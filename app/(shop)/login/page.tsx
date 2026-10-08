import type { Metadata } from "next";
import { LoginPage } from "@/components/auth/LoginPage";

export const metadata: Metadata = {
  title: "Login",
  description: "FoodGo login screen. Authentication is not connected in this phase.",
};

export default function Page() {
  return <LoginPage />;
}
