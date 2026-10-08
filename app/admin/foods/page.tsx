import type { Metadata } from "next";
import { FoodsPage } from "@/components/admin/FoodsPage";

export const metadata: Metadata = {
  title: "Foods",
  description: "Manage the FoodGo menu.",
};

export default function Page() {
  return <FoodsPage />;
}
