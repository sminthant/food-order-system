import type { Metadata } from "next";
import { OrdersPage } from "@/components/order/OrdersPage";

export const metadata: Metadata = {
  title: "Orders",
  description: "Review FoodGo orders and their status.",
};

export default function Page() {
  return <OrdersPage />;
}
