import { Gem } from "lucide-react";
import type { getLoyalty } from "@/entities/loyalty";

// interface
type LoyaltyCardProps = { loyalty: ReturnType<typeof getLoyalty> };

// component
export function LoyaltyCard({ loyalty }: LoyaltyCardProps) {
  // return
  return (
    <section className="card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-soft text-brand">
            <Gem className="size-5" />
          </span>
          <div>
            <p className="font-semibold">Рівень {loyalty.tier}</p>
            <p className="text-sm text-muted">{loyalty.points} балів</p>
          </div>
        </div>
        <span className="badge bg-brand/15 text-brand">Знижка {loyalty.discountPercent}%</span>
      </div>
      <div className="h-2 rounded-full bg-soft">
        <div className="h-2 rounded-full bg-brand" style={{ width: `${loyalty.progress}%` }} />
      </div>
      <p className="text-sm text-muted">
        {loyalty.next
          ? `До рівня ${loyalty.next.name} (знижка ${loyalty.next.discount}%) лишилось ${loyalty.next.pointsToGo} балів`
          : "Ви досягли найвищого рівня"}
      </p>
    </section>
  );
}
