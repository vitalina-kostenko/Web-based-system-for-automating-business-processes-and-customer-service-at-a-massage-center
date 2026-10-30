import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { auth } from "../src/shared/lib/auth/auth.config";
import { appointments, db, masterSchedules, masterServices, masters, services, user } from "../src/shared/lib/db";

const serviceData = [
  { name: "Класичний масаж спини", category: "Класичний", durationMin: 60, price: 800, description: "Глибоке розслаблення м'язів спини та шиї." },
  { name: "Антицелюлітний масаж", category: "Корекція", durationMin: 60, price: 900, description: "Покращення тонусу шкіри та мікроциркуляції." },
  { name: "Спортивний масаж", category: "Спорт", durationMin: 90, price: 1200, description: "Відновлення після навантажень." },
  { name: "Релакс з ароматерапією", category: "Релаксація", durationMin: 90, price: 1300, description: "Повне розслаблення з ефірними оліями." },
  { name: "Масаж обличчя", category: "Догляд", durationMin: 30, price: 500, description: "Лімфодренаж та підтяжка контуру." },
];
const masterData = [
  { name: "Олена Коваль", specialty: "Класичний та лікувальний" },
  { name: "Андрій Мельник", specialty: "Спортивний масаж" },
  { name: "Ірина Шевченко", specialty: "Релакс та догляд" },
];

async function main() {
  await db.delete(appointments);
  await db.delete(masterSchedules);
  await db.delete(masterServices);
  await db.delete(masters);
  await db.delete(services);

  const serviceRows = serviceData.map((s) => ({ id: randomUUID(), ...s }));
  const masterRows = masterData.map((m) => ({ id: randomUUID(), ...m }));
  await db.insert(services).values(serviceRows);
  await db.insert(masters).values(masterRows);
  await db.insert(masterServices).values(
    masterRows.flatMap((m) => serviceRows.map((s) => ({ masterId: m.id, serviceId: s.id }))),
  );

  const shifts = [
    { days: [1, 2, 3, 4, 5], startMin: 540, endMin: 1080 },
    { days: [2, 3, 4, 5, 6], startMin: 600, endMin: 1200 },
    { days: [1, 2, 3, 4, 5, 6], startMin: 540, endMin: 1020 },
  ];
  await db.insert(masterSchedules).values(
    masterRows.flatMap((m, i) =>
      shifts[i % shifts.length].days.map((weekday) => ({
        masterId: m.id,
        weekday,
        startMin: shifts[i % shifts.length].startMin,
        endMin: shifts[i % shifts.length].endMin,
      })),
    ),
  );

  const accounts = [
    { name: "Адміністратор", email: "admin@calma.test", password: "Admin12345", role: "admin" as const },
    { name: "Марія Клієнт", email: "client@calma.test", password: "Client12345", role: "client" as const },
  ];
  for (const account of accounts) {
    const existing = await db.select().from(user).where(eq(user.email, account.email));
    if (!existing.length) {
      await auth.api.signUpEmail({ body: { name: account.name, email: account.email, password: account.password } });
    }
    await db.update(user).set({ role: account.role }).where(eq(user.email, account.email));
  }

  const [client] = await db.select().from(user).where(eq(user.email, "client@calma.test"));
  const statuses = ["completed", "completed", "confirmed", "pending"] as const;
  await db.insert(appointments).values(
    statuses.map((status, index) => {
      const service = serviceRows[index % serviceRows.length];
      const start = new Date();
      start.setDate(start.getDate() + (status === "completed" ? -(index + 1) : index));
      start.setHours(10 + index, 0, 0, 0);
      return {
        id: randomUUID(),
        userId: client.id,
        clientName: client.name,
        clientEmail: client.email,
        serviceId: service.id,
        masterId: masterRows[index % masterRows.length].id,
        startsAt: start,
        endsAt: new Date(start.getTime() + service.durationMin * 60_000),
        status,
        price: service.price,
      };
    }),
  );
  console.log("Seed completed");
}

main().then(() => process.exit(0));
