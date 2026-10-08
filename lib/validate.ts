import { HttpError } from "@/lib/http";
import { ORDER_STATUSES } from "@/lib/status";
import type { CategoryIcon, OrderStatus, PaymentMethod } from "@/types";

const ICONS: CategoryIcon[] = ["beef", "pizza", "drumstick", "soup", "cup-soda", "cake", "utensils"];
const STATUSES = new Set<OrderStatus>(ORDER_STATUSES.map((item) => item.value));

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, label: string, required = true) {
  if (typeof value !== "string" || value.trim().length === 0) {
    if (!required) return "";
    throw new HttpError(400, `${label} is required.`);
  }
  return value.trim();
}

function positivePrice(value: unknown, label: string) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw new HttpError(400, `${label} must be greater than 0.`);
  }
  return Math.round(number);
}

function nonNegative(value: unknown, label: string) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new HttpError(400, `${label} must be a valid amount.`);
  }
  return Math.round(number);
}

export function readId(value: unknown) {
  const id = text(value, "Id");
  if (!/^[a-z0-9][a-z0-9-]{0,80}$/i.test(id)) {
    throw new HttpError(400, "Id can only use letters, numbers, and hyphens.");
  }
  return id;
}

export function parseCategory(body: unknown, id: string) {
  if (!isRecord(body)) throw new HttpError(400, "Category details are required.");
  const name = text(body.name, "Name");
  const icon = text(body.icon, "Icon");
  if (!ICONS.includes(icon as CategoryIcon)) {
    throw new HttpError(400, "Choose a valid category icon.");
  }
  return {
    id,
    name,
    slug: text(body.slug, "Slug", false) || id,
    description: text(body.description, "Description", false),
    icon: icon as CategoryIcon,
    image: text(body.image, "Image"),
  };
}

export function parseFood(body: unknown, id: string) {
  if (!isRecord(body)) throw new HttpError(400, "Food details are required.");
  if (typeof body.available !== "boolean") {
    throw new HttpError(400, "Available must be true or false.");
  }
  const rating = typeof body.rating === "number" ? body.rating : 5;
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    throw new HttpError(400, "Rating must be between 0 and 5.");
  }
  const reviewCount = typeof body.reviewCount === "number" ? body.reviewCount : 0;
  const prepMinutes = typeof body.prepMinutes === "number" ? body.prepMinutes : 15;
  const highlights = Array.isArray(body.highlights)
    ? body.highlights.filter((item): item is string => typeof item === "string")
    : [];

  return {
    id,
    name: text(body.name, "Name"),
    description: text(body.description, "Description"),
    price: positivePrice(body.price, "Price"),
    categoryId: text(body.categoryId, "Category"),
    category: text(body.category, "Category", false),
    image: text(body.image, "Image"),
    rating,
    reviewCount: Number.isFinite(reviewCount) && reviewCount >= 0 ? Math.round(reviewCount) : 0,
    available: body.available,
    popular: body.popular === true,
    prepMinutes: Number.isFinite(prepMinutes) && prepMinutes > 0 ? Math.round(prepMinutes) : 15,
    highlights,
  };
}

export function parseOrder(body: unknown, id: string, code: string) {
  if (!isRecord(body)) throw new HttpError(400, "Order details are required.");
  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw new HttpError(400, "An order needs at least one item.");
  }

  const items = body.items.map((item) => {
    if (!isRecord(item)) throw new HttpError(400, "Each order item must be an object.");
    const price = nonNegative(item.price, "Item price");
    const quantity = typeof item.quantity === "number" ? item.quantity : Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new HttpError(400, "Quantity must be greater than 0.");
    }
    return {
      foodId: text(item.foodId, "Food"),
      name: text(item.name, "Item name"),
      price,
      quantity,
      subtotal: price * quantity,
      image: typeof item.image === "string" ? item.image : "",
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const discount = body.discount === undefined ? 0 : nonNegative(body.discount, "Discount");
  const deliveryFee = body.deliveryFee === undefined ? 0 : nonNegative(body.deliveryFee, "Delivery fee");
  const total = nonNegative(body.total ?? body.totalPrice, "Total");
  if (Math.abs(total - (subtotal - discount + deliveryFee)) > 1) {
    throw new HttpError(400, "Total price does not match the order items.");
  }

  const status = typeof body.status === "string" ? body.status : "pending";
  if (!STATUSES.has(status as OrderStatus)) {
    throw new HttpError(400, "Status must be pending, confirmed, preparing, ready, completed, or cancelled.");
  }

  const payment = body.paymentMethod === "card" ? "card" : body.paymentMethod === "cash" ? "cash" : null;
  if (!payment) throw new HttpError(400, "Payment method must be cash or card.");

  const customerId =
    body.customerId === null || body.customerId === undefined || body.customerId === ""
      ? null
      : text(body.customerId, "Customer");

  const createdAt =
    typeof body.createdAt === "string" && !Number.isNaN(Date.parse(body.createdAt))
      ? new Date(body.createdAt)
      : new Date();

  return {
    id,
    code,
    customerId,
    customer: {
      id: customerId,
      name: text(body.customerName, "Customer name"),
      email: text(body.customerEmail, "Email", false),
      phone: text(body.customerPhone, "Phone", false),
      address: text(body.address, "Address", false),
    },
    items,
    subtotal,
    discount,
    deliveryFee,
    total,
    totalPrice: total,
    status: status as OrderStatus,
    paymentMethod: payment as PaymentMethod,
    promoCode: typeof body.promoCode === "string" && body.promoCode.trim() ? body.promoCode.trim() : null,
    orderDate: createdAt,
  };
}

export function parseStatus(body: unknown) {
  if (!isRecord(body) || typeof body.status !== "string" || !STATUSES.has(body.status as OrderStatus)) {
    throw new HttpError(400, "Status must be pending, confirmed, preparing, ready, completed, or cancelled.");
  }
  return body.status as OrderStatus;
}
