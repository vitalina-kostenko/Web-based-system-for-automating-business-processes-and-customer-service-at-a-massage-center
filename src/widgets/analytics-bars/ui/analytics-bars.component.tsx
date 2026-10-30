// interface
type AnalyticsBarsProps = {
  title: string;
  rows: { label: string; value: number; caption: string }[];
};

// component
export function AnalyticsBars({ title, rows }: AnalyticsBarsProps) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  // return
  return (
    <section className="card space-y-4">
      <h2 className="font-semibold">{title}</h2>
      {rows.length === 0 && <p className="text-sm text-muted">Недостатньо даних</p>}
      <ul className="space-y-3">
        {rows.map((row) => (
          <li key={row.label} className="space-y-1.5">
            <div className="flex justify-between gap-3 text-sm">
              <span className="truncate">{row.label}</span>
              <span className="text-muted">{row.caption}</span>
            </div>
            <div className="h-2 rounded-full bg-soft">
              <div className="h-2 rounded-full bg-brand" style={{ width: `${(row.value / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
