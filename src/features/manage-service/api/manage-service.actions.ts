"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, masterServices, masters, services } from "@/shared/lib/db";
import { requireAdmin } from "@/shared/lib/auth/session.service";

const schema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(300),
  category: z.string().min(2).max(40),
  durationMin: z.coerce.number().int().min(15).max(240),
  price: z.coerce.number().int().min(1).max(100000),
});

export async function createServiceAction(formData: FormData) {
  await requireAdmin();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const id = randomUUID();
  await db.insert(services).values({ id, ...parsed.data });
  const activeMasters = await db.select({ id: masters.id }).from(masters).where(eq(masters.active, true));
  if (activeMasters.length) {
    await db.insert(masterServices).values(activeMasters.map((m) => ({ masterId: m.id, serviceId: id })));
  }
  revalidatePath("/dashboard", "layout");
}

export async function toggleServiceAction(id: string, active: boolean) {
  await requireAdmin();
  await db.update(services).set({ active }).where(eq(services.id, id));
  revalidatePath("/dashboard", "layout");
}
