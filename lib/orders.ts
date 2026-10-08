import type { Customer, Order } from "@/types";

export function orderItemSummary(order: Order) {
  return order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ");
}

export function countCustomerOrders(customer: Customer, orders: Order[]) {
  const email = customer.email.toLowerCase();
  return orders.filter(
    (order) =>
      order.customerId === customer.id || order.customerEmail.toLowerCase() === email,
  ).length;
}

export function withCustomerId(order: Order): Order {
  return {
    ...order,
    customerId: typeof order.customerId === "string" ? order.customerId : null,
  };
}
