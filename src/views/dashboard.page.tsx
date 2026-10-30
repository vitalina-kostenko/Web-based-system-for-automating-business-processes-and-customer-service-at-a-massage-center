import { CalendarCheck, CircleCheck, Clock, Wallet } from "lucide-react";
import { listAppointments } from "@/entities/appointment";
import { requireUser } from "@/shared/lib/auth/session.service";
import { formatPrice } from "@/shared/lib/format.util";
import { AppointmentsList } from "@/widgets/appointments-list";
import { NextVisit } from "@/widgets/next-visit";
import { RevenueChart } from "@/widgets/revenue-chart";
import { StatsGrid } from "@/widgets/stats-grid";

// page
export async function DashboardPage() {
  const user = await requireUser();
  const isAdmin = user.role === "admin";
  const items = await listAppointments(isAdmin ? undefined : user.id);
  const now = new Date();
  const upcoming = items.filter((i) => i.startsAt > now && i.status !== "cancelled").reverse();
  const completed = items.filter((i) => i.status === "completed");
  const revenue = completed.reduce((sum, i) => sum + i.price, 0);

  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (6 - index));
    const value = completed
      .filter((i) => i.startsAt.toDateString() === day.toDateString())
      .reduce((sum, i) => sum + i.price, 0);
    return { label: day.toLocaleDateString("uk-UA", { weekday: "short" }), value };
  });

  // return
  return (
    <div className="space-y-6">
      <h1 className="page-title">Привіт, {user.name}</h1>
      <StatsGrid
        stats={[
          { label: "Майбутні записи", value: upcoming.length, icon: Clock },
          { label: "Завершені візити", value: completed.length, icon: CircleCheck },
          { label: "Всього записів", value: items.length, icon: CalendarCheck },
          { label: isAdmin ? "Дохід" : "Витрачено", value: formatPrice(revenue), icon: Wallet },
        ]}
      />
      {!isAdmin && <NextVisit appointment={upcoming[0]} />}
      {isAdmin && <RevenueChart data={days} />}
      <section className="space-y-3">
        <h2 className="font-semibold">Найближчі записи</h2>
        <AppointmentsList items={upcoming.slice(0, 5)} isAdmin={isAdmin} />
      </section>
    </div>
  );
}
