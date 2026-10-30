import { StatusBadge, type AppointmentView } from "@/entities/appointment";
import { StatusActions } from "@/features/manage-appointment";
import { formatDateTime, formatPrice } from "@/shared/lib/format.util";

// interface
type AppointmentsListProps = {
  items: AppointmentView[];
  isAdmin?: boolean;
};

// component
export function AppointmentsList({ items, isAdmin = false }: AppointmentsListProps) {
  if (items.length === 0) {
    return <p className="card text-center text-sm text-muted">Записів поки немає</p>;
  }
  // return
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
        </li>
      ))}
    </ul>
  );
}
