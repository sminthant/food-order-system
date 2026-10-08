"use client";

import Link from "next/link";
import { FoodImage } from "@/components/food/FoodImage";
import { QuantitySelector } from "@/components/food/QuantitySelector";
import { useStore } from "@/components/providers/StoreProvider";
import { formatPrice } from "@/lib/format";
import type { CartLine } from "@/lib/cart";

export function CartItem({ line }: { line: CartLine }) {
  const { setQuantity, removeFromCart } = useStore();

  return (
    <article className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-line py-4 sm:grid-cols-[5.5rem_1fr_auto] sm:items-center sm:gap-4">
      <Link
        href={`/food/${line.food.id}`}
        aria-label={line.food.name}
        className="relative row-span-2 block h-[4.5rem] overflow-hidden rounded-xl bg-stone-100 sm:row-span-1 sm:h-[5.5rem]"
      >
        <FoodImage src={line.food.image} alt="" sizes="88px" />
      </Link>
      <div className="min-w-0">
        <h3 className="truncate font-semibold text-ink">
          <Link href={`/food/${line.food.id}`} className="hover:text-brand">
            {line.food.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted">{formatPrice(line.food.price)}</p>
        <button
          type="button"
          onClick={() => removeFromCart(line.food.id)}
          className="mt-2 text-sm font-medium text-red-700 hover:underline"
        >
          Remove
        </button>
      </div>
      <div className="col-start-2 flex items-center justify-between gap-4 sm:col-start-auto sm:flex-col sm:items-end">
        <QuantitySelector
          value={line.quantity}
          onChange={(quantity) => setQuantity(line.food.id, quantity)}
        />
        <p className="font-semibold text-ink">{formatPrice(line.lineTotal)}</p>
      </div>
    </article>
  );
}
