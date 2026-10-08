import type { Metadata } from "next";
import { Suspense } from "react";
import { foods } from "@/data/mock-foods";
import { FoodDetail } from "@/components/food/FoodDetail";
import { PageSkeleton } from "@/components/layout/PageSkeleton";

export function generateStaticParams() {
  return foods.map((food) => ({ id: food.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const food = foods.find((item) => item.id === id);
  return {
    title: food?.name ?? "Food",
    description: food?.description,
  };
}

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <FoodDetail />
    </Suspense>
  );
}
