"use server";

import { z } from "zod";
import { requireUser } from "@/shared/lib/auth/session.service";
import { joinWaitlist } from "@/entities/waitlist";

const schema = z.object({
  serviceId: z.string().min(1),
  masterId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function joinWaitlistAction(input: z.infer<typeof schema>) {
  const user = await requireUser();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Некоректні дані" };
  const created = await joinWaitlist({ userId: user.id, ...parsed.data });
  return { ok: true, message: created ? "Ми повідомимо, якщо час звільниться" : "Ви вже в черзі на цю дату" };
}
