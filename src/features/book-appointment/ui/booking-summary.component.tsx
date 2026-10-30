import type { ReactNode } from "react";
import { formatDateTime, formatPrice } from "@/shared/lib/format.util";

// interface
type BookingSummaryProps = {
  service?: { name: string; durationMin: number; price: number };
  masterName?: string;
  slot: string;
  children: ReactNode;
};

// component
export function BookingSummary({ service, masterName, slot, children }: BookingSummaryProps) {
  const rows = [
    ["Послуга", service?.name],
    ["Тривалість", service && `${service.durationMin} хв`],
    ["Майстер", masterName],
    ["Час", slot && formatDateTime(new Date(slot))],
  ];
  // return
  return (
    <aside className="card space-y-4 lg:sticky lg:top-20">
      <h2 className="font-semibold">Ваш запис</h2>
      <dl className="space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3">
            <dt className="text-muted">{label}</dt>
            <dd className="text-right font-medium">{value || "Не обрано"}</dd>
          </div>
        ))}
      </dl>
      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-muted">До сплати</span>
        <span className="text-xl font-semibold">{service ? formatPrice(service.price) : formatPrice(0)}</span>
      </div>
      {children}
    </aside>
  );
}
