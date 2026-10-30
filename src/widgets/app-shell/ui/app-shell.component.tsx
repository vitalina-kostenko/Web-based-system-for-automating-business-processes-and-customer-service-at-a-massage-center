import type { ReactNode } from "react";
import Link from "next/link";
import type { SessionUser } from "@/shared/lib/auth/session.service";
import { Logo } from "@/shared/ui";
import { SignOutButton } from "@/features/auth";
import { ThemeToggle } from "@/features/toggle-theme";
import { NotificationBell } from "@/widgets/notification-bell";
import { SidebarNav } from "./sidebar-nav.component";

// interface
type AppShellProps = {
  user: SessionUser;
  children: ReactNode;
};

// component
export function AppShell({ user, children }: AppShellProps) {
  const isAdmin = user.role === "admin";
  // return
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-r border-border bg-surface p-4 md:flex">
        <Link href="/" className="px-2 pt-1">
          <Logo />
        </Link>
        <SidebarNav isAdmin={isAdmin} variant="side" />
      </aside>
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-bg/80 px-4 backdrop-blur md:px-8">
          <Link href="/" className="md:hidden">
            <Logo />
          </Link>
          <div className="hidden text-sm text-muted md:block">
            {user.name} · {isAdmin ? "Адміністратор" : "Клієнт"}
          </div>
          <div className="flex items-center gap-1">
            <NotificationBell userId={user.id} />
            <ThemeToggle />
            <SignOutButton />
          </div>
        </header>
        <main className="flex-1 p-4 pb-24 md:p-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-surface/95 p-1.5 backdrop-blur md:hidden">
        <SidebarNav isAdmin={isAdmin} variant="bottom" />
      </div>
    </div>
  );
}
