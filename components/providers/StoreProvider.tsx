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
import { defaultSettings } from "@/data/site";
import { ApiError, api } from "@/lib/client-api";
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

const STORAGE_KEY = "foodgo-cart-v2";

type Catalog = {
  foods: Food[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
};

type PersistedLocal = {
  cart: CartItem[];
  settings: StoreSettings;
};

type StoreState = Catalog &
  PersistedLocal & {
    hydrated: boolean;
    error: string | null;
  };

type StoreValue = StoreState & {
  addToCart: (foodId: string, quantity?: number) => void;
  setQuantity: (foodId: string, quantity: number) => void;
  removeFromCart: (foodId: string) => void;
  clearCart: () => void;
  placeOrder: (order: Order) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  deleteOrder: (id: string) => Promise<boolean>;
  saveFood: (food: Food) => Promise<boolean>;
  deleteFood: (id: string) => Promise<boolean>;
  saveCategory: (category: Category) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<string | null>;
  updateSettings: (settings: StoreSettings) => void;
  resetDemo: () => Promise<void>;
};

const StoreContext = createContext<StoreValue | null>(null);

function emptyCatalog(): Catalog {
  return { foods: [], categories: [], orders: [], customers: [] };
}

function createInitialState(): StoreState {
  return {
    ...emptyCatalog(),
    cart: [],
    settings: defaultSettings,
    hydrated: false,
    error: null,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readLocal(): PersistedLocal | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || !Array.isArray(parsed.cart) || !isRecord(parsed.settings)) return null;
    return {
      cart: parsed.cart as CartItem[],
      settings: { ...defaultSettings, ...(parsed.settings as Partial<StoreSettings>) },
    };
  } catch {
    return null;
  }
}

type Action =
  | { type: "local"; payload: PersistedLocal }
  | { type: "catalog"; payload: Catalog }
  | { type: "error"; message: string }
  | { type: "hydrated" }
  | { type: "add-to-cart"; foodId: string; quantity: number }
  | { type: "set-qty"; foodId: string; quantity: number }
  | { type: "remove"; foodId: string }
  | { type: "clear-cart" }
  | { type: "upsert-order"; order: Order; clearCart?: boolean }
  | { type: "remove-order"; id: string }
  | { type: "upsert-food"; food: Food }
  | { type: "remove-food"; id: string }
  | { type: "upsert-category"; category: Category }
  | { type: "remove-category"; id: string }
  | { type: "settings"; settings: StoreSettings };

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case "local":
      return { ...state, ...action.payload };
    case "catalog":
      return { ...state, ...action.payload, hydrated: true, error: null };
    case "error":
      return { ...state, hydrated: true, error: action.message };
    case "hydrated":
      return { ...state, hydrated: true };
    case "add-to-cart": {
      const existing = state.cart.find((item) => item.foodId === action.foodId);
      const cart = existing
        ? state.cart.map((item) =>
            item.foodId === action.foodId
              ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + action.quantity) }
              : item,
          )
        : [...state.cart, { foodId: action.foodId, quantity: Math.min(MAX_QUANTITY, action.quantity) }];
      return { ...state, cart };
    }
    case "set-qty":
      if (action.quantity < 1) {
        return { ...state, cart: state.cart.filter((item) => item.foodId !== action.foodId) };
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
      return { ...state, cart: state.cart.filter((item) => item.foodId !== action.foodId) };
    case "clear-cart":
      return { ...state, cart: [] };
    case "upsert-order": {
      const exists = state.orders.some((order) => order.id === action.order.id);
      return {
        ...state,
        orders: exists
          ? state.orders.map((order) => (order.id === action.order.id ? action.order : order))
          : [action.order, ...state.orders],
        cart: action.clearCart ? [] : state.cart,
      };
    }
    case "remove-order":
      return { ...state, orders: state.orders.filter((order) => order.id !== action.id) };
    case "upsert-food": {
      const exists = state.foods.some((food) => food.id === action.food.id);
      return {
        ...state,
        foods: exists
          ? state.foods.map((food) => (food.id === action.food.id ? action.food : food))
          : [action.food, ...state.foods],
      };
    }
    case "remove-food":
      return {
        ...state,
        foods: state.foods.filter((food) => food.id !== action.id),
        cart: state.cart.filter((item) => item.foodId !== action.id),
      };
    case "upsert-category": {
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
    case "remove-category":
      return { ...state, categories: state.categories.filter((category) => category.id !== action.id) };
    case "settings":
      return { ...state, settings: action.settings };
    default:
      return state;
  }
}

