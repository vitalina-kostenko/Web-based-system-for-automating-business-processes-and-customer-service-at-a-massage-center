import type { AppointmentView } from "@/entities/appointment";
import { formatTime } from "@/shared/lib/format.util";
import { cn } from "@/shared/lib/cn.util";

// interface
type DayCalendarProps = {
  date: Date;
  masters: { id: string; name: string; schedule: { weekday: number; startMin: number; endMin: number }[] }[];
  items: AppointmentView[];
};

const START_MIN = 8 * 60;
const END_MIN = 21 * 60;
const HOUR_PX = 64;
const px = (minutes: number) => ((minutes - START_MIN) / 60) * HOUR_PX;
const hours = Array.from({ length: (END_MIN - START_MIN) / 60 }, (_, i) => START_MIN / 60 + i);

const tones: Record<AppointmentView["status"], string> = {
  pending: "border-warn bg-warn/15",
  confirmed: "border-brand bg-brand/15",
  completed: "border-border bg-soft",
  cancelled: "hidden",
};

function minutesOfDay(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

// component
export function DayCalendar({ date, masters, items }: DayCalendarProps) {
  const height = px(END_MIN);
  // return
  return (
    <div className="card overflow-x-auto p-0">
      <div className="flex" style={{ minWidth: 80 + masters.length * 180 }}>
        <div className="w-14 shrink-0 border-r border-border">
          <div className="h-10 border-b border-border" />
          <div className="relative" style={{ height }}>
            {hours.map((hour) => (
              <span
                key={hour}
                className="absolute right-2 -translate-y-1/2 text-xs text-muted"
                style={{ top: px(hour * 60) }}
              >
                {String(hour).padStart(2, "0")}:00
              </span>
            ))}
          </div>
        </div>
        {masters.map((master) => {
          const shift = master.schedule.find((row) => row.weekday === date.getDay());
          const mine = items.filter((item) => item.masterId === master.id);
          return (
            <div key={master.id} className="min-w-0 flex-1 border-r border-border last:border-r-0">
              <div className="flex h-10 items-center justify-center border-b border-border text-sm font-medium">
                {master.name}
              </div>
              <div className="relative" style={{ height }}>
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="absolute inset-x-0 border-t border-border/60"
                    style={{ top: px(hour * 60) }}
                  />
                ))}
                {!shift && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/10 text-sm text-muted">
                    Вихідний
                  </div>
                )}
                {shift && (
                  <>
                    <div className="absolute inset-x-0 top-0 bg-muted/10" style={{ height: px(shift.startMin) }} />
                    <div
                      className="absolute inset-x-0 bg-muted/10"
                      style={{ top: px(shift.endMin), height: height - px(shift.endMin) }}
                    />
                  </>
                )}
                {mine.map((item) => (
                  <div
                    key={item.id}
                    className={cn("absolute inset-x-1 overflow-hidden rounded-lg border-l-4 px-2 py-1 text-xs", tones[item.status])}
                    style={{
                      top: px(minutesOfDay(item.startsAt)),
                      height: Math.max(((item.endsAt.getTime() - item.startsAt.getTime()) / 3_600_000) * HOUR_PX - 2, 24),
                    }}
                  >
                    <p className="truncate font-medium">{item.serviceName}</p>
                    <p className="truncate text-muted">
                      {formatTime(item.startsAt)} · {item.clientName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
