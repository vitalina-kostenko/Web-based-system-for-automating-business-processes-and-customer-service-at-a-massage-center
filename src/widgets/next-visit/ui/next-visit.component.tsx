import Link from "next/link";
import { CalendarPlus, Clock } from "lucide-react";
import { StatusBadge, type AppointmentView } from "@/entities/appointment";
import { formatDateTime } from "@/shared/lib/format.util";

// interface
type NextVisitProps = { appointment?: AppointmentView };

// component
export function NextVisit({ appointment }: NextVisitProps) {
  // return
  return (
    <section className="card flex flex-col gap-4 bg-soft sm:flex-row sm:items-center sm:justify-between">
      {appointment ? (
        <div className="space-y-1">
          <p className="flex items-center gap-2 text-sm text-muted">
            <Clock className="size-4" /> Найближчий візит
          </p>
          <p className="text-xl font-semibold">{appointment.serviceName}</p>
          <p className="flex items-center gap-2 text-sm">
            {formatDateTime(appointment.startsAt)} · {appointment.masterName}
            <StatusBadge status={appointment.status} />
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-xl font-semibold">Запланованих візитів немає</p>
          <p className="text-sm text-muted">Оберіть послугу та зручний час для відпочинку.</p>
        </div>
      )}
      <Link href="/dashboard/book" className="btn-primary">
        <CalendarPlus className="size-4" /> Записатись
      </Link>
    </section>
  );
}
