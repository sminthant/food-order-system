"use client";

import { Banknote, Check, CreditCard, ShoppingBag } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { CartSummary } from "@/components/cart/CartSummary";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { useCartSummary, useStore } from "@/components/providers/StoreProvider";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field, TextArea, TextInput } from "@/components/ui/field";
import { createId, nextOrderCode, PROMO_CODE } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { Order, PaymentMethod } from "@/types";

type FormState = {
  name: string;
  phone: string;
  email: string;
  address: string;
  payment: PaymentMethod;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  promo: string;
};

type FieldName = keyof FormState;

const initialForm: FormState = {
  name: "",
  phone: "",
  email: "",
  address: "",
  payment: "cash",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
  promo: "",
};

export function CheckoutPage() {
  const { hydrated, orders, placeOrder, settings } = useStore();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");
  const [placed, setPlaced] = useState<Order | null>(null);
  const { lines, summary } = useCartSummary(promoApplied);

  if (!hydrated) return <PageSkeleton />;

  if (placed) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-line bg-white px-6 py-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-700">
            <Check className="h-6 w-6" />
          </div>
          <h1 className="mt-5 font-display text-4xl tracking-tight text-ink">Order placed</h1>
          <p className="mt-3 text-muted">
            {placed.code} is now pending. The kitchen preview will show it under Orders and in the admin board.
          </p>
          <p className="mt-2 text-sm text-muted">
            No payment was taken. Card details are not stored.
          </p>
          <ul className="mt-6 space-y-1 text-sm text-ink">
            {placed.items.map((item) => (
              <li key={`${item.foodId}-${item.name}`}>
                {item.name} × {item.quantity}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-2xl font-semibold text-ink">{formatPrice(placed.total)}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/orders">View orders</ButtonLink>
            <ButtonLink href="/menu" variant="secondary">
              Back to menu
            </ButtonLink>
          </div>
        </div>
      </Container>
    );
  }

  if (lines.length === 0) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={<ShoppingBag className="h-5 w-5" />}
          title="Your cart is empty."
          description="Add a few dishes before checking out."
          action={<ButtonLink href="/menu">Explore Menu</ButtonLink>}
        />
      </Container>
    );
  }

  function update<K extends FieldName>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function applyPromo() {
    if (form.promo.trim().toUpperCase() === PROMO_CODE) {
      setPromoApplied(true);
      setPromoMessage("FIRST20 applied. 20% off the food subtotal.");
      return;
    }
    setPromoApplied(false);
    setPromoMessage("That code is not valid. Try FIRST20.");
  }

  function validate() {
    const next: Partial<Record<FieldName, string>> = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^[0-9+\-\s]{8,}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email.";
    if (form.address.trim().length < 8) next.address = "Enter a delivery address.";
    if (form.payment === "card") {
      if (form.cardName.trim().length < 2) next.cardName = "Enter the name on the card.";
      if (form.cardNumber.replace(/\s/g, "").length < 12) next.cardNumber = "Enter a card number.";
      if (!/^\d{2}\/\d{2}$/.test(form.expiry.trim())) next.expiry = "Use MM/YY.";
      if (!/^\d{3,4}$/.test(form.cvc.trim())) next.cvc = "Enter the CVC.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    const order: Order = {
      id: createId("ord"),
      code: nextOrderCode(orders.map((item) => item.code)),
      customerId: null,
      customerName: form.name.trim(),
      customerEmail: form.email.trim(),
      customerPhone: form.phone.trim(),
      address: form.address.trim(),
      items: lines.map((line) => ({
        foodId: line.food.id,
        name: line.food.name,
        price: line.food.price,
        quantity: line.quantity,
        image: line.food.image,
        subtotal: line.lineTotal,
      })),
      subtotal: summary.subtotal,
      discount: summary.discount,
      deliveryFee: summary.deliveryFee,
      total: summary.total,
      status: "pending",
      paymentMethod: form.payment,
      promoCode: promoApplied ? PROMO_CODE : null,
      createdAt: new Date().toISOString(),
    };

    const saved = await placeOrder(order);
    if (saved) setPlaced(saved);
  }

  return (
    <>
      <PageHeader
        eyebrow="Checkout"
        title="Delivery details"
        description="Tell us where to bring the order. Payment on this screen is a preview only."
      />
      <Container className="py-8 sm:py-10">
        <form onSubmit={submit} className="grid items-start gap-8 lg:grid-cols-[1fr_320px]" noValidate>
          <div className="space-y-6">
            <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-ink">Customer information</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" htmlFor="name" error={errors.name}>
                  <TextInput
                    id="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                  />
                </Field>
                <Field label="Phone" htmlFor="phone" error={errors.phone}>
                  <TextInput
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Email" htmlFor="email" error={errors.email}>
                    <TextInput
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) => update("email", event.target.value)}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Delivery address" htmlFor="address" error={errors.address}>
                    <TextArea
                      id="address"
                      autoComplete="street-address"
                      value={form.address}
                      onChange={(event) => update("address", event.target.value)}
                    />
                  </Field>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-ink">Payment method</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <PaymentOption
                  active={form.payment === "cash"}
                  icon={<Banknote className="h-5 w-5" />}
                  title="Cash on Delivery"
                  description="Pay the courier when the food arrives."
                  onSelect={() => update("payment", "cash")}
                />
                <PaymentOption
                  active={form.payment === "card"}
                  icon={<CreditCard className="h-5 w-5" />}
                  title="Credit/Debit Card"
                  description="Preview only. Nothing is charged."
                  onSelect={() => update("payment", "card")}
                />
              </div>
              {form.payment === "card" ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Name on card" htmlFor="card-name" error={errors.cardName}>
                      <TextInput
                        id="card-name"
                        autoComplete="cc-name"
                        value={form.cardName}
                        onChange={(event) => update("cardName", event.target.value)}
                      />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Card number" htmlFor="card-number" error={errors.cardNumber}>
                      <TextInput
                        id="card-number"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="1234 5678 9012 3456"
                        value={form.cardNumber}
                        onChange={(event) => update("cardNumber", event.target.value)}
                      />
                    </Field>
                  </div>
                  <Field label="Expiry" htmlFor="expiry" error={errors.expiry}>
                    <TextInput
                      id="expiry"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      value={form.expiry}
                      onChange={(event) => update("expiry", event.target.value)}
                    />
                  </Field>
                  <Field label="CVC" htmlFor="cvc" error={errors.cvc}>
                    <TextInput
                      id="cvc"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      value={form.cvc}
                      onChange={(event) => update("cvc", event.target.value)}
                    />
                  </Field>
                </div>
              ) : null}
            </section>

            <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-ink">Promo code</h2>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <TextInput
                  aria-label="Promo code"
                  value={form.promo}
                  onChange={(event) => {
                    update("promo", event.target.value);
                    setPromoApplied(false);
                    setPromoMessage("");
                  }}
                  placeholder="FIRST20"
                />
                <Button type="button" variant="secondary" onClick={applyPromo}>
                  Apply
                </Button>
              </div>
              {promoMessage ? (
                <p className={cn("mt-2 text-sm", promoApplied ? "text-emerald-700" : "text-red-700")}>
                  {promoMessage}
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted">First-order preview code: FIRST20.</p>
              )}
            </section>
          </div>

          <div className="space-y-4 lg:sticky lg:top-24">
            <CartSummary
              summary={summary}
              threshold={settings.freeDeliveryThreshold}
              action={
                <Button type="submit" className="w-full" size="lg">
                  Place Order
                </Button>
              }
            />
            <ul className="space-y-2 rounded-2xl border border-line bg-white p-4 text-sm">
              {lines.map((line) => (
                <li key={line.food.id} className="flex justify-between gap-3">
                  <span className="text-ink">
                    {line.food.name} × {line.quantity}
                  </span>
                  <span className="shrink-0 font-medium">{formatPrice(line.lineTotal)}</span>
                </li>
              ))}
            </ul>
          </div>
        </form>
      </Container>
    </>
  );
}

function PaymentOption({
  active,
  icon,
  title,
  description,
  onSelect,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "rounded-2xl border p-4 text-left transition",
        active ? "border-brand bg-brand-soft" : "border-line bg-white hover:bg-stone-50",
      )}
    >
      <span className={cn("grid h-10 w-10 place-items-center rounded-xl", active ? "bg-white text-brand" : "bg-stone-100 text-ink")}>
        {icon}
      </span>
      <span className="mt-3 block font-semibold text-ink">{title}</span>
      <span className="mt-1 block text-sm text-muted">{description}</span>
    </button>
  );
}
