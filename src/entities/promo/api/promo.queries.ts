import { desc, eq } from "drizzle-orm";
import { db, promoCodes } from "@/shared/lib/db";

export async function findPromoByCode(code: string) {
  const [promo] = await db.select().from(promoCodes).where(eq(promoCodes.code, code.trim().toUpperCase()));
  return promo;
}

export async function listPromoCodes() {
  return db.select().from(promoCodes).orderBy(desc(promoCodes.createdAt));
}
