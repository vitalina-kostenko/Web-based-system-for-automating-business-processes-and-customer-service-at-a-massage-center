"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/shared/lib/auth/auth.client";

// component
export function SignOutButton() {
  const router = useRouter();

  async function onClick() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  // return
  return (
    <button type="button" aria-label="Вийти" className="btn-ghost size-10 px-0" onClick={onClick}>
      <LogOut className="size-5" />
    </button>
  );
}
