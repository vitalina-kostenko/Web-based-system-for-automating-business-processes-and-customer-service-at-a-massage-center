"use server";

import { randomUUID } from "node:crypto";
import { and, eq, isNull, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { appointments, db, masterServices, promoCodes, services } from "@/shared/lib/db";
import { requireUser } from "@/shared/lib/auth/session.service";
import { getFreeSlots, listBusyIntervals } from "@/entities/appointment";
import { applyDiscount, getUserLoyalty } from "@/entities/loyalty";
import { getWorkWindow } from "@/entities/master";
import { applyPromo, checkPromo, findPromoByCode } from "@/entities/promo";

const slotsSchema = z.object({
  masterId: z.string().min(1),
  serviceId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const bookingSchema = slotsSchema.extend({
  startsAt: z.string().datetime(),
  notes: z.string().max(300).optional(),
  promoCode: z.string().max(20).optional(),
});

async function resolveSlots(input: z.infer<typeof slotsSchema>) {
  const [service] = await db.select().from(services).where(eq(services.id, input.serviceId));
  if (!service || !service.active) return { service: null, slots: [] as Date[] };
  const dayStart = new Date(`${input.date}T00:00:00`);
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60_000);
  const busy = await listBusyIntervals(input.masterId, dayStart, dayEnd);
  const window = await getWorkWindow(input.masterId, input.date);
  const slots = getFreeSlots({ date: input.date, durationMin: service.durationMin, busy, window });
  return { service, slots };
}

export async function getSlotsAction(input: z.infer<typeof slotsSchema>) {
  await requireUser();
  const parsed = slotsSchema.safeParse(input);
  if (!parsed.success) return [];
  const { slots } = await resolveSlots(parsed.data);
  return slots.map((slot) => slot.toISOString());
}

export async function previewPromoAction(input: { code: string; serviceId: string }) {
  const user = await requireUser();
  const promo = await findPromoByCode(input.code);
  const check = checkPromo(promo);
  if (!promo || !check.ok) return { ok: false, error: check.ok ? "Промокод не знайдено" : check.error };
  const [service] = await db.select().from(services).where(eq(services.id, input.serviceId));
  if (!service) return { ok: false, error: "Оберіть послугу" };
  const { discountPercent } = await getUserLoyalty(user.id);
  return { ok: true, finalPrice: applyPromo(applyDiscount(service.price, discountPercent), promo) };
}

export async function createAppointmentAction(input: z.infer<typeof bookingSchema>) {
  const user = await requireUser();
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Некоректні дані запису" };

  const { masterId, serviceId, startsAt, notes, promoCode } = parsed.data;
  const [link] = await db
    .select()
    .from(masterServices)
    .where(and(eq(masterServices.masterId, masterId), eq(masterServices.serviceId, serviceId)));
  if (!link) return { ok: false, error: "Майстер не надає цю послугу" };

  const { service, slots } = await resolveSlots(parsed.data);
  const start = new Date(startsAt);
  if (!service || !slots.some((slot) => slot.getTime() === start.getTime())) {
    return { ok: false, error: "Цей час вже зайнятий, оберіть інший" };
  }

  const { discountPercent } = await getUserLoyalty(user.id);
  let price = applyDiscount(service.price, discountPercent);
  let usedPromo: string | undefined;
  if (promoCode) {
    const promo = await findPromoByCode(promoCode);
    const check = checkPromo(promo);
    if (!promo || !check.ok) return { ok: false, error: check.ok ? "Промокод не знайдено" : check.error };
    const [claimed] = await db
      .update(promoCodes)
      .set({ usedCount: sql`${promoCodes.usedCount} + 1` })
      .where(
        and(
          eq(promoCodes.id, promo.id),
          or(isNull(promoCodes.maxUses), sql`${promoCodes.usedCount} < ${promoCodes.maxUses}`),
        ),
      )
      .returning({ id: promoCodes.id });
    if (!claimed) return { ok: false, error: "Ліміт використань вичерпано" };
    price = applyPromo(price, promo);
    usedPromo = promo.code;
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
    price,
    discountPercent,
    promoCode: usedPromo,
    notes,
  });
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}
