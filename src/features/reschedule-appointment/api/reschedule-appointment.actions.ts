"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { appointments, db, services } from "@/shared/lib/db";
import { requireUser } from "@/shared/lib/auth/session.service";
import { getFreeSlots, listBusyIntervals } from "@/entities/appointment";
import { getWorkWindow } from "@/entities/master";

const slotsSchema = z.object({
  id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const rescheduleSchema = slotsSchema.extend({ startsAt: z.string().datetime() });

async function loadEditable(id: string) {
  const user = await requireUser();
  const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
  const allowed = appointment && (user.role === "admin" || appointment.userId === user.id);
  const editable = appointment && ["pending", "confirmed"].includes(appointment.status);
  return allowed && editable ? appointment : null;
}

async function resolveSlots(appointment: typeof appointments.$inferSelect, date: string) {
  const [service] = await db.select().from(services).where(eq(services.id, appointment.serviceId));
  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60_000);
  const [busy, window] = await Promise.all([
    listBusyIntervals(appointment.masterId, dayStart, dayEnd, appointment.id),
    getWorkWindow(appointment.masterId, date),
  ]);
  return { service, slots: getFreeSlots({ date, durationMin: service.durationMin, busy, window }) };
}

export async function getRescheduleSlotsAction(input: z.infer<typeof slotsSchema>) {
  const parsed = slotsSchema.safeParse(input);
  if (!parsed.success) return [];
  const appointment = await loadEditable(parsed.data.id);
  if (!appointment) return [];
  const { slots } = await resolveSlots(appointment, parsed.data.date);
  return slots.map((slot) => slot.toISOString());
}

export async function rescheduleAppointmentAction(input: z.infer<typeof rescheduleSchema>) {
  const parsed = rescheduleSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Некоректні дані" };
  const appointment = await loadEditable(parsed.data.id);
  if (!appointment) return { ok: false, error: "Запис не можна перенести" };

  const { service, slots } = await resolveSlots(appointment, parsed.data.date);
  const start = new Date(parsed.data.startsAt);
  if (!slots.some((slot) => slot.getTime() === start.getTime())) {
    return { ok: false, error: "Цей час вже зайнятий, оберіть інший" };
  }
  await db
    .update(appointments)
    .set({ startsAt: start, endsAt: new Date(start.getTime() + service.durationMin * 60_000), status: "pending" })
    .where(and(eq(appointments.id, appointment.id)));
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}
