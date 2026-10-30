import { randomUUID } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { db, waitlist } from "@/shared/lib/db";
import { notify } from "@/entities/notification";

export async function joinWaitlist(input: { userId: string; serviceId: string; masterId: string; date: string }) {
  const [existing] = await db
    .select()
    .from(waitlist)
    .where(
      and(
        eq(waitlist.userId, input.userId),
        eq(waitlist.masterId, input.masterId),
        eq(waitlist.date, input.date),
        eq(waitlist.notified, false),
      ),
    );
  if (existing) return false;
  await db.insert(waitlist).values({ id: randomUUID(), ...input });
  return true;
}

export async function notifyWaitlist(masterId: string, startsAt: Date) {
  const date = `${startsAt.getFullYear()}-${String(startsAt.getMonth() + 1).padStart(2, "0")}-${String(startsAt.getDate()).padStart(2, "0")}`;
  const waiting = await db
    .select()
    .from(waitlist)
    .where(and(eq(waitlist.masterId, masterId), eq(waitlist.date, date), eq(waitlist.notified, false)));
  if (!waiting.length) return;
  await Promise.all(
    waiting.map((entry) => notify(entry.userId, "Звільнився час", `Є вільний час на ${date}. Поспішайте записатись.`)),
  );
  await db
    .update(waitlist)
    .set({ notified: true })
    .where(inArray(waitlist.id, waiting.map((entry) => entry.id)));
}
