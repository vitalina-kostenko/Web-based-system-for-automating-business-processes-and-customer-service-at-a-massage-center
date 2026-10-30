import type { AppointmentView } from "../model/appointment.types";

// interface
export type MasterShifts = {
  id: string;
  name: string;
  schedule: { weekday: number; startMin: number; endMin: number }[];
};

const DAY_MS = 24 * 60 * 60_000;

export function inLastDays(items: AppointmentView[], days: number, now = new Date()) {
  const from = now.getTime() - days * DAY_MS;
  return items.filter((item) => item.status !== "cancelled" && item.startsAt.getTime() >= from && item.startsAt <= now);
}

export function topServices(items: AppointmentView[], limit = 5) {
  const stats = new Map<string, { name: string; count: number; revenue: number }>();
  for (const item of items) {
    const entry = stats.get(item.serviceId) ?? { name: item.serviceName, count: 0, revenue: 0 };
    entry.count += 1;
    entry.revenue += item.price;
    stats.set(item.serviceId, entry);
  }
  return [...stats.values()].sort((a, b) => b.count - a.count).slice(0, limit);
}

export function masterUtilization(items: AppointmentView[], masters: MasterShifts[], days: number, now = new Date()) {
  return masters.map((master) => {
    let capacity = 0;
    for (let offset = 0; offset < days; offset++) {
      const weekday = new Date(now.getTime() - offset * DAY_MS).getDay();
      const shift = master.schedule.find((row) => row.weekday === weekday);
      if (shift) capacity += shift.endMin - shift.startMin;
    }
    const booked = items
      .filter((item) => item.masterId === master.id)
      .reduce((sum, item) => sum + (item.endsAt.getTime() - item.startsAt.getTime()) / 60_000, 0);
    return { name: master.name, percent: capacity ? Math.min(100, Math.round((booked / capacity) * 100)) : 0 };
  });
}
