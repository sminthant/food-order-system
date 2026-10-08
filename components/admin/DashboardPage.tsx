"use client";

import { Banknote, ClipboardList, Eye, Users, UtensilsCrossed } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OrderTable } from "@/components/admin/OrderTable";
import { StatsCard } from "@/components/admin/StatsCard";
import { OrderDetails } from "@/components/order/OrderDetails";
import { StatusBadge } from "@/components/order/StatusBadge";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { useStore } from "@/components/providers/StoreProvider";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { formatPrice } from "@/lib/format";
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
        <div className="mt-4">
          <OrderTable
            orders={recent}
            empty="No orders yet."
            renderStatus={(order) => (
              <>
                <StatusBadge status={order.status} />
                <span className="sr-only">{statusLabel(order.status)}</span>
              </>
            )}
            renderAction={(order) => (
              <Button size="sm" variant="ghost" onClick={() => setSelected(order)}>
                <Eye className="h-4 w-4" />
                View
              </Button>
            )}
          />
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
