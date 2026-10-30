"use client";

import { useEffect, useState, useTransition } from "react";
import { CalendarClock } from "lucide-react";
import { formatTime } from "@/shared/lib/format.util";
import { cn } from "@/shared/lib/cn.util";
import { getRescheduleSlotsAction, rescheduleAppointmentAction } from "../api/reschedule-appointment.actions";

// interface
type ReschedulePanelProps = { id: string };

// component
export function ReschedulePanel({ id }: ReschedulePanelProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(today);
  const [slots, setSlots] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    let active = true;
    getRescheduleSlotsAction({ id, date }).then((result) => active && setSlots(result));
    return () => {
      active = false;
    };
  }, [open, id, date]);

  function pick(startsAt: string) {
    setError("");
    startTransition(async () => {
      const result = await rescheduleAppointmentAction({ id, date, startsAt });
      if (result.ok) setOpen(false);
      else setError(result.error ?? "Помилка");
    });
  }

  // return
  return (
    <div className="w-full sm:w-auto">
      <button className="btn-outline h-8 px-3" onClick={() => setOpen((value) => !value)}>
        <CalendarClock className="size-4" /> Перенести
      </button>
      {open && (
        <div className="mt-3 space-y-3 rounded-xl border border-border p-3">
          <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="input max-w-44" />
          {slots.length === 0 && <p className="text-sm text-muted">Немає вільного часу на цю дату</p>}
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {slots.map((iso) => (
              <button
                key={iso}
                disabled={pending}
                onClick={() => pick(iso)}
                className={cn("h-9 rounded-lg border border-border text-sm transition hover:bg-soft")}
              >
                {formatTime(new Date(iso))}
              </button>
            ))}
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}
    </div>
  );
}
