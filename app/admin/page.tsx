import type { Metadata } from "next";
import { DashboardPage } from "@/components/admin/DashboardPage";

export const metadata: Metadata = {
  title: "Admin",
  description: "FoodGo admin dashboard.",
};

export default function Page() {
  return <DashboardPage />;
}
