import Link from "next/link";
import { cn } from "@/shared/lib/cn.util";

// interface
export type AppointmentTab = "upcoming" | "past" | "cancelled";

const tabs: { id: AppointmentTab; label: string }[] = [
  { id: "upcoming", label: "Майбутні" },
  { id: "past", label: "Минулі" },
  { id: "cancelled", label: "Скасовані" },
];

// component
export function AppointmentTabs({ active, basePath }: { active: AppointmentTab; basePath: string }) {
  // return
  return (
    <div className="inline-flex gap-1 rounded-xl border border-border bg-surface p-1">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={`${basePath}?tab=${tab.id}`}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            active === tab.id ? "bg-brand text-white dark:text-bg" : "text-muted hover:text-fg",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
