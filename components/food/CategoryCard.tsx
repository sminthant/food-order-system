import Link from "next/link";
import { FoodImage } from "@/components/food/FoodImage";
import type { Category } from "@/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/menu?category=${category.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-stone-200"
    >
      <FoodImage
        src={category.image}
        alt=""
        sizes="(min-width: 1024px) 25vw, 50vw"
        className="object-cover transition duration-500 group-hover:scale-105"
      />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/35 to-transparent p-4 pt-16">
        <span className="block text-base font-semibold text-white">{category.name}</span>
      </span>
    </Link>
  );
}
