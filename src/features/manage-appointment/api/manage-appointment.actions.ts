"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { appointments, db } from "@/shared/lib/db";
import { requireUser } from "@/shared/lib/auth/session.service";
import { notify } from "@/entities/notification";
import { notifyWaitlist } from "@/entities/waitlist";

const schema = z.object({
  id: z.string().min(1),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
});

const messages = {
  confirmed: ["Запис підтверджено", "Чекаємо на вас у призначений час."],
  completed: ["Візит завершено", "Дякуємо! Залиште відгук у розділі «Мої записи»."],
  cancelled: ["Запис скасовано", "Ви можете обрати інший час."],
  pending: ["Запис оновлено", ""],
} as const;

export async function updateStatusAction(input: z.infer<typeof schema>) {
  const user = await requireUser();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return;
  const { id, status } = parsed.data;

  const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
  if (!appointment) return;
  const isOwner = appointment.userId === user.id;
  if (user.role !== "admin" && !(isOwner && status === "cancelled")) return;

  await db.update(appointments).set({ status }).where(and(eq(appointments.id, id)));

  if (user.role === "admin" && !isOwner) {
    const [title, body] = messages[status];
    await notify(appointment.userId, title, body);
  }
  if (status === "cancelled") await notifyWaitlist(appointment.masterId, appointment.startsAt);
  revalidatePath("/dashboard", "layout");
}
