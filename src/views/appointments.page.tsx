import { listAppointments } from "@/entities/appointment";
import { requireUser } from "@/shared/lib/auth/session.service";
import {
  AppointmentsList,
  AppointmentTabs,
  EmptyAppointments,
  type AppointmentTab,
} from "@/widgets/appointments-list";

// interface
type AppointmentsPageProps = {
  scope: "mine" | "all";
  tab?: string;
};

// page
export async function AppointmentsPage({ scope, tab }: AppointmentsPageProps) {
  const user = await requireUser();
  const isAll = scope === "all" && user.role === "admin";
  const active: AppointmentTab = tab === "past" || tab === "cancelled" ? tab : "upcoming";
  const now = new Date();
  const items = (await listAppointments(isAll ? undefined : user.id)).filter((item) => {
    if (active === "cancelled") return item.status === "cancelled";
    if (item.status === "cancelled") return false;
    const isPast = item.status === "completed" || item.endsAt < now;
    return active === "past" ? isPast : !isPast;
  });
  // return
  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="page-title">{isAll ? "Всі записи" : "Мої записи"}</h1>
      <AppointmentTabs
        active={active}
        basePath={isAll ? "/dashboard/admin/appointments" : "/dashboard/appointments"}
      />
      {items.length ? (
        <AppointmentsList items={items} isAdmin={isAll} />
      ) : (
        <EmptyAppointments showAction={!isAll && active === "upcoming"} />
      )}
    </div>
  );
}
