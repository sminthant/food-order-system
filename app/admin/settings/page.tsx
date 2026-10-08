import type { Metadata } from "next";
import { SettingsPage } from "@/components/admin/SettingsPage";

export const metadata: Metadata = {
  title: "Settings",
  description: "FoodGo store settings for this preview.",
};

export default function Page() {
  return <SettingsPage />;
}
