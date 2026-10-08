"use client";

import { Bike, Leaf, ShieldCheck, Smartphone } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { useStore } from "@/components/providers/StoreProvider";
import { ButtonLink } from "@/components/ui/button";
import { features } from "@/data/site";

const featureIcons = {
  bike: Bike,
  leaf: Leaf,
  smartphone: Smartphone,
  shield: ShieldCheck,
};

export function AboutPage() {
  const { settings } = useStore();

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Food, ordered simply."
        description="FoodGo is a frontend preview of a delivery service. Browse the menu, build a cart, and place an order without a backend connected yet."
      />
      <Container className="grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 text-base leading-7 text-stone-700">
          <p>
            The menu, cart, and order board all run in the browser. Changes you make in the admin
            screens stay on this device so the prototype feels connected before a database is added.
          </p>
          <p>
            Delivery is priced in Thai baht. Orders of {settings.freeDeliveryThreshold} baht or more
            skip the delivery fee. Use the code FIRST20 at checkout to preview a first-order discount.
          </p>
          <ButtonLink href="/menu">Browse the menu</ButtonLink>
        </div>
        <aside className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-semibold text-ink">Visit or call</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted">Address</dt>
              <dd className="mt-1 text-ink">{settings.address}</dd>
            </div>
            <div>
              <dt className="text-muted">Phone</dt>
              <dd className="mt-1">
                <a href={`tel:${settings.phone}`} className="text-ink hover:text-brand">
                  {settings.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${settings.email}`} className="text-ink hover:text-brand">
                  {settings.email}
                </a>
              </dd>
            </div>
          </dl>
        </aside>
      </Container>
      <section className="bg-white py-14">
        <Container className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = featureIcons[feature.icon];
            return (
              <article key={feature.title} className="rounded-2xl border border-line p-5">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-4 font-semibold text-ink">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{feature.description}</p>
              </article>
            );
          })}
        </Container>
      </section>
    </>
  );
}
