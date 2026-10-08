import { cn } from "@/lib/cn";
import { statusLabel } from "@/lib/status";
import type { OrderStatus } from "@/types";

const styles: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  confirmed: "bg-sky-50 text-sky-800 ring-sky-200",
  preparing: "bg-orange-50 text-orange-800 ring-orange-200",
  ready: "bg-teal-50 text-teal-800 ring-teal-200",
  completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  cancelled: "bg-stone-100 text-stone-600 ring-stone-200",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        styles[status],
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
