"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/shared/lib/format.util";
import { createAppointmentAction, getSlotsAction } from "../api/book-appointment.actions";
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
      if (!result.ok) return setError(result.error ?? "РџРѕРјРёР»РєР°");
      router.push("/dashboard/appointments");
    });
  }

  // return
  return (
    <div className="space-y-6">
      <section className="card space-y-3">
        <h2 className="font-semibold">1. РџРѕСЃР»СѓРіР°</h2>
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
            hint: `${s.durationMin} С…РІ В· ${formatPrice(s.price)}`,
          }))}
        />
      </section>
      {serviceId && (
        <section className="card space-y-3">
          <h2 className="font-semibold">2. РњР°Р№СЃС‚РµСЂ</h2>
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
          <h2 className="font-semibold">3. Р”Р°С‚Р° С– С‡Р°СЃ</h2>
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
            placeholder="РџРѕР±Р°Р¶Р°РЅРЅСЏ (РЅРµРѕР±РѕРІ'СЏР·РєРѕРІРѕ)"
            className="input h-24 py-2"
          />
        </section>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
      <button className="btn-primary w-full sm:w-auto" disabled={!slot || pending} onClick={submit}>
        Р—Р°РїРёСЃР°С‚РёСЃСЊ
      </button>
    </div>
  );
}
