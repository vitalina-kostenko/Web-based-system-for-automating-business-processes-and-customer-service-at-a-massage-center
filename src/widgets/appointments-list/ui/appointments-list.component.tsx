import { StatusBadge, type AppointmentView } from "@/entities/appointment";
import { StatusActions } from "@/features/manage-appointment";
import { ReschedulePanel } from "@/features/reschedule-appointment";
import { formatDateTime, formatPrice } from "@/shared/lib/format.util";

// interface
type AppointmentsListProps = {
  items: AppointmentView[];
  isAdmin?: boolean;
};

// component
export function AppointmentsList({ items, isAdmin = false }: AppointmentsListProps) {
  const now = new Date();
  if (items.length === 0) {
    return <p className="card text-center text-sm text-muted">Записів поки немає</p>;
  }
  // return
  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const canReschedule = (item.status === "pending" || item.status === "confirmed") && item.startsAt > now;
        return (
          <li key={item.id} className="card space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{item.serviceName}</span>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-sm text-muted">
                  {formatDateTime(item.startsAt)} · {item.masterName}
                  {isAdmin && ` · ${item.clientName}`}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <span className="font-semibold">{formatPrice(item.price)}</span>
                <StatusActions id={item.id} status={item.status} isAdmin={isAdmin} />
              </div>
            </div>
            {canReschedule && <ReschedulePanel id={item.id} />}
          </li>
        );
      })}
    </ul>
  );
}
