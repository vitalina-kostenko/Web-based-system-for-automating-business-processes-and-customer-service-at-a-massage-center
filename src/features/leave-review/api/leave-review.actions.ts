"use server";

import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { appointments, db, reviews } from "@/shared/lib/db";
import { requireUser } from "@/shared/lib/auth/session.service";

const schema = z.object({
  appointmentId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export async function leaveReviewAction(input: z.infer<typeof schema>) {
  const user = await requireUser();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Некоректна оцінка" };

  const [appointment] = await db
    .select()
    .from(appointments)
    .where(and(eq(appointments.id, parsed.data.appointmentId), eq(appointments.userId, user.id)));
  if (!appointment || appointment.status !== "completed") {
    return { ok: false, error: "Відгук можна залишити лише після візиту" };
  }
  const existing = await db.select().from(reviews).where(eq(reviews.appointmentId, appointment.id));
  if (existing.length) return { ok: false, error: "Відгук уже залишено" };

  await db.insert(reviews).values({
    id: randomUUID(),
    appointmentId: appointment.id,
    userId: user.id,
    masterId: appointment.masterId,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
  });
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}
