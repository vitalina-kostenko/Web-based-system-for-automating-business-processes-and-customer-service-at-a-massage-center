"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/shared/lib/format.util";
import { createAppointmentAction, getSlotsAction } from "../api/book-appointment.actions";
import { BookingSummary } from "./booking-summary.component";
import { OptionList } from "./option-list.component";
import { SlotGrid } from "./slot-grid.component";

// interface
type BookingFormProps = {
  services: { id: string; name: string; durationMin: number; price: number }[];
  masters: Record<string, { id: string; name: string; specialty: string }[]>;
};

// component
export function BookingForm({ services, masters }: BookingFormProps) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [serviceId, setServiceId] = useState("");
  const [masterId, setMasterId] = useState("");
  const [date, setDate] = useState(today);
  const [slots, setSlots] = useState<string[]>([]);
  const [slot, setSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const service = services.find((s) => s.id === serviceId);
  const master = (masters[serviceId] ?? []).find((m) => m.id === masterId);

  useEffect(() => {
    if (!serviceId || !masterId) return;
    let active = true;
    getSlotsAction({ serviceId, masterId, date }).then((result) => {
      if (active) setSlots(result);
    });
    return () => {
      active = false;
    };
  }, [serviceId, masterId, date]);

  function submit() {
    setError("");
    startTransition(async () => {
      const result = await createAppointmentAction({ serviceId, masterId, date, startsAt: slot, notes });
      if (!result.ok) return setError(result.error ?? "Помилка");
      router.push("/dashboard/appointments");
    });
  }

  // return
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
      <div className="space-y-6">
        <section className="card space-y-3">
          <h2 className="font-semibold">1. Послуга</h2>
          <OptionList
            value={serviceId}
            onChange={(id) => {
              setServiceId(id);
              setMasterId("");
              setSlots([]);
              setSlot("");
            }}
            options={services.map((s) => ({
              id: s.id,
              title: s.name,
              hint: `${s.durationMin} хв · ${formatPrice(s.price)}`,
            }))}
          />
        </section>
        {serviceId && (
          <section className="card space-y-3">
            <h2 className="font-semibold">2. Майстер</h2>
            <OptionList
              value={masterId}
              onChange={(id) => {
                setMasterId(id);
                setSlot("");
                setSlots([]);
              }}
              options={(masters[serviceId] ?? []).map((m) => ({ id: m.id, title: m.name, hint: m.specialty }))}
            />
          </section>
        )}
        {masterId && (
          <section className="card space-y-3">
            <h2 className="font-semibold">3. Дата і час</h2>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setSlot("");
                setSlots([]);
              }}
              className="input max-w-48"
            />
            <SlotGrid slots={slots} value={slot} onChange={setSlot} />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={300}
              placeholder="Побажання (необов'язково)"
              className="input h-24 py-2"
            />
          </section>
        )}
      </div>
      <BookingSummary service={service} masterName={master?.name} slot={slot}>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button className="btn-primary w-full" disabled={!slot || pending} onClick={submit}>
          Записатись
        </button>
      </BookingSummary>
    </div>
  );
}
