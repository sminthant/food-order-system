"use client";

import Link from "next/link";
import { AddToCartButton } from "@/components/food/AddToCartButton";
import { FoodImage } from "@/components/food/FoodImage";
import { StarRating } from "@/components/food/StarRating";
import { useStore } from "@/components/providers/StoreProvider";
import { categoryName } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import type { Food } from "@/types";

export function FoodCard({ food }: { food: Food }) {
  const { categories } = useStore();
  const category = categoryName(categories, food.categoryId);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/food/${food.id}`} className="group relative block aspect-[4/3] bg-stone-100">
        <FoodImage
          src={food.image}
          alt={food.name}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink">
          {category}
        </span>
        {!food.available ? (
          <span className="absolute top-3 right-3 rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-white">
            Sold out
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold text-ink">
          <Link href={`/food/${food.id}`} className="hover:text-brand">
            {food.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{food.description}</p>
        <div className="mt-3">
          <StarRating rating={food.rating} />
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-lg font-semibold text-ink">{formatPrice(food.price)}</p>
          <AddToCartButton foodId={food.id} />
        </div>
      </div>
    </article>
  );
}
