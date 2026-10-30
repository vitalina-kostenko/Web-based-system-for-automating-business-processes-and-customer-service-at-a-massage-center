"use client";

import { useTransition } from "react";
import { toggleServiceAction } from "../api/manage-service.actions";

// interface
type ServiceToggleProps = { id: string; active: boolean };

// component
export function ServiceToggle({ id, active }: ServiceToggleProps) {
  const [pending, startTransition] = useTransition();
  // return
  return (
    <button
      className="btn-outline h-8 px-3"
      disabled={pending}
      onClick={() => startTransition(() => toggleServiceAction(id, !active))}
    >
      {active ? "Вимкнути" : "Увімкнути"}
    </button>
  );
}
