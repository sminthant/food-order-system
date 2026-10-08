"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AddToCartButton } from "@/components/food/AddToCartButton";
import { FoodCard } from "@/components/food/FoodCard";
import { FoodImage } from "@/components/food/FoodImage";
import { QuantitySelector } from "@/components/food/QuantitySelector";
import { StarRating } from "@/components/food/StarRating";
import { Container } from "@/components/layout/Container";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { useStore } from "@/components/providers/StoreProvider";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { categoryName, relatedFoods } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { Search } from "lucide-react";

export function FoodDetail() {
  const params = useParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : "";
  const { foods, categories, hydrated } = useStore();
  const [quantity, setQuantity] = useState(1);

  if (!hydrated) return <PageSkeleton />;

  const food = foods.find((item) => item.id === id);

  if (!food) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={<Search className="h-5 w-5" />}
          title="We couldn't find that dish."
          description="It may have been removed from the menu."
          action={<ButtonLink href="/menu">Back to menu</ButtonLink>}
        />
      </Container>
    );
  }

  const category = categoryName(categories, food.categoryId);
  const related = relatedFoods(foods, food);

  return (
    <Container className="py-8 pb-28 sm:py-12 lg:pb-12">
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span className="px-2">/</span>
        <Link href="/menu" className="hover:text-ink">
          Menu
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink">{food.name}</span>
      </nav>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-stone-100">
          <FoodImage
            src={food.image}
            alt={food.name}
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">{category}</p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-ink sm:text-5xl">{food.name}</h1>
          <div className="mt-4">
            <StarRating rating={food.rating} count={food.reviewCount} />
          </div>
          <p className="mt-5 text-base leading-7 text-muted">{food.description}</p>
          <p className="mt-4 text-3xl font-semibold text-ink">{formatPrice(food.price)}</p>
          <p className="mt-2 text-sm text-muted">Ready in about {food.prepMinutes} minutes.</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {food.highlights.map((highlight) => (
              <li
                key={highlight}
                className="rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand-dark"
              >
                {highlight}
              </li>
            ))}
          </ul>
          {food.available ? (
            <div className="mt-8 hidden items-center gap-3 lg:flex">
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <AddToCartButton foodId={food.id} quantity={quantity} size="lg" className="min-w-44" />
            </div>
          ) : (
            <p className="mt-8 hidden text-sm font-medium text-red-700 lg:block">
              This dish is sold out right now.
            </p>
          )}
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-display text-3xl tracking-tight text-ink">You may also like</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <FoodCard key={item.id} food={item} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white p-3 lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted">Total</p>
            <p className="font-semibold text-ink">{formatPrice(food.price * quantity)}</p>
          </div>
          {food.available ? (
            <div className="flex items-center gap-2">
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <AddToCartButton foodId={food.id} quantity={quantity} />
            </div>
          ) : (
            <p className="text-sm font-medium text-red-700">Sold out</p>
          )}
        </div>
      </div>
    </Container>
  );
}
