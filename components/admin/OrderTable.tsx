"use client";

import type { ReactNode } from "react";
import { DataTable, DataTableMessage } from "@/components/admin/DataTable";
import { formatDate, formatPrice } from "@/lib/format";
import { orderItemSummary } from "@/lib/orders";
import type { Order } from "@/types";

const columns = ["Order ID", "Customer", "Items", "Total", "Status", "Date", "Action"];

export function OrderTable({
  orders,
  empty,
  showPhone = false,
  renderStatus,
  renderAction,
}: {
  orders: Order[];
  empty: string;
  showPhone?: boolean;
  renderStatus: (order: Order) => ReactNode;
  renderAction: (order: Order) => ReactNode;
}) {
  return (
    <DataTable caption="Orders" minWidth="920px" columns={columns}>
      {orders.length === 0 ? (
        <DataTableMessage colSpan={columns.length}>{empty}</DataTableMessage>
      ) : (
        orders.map((order) => (
          <tr key={order.id} className="border-t border-line">
            <td className="px-4 py-3 font-medium text-ink">{order.code}</td>
            <td className="px-4 py-3">
              <p>{order.customerName}</p>
              {showPhone ? <p className="text-xs text-muted">{order.customerPhone}</p> : null}
            </td>
            <td className="max-w-xs px-4 py-3 text-muted">
              <p className="line-clamp-2">{orderItemSummary(order)}</p>
            </td>
            <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
            <td className="px-4 py-3">{renderStatus(order)}</td>
            <td className="px-4 py-3 text-muted">{formatDate(order.createdAt)}</td>
            <td className="px-4 py-3">{renderAction(order)}</td>
          </tr>
        ))
      )}
    </DataTable>
  );
}
