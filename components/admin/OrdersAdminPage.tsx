"use client";

import { useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OrderTable } from "@/components/admin/OrderTable";
import { OrderDetails } from "@/components/order/OrderDetails";
import { StatusBadge } from "@/components/order/StatusBadge";
import { SearchBar } from "@/components/food/SearchBar";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { useStore } from "@/components/providers/StoreProvider";
import { Button } from "@/components/ui/button";
import { SelectInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/Modal";
import { nextStatus, ORDER_STATUSES, statusLabel } from "@/lib/status";
import type { Order, OrderStatus } from "@/types";

export function OrdersAdminPage() {
  const { orders, hydrated, updateOrderStatus, deleteOrder } = useStore();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [selected, setSelected] = useState<Order | null>(null);

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...orders]
      .filter((order) => status === "all" || order.status === status)
      .filter((order) => {
        if (!query) return true;
        const items = order.items.map((item) => item.name).join(" ");
        return `${order.code} ${order.customerName} ${order.customerEmail} ${items}`
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [orders, search, status]);

  const active = selected ? orders.find((order) => order.id === selected.id) ?? selected : null;
  const upcoming = active ? nextStatus(active.status) : null;

  if (!hydrated) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Orders"
        description="Search orders, open the details, and move each one through the kitchen."
      />
      <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
        <SearchBar value={search} onChange={setSearch} placeholder="Search order, customer, or dish" />
        <SelectInput
          aria-label="Filter by status"
          value={status}
          onChange={(event) => setStatus(event.target.value as OrderStatus | "all")}
        >
          <option value="all">All statuses</option>
          {ORDER_STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </SelectInput>
      </div>
      <OrderTable
        orders={rows}
        empty="No orders match this filter."
        showPhone
        renderStatus={(order) => (
          <>
            <label className="sr-only" htmlFor={`status-${order.id}`}>
              Status for {order.code}
            </label>
            <SelectInput
              id={`status-${order.id}`}
              value={order.status}
              onChange={(event) => updateOrderStatus(order.id, event.target.value as OrderStatus)}
              className="h-9"
            >
              {ORDER_STATUSES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </SelectInput>
          </>
        )}
        renderAction={(order) => (
          <Button size="sm" variant="secondary" onClick={() => setSelected(order)}>
            Details
          </Button>
        )}
      />

      <Modal open={Boolean(active)} title={active ? active.code : "Order"} onClose={() => setSelected(null)} wide>
        {active ? (
          <div className="space-y-5">
            <OrderDetails order={active} />
            <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
              <StatusBadge status={active.status} />
              {upcoming ? (
                <Button onClick={() => updateOrderStatus(active.id, upcoming)}>
                  Mark as {statusLabel(upcoming)}
                </Button>
              ) : null}
              {active.status !== "cancelled" && active.status !== "completed" ? (
                <Button variant="ghost" onClick={() => updateOrderStatus(active.id, "cancelled")}>
                  Cancel order
                </Button>
              ) : null}
              <Button
                variant="danger"
                onClick={() => {
                  const id = active.id;
                  void deleteOrder(id).then((deleted) => {
                    if (deleted) setSelected(null);
                  });
                }}
              >
                Delete order
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
