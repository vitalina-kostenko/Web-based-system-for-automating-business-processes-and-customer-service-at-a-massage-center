import { formatPrice } from "@/shared/lib/format.util";

// interface
type RevenueChartProps = {
  data: { label: string; value: number }[];
};

// component
export function RevenueChart({ data }: RevenueChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  // return
  return (
    <div className="card space-y-4">
      <h2 className="font-semibold">Дохід за 7 днів</h2>
      <div className="flex h-40 items-end gap-2">
        {data.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-1" title={formatPrice(d.value)}>
            <div
              className="w-full rounded-t-lg bg-brand/80"
              style={{ height: `${Math.max((d.value / max) * 100, 3)}%` }}
            />
            <span className="text-[11px] text-muted">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
