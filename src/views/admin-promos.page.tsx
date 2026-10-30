import { listPromoCodes } from "@/entities/promo";
import { PromoForm, PromoToggle } from "@/features/manage-promo";
import { requireAdmin } from "@/shared/lib/auth/session.service";
import { Badge } from "@/shared/ui";

// page
export async function AdminPromosPage() {
  await requireAdmin();
  const promos = await listPromoCodes();
  // return
  return (
    <div className="space-y-6">
      <h1 className="page-title">Промокоди</h1>
      <PromoForm />
      <ul className="grid gap-3 md:grid-cols-2">
        {promos.map((promo) => (
          <li key={promo.id} className="card flex items-center justify-between gap-3">
            <div>
              <p className="font-mono font-semibold">{promo.code}</p>
              <p className="text-sm text-muted">
                {promo.kind === "percent" ? `${promo.value}%` : `${promo.value} ₴`} · використано {promo.usedCount}
                {promo.maxUses ? ` з ${promo.maxUses}` : ""}
                {promo.expiresAt ? ` · до ${promo.expiresAt.toLocaleDateString("uk-UA")}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={promo.active ? "success" : "neutral"}>{promo.active ? "Активний" : "Вимкнений"}</Badge>
              <PromoToggle id={promo.id} active={promo.active} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
