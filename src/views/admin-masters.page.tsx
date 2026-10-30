import { listMastersWithSchedule } from "@/entities/master";
import { ScheduleForm } from "@/features/manage-schedule";
import { requireAdmin } from "@/shared/lib/auth/session.service";

// page
export async function AdminMastersPage() {
  await requireAdmin();
  const masters = await listMastersWithSchedule();
  // return
  return (
    <div className="space-y-6">
      <h1 className="page-title">Майстри та графік роботи</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        {masters.map((master) => (
          <section key={master.id} className="card space-y-4">
            <div>
              <h2 className="font-semibold">{master.name}</h2>
              <p className="text-sm text-muted">{master.specialty}</p>
            </div>
            <ScheduleForm masterId={master.id} schedule={master.schedule} />
          </section>
        ))}
      </div>
    </div>
  );
}
