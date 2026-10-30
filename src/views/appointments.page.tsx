import { listAppointments } from "@/entities/appointment";
import { requireUser } from "@/shared/lib/auth/session.service";
import { AppointmentsList } from "@/widgets/appointments-list";

// interface
type AppointmentsPageProps = { scope: "mine" | "all" };

// page
export async function AppointmentsPage({ scope }: AppointmentsPageProps) {
  const user = await requireUser();
  const isAll = scope === "all" && user.role === "admin";
  const items = await listAppointments(isAll ? undefined : user.id);
  // return
  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="page-title">{isAll ? "Всі записи" : "Мої записи"}</h1>
      <AppointmentsList items={items} isAdmin={isAll} />
    </div>
  );
}
