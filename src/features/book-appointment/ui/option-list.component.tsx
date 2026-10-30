import { cn } from "@/shared/lib/cn.util";

// interface
type Option = { id: string; title: string; hint?: string };

type OptionListProps = {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
};

// component
export function OptionList({ options, value, onChange }: OptionListProps) {
  // return
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={cn(
            "rounded-xl border p-3 text-left transition",
            value === option.id ? "border-brand bg-soft" : "border-border hover:bg-soft",
          )}
        >
          <span className="block text-sm font-medium">{option.title}</span>
          {option.hint && <span className="text-xs text-muted">{option.hint}</span>}
        </button>
      ))}
    </div>
  );
}
