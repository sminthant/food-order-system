import type { CategoryDocument } from "@/models/category";
import type { CustomerDocument } from "@/models/customer";
import type { FoodDocument } from "@/models/food";
import type { OrderDocument } from "@/models/order";
import type { Category, Customer, Food, Order, OrderItem } from "@/types";

export function toCategory(doc: CategoryDocument): Category {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    icon: doc.icon,
    image: doc.image,
  };
}

export function toFood(doc: FoodDocument): Food {
  return {
    id: doc.id,
    name: doc.name,
    description: doc.description,
    price: doc.price,
    categoryId: doc.categoryId,
    category: doc.category,
    rating: doc.rating,
    reviewCount: doc.reviewCount,
    image: doc.image,
    available: doc.available,
    popular: doc.popular,
    prepMinutes: doc.prepMinutes,
    highlights: doc.highlights,
  };
}

export function toCustomer(doc: CustomerDocument): Customer {
  return {
    id: doc.id,
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    address: doc.address,
    joinedAt: doc.joinedAt,
    orderCount: doc.orderCount,
  };
}

export function toOrder(doc: OrderDocument): Order {
  const items: OrderItem[] = doc.items.map((item) => ({
    foodId: item.foodId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    subtotal: item.subtotal,
  }));

  return {
    id: doc.id,
    code: doc.code,
    customerId: doc.customerId ?? null,
    customerName: doc.customer.name,
    customerEmail: doc.customer.email,
    customerPhone: doc.customer.phone,
    address: doc.customer.address,
    customer: {
      id: doc.customer.id ?? doc.customerId ?? null,
      name: doc.customer.name,
      email: doc.customer.email,
      phone: doc.customer.phone,
      address: doc.customer.address,
    },
    items,
    subtotal: doc.subtotal,
    discount: doc.discount,
    deliveryFee: doc.deliveryFee,
    total: doc.total,
    totalPrice: doc.totalPrice,
    status: doc.status,
    paymentMethod: doc.paymentMethod,
    promoCode: doc.promoCode ?? null,
    orderDate: doc.orderDate.toISOString(),
    createdAt: doc.orderDate.toISOString(),
  };
}
