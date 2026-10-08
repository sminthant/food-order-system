"use client";

import { useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OrderDetails } from "@/components/order/OrderDetails";
import { StatusBadge } from "@/components/order/StatusBadge";
import { SearchBar } from "@/components/food/SearchBar";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { useStore } from "@/components/providers/StoreProvider";
import { Button } from "@/components/ui/button";
import { SelectInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/Modal";
import { formatDate, formatPrice } from "@/lib/format";
import { nextStatus, ORDER_STATUSES, statusLabel } from "@/lib/status";
import type { Order, OrderStatus } from "@/types";

export function OrdersAdminPage() {
  const { orders, hydrated, updateOrderStatus } = useStore();
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
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[920px] text-left text-sm">
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
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  No orders match this filter.
                </td>
              </tr>
            ) : (
              rows.map((order) => (
                <tr key={order.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">{order.code}</td>
                  <td className="px-4 py-3">
                    <p>{order.customerName}</p>
                    <p className="text-xs text-muted">{order.customerPhone}</p>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-muted">
                    <p className="line-clamp-2">
                      {order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <label className="sr-only" htmlFor={`status-${order.id}`}>
                      Status for {order.code}
                    </label>
                    <SelectInput
                      id={`status-${order.id}`}
                      value={order.status}
                      onChange={(event) =>
                        updateOrderStatus(order.id, event.target.value as OrderStatus)
                      }
                      className="h-9"
                    >
                      {ORDER_STATUSES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </SelectInput>
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="secondary" onClick={() => setSelected(order)}>
                      Details
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
