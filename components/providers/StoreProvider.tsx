"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { categories as seedCategories } from "@/data/mock-categories";
import { customers } from "@/data/mock-customers";
import { foods as seedFoods } from "@/data/mock-foods";
import { orders as seedOrders } from "@/data/mock-orders";
import { defaultSettings } from "@/data/site";
import { buildCartLines, MAX_QUANTITY, summarizeCart } from "@/lib/cart";
import type {
  CartItem,
  Category,
  Customer,
  Food,
  Order,
  OrderStatus,
  StoreSettings,
} from "@/types";

const STORAGE_KEY = "foodgo-state-v1";

type PersistedState = {
  version: 1;
  foods: Food[];
  categories: Category[];
  orders: Order[];
  cart: CartItem[];
  settings: StoreSettings;
};

type StoreState = PersistedState & {
  hydrated: boolean;
};

type StoreValue = StoreState & {
  customers: Customer[];
  addToCart: (foodId: string, quantity?: number) => void;
  setQuantity: (foodId: string, quantity: number) => void;
  removeFromCart: (foodId: string) => void;
  clearCart: () => void;
  placeOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  saveFood: (food: Food) => void;
  deleteFood: (id: string) => void;
  saveCategory: (category: Category) => void;
  deleteCategory: (id: string) => string | null;
  updateSettings: (settings: StoreSettings) => void;
  resetDemo: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);

function seedState(): PersistedState {
  return {
    version: 1,
    foods: seedFoods,
    categories: seedCategories,
    orders: seedOrders,
    cart: [],
    settings: defaultSettings,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1) return null;
    if (!Array.isArray(parsed.foods) || parsed.foods.length === 0) return null;
    if (!Array.isArray(parsed.categories) || parsed.categories.length === 0) return null;
    if (!Array.isArray(parsed.orders) || !Array.isArray(parsed.cart)) return null;
    if (!isRecord(parsed.settings)) return null;

    return {
      version: 1,
      foods: parsed.foods as Food[],
      categories: parsed.categories as Category[],
      orders: parsed.orders as Order[],
      cart: parsed.cart as CartItem[],
      settings: { ...defaultSettings, ...(parsed.settings as Partial<StoreSettings>) },
    };
  } catch {
    return null;
  }
}

type Action =
  | { type: "replace"; payload: PersistedState }
  | { type: "hydrated" }
  | { type: "add-to-cart"; foodId: string; quantity: number }
  | { type: "set-qty"; foodId: string; quantity: number }
  | { type: "remove"; foodId: string }
  | { type: "clear-cart" }
  | { type: "place-order"; order: Order }
  | { type: "status"; orderId: string; status: OrderStatus }
  | { type: "save-food"; food: Food }
  | { type: "delete-food"; id: string }
  | { type: "save-category"; category: Category }
  | { type: "delete-category"; id: string }
  | { type: "settings"; settings: StoreSettings };

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case "replace":
      return { ...action.payload, hydrated: true };
    case "hydrated":
      return { ...state, hydrated: true };
    case "add-to-cart": {
      const existing = state.cart.find((item) => item.foodId === action.foodId);
      const cart = existing
        ? state.cart.map((item) =>
            item.foodId === action.foodId
              ? {
                  ...item,
                  quantity: Math.min(MAX_QUANTITY, item.quantity + action.quantity),
                }
              : item,
          )
        : [
            ...state.cart,
            {
              foodId: action.foodId,
              quantity: Math.min(MAX_QUANTITY, action.quantity),
            },
          ];
      return { ...state, cart };
    }
    case "set-qty":
      if (action.quantity < 1) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.foodId !== action.foodId),
        };
      }
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.foodId === action.foodId
            ? { ...item, quantity: Math.min(MAX_QUANTITY, action.quantity) }
            : item,
        ),
      };
    case "remove":
      return {
        ...state,
        cart: state.cart.filter((item) => item.foodId !== action.foodId),
      };
    case "clear-cart":
      return { ...state, cart: [] };
    case "place-order":
      return { ...state, orders: [action.order, ...state.orders], cart: [] };
    case "status":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.orderId ? { ...order, status: action.status } : order,
        ),
      };
    case "save-food": {
      const exists = state.foods.some((food) => food.id === action.food.id);
      return {
        ...state,
        foods: exists
          ? state.foods.map((food) => (food.id === action.food.id ? action.food : food))
          : [action.food, ...state.foods],
      };
    }
    case "delete-food":
      return {
        ...state,
        foods: state.foods.filter((food) => food.id !== action.id),
        cart: state.cart.filter((item) => item.foodId !== action.id),
      };
    case "save-category": {
      const exists = state.categories.some((category) => category.id === action.category.id);
      return {
        ...state,
        categories: exists
          ? state.categories.map((category) =>
              category.id === action.category.id ? action.category : category,
            )
          : [...state.categories, action.category],
      };
    }
    case "delete-category":
      return {
        ...state,
        categories: state.categories.filter((category) => category.id !== action.id),
      };
    case "settings":
      return { ...state, settings: action.settings };
    default:
      return state;
  }
}

function createInitialState(): StoreState {
  return { ...seedState(), hydrated: false };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const saved = readPersisted();
    if (saved) dispatch({ type: "replace", payload: saved });
    else dispatch({ type: "hydrated" });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const payload: PersistedState = {
      version: 1,
      foods: state.foods,
      categories: state.categories,
      orders: state.orders,
      cart: state.cart,
      settings: state.settings,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [state]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const value = useMemo<StoreValue>(() => {
    return {
      ...state,
      customers,
      addToCart(foodId, quantity = 1) {
        const food = state.foods.find((item) => item.id === foodId);
        if (!food || !food.available || quantity < 1) return;
        dispatch({ type: "add-to-cart", foodId, quantity });
        setToast(`${food.name} added to cart`);
      },
      setQuantity(foodId, quantity) {
        dispatch({ type: "set-qty", foodId, quantity });
      },
      removeFromCart(foodId) {
        dispatch({ type: "remove", foodId });
      },
      clearCart() {
        dispatch({ type: "clear-cart" });
      },
      placeOrder(order) {
        dispatch({ type: "place-order", order });
      },
      updateOrderStatus(orderId, status) {
        dispatch({ type: "status", orderId, status });
      },
      saveFood(food) {
        dispatch({ type: "save-food", food });
      },
      deleteFood(id) {
        dispatch({ type: "delete-food", id });
      },
      saveCategory(category) {
        dispatch({ type: "save-category", category });
      },
      deleteCategory(id) {
        const inUse = state.foods.some((food) => food.categoryId === id);
        if (inUse) {
          return "Move foods out of this category before deleting it.";
        }
        dispatch({ type: "delete-category", id });
        return null;
      },
      updateSettings(settings) {
        dispatch({ type: "settings", settings });
      },
      resetDemo() {
        localStorage.removeItem(STORAGE_KEY);
        dispatch({ type: "replace", payload: seedState() });
        setToast("Demo data restored");
      },
    };
  }, [state]);

  return (
    <StoreContext.Provider value={value}>
      {children}
      {toast ? (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 z-[80] w-[min(92vw,24rem)] -translate-x-1/2 rounded-full bg-ink px-4 py-3 text-center text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return value;
}

export function useCartSummary(promoApplied = false) {
  const { foods, cart, settings } = useStore();
  const lines = buildCartLines(foods, cart);
  const summary = summarizeCart(lines, settings, promoApplied);
  return { lines, summary };
}
