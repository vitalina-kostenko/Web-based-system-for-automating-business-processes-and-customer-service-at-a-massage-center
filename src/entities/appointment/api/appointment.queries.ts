import { and, desc, eq, gte, lt, ne } from "drizzle-orm";
import { appointments, db, masters, services } from "@/shared/lib/db";
import type { AppointmentView } from "../model/appointment.types";

const selection = {
  id: appointments.id,
  clientName: appointments.clientName,
  clientEmail: appointments.clientEmail,
  serviceName: services.name,
  masterName: masters.name,
  startsAt: appointments.startsAt,
  endsAt: appointments.endsAt,
  status: appointments.status,
  price: appointments.price,
};

export async function listAppointments(userId?: string): Promise<AppointmentView[]> {
  const query = db
    .select(selection)
    .from(appointments)
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .innerJoin(masters, eq(appointments.masterId, masters.id));
  const rows = userId ? query.where(eq(appointments.userId, userId)) : query;
  return rows.orderBy(desc(appointments.startsAt));
}

export async function listBusyIntervals(masterId: string, dayStart: Date, dayEnd: Date) {
  const rows = await db
    .select({ start: appointments.startsAt, end: appointments.endsAt })
    .from(appointments)
    .where(
      and(
        eq(appointments.masterId, masterId),
        ne(appointments.status, "cancelled"),
        gte(appointments.startsAt, dayStart),
        lt(appointments.startsAt, dayEnd),
      ),
    );
  return rows;
}
