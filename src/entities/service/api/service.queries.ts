import { asc, eq } from "drizzle-orm";
import { db, masterServices, masters, services } from "@/shared/lib/db";

export async function listServices(onlyActive = true) {
  const query = db.select().from(services).orderBy(asc(services.category), asc(services.name));
  return onlyActive ? query.where(eq(services.active, true)) : query;
}

export async function listMastersByService(serviceId: string) {
  return db
    .select({ id: masters.id, name: masters.name, specialty: masters.specialty })
    .from(masters)
    .innerJoin(masterServices, eq(masterServices.masterId, masters.id))
    .where(eq(masterServices.serviceId, serviceId));
}

export async function listMastersWithServices() {
  const rows = await db
    .select({ serviceId: masterServices.serviceId, master: masters })
    .from(masterServices)
    .innerJoin(masters, eq(masterServices.masterId, masters.id));
  return rows;
}
