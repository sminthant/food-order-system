import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentAccount } from "@/lib/auth";

export const instant = false;

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const account = await getCurrentAccount();
  if (!account) redirect("/login");
  return children;
}
