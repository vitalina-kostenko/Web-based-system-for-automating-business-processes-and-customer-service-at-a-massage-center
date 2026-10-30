import { Clock } from "lucide-react";
import { formatPrice } from "@/shared/lib/format.util";
import { Badge } from "@/shared/ui";

// interface
type ServiceCardProps = {
  name: string;
  description: string;
  category: string;
  durationMin: number;
  price: number;
};

// component
export function ServiceCard({ name, description, category, durationMin, price }: ServiceCardProps) {
  // return
  return (
    <article className="card flex flex-col gap-3 transition hover:-translate-y-0.5 hover:shadow-md">
      <Badge>{category}</Badge>
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="flex-1 text-sm text-muted">{description}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-muted">
          <Clock className="size-4" /> {durationMin} хв
        </span>
        <span className="font-semibold">{formatPrice(price)}</span>
      </div>
    </article>
  );
}
