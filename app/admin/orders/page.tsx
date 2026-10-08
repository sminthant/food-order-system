import type { Metadata } from "next";
import { OrdersAdminPage } from "@/components/admin/OrdersAdminPage";

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage FoodGo order status.",
};

export default function Page() {
  return <OrdersAdminPage />;
}
