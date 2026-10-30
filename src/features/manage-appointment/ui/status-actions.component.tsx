"use client";

import { useTransition } from "react";
import type { AppointmentStatus } from "@/entities/appointment";
import { updateStatusAction } from "../api/manage-appointment.actions";

// interface
type StatusActionsProps = {
  id: string;
  status: AppointmentStatus;
  isAdmin: boolean;
};

// component
export function StatusActions({ id, status, isAdmin }: StatusActionsProps) {
  const [pending, startTransition] = useTransition();
  const change = (next: AppointmentStatus) => startTransition(() => updateStatusAction({ id, status: next }));

  if (status === "cancelled" || status === "completed") return null;
  // return
  return (
    <div className="flex gap-1">
      {isAdmin && status === "pending" && (
        <button className="btn-outline h-8 px-3" disabled={pending} onClick={() => change("confirmed")}>
          РџС–РґС‚РІРµСЂРґРёС‚Рё
        </button>
      )}
      {isAdmin && status === "confirmed" && (
        <button className="btn-outline h-8 px-3" disabled={pending} onClick={() => change("completed")}>
          Р—Р°РІРµСЂС€РёС‚Рё
        </button>
      )}
      <button className="btn-danger h-8 px-3" disabled={pending} onClick={() => change("cancelled")}>
        РЎРєР°СЃСѓРІР°С‚Рё
      </button>
    </div>
  );
}
