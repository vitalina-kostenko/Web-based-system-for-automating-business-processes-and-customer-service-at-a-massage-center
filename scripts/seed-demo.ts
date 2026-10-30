import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { applyDiscount } from "../src/entities/loyalty/lib/loyalty.util";
import {
  appointments,
  db,
  masterServices,
  masters,
  notifications,
  promoCodes,
  reviews,
  services,
  user,
  waitlist,
} from "../src/shared/lib/db";

const email = process.argv[2];

const comments = [
  "Чудовий масаж, спина більше не болить.",
  "Дуже професійний майстер, обов'язково повернусь.",
  "Приємна атмосфера та уважне ставлення.",
  "Все добре, хотілося б трохи довший сеанс.",
  "Найкращий релакс після робочого тижня!",
];

function at(daysFromNow: number, hour: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date;
}

async function main() {
  if (!email) throw new Error("Usage: npm run db:demo -- <email>");
  const [account] = await db.select().from(user).where(eq(user.email, email));
  if (!account) throw new Error(`User ${email} not found. Register first.`);

  const [serviceRows, masterRows, links] = await Promise.all([
    db.select().from(services).where(eq(services.active, true)),
    db.select().from(masters),
    db.select().from(masterServices),
  ]);
  const pickMaster = (serviceId: string, index: number) => {
    const ids = links.filter((l) => l.serviceId === serviceId).map((l) => l.masterId);
    return masterRows.find((m) => m.id === ids[index % ids.length])!;
  };

  await db.delete(waitlist).where(eq(waitlist.userId, account.id));
  await db.delete(notifications).where(eq(notifications.userId, account.id));
  await db.delete(reviews).where(eq(reviews.userId, account.id));
  await db.delete(appointments).where(eq(appointments.userId, account.id));
  await db.update(user).set({ phone: "+380 67 123 45 67" }).where(eq(user.id, account.id));

  const plan = [
    { day: -63, hour: 14, status: "completed", discount: 0 },
    { day: -54, hour: 15, status: "completed", discount: 0 },
    { day: -45, hour: 16, status: "completed", discount: 0 },
    { day: -36, hour: 14, status: "completed", discount: 5 },
    { day: -27, hour: 15, status: "completed", discount: 5 },
    { day: -18, hour: 16, status: "completed", discount: 5 },
    { day: -10, hour: 14, status: "completed", discount: 5 },
    { day: -4, hour: 15, status: "completed", discount: 5 },
    { day: -14, hour: 17, status: "cancelled", discount: 5 },
    { day: 2, hour: 15, status: "confirmed", discount: 5 },
    { day: 6, hour: 16, status: "confirmed", discount: 5 },
    { day: 9, hour: 14, status: "pending", discount: 5 },
    { day: 12, hour: 17, status: "cancelled", discount: 5 },
  ] as const;

  const rows = plan.map((item, index) => {
    const service = serviceRows[index % serviceRows.length];
    const master = pickMaster(service.id, index);
    const start = at(item.day, item.hour);
    const promo = index === 7;
    const base = applyDiscount(service.price, item.discount);
    return {
      id: randomUUID(),
      userId: account.id,
      clientName: account.name,
      clientEmail: account.email,
      serviceId: service.id,
      masterId: master.id,
      startsAt: start,
      endsAt: new Date(start.getTime() + service.durationMin * 60_000),
      status: item.status,
      price: promo ? applyDiscount(base, 10) : base,
      discountPercent: item.discount,
      promoCode: promo ? "WELCOME10" : null,
      notes: index === 9 ? "Прошу приглушене світло" : null,
    };
  });
  await db.insert(appointments).values(rows);

  const completed = rows.filter((row) => row.status === "completed");
  await db.insert(reviews).values(
    completed.slice(0, 5).map((row, index) => ({
      id: randomUUID(),
      appointmentId: row.id,
      userId: account.id,
      masterId: row.masterId,
      rating: index === 3 || index === 4 ? 4 : 5,
      comment: comments[index],
    })),
  );

  const [promo] = await db.select().from(promoCodes).where(eq(promoCodes.code, "WELCOME10"));
  if (promo) await db.update(promoCodes).set({ usedCount: promo.usedCount + 1 }).where(eq(promoCodes.id, promo.id));

  const waitDate = at(15, 12);
  const service = serviceRows[0];
  await db.insert(waitlist).values({
    id: randomUUID(),
    userId: account.id,
    serviceId: service.id,
    masterId: pickMaster(service.id, 0).id,
    date: `${waitDate.getFullYear()}-${String(waitDate.getMonth() + 1).padStart(2, "0")}-${String(waitDate.getDate()).padStart(2, "0")}`,
  });

  await db.insert(notifications).values([
    { id: randomUUID(), userId: account.id, title: "Запис підтверджено", body: "Чекаємо на вас у призначений час.", read: false, createdAt: at(0, 9) },
    { id: randomUUID(), userId: account.id, title: "Запис створено", body: "Очікуйте підтвердження від адміністратора.", read: false, createdAt: at(-1, 18) },
    { id: randomUUID(), userId: account.id, title: "Візит завершено", body: "Дякуємо! Залиште відгук у розділі «Мої записи».", read: true, createdAt: at(-4, 17) },
    { id: randomUUID(), userId: account.id, title: "Ви досягли рівня Silver", body: "Тепер діє знижка 5% на всі послуги.", read: true, createdAt: at(-36, 16) },
  ]);

  console.log(`Demo data written for ${email}: ${rows.length} appointments, 5 reviews, 4 notifications`);
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error.message);
    process.exit(1);
  },
);
