"use client";

import {
  ClipboardList,
  LayoutDashboard,
  Menu,
  Settings,
  Tags,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/foods", label: "Foods", icon: UtensilsCrossed },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  return (
    <div className="min-h-screen bg-stone-100 lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          onClick={() => setOpenPath(null)}
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-line bg-white transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-xs font-bold text-white">
              FG
            </span>
            <span>
              <span className="block font-display text-lg leading-none text-ink">FoodGo</span>
              <span className="text-xs text-muted">Admin</span>
            </span>
          </Link>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-stone-100 lg:hidden"
            aria-label="Close sidebar"
            onClick={() => setOpenPath(null)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Admin">
          {links.map((link) => {
            const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-ink",
                  active && "bg-brand-soft text-brand-dark",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line p-4">
          <Link href="/" className="text-sm font-medium text-ink hover:text-brand">
            View store
          </Link>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? "Close admin menu" : "Open admin menu"}
            onClick={() => setOpenPath(open ? null : pathname)}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-stone-100"
          >
            <Menu className="h-4 w-4" />
          </button>
          <p className="font-semibold text-ink">FoodGo Admin</p>
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
