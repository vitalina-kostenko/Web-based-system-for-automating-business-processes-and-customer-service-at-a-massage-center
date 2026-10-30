import { CalendarCheck, Percent, TrendingUp, Wallet } from "lucide-react";
import { inLastDays, listAppointments, masterUtilization, topServices } from "@/entities/appointment";
import { listMastersWithSchedule } from "@/entities/master";
import { requireAdmin } from "@/shared/lib/auth/session.service";
import { formatPrice } from "@/shared/lib/format.util";
import { AnalyticsBars } from "@/widgets/analytics-bars";
import { StatsGrid } from "@/widgets/stats-grid";

const PERIOD_DAYS = 30;

// page
export async function AdminAnalyticsPage() {
  await requireAdmin();
  const [all, masters] = await Promise.all([listAppointments(), listMastersWithSchedule()]);
  const items = inLastDays(all, PERIOD_DAYS);
  const revenue = items.filter((i) => i.status === "completed").reduce((sum, i) => sum + i.price, 0);
  const utilization = masterUtilization(items, masters, PERIOD_DAYS);
  const average = utilization.length
    ? Math.round(utilization.reduce((sum, u) => sum + u.percent, 0) / utilization.length)
    : 0;
  const popular = topServices(items);

  // return
  return (
    <div className="space-y-6">
      <h1 className="page-title">Аналітика за {PERIOD_DAYS} днів</h1>
      <StatsGrid
        stats={[
          { label: "Візитів", value: items.length, icon: CalendarCheck },
          { label: "Дохід", value: formatPrice(revenue), icon: Wallet },
          { label: "Середній чек", value: formatPrice(items.length ? Math.round(revenue / items.length) : 0), icon: TrendingUp },
          { label: "Завантаження", value: `${average}%`, icon: Percent },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <AnalyticsBars
          title="Популярні послуги"
          rows={popular.map((s) => ({ label: s.name, value: s.count, caption: `${s.count} · ${formatPrice(s.revenue)}` }))}
        />
        <AnalyticsBars
          title="Завантаження майстрів"
          rows={utilization.map((u) => ({ label: u.name, value: u.percent, caption: `${u.percent}%` }))}
        />
      </div>
    </div>
  );
}
