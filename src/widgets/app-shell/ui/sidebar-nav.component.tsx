"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/cn.util";
import { navItems } from "../model/nav.config";

// interface
type SidebarNavProps = {
  isAdmin: boolean;
  variant: "side" | "bottom";
};

// component
export function SidebarNav({ isAdmin, variant }: SidebarNavProps) {
  const pathname = usePathname();
  const items = navItems.filter((item) => !item.adminOnly || isAdmin);
  const isSide = variant === "side";

  // return
  return (
    <nav className={cn(isSide ? "flex flex-col gap-1" : "flex gap-1 overflow-x-auto")}>
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-xl text-sm font-medium transition-colors",
            isSide ? "px-3 py-2.5" : "min-w-16 shrink-0 flex-col gap-0.5 px-2 py-1.5 text-[11px]",
            pathname === href ? "bg-soft text-brand" : "text-muted hover:bg-soft hover:text-fg",
          )}
        >
          <Icon className="size-5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
