"use server";

import { randomUUID } from "node:crypto";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { appointments, db, masterServices, services } from "@/shared/lib/db";
import { requireUser } from "@/shared/lib/auth/session.service";
import { getFreeSlots, listBusyIntervals } from "@/entities/appointment";

const slotsSchema = z.object({
  masterId: z.string().min(1),
  serviceId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const bookingSchema = slotsSchema.extend({
  startsAt: z.string().datetime(),
  notes: z.string().max(300).optional(),
});

async function resolveSlots(input: z.infer<typeof slotsSchema>) {
  const [service] = await db.select().from(services).where(eq(services.id, input.serviceId));
  if (!service || !service.active) return { service: null, slots: [] as Date[] };
  const dayStart = new Date(`${input.date}T00:00:00`);
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60_000);
  const busy = await listBusyIntervals(input.masterId, dayStart, dayEnd);
  const slots = getFreeSlots({ date: input.date, durationMin: service.durationMin, busy });
  return { service, slots };
}

export async function getSlotsAction(input: z.infer<typeof slotsSchema>) {
  await requireUser();
  const parsed = slotsSchema.safeParse(input);
  if (!parsed.success) return [];
  const { slots } = await resolveSlots(parsed.data);
  return slots.map((slot) => slot.toISOString());
}

export async function createAppointmentAction(input: z.infer<typeof bookingSchema>) {
  const user = await requireUser();
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "РќРµРєРѕСЂРµРєС‚РЅС– РґР°РЅС– Р·Р°РїРёСЃСѓ" };

  const { masterId, serviceId, startsAt, notes } = parsed.data;
  const [link] = await db
    .select()
    .from(masterServices)
    .where(and(eq(masterServices.masterId, masterId), eq(masterServices.serviceId, serviceId)));
  if (!link) return { ok: false, error: "РњР°Р№СЃС‚РµСЂ РЅРµ РЅР°РґР°С” С†СЋ РїРѕСЃР»СѓРіСѓ" };

  const { service, slots } = await resolveSlots(parsed.data);
  const start = new Date(startsAt);
  if (!service || !slots.some((slot) => slot.getTime() === start.getTime())) {
    return { ok: false, error: "Р¦РµР№ С‡Р°СЃ РІР¶Рµ Р·Р°Р№РЅСЏС‚РёР№, РѕР±РµСЂС–С‚СЊ С–РЅС€РёР№" };
  }

  await db.insert(appointments).values({
    id: randomUUID(),
    userId: user.id,
    clientName: user.name,
    clientEmail: user.email,
    serviceId,
    masterId,
    startsAt: start,
    endsAt: new Date(start.getTime() + service.durationMin * 60_000),
    price: service.price,
    notes,
  });
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}
