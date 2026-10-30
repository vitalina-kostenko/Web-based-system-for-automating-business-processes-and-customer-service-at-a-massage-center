"use client";

import { useTransition } from "react";
import { markAllReadAction } from "../api/read-notifications.actions";

// component
export function MarkReadButton() {
  const [pending, startTransition] = useTransition();
  // return
  return (
    <button
      className="text-xs font-medium text-brand disabled:opacity-50"
      disabled={pending}
      onClick={() => startTransition(() => markAllReadAction())}
    >
      Позначити прочитаними
    </button>
  );
}
