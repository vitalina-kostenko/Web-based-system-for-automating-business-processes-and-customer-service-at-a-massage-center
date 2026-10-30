"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, masterSchedules } from "@/shared/lib/db";
import { requireAdmin } from "@/shared/lib/auth/session.service";

function toMinutes(value: FormDataEntryValue | null) {
  const [hours, minutes] = String(value ?? "").split(":").map(Number);
  return Number.isFinite(hours) ? hours * 60 + (minutes || 0) : NaN;
}

export async function saveScheduleAction(masterId: string, formData: FormData) {
  await requireAdmin();
  const rows = [];
  for (let weekday = 0; weekday < 7; weekday++) {
    if (!formData.get(`day${weekday}`)) continue;
    const startMin = toMinutes(formData.get(`start${weekday}`));
    const endMin = toMinutes(formData.get(`end${weekday}`));
    if (Number.isNaN(startMin) || Number.isNaN(endMin) || startMin >= endMin) continue;
    rows.push({ masterId, weekday, startMin, endMin });
  }
  await db.delete(masterSchedules).where(eq(masterSchedules.masterId, masterId));
  if (rows.length) await db.insert(masterSchedules).values(rows);
  revalidatePath("/dashboard", "layout");
}
