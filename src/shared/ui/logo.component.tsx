import { cn } from "@/shared/lib/cn.util";

// interface
type LogoProps = {
  className?: string;
  withText?: boolean;
};

// component
export function Logo({ className, withText = true }: LogoProps) {
  // return
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 64 64" className="size-8" aria-hidden>
        <rect width="64" height="64" rx="18" className="fill-brand" />
        <ellipse cx="32" cy="45" rx="17" ry="6.5" fill="#fff" />
        <ellipse cx="32" cy="32" rx="12" ry="5.5" fill="#fff" opacity=".85" />
        <ellipse cx="32" cy="21" rx="7" ry="4.5" fill="#fff" opacity=".7" />
      </svg>
      {withText && <span className="text-lg font-semibold tracking-tight">Calma</span>}
    </span>
  );
}
