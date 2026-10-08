"use client";

import { ShoppingBag } from "lucide-react";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { useCartSummary, useStore } from "@/components/providers/StoreProvider";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

export function CartPage() {
  const { hydrated, settings } = useStore();
  const { lines, summary } = useCartSummary(false);

  if (!hydrated) return <PageSkeleton />;

  return (
    <>
      <PageHeader
        eyebrow="Cart"
        title="Shopping Cart"
        description="Review quantities before you checkout. Prices are shown in Thai baht."
      />
      <Container className="py-8 sm:py-10">
        {lines.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="h-5 w-5" />}
            title="Your cart is empty."
            description="Looks like you haven't added anything yet."
            action={<ButtonLink href="/menu">Explore Menu</ButtonLink>}
          />
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
            <div className="rounded-2xl border border-line bg-white px-4 sm:px-6">
              <div className="hidden grid-cols-[1fr_auto_auto] gap-4 border-b border-line py-3 text-xs font-semibold tracking-wide text-muted uppercase sm:grid">
                <span>Food item</span>
                <span>Quantity</span>
                <span>Price</span>
              </div>
              {lines.map((line) => (
                <CartItem key={line.food.id} line={line} />
              ))}
            </div>
            <CartSummary summary={summary} threshold={settings.freeDeliveryThreshold} />
          </div>
        )}
      </Container>
    </>
  );
}