function messageFrom(error: unknown) {
  if (error instanceof ApiError) return error.message;
  return "Something went wrong. Please try again.";
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const [toast, setToast] = useState<string | null>(null);

  async function loadCatalog() {
    const [categories, foods, orders, customers] = await Promise.all([
      api<Category[]>("/api/categories"),
      api<Food[]>("/api/foods"),
      api<Order[]>("/api/orders"),
      api<Customer[]>("/api/customers"),
    ]);
    dispatch({ type: "catalog", payload: { categories, foods, orders, customers } });
  }

  useEffect(() => {
    const saved = readLocal();
    if (saved) dispatch({ type: "local", payload: saved });
    loadCatalog().catch((error: unknown) => {
      dispatch({ type: "error", message: messageFrom(error) });
    });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const payload: PersistedLocal = { cart: state.cart, settings: state.settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [state.hydrated, state.cart, state.settings]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const value = useMemo<StoreValue>(() => {
    function fail(error: unknown) {
      const message = messageFrom(error);
      setToast(message);
      return message;
    }

    return {
      ...state,
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
      async placeOrder(order) {
        try {
          const saved = await api<Order>("/api/orders", {
            method: "POST",
            body: JSON.stringify(order),
          });
          dispatch({ type: "upsert-order", order: saved, clearCart: true });
          return saved;
        } catch (error) {
          fail(error);
          return null;
        }
      },
      async updateOrderStatus(orderId, status) {
        try {
          const saved = await api<Order>(`/api/orders/${encodeURIComponent(orderId)}`, {
            method: "PUT",
            body: JSON.stringify({ status }),
          });
          dispatch({ type: "upsert-order", order: saved });
          return true;
        } catch (error) {
          fail(error);
          return false;
        }
      },
      async deleteOrder(id) {
        try {
          await api<Order>(`/api/orders/${encodeURIComponent(id)}`, { method: "DELETE" });
          dispatch({ type: "remove-order", id });
          setToast("Order deleted");
          return true;
        } catch (error) {
          fail(error);
          return false;
        }
      },
      async saveFood(food) {
        const exists = state.foods.some((item) => item.id === food.id);
        try {
          const saved = await api<Food>(
            exists ? `/api/foods/${encodeURIComponent(food.id)}` : "/api/foods",
            {
              method: exists ? "PUT" : "POST",
              body: JSON.stringify(food),
            },
          );
          dispatch({ type: "upsert-food", food: saved });
          setToast(exists ? "Food updated" : "Food added");
          return true;
        } catch (error) {
          fail(error);
          return false;
        }
      },
      async deleteFood(id) {
        try {
          await api<Food>(`/api/foods/${encodeURIComponent(id)}`, { method: "DELETE" });
          dispatch({ type: "remove-food", id });
          setToast("Food deleted");
          return true;
        } catch (error) {
          fail(error);
          return false;
        }
      },
      async saveCategory(category) {
        const exists = state.categories.some((item) => item.id === category.id);
        try {
          const saved = await api<Category>(
            exists ? `/api/categories/${encodeURIComponent(category.id)}` : "/api/categories",
            {
              method: exists ? "PUT" : "POST",
              body: JSON.stringify(category),
            },
          );
          dispatch({ type: "upsert-category", category: saved });
          setToast(exists ? "Category updated" : "Category added");
          return true;
        } catch (error) {
          fail(error);
          return false;
        }
      },
      async deleteCategory(id) {
        try {
          await api<Category>(`/api/categories/${encodeURIComponent(id)}`, { method: "DELETE" });
          dispatch({ type: "remove-category", id });
          setToast("Category deleted");
          return null;
        } catch (error) {
          return fail(error);
        }
      },
      updateSettings(settings) {
        dispatch({ type: "settings", settings });
      },
      async resetDemo() {
        try {
          await api("/api/seed", { method: "POST", body: JSON.stringify({ reset: true }) });
          dispatch({ type: "clear-cart" });
          await loadCatalog();
          setToast("Sample data restored");
        } catch (error) {
          fail(error);
        }
      },
    };
  }, [state]);

  return (
    <StoreContext.Provider value={value}>
      {state.error ? (
        <p role="alert" className="bg-red-50 px-4 py-3 text-center text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
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
