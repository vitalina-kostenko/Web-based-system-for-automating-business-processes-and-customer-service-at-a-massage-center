import { CalendarCheck, CalendarPlus, LayoutDashboard, Sparkles, Users, type LucideIcon } from "lucide-react";

// interface
export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Огляд", icon: LayoutDashboard },
  { href: "/dashboard/book", label: "Запис", icon: CalendarPlus },
  { href: "/dashboard/appointments", label: "Мої записи", icon: CalendarCheck },
  { href: "/dashboard/admin/appointments", label: "Всі записи", icon: CalendarCheck, adminOnly: true },
  { href: "/dashboard/admin/services", label: "Послуги", icon: Sparkles, adminOnly: true },
  { href: "/dashboard/admin/clients", label: "Клієнти", icon: Users, adminOnly: true },
];
