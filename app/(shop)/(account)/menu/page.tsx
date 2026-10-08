import type { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { MenuPage } from "@/components/menu/MenuPage";

export const metadata: Metadata = {
  title: "Menu",
  description: "Browse burgers, pizza, chicken, Asian dishes, drinks, and desserts on FoodGo.",
};

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <MenuPage />
    </Suspense>
  );
}
