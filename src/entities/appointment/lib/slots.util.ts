import { siteConfig } from "@/shared/config/site.config";

// interface
export type BusyInterval = { start: Date; end: Date };

type SlotParams = {
  date: string;
  durationMin: number;
  busy: BusyInterval[];
  now?: Date;
};

export function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

export function getFreeSlots({ date, durationMin, busy, now = new Date() }: SlotParams): Date[] {
  const { start, end, stepMin } = siteConfig.workHours;
  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(dayStart);
  dayEnd.setHours(end, 0, 0, 0);
  const slots: Date[] = [];

  for (let minutes = start * 60; minutes < end * 60; minutes += stepMin) {
    const slotStart = new Date(dayStart);
    slotStart.setHours(0, minutes, 0, 0);
    const slotEnd = new Date(slotStart.getTime() + durationMin * 60_000);
    if (slotEnd > dayEnd || slotStart <= now) continue;
    if (busy.some((b) => overlaps(slotStart, slotEnd, b.start, b.end))) continue;
    slots.push(slotStart);
  }
  return slots;
}
