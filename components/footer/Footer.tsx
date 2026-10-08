"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { useStore } from "@/components/providers/StoreProvider";
import { shopLinks } from "@/data/site";

function SocialIcon({ name }: { name: "instagram" | "facebook" }) {
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="currentColor">
      <path d="M14.5 8.5H16V6h-1.5C12.6 6 11 7.6 11 9.5V11H9v2.5h2V20h2.5v-6.5H16L16.5 11H13.5V9.5c0-.6.4-1 1-1Z" />
    </svg>
  );
}

export function Footer() {
  const { settings } = useStore();

  return (
    <footer className="mt-auto bg-ink text-stone-300">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl text-white">FoodGo</p>
          <p className="mt-3 max-w-xs text-sm leading-6">
            A modern way to browse meals, build a cart, and place a delivery order.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <SocialIcon name="instagram" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <SocialIcon name="facebook" />
            </a>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/cart" className="hover:text-white">
                Cart
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>{settings.address}</li>
            <li>
              <a href={`tel:${settings.phone}`} className="hover:text-white">
                {settings.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="hover:text-white">
                {settings.email}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Kitchen hours</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Monday – Friday, 10:00 – 22:00</li>
            <li>Saturday – Sunday, 09:00 – 23:00</li>
            <li>Delivery across Bangkok</li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 FoodGo. All rights reserved.</p>
          <Link href="/admin" className="hover:text-white">
            Admin
          </Link>
        </Container>
      </div>
    </footer>
  );
}
