import { siteConfig } from "@/shared/config/site.config";

// interface
export type BusyInterval = { start: Date; end: Date };

export type WorkWindow = { startMin: number; endMin: number } | null;

type SlotParams = {
  date: string;
  durationMin: number;
  busy: BusyInterval[];
  window?: WorkWindow;
  now?: Date;
};

export function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

export function getFreeSlots({ date, durationMin, busy, window, now = new Date() }: SlotParams): Date[] {
  if (window === null) return [];
  const { start, end, stepMin } = siteConfig.workHours;
  const openMin = window?.startMin ?? start * 60;
  const closeMin = window?.endMin ?? end * 60;
  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(dayStart.getTime());
  dayEnd.setHours(0, closeMin, 0, 0);
  const slots: Date[] = [];

  for (let minutes = openMin; minutes < closeMin; minutes += stepMin) {
    const slotStart = new Date(dayStart.getTime());
    slotStart.setHours(0, minutes, 0, 0);
    const slotEnd = new Date(slotStart.getTime() + durationMin * 60_000);
    if (slotEnd > dayEnd || slotStart <= now) continue;
    if (busy.some((b) => overlaps(slotStart, slotEnd, b.start, b.end))) continue;
    slots.push(slotStart);
  }
  return slots;
}
