import type { CartItem, Food, StoreSettings } from "@/types";

export const PROMO_CODE = "FIRST20";
export const PROMO_RATE = 0.2;
export const MAX_QUANTITY = 20;

export type CartLine = {
  food: Food;
  quantity: number;
  lineTotal: number;
};

export type CartSummary = {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
};

export function buildCartLines(foods: Food[], cart: CartItem[]): CartLine[] {
  return cart.flatMap((item) => {
    const food = foods.find((entry) => entry.id === item.foodId);
    if (!food) return [];
    const quantity = Math.min(MAX_QUANTITY, Math.max(1, item.quantity));
    return [{ food, quantity, lineTotal: food.price * quantity }];
  });
}

export function summarizeCart(
  lines: CartLine[],
  settings: StoreSettings,
  promoApplied: boolean,
): CartSummary {
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const discount = promoApplied ? Math.round(subtotal * PROMO_RATE) : 0;
  const deliveryFee =
    subtotal === 0 || subtotal >= settings.freeDeliveryThreshold
      ? 0
      : settings.deliveryFee;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  return { subtotal, discount, deliveryFee, total, itemCount };
}

export function nextOrderCode(codes: string[]) {
  const highest = codes.reduce((max, code) => {
    const match = /FO-(\d+)/.exec(code);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 1000);

  return `FO-${highest + 1}`;
}

export function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}
