"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, promoCodes } from "@/shared/lib/db";
import { requireAdmin } from "@/shared/lib/auth/session.service";

const schema = z.object({
  code: z.string().min(3).max(20).regex(/^[A-Za-z0-9_-]+$/),
  kind: z.enum(["percent", "fixed"]),
  value: z.coerce.number().int().min(1).max(100000),
  maxUses: z.coerce.number().int().min(1).optional(),
  expiresAt: z.string().optional(),
});

export async function createPromoAction(formData: FormData) {
  await requireAdmin();
  const raw = Object.fromEntries([...formData].filter(([, value]) => value !== ""));
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return;
  const { code, kind, value, maxUses, expiresAt } = parsed.data;
  if (kind === "percent" && value > 100) return;
  await db
    .insert(promoCodes)
    .values({
      id: randomUUID(),
      code: code.toUpperCase(),
      kind,
      value,
      maxUses,
      expiresAt: expiresAt ? new Date(`${expiresAt}T23:59:59`) : null,
    })
    .onConflictDoNothing();
  revalidatePath("/dashboard", "layout");
}

export async function togglePromoAction(id: string, active: boolean) {
  await requireAdmin();
  await db.update(promoCodes).set({ active }).where(eq(promoCodes.id, id));
  revalidatePath("/dashboard", "layout");
}
