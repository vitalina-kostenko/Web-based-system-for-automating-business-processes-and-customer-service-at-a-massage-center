import { and, eq, sum } from "drizzle-orm";
import { appointments, db } from "@/shared/lib/db";
import { getLoyalty, pointsForPrice } from "../lib/loyalty.util";

export async function getUserLoyalty(userId: string) {
  const [row] = await db
    .select({ total: sum(appointments.price) })
    .from(appointments)
    .where(and(eq(appointments.userId, userId), eq(appointments.status, "completed")));
  return getLoyalty(pointsForPrice(Number(row?.total ?? 0)));
}
