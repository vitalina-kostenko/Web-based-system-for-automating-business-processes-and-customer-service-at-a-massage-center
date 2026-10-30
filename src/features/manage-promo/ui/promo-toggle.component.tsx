"use client";

import { useTransition } from "react";
import { togglePromoAction } from "../api/manage-promo.actions";

// interface
type PromoToggleProps = { id: string; active: boolean };

// component
export function PromoToggle({ id, active }: PromoToggleProps) {
  const [pending, startTransition] = useTransition();
  // return
  return (
    <button
      className="btn-outline h-8 px-3"
      disabled={pending}
      onClick={() => startTransition(() => togglePromoAction(id, !active))}
    >
      {active ? "Вимкнути" : "Увімкнути"}
    </button>
  );
}
