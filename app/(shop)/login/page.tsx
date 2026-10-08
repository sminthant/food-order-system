import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPage } from "@/components/auth/LoginPage";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in or create a FoodGo customer or admin account.",
};

export default function Page() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
