import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn.util";

// interface
type BadgeProps = {
  tone?: "neutral" | "success" | "warn" | "danger";
  children: ReactNode;
};

const tones = {
  neutral: "bg-soft text-muted",
  success: "bg-brand/15 text-brand",
  warn: "bg-warn/15 text-warn",
  danger: "bg-danger/15 text-danger",
};

// component
export function Badge({ tone = "neutral", children }: BadgeProps) {
  // return
  return <span className={cn("badge", tones[tone])}>{children}</span>;
}
