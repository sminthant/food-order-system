"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { shopLinks } from "@/data/site";
import { cn } from "@/lib/cn";

export function Navbar() {
  const pathname = usePathname();
  const { cart, hydrated } = useStore();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-sm font-bold text-white">
            FG
          </span>
          <span className="font-display text-xl tracking-tight">FoodGo</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {shopLinks.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-ink",
                  active && "bg-brand-soft text-brand-dark",
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label={
              hydrated ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart"
            }
            className="relative grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-stone-100"
          >
            <ShoppingBag className="h-5 w-5" />
            {hydrated && count > 0 ? (
              <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            ) : null}
          </Link>
          <Link
            href="/login"
            className="hidden h-9 items-center rounded-full bg-brand px-3 text-sm font-semibold text-white hover:bg-brand-dark sm:inline-flex"
          >
            Login
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-stone-100 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpenPath(open ? null : pathname)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" className="border-t border-line bg-white px-4 py-3 lg:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-1">
            {shopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-3 text-sm font-medium text-ink hover:bg-stone-100"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login" className="rounded-xl px-3 py-3 text-sm font-medium text-brand">
              Login
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
