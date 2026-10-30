import { avg, count, eq } from "drizzle-orm";
import { db, reviews } from "@/shared/lib/db";

export async function listReviewedAppointmentIds(userId: string) {
  const rows = await db.select({ id: reviews.appointmentId }).from(reviews).where(eq(reviews.userId, userId));
  return rows.map((row) => row.id);
}

export async function getMasterRatings() {
  const rows = await db
    .select({ masterId: reviews.masterId, average: avg(reviews.rating), total: count() })
    .from(reviews)
    .groupBy(reviews.masterId);
  return new Map(rows.map((row) => [row.masterId, { average: Number(row.average), total: row.total }]));
}
