import { getUserLoyalty } from "@/entities/loyalty";
import { requireUser } from "@/shared/lib/auth/session.service";
import { getMasterRatings } from "@/entities/review";
import { listMastersWithServices, listServices } from "@/entities/service";
import { BookingForm } from "@/features/book-appointment";

// page
export async function BookPage() {
  const user = await requireUser();
  const [services, links, ratings, loyalty] = await Promise.all([
    listServices(),
    listMastersWithServices(),
    getMasterRatings(),
    getUserLoyalty(user.id),
  ]);
  const masters: Record<string, { id: string; name: string; specialty: string; rating?: string }[]> = {};
  for (const { serviceId, master } of links) {
    const rating = ratings.get(master.id);
    if (master.active) {
      (masters[serviceId] ??= []).push({ ...master, rating: rating?.average.toFixed(1) });
    }
  }
  // return
  return (
    <div className="space-y-6">
      <h1 className="page-title">Запис на масаж</h1>
      <BookingForm services={services} masters={masters} discountPercent={loyalty.discountPercent} />
    </div>
  );
}
