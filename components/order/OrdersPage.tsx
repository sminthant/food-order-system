"use client";

import { ClipboardList } from "lucide-react";
import { useMemo, useState } from "react";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { OrderCard } from "@/components/order/OrderCard";
import { OrderDetails } from "@/components/order/OrderDetails";
import { useStore } from "@/components/providers/StoreProvider";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import { ORDER_STATUSES } from "@/lib/status";
import type { Order, OrderStatus } from "@/types";

export function OrdersPage() {
  const { orders, hydrated } = useStore();
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [selected, setSelected] = useState<Order | null>(null);

  const visible = useMemo(() => {
    return [...orders]
      .filter((order) => status === "all" || order.status === status)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [orders, status]);

  if (!hydrated) return <PageSkeleton />;

  return (
    <>
      <PageHeader
        eyebrow="Orders"
        title="Your orders"
        description="Track sample orders and anything you place during this preview."
      />
      <Container className="py-8 sm:py-10">
        <div className="flex gap-2 overflow-x-auto pb-1" role="toolbar" aria-label="Filter by status">
          <StatusChip active={status === "all"} onClick={() => setStatus("all")}>
            All
          </StatusChip>
          {ORDER_STATUSES.map((item) => (
            <StatusChip
              key={item.value}
              active={status === item.value}
              onClick={() => setStatus(item.value)}
            >
              {item.label}
            </StatusChip>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={<ClipboardList className="h-5 w-5" />}
              title="No orders in this view."
              description="Place an order from the menu, or choose another status."
              action={<ButtonLink href="/menu">Explore Menu</ButtonLink>}
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {visible.map((order) => (
              <OrderCard key={order.id} order={order} onView={() => setSelected(order)} />
            ))}
          </div>
        )}
      </Container>
      <Modal open={Boolean(selected)} title={selected ? `Order ${selected.code}` : "Order"} onClose={() => setSelected(null)} wide>
        {selected ? <OrderDetails order={selected} /> : null}
      </Modal>
    </>
  );
}

function StatusChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full px-4 text-sm font-medium",
        active ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line hover:bg-stone-50",
      )}
    >
      {children}
    </button>
  );
}
