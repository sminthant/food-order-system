import type { ReactNode } from "react";

export function StatsCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">{icon}</span>
      </div>
      <p className="mt-3 font-display text-3xl tracking-tight text-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </article>
  );
}
