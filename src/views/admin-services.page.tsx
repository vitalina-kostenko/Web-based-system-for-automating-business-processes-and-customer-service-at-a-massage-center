import { listServices } from "@/entities/service";
import { ServiceForm, ServiceToggle } from "@/features/manage-service";
import { Badge } from "@/shared/ui";
import { requireAdmin } from "@/shared/lib/auth/session.service";
import { formatPrice } from "@/shared/lib/format.util";

// page
export async function AdminServicesPage() {
  await requireAdmin();
  const services = await listServices(false);
  // return
  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="page-title">Послуги</h1>
      <ServiceForm />
      <ul className="space-y-3">
        {services.map((service) => (
          <li key={service.id} className="card flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-muted">
                {service.durationMin} хв · {formatPrice(service.price)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={service.active ? "success" : "neutral"}>{service.active ? "Активна" : "Вимкнена"}</Badge>
              <ServiceToggle id={service.id} active={service.active} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
