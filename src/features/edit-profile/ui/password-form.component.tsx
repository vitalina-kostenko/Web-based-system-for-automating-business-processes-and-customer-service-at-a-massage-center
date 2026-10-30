"use client";

import { useState, type FormEvent } from "react";
import { authClient } from "@/shared/lib/auth/auth.client";
import { Field } from "@/shared/ui";

// component
export function PasswordForm() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setPending(true);
    const form = new FormData(formElement);
    const result = await authClient.changePassword({
      currentPassword: String(form.get("current")),
      newPassword: String(form.get("next")),
      revokeOtherSessions: true,
    });
    setPending(false);
    if (result.error) return setMessage(result.error.message ?? "Помилка");
    setMessage("Пароль змінено");
    formElement.reset();
  }

  // return
  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <h2 className="font-semibold">Зміна пароля</h2>
      <Field label="Поточний пароль" name="current" type="password" required autoComplete="current-password" />
      <Field label="Новий пароль" name="next" type="password" required minLength={8} autoComplete="new-password" />
      {message && <p className="text-sm text-muted">{message}</p>}
      <button className="btn-primary" disabled={pending}>
        Змінити пароль
      </button>
    </form>
  );
}
