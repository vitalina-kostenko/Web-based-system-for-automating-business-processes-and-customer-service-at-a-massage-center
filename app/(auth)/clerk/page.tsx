import { SignIn } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { siteConfig } from "@/shared/config/site.config";

export default function Page() {
  if (!siteConfig.isClerkEnabled) notFound();
  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <SignIn routing="hash" forceRedirectUrl="/dashboard" />
    </div>
  );
}
