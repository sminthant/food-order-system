"use client";

import { useState, type FormEvent } from "react";
import { Container } from "@/components/layout/Container";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: { email?: string; password?: string } = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email.";
    if (password.length < 4) next.password = "Use at least 4 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setMessage("");
      return;
    }
    setMessage("Sign-in is not connected yet. This screen is ready for the authentication phase.");
  }

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-md rounded-3xl border border-line bg-white p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">Account</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight text-ink">Login</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Accounts will be connected later. You can still browse, cart, and place preview orders.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
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
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((current) => ({ ...current, password: undefined }));
              }}
            />
          </Field>
          {message ? (
            <p role="status" className="text-sm text-ink">
              {message}
            </p>
          ) : null}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <div className="mt-4 text-center">
          <ButtonLink href="/menu" variant="ghost">
            Continue to menu
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
