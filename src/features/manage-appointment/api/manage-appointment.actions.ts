"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { appointments, db } from "@/shared/lib/db";
import { requireUser } from "@/shared/lib/auth/session.service";

const schema = z.object({
  id: z.string().min(1),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
});

export async function updateStatusAction(input: z.infer<typeof schema>) {
  const user = await requireUser();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return;
  const { id, status } = parsed.data;

  if (user.role === "admin") {
    await db.update(appointments).set({ status }).where(eq(appointments.id, id));
  } else if (status === "cancelled") {
    await db
      .update(appointments)
      .set({ status })
      .where(and(eq(appointments.id, id), eq(appointments.userId, user.id)));
  }
  revalidatePath("/dashboard", "layout");
}
