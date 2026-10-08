import type { Metadata } from "next";
import { CheckoutPage } from "@/components/checkout/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter delivery details and place a FoodGo order.",
};

export default function Page() {
  return <CheckoutPage />;
}
