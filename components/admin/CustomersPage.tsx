"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { useStore } from "@/components/providers/StoreProvider";
import { formatDate } from "@/lib/format";

export function CustomersPage() {
  const { customers, hydrated } = useStore();

  if (!hydrated) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Customers"
        description="Sample customer records for the preview. Editing accounts arrives with authentication."
      />
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Address</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium text-ink">{customer.name}</td>
                <td className="px-4 py-3">{customer.email}</td>
                <td className="px-4 py-3">{customer.phone}</td>
                <td className="px-4 py-3 text-muted">{customer.address}</td>
                <td className="px-4 py-3">{customer.orderCount}</td>
                <td className="px-4 py-3 text-muted">{formatDate(customer.joinedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
