"use client";

import { Bike, Leaf, ShieldCheck, Smartphone } from "lucide-react";
import { CategoryCard } from "@/components/food/CategoryCard";
import { FoodCard } from "@/components/food/FoodCard";
import { Container } from "@/components/layout/Container";
import { FoodImage } from "@/components/food/FoodImage";
import { useStore } from "@/components/providers/StoreProvider";
import { ButtonLink } from "@/components/ui/button";
import { features } from "@/data/site";
import { formatPrice } from "@/lib/format";

const featureIcons = {
  bike: Bike,
  leaf: Leaf,
  smartphone: Smartphone,
  shield: ShieldCheck,
};

export function HomePage() {
  const { foods, categories, settings } = useStore();
  const popular = foods.filter((food) => food.popular).slice(0, 8);
  const featured = foods.find((food) => food.id === "classic-cheeseburger") ?? foods[0];

  return (
    <>
      <section className="bg-surface">
        <Container className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
              Food delivery
            </p>
            <h1 className="mt-3 font-display text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Delicious food, delivered to your door.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-muted">
              Discover delicious meals from your favorite restaurants and enjoy them wherever you are.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/menu" size="lg">
                Order Now
              </ButtonLink>
              <ButtonLink href="/menu" size="lg" variant="secondary">
                Explore Menu
              </ButtonLink>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
              <div>
                <dt className="text-xs text-muted">Guest rating</dt>
                <dd className="mt-1 font-semibold text-ink">4.8 / 5</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Typical delivery</dt>
                <dd className="mt-1 font-semibold text-ink">30 min</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Free delivery</dt>
                <dd className="mt-1 font-semibold text-ink">
                  {formatPrice(settings.freeDeliveryThreshold)}+
                </dd>
              </div>
            </dl>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-stone-200 sm:aspect-[5/4] lg:aspect-[4/5]">
              <FoodImage
                src="/images/hero.jpg"
                alt="Plated dishes arranged for delivery"
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority
              />
            </div>
            {featured ? (
              <div className="absolute right-4 bottom-4 left-4 rounded-2xl bg-white/95 p-4 shadow-lg sm:left-auto sm:w-64">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">Popular now</p>
                <p className="mt-1 font-semibold text-ink">{featured.name}</p>
                <p className="text-sm text-muted">
                  {formatPrice(featured.price)} · {featured.rating.toFixed(1)}
                </p>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">Browse</p>
              <h2 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
                Popular categories
              </h2>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">Menu</p>
              <h2 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
                Popular foods
              </h2>
            </div>
            <ButtonLink href="/menu" variant="secondary" size="sm">
              View full menu
            </ButtonLink>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-16 sm:pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] bg-ink">
            <div className="absolute inset-0">
              <FoodImage
                src="/images/promo.jpg"
                alt=""
                sizes="100vw"
                className="object-cover opacity-50"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/25" />
            <div className="relative max-w-xl px-6 py-12 text-white sm:px-12 sm:py-16">
              <h2 className="font-display text-4xl tracking-tight sm:text-5xl">Hungry?</h2>
              <p className="mt-3 text-lg text-white/90">Get 20% off your first order.</p>
              <p className="mt-2 text-sm text-white/75">Use code FIRST20 at checkout.</p>
              <ButtonLink
                href="/menu"
                className="mt-6 bg-white text-ink hover:bg-stone-100"
              >
                Order Now
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">Why choose us</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = featureIcons[feature.icon];
              return (
                <article key={feature.title} className="rounded-2xl border border-line bg-surface p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-brand">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
