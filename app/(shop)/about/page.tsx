import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About",
  description: "Learn what the FoodGo ordering preview includes.",
};

export default function Page() {
  return <AboutPage />;
}
