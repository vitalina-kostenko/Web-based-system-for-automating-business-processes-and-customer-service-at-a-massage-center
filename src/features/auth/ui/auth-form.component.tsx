"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field } from "@/shared/ui";
import { authClient } from "@/shared/lib/auth/auth.client";
import { siteConfig } from "@/shared/config/site.config";

// interface
type AuthFormProps = { mode: "sign-in" | "sign-up" };

// component
export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const isSignUp = mode === "sign-up";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const result = isSignUp
      ? await authClient.signUp.email({ email, password, name: String(form.get("name")) })
      : await authClient.signIn.email({ email, password });
    setPending(false);
    if (result.error) {
      setError(result.error.message ?? "Помилка авторизації");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  // return
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {isSignUp && <Field label="Ім'я" name="name" required minLength={2} autoComplete="name" />}
      <Field label="Email" name="email" type="email" required autoComplete="email" />
      <Field
        label="Пароль"
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete={isSignUp ? "new-password" : "current-password"}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <button className="btn-primary w-full" disabled={pending}>
        {isSignUp ? "Створити акаунт" : "Увійти"}
      </button>
      {siteConfig.isClerkEnabled && (
        <Link href="/clerk" className="btn-outline w-full">
          Продовжити через Clerk
        </Link>
      )}
      <p className="text-center text-sm text-muted">
        {isSignUp ? "Вже є акаунт? " : "Немає акаунта? "}
        <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="font-medium text-brand">
          {isSignUp ? "Увійти" : "Зареєструватись"}
        </Link>
      </p>
    </form>
  );
}
