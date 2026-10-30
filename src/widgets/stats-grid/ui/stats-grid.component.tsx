import type { LucideIcon } from "lucide-react";

// interface
type Stat = { label: string; value: string | number; icon: LucideIcon };

// component
export function StatsGrid({ stats }: { stats: Stat[] }) {
  // return
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <div key={label} className="card flex flex-col gap-2 p-4">
          <span className="flex size-9 items-center justify-center rounded-xl bg-soft text-brand">
            <Icon className="size-5" />
          </span>
          <span className="text-2xl font-semibold">{value}</span>
          <span className="text-sm text-muted">{label}</span>
        </div>
      ))}
    </div>
  );
}
