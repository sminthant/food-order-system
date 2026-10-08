import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { StoreProvider } from "@/components/providers/StoreProvider";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: {
    default: "FoodGo — Delicious food, delivered",
    template: "%s · FoodGo",
  },
  description:
    "FoodGo is a food ordering website for browsing meals, managing a cart, and placing delivery orders.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full bg-surface font-sans text-ink">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
