import { cn } from "@/shared/lib/cn.util";
import { formatTime } from "@/shared/lib/format.util";

// interface
type SlotGridProps = {
  slots: string[];
  value: string;
  onChange: (iso: string) => void;
};

// component
export function SlotGrid({ slots, value, onChange }: SlotGridProps) {
  if (slots.length === 0) {
    return <p className="text-sm text-muted">РќРµРјР°С” РІС–Р»СЊРЅРѕРіРѕ С‡Р°СЃСѓ РЅР° С†СЋ РґР°С‚Сѓ</p>;
  }
  // return
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {slots.map((iso) => (
        <button
          key={iso}
          type="button"
          onClick={() => onChange(iso)}
          className={cn(
            "h-10 rounded-xl border text-sm transition",
            value === iso ? "border-brand bg-brand text-white dark:text-bg" : "border-border hover:bg-soft",
          )}
        >
          {formatTime(new Date(iso))}
        </button>
      ))}
    </div>
  );
}
