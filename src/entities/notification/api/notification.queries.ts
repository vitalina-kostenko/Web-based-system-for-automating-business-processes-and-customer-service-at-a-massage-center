import { desc, eq, and, count } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db, notifications } from "@/shared/lib/db";

export async function notify(userId: string, title: string, body = "") {
  await db.insert(notifications).values({ id: randomUUID(), userId, title, body });
}

export async function getNotifications(userId: string, limit = 8) {
  const [items, [unread]] = await Promise.all([
    db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit),
    db
      .select({ total: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false))),
  ]);
  return { items, unread: unread?.total ?? 0 };
}
