import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentAccount } from "@/lib/auth";

export const instant = false;

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const account = await getCurrentAccount();
  if (!account) redirect("/login?next=/admin");
  if (account.role !== "admin") redirect("/login?notice=admin");
  return <AdminShell>{children}</AdminShell>;
}
