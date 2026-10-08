"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { api } from "@/lib/client-api";
import { useStore } from "@/components/providers/StoreProvider";
import type { AccountRole, PublicAccount } from "@/types/account";

type AuthValue = {
  account: PublicAccount | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<PublicAccount>;
  register: (input: {
    name: string;
    email: string;
    password: string;
    role: AccountRole;
  }) => Promise<PublicAccount>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { reloadCatalog } = useStore();
  const reloadRef = useRef(reloadCatalog);
  reloadRef.current = reloadCatalog;
  const [account, setAccount] = useState<PublicAccount | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancel = false;
    api<PublicAccount | null>("/api/auth/me")
      .then(async (value) => {
        if (cancel) return;
        setAccount(value);
        if (value) await reloadRef.current();
      })
      .catch(() => {
        if (!cancel) setAccount(null);
      })
      .finally(() => {
        if (!cancel) setReady(true);
      });
    return () => {
      cancel = true;
    };
  }, []);

  async function login(email: string, password: string) {
    const next = await api<PublicAccount>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAccount(next);
    await reloadRef.current();
    return next;
  }

  async function register(input: { name: string; email: string; password: string; role: AccountRole }) {
    const next = await api<PublicAccount>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
    setAccount(next);
    await reloadRef.current();
    return next;
  }

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    setAccount(null);
    await reloadRef.current();
  }

  return (
    <AuthContext.Provider value={{ account, ready, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
