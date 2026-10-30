import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { siteConfig } from "@/shared/config/site.config";
import { auth } from "./auth.config";

// interface
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "client" | "admin";
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    const role = (session.user as { role?: string }).role === "admin" ? "admin" : "client";
    return { id: session.user.id, name: session.user.name, email: session.user.email, role };
  }
  if (!siteConfig.isClerkEnabled) return null;
  const { auth: clerkAuth, currentUser } = await import("@clerk/nextjs/server");
  const { userId } = await clerkAuth();
  if (!userId) return null;
  const clerkUser = await currentUser();
  return {
    id: `clerk_${userId}`,
    name: clerkUser?.fullName ?? clerkUser?.username ?? "Клієнт",
    email: clerkUser?.primaryEmailAddress?.emailAddress ?? "",
    role: "client",
  };
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}
