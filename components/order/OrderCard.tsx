"use client";

import { StatusBadge } from "@/components/order/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/format";
import type { Order } from "@/types";

export function OrderCard({ order, onView }: { order: Order; onView: () => void }) {
  return (
    <article className="rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{formatDate(order.createdAt)}</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">Order #{order.code}</h2>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <ul className="mt-4 space-y-1 text-sm text-ink">
        {order.items.map((item) => (
          <li key={`${item.foodId}-${item.name}`}>
            {item.name} × {item.quantity}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-lg font-semibold text-ink">{formatPrice(order.total)}</p>
        <Button variant="secondary" size="sm" onClick={onView}>
          View Details
        </Button>
      </div>
    </article>
  );
}
