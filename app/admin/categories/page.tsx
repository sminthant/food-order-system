import type { Metadata } from "next";
import { CategoriesPage } from "@/components/admin/CategoriesPage";

export const metadata: Metadata = {
  title: "Categories",
  description: "Manage FoodGo menu categories.",
};

export default function Page() {
  return <CategoriesPage />;
}
