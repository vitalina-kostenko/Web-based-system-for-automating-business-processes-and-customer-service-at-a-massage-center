import Link from "next/link";
import { Logo } from "@/shared/ui";
import { ThemeToggle } from "@/features/toggle-theme";

// component
export function LandingHeader() {
  // return
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/sign-in" className="btn-ghost hidden sm:inline-flex">
            Увійти
          </Link>
          <Link href="/sign-up" className="btn-primary">
            Записатись
          </Link>
        </div>
      </div>
    </header>
  );
}
