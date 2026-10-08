import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the meals in your FoodGo cart.",
};

export default function Page() {
  return <CartPage />;
}
