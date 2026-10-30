import { listMastersWithServices, listServices } from "@/entities/service";
import { BookingForm } from "@/features/book-appointment";

// page
export async function BookPage() {
  const [services, links] = await Promise.all([listServices(), listMastersWithServices()]);
  const masters: Record<string, { id: string; name: string; specialty: string }[]> = {};
  for (const { serviceId, master } of links) {
    if (master.active) (masters[serviceId] ??= []).push(master);
  }
  // return
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="page-title">Запис на масаж</h1>
      <BookingForm services={services} masters={masters} />
    </div>
  );
}
