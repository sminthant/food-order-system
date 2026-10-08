import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-dashed border-line bg-white px-6 py-14 text-center">
      {icon ? (
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-brand">
          {icon}
        </div>
      ) : null}
      <h2 className="font-display text-3xl tracking-tight text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
