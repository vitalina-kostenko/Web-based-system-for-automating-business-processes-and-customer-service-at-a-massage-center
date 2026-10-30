import type { ReactNode } from "react";
import { requireUser } from "@/shared/lib/auth/session.service";
import { AppShell } from "@/widgets/app-shell";

export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  return <AppShell user={user}>{children}</AppShell>;
}
