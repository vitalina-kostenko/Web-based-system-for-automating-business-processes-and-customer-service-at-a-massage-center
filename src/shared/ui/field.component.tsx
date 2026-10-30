import type { InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn.util";

// interface
type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

// component
export function Field({ label, className, ...props }: FieldProps) {
  // return
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <input className={cn("input", className)} {...props} />
    </label>
  );
}
