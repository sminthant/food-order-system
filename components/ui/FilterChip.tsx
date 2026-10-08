import { cn } from "@/lib/cn";

export function FilterChip({
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
        "h-9 shrink-0 rounded-full px-4 text-sm font-medium transition",
        active ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line hover:bg-stone-50",
      )}
    >
      {children}
    </button>
  );
}
