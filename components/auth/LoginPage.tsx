"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";
import { ApiError } from "@/lib/client-api";
import { cn } from "@/lib/cn";
import type { AccountRole } from "@/types/account";

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "";
  return value;
}

export function LoginPage() {
  const searchParams = useSearchParams();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<AccountRole>("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const notice = searchParams.get("notice") === "admin" ? "That page is for admin accounts." : "";

  function destination(nextRole: AccountRole) {
    const next = safeNext(searchParams.get("next"));
    if (nextRole === "admin") return next.startsWith("/admin") ? next : "/admin";
    if (next && !next.startsWith("/admin")) return next;
    return "/menu";
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: { name?: string; email?: string; password?: string } = {};
    if (mode === "register" && name.trim().length < 2) nextErrors.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = "Enter a valid email.";
    if (password.length < 8) nextErrors.password = "Use at least 8 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setMessage("");
      return;
    }

    setPending(true);
    setMessage("");
    try {
      const account =
        mode === "register"
          ? await register({ name: name.trim(), email: email.trim(), password, role })
          : await login(email.trim(), password);
      window.location.assign(destination(account.role));
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-md rounded-3xl border border-line bg-white p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">Account</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight text-ink">
          {mode === "login" ? "Login" : "Create account"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Customers open the menu. Admins open the dashboard.
        </p>
        <div className="mt-4 rounded-2xl bg-stone-50 px-3 py-3 text-sm leading-6 text-muted">
          <p className="font-medium text-ink">Default accounts</p>
          <p>Admin: admin@gmail.com / admin1234</p>
          <p>Customer: john@gmail.com / john1234</p>
        </div>
        {notice ? (
          <p role="status" className="mt-4 rounded-2xl bg-brand-soft px-3 py-2 text-sm text-brand-dark">
            {notice}
          </p>
        ) : null}
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          {mode === "register" ? (
            <>
              <fieldset>
                <legend className="mb-1.5 block text-sm font-medium text-ink">Account type</legend>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ["user", "Customer"],
                      ["admin", "Admin"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={role === value}
                      onClick={() => setRole(value)}
                      className={cn(
                        "h-11 rounded-xl border text-sm font-semibold",
                        role === value
                          ? "border-brand bg-brand-soft text-brand-dark"
                          : "border-line bg-white text-ink hover:bg-stone-50",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <Field label="Name" htmlFor="login-name" error={errors.name}>
                <TextInput
                  id="login-name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setErrors((current) => ({ ...current, name: undefined }));
                  }}
                />
              </Field>
            </>
          ) : null}
          <Field label="Email" htmlFor="login-email" error={errors.email}>
            <TextInput
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((current) => ({ ...current, email: undefined }));
              }}
            />
          </Field>
          <Field label="Password" htmlFor="login-password" error={errors.password}>
            <TextInput
              id="login-password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((current) => ({ ...current, password: undefined }));
              }}
            />
          </Field>
          {message ? (
            <p role="alert" className="text-sm text-red-700">
              {message}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Please wait" : mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted">
          {mode === "login" ? "Need an account?" : "Already registered?"}{" "}
          <button
            type="button"
            className="font-semibold text-brand hover:text-brand-dark"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setMessage("");
              setErrors({});
            }}
          >
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </p>
      </div>
    </Container>
  );
}
