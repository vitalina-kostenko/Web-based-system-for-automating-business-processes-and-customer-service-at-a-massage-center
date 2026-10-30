import Link from "next/link";
import { CalendarX } from "lucide-react";

// component
export function EmptyAppointments({ showAction }: { showAction: boolean }) {
  // return
  return (
    <div className="card flex flex-col items-center gap-3 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-soft text-brand">
        <CalendarX className="size-6" />
      </span>
      <p className="font-medium">Тут поки порожньо</p>
      <p className="text-sm text-muted">Записів у цій категорії немає.</p>
      {showAction && (
        <Link href="/dashboard/book" className="btn-primary">
          Записатись на масаж
        </Link>
      )}
    </div>
  );
}
