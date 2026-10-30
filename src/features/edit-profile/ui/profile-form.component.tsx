"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/shared/lib/auth/auth.client";
import { Field } from "@/shared/ui";

// interface
type ProfileFormProps = {
  name: string;
  email: string;
  phone: string;
};

// component
export function ProfileForm({ name, email, phone }: ProfileFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.currentTarget);
    const result = await authClient.updateUser({
      name: String(form.get("name")),
      phone: String(form.get("phone")),
    });
    setPending(false);
    setMessage(result.error ? (result.error.message ?? "Помилка") : "Збережено");
    router.refresh();
  }

  // return
  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <h2 className="font-semibold">Особисті дані</h2>
      <Field label="Ім'я" name="name" defaultValue={name} required minLength={2} />
      <Field label="Телефон" name="phone" defaultValue={phone} type="tel" placeholder="+380" />
      <Field label="Email" value={email} readOnly disabled />
      {message && <p className="text-sm text-muted">{message}</p>}
      <button className="btn-primary" disabled={pending}>
        Зберегти
      </button>
    </form>
  );
}
