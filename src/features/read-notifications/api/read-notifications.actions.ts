"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, notifications } from "@/shared/lib/db";
import { requireUser } from "@/shared/lib/auth/session.service";

export async function markAllReadAction() {
  const user = await requireUser();
  await db.update(notifications).set({ read: true }).where(eq(notifications.userId, user.id));
  revalidatePath("/dashboard", "layout");
}
