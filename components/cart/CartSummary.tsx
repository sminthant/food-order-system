import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import type { CartSummary as Summary } from "@/lib/cart";

export function CartSummary({
  summary,
  threshold,
  action,
}: {
  summary: Summary;
  threshold: number;
  action?: ReactNode;
}) {
  return (
    <aside className="h-fit rounded-2xl border border-line bg-white p-5 sm:p-6">
      <h2 className="font-display text-2xl tracking-tight text-ink">Order summary</h2>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="font-medium text-ink">{formatPrice(summary.subtotal)}</dd>
        </div>
        {summary.discount > 0 ? (
          <div className="flex justify-between text-brand-dark">
            <dt>Discount</dt>
            <dd>-{formatPrice(summary.discount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-muted">Delivery</dt>
          <dd className="font-medium text-ink">
            {summary.deliveryFee === 0 ? "Free" : formatPrice(summary.deliveryFee)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-base">
          <dt className="font-semibold text-ink">Total</dt>
          <dd className="font-semibold text-ink">{formatPrice(summary.total)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs leading-5 text-muted">
        Free delivery on orders from {formatPrice(threshold)}.
      </p>
      <div className="mt-5">
        {action ?? <ButtonLink href="/checkout" className="w-full">Checkout</ButtonLink>}
      </div>
    </aside>
  );
}
