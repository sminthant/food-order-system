import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: {
    absolute: "FoodGo — Delicious food, delivered",
  },
};

export default function Page() {
  return <HomePage />;
}
