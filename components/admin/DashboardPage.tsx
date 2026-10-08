"use client";

import { Banknote, ClipboardList, Eye, Users, UtensilsCrossed } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { OrderDetails } from "@/components/order/OrderDetails";
import { StatusBadge } from "@/components/order/StatusBadge";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { useStore } from "@/components/providers/StoreProvider";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { formatDate, formatPrice } from "@/lib/format";
import { statusLabel } from "@/lib/status";
import type { Order } from "@/types";

export function DashboardPage() {
  const { orders, foods, customers, hydrated } = useStore();
  const [selected, setSelected] = useState<Order | null>(null);

  const recent = useMemo(
    () => [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    [orders],
  );
  const revenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);

  if (!hydrated) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Dashboard"
        description="A snapshot of orders, revenue, customers, and the current menu."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total Orders" value={String(orders.length)} icon={<ClipboardList className="h-4 w-4" />} />
        <StatsCard label="Total Revenue" value={formatPrice(revenue)} hint="Excludes cancelled orders" icon={<Banknote className="h-4 w-4" />} />
        <StatsCard label="Total Customers" value={String(customers.length)} icon={<Users className="h-4 w-4" />} />
        <StatsCard label="Total Foods" value={String(foods.length)} icon={<UtensilsCrossed className="h-4 w-4" />} />
      </div>
      <section>
        <h2 className="text-lg font-semibold text-ink">Recent orders</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((order) => (
                <tr key={order.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">{order.code}</td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3 text-muted">
                    {order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                    <span className="sr-only">{statusLabel(order.status)}</span>
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="ghost" onClick={() => setSelected(order)}>
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <Modal
        open={Boolean(selected)}
        title={selected ? selected.code : "Order"}
        onClose={() => setSelected(null)}
        wide
      >
        {selected ? <OrderDetails order={selected} /> : null}
      </Modal>
    </div>
  );
}
