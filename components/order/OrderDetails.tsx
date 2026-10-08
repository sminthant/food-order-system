import { FoodImage } from "@/components/food/FoodImage";
import { StatusBadge } from "@/components/order/StatusBadge";
import { formatDateTime, formatPrice } from "@/lib/format";
import type { Order } from "@/types";

export function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{formatDateTime(order.createdAt)}</p>
          <p className="mt-1 font-semibold text-ink">{order.code}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <ul className="divide-y divide-line rounded-2xl border border-line">
        {order.items.map((item) => (
          <li key={`${item.foodId}-${item.name}`} className="flex items-center gap-3 p-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100">
              <FoodImage src={item.image} alt="" sizes="56px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{item.name}</p>
              <p className="text-sm text-muted">
                {formatPrice(item.price)} × {item.quantity}
              </p>
            </div>
            <p className="font-semibold text-ink">{formatPrice(item.price * item.quantity)}</p>
          </li>
        ))}
      </ul>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">Customer</dt>
          <dd className="font-medium text-ink">{order.customerName}</dd>
        </div>
        <div>
          <dt className="text-muted">Phone</dt>
          <dd className="font-medium text-ink">{order.customerPhone}</dd>
        </div>
        <div>
          <dt className="text-muted">Email</dt>
          <dd className="font-medium text-ink">{order.customerEmail}</dd>
        </div>
        <div>
          <dt className="text-muted">Payment</dt>
          <dd className="font-medium text-ink">
            {order.paymentMethod === "cash" ? "Cash on Delivery" : "Credit/Debit Card"}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-muted">Delivery address</dt>
          <dd className="font-medium text-ink">{order.address}</dd>
        </div>
      </dl>
      <dl className="space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd>{formatPrice(order.subtotal)}</dd>
        </div>
        {order.discount > 0 ? (
          <div className="flex justify-between text-brand-dark">
            <dt>Discount {order.promoCode ? `(${order.promoCode})` : ""}</dt>
            <dd>-{formatPrice(order.discount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-muted">Delivery</dt>
          <dd>{order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}</dd>
        </div>
        <div className="flex justify-between text-base font-semibold text-ink">
          <dt>Total</dt>
          <dd>{formatPrice(order.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
