"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, DataTableMessage } from "@/components/admin/DataTable";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { useStore } from "@/components/providers/StoreProvider";
import { formatDate } from "@/lib/format";
import { countCustomerOrders } from "@/lib/orders";

export function CustomersPage() {
  const { customers, orders, hydrated } = useStore();

  if (!hydrated) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Customers"
        description="Sample customer records for the preview. Editing accounts arrives with authentication."
      />
      <DataTable
        caption="Customers"
        columns={["Name", "Email", "Phone", "Address", "Orders", "Joined"]}
      >
        {customers.length === 0 ? (
          <DataTableMessage colSpan={6}>No customers yet.</DataTableMessage>
        ) : (
          customers.map((customer) => (
            <tr key={customer.id} className="border-t border-line">
              <td className="px-4 py-3 font-medium text-ink">{customer.name}</td>
              <td className="px-4 py-3">{customer.email}</td>
              <td className="px-4 py-3">{customer.phone}</td>
              <td className="px-4 py-3 text-muted">{customer.address}</td>
              <td className="px-4 py-3">{countCustomerOrders(customer, orders)}</td>
              <td className="px-4 py-3 text-muted">{formatDate(customer.joinedAt)}</td>
            </tr>
          ))
        )}
      </DataTable>
    </div>
  );
}
