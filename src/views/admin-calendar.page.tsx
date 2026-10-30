import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { listAppointments } from "@/entities/appointment";
import { listMastersWithSchedule } from "@/entities/master";
import { requireAdmin } from "@/shared/lib/auth/session.service";
import { DayCalendar } from "@/widgets/day-calendar";

// interface
type AdminCalendarPageProps = { date?: string };

const toIso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

// page
export async function AdminCalendarPage({ date }: AdminCalendarPageProps) {
  await requireAdmin();
  const day = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00`) : new Date();
  day.setHours(0, 0, 0, 0);
  const prev = new Date(day.getTime() - 86_400_000);
  const next = new Date(day.getTime() + 86_400_000);
  const [all, masters] = await Promise.all([listAppointments(), listMastersWithSchedule()]);
  const items = all.filter((item) => toIso(item.startsAt) === toIso(day));
  // return
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="page-title">Календар</h1>
        <div className="flex items-center gap-2">
          <Link href={`?date=${toIso(prev)}`} className="btn-outline size-10 px-0" aria-label="Попередній день">
            <ChevronLeft className="size-4" />
          </Link>
          <span className="min-w-40 text-center text-sm font-medium">
            {day.toLocaleDateString("uk-UA", { weekday: "long", day: "numeric", month: "long" })}
          </span>
          <Link href={`?date=${toIso(next)}`} className="btn-outline size-10 px-0" aria-label="Наступний день">
            <ChevronRight className="size-4" />
          </Link>
          <Link href="?" className="btn-outline">
            Сьогодні
          </Link>
        </div>
      </div>
      <DayCalendar date={day} masters={masters.filter((m) => m.active)} items={items} />
    </div>
  );
}
