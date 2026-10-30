import { and, asc, eq } from "drizzle-orm";
import { db, masterSchedules, masters } from "@/shared/lib/db";
import type { WorkWindow } from "@/entities/appointment";

export async function listMastersWithSchedule() {
  const [masterRows, scheduleRows] = await Promise.all([
    db.select().from(masters).orderBy(asc(masters.name)),
    db.select().from(masterSchedules),
  ]);
  return masterRows.map((master) => ({
    ...master,
    schedule: scheduleRows.filter((row) => row.masterId === master.id),
  }));
}

export async function getWorkWindow(masterId: string, date: string): Promise<WorkWindow> {
  const weekday = new Date(`${date}T00:00:00`).getDay();
  const [row] = await db
    .select()
    .from(masterSchedules)
    .where(and(eq(masterSchedules.masterId, masterId), eq(masterSchedules.weekday, weekday)));
  return row ? { startMin: row.startMin, endMin: row.endMin } : null;
}
