import { Logo } from "@/shared/ui";

// component
export function LandingFooter() {
  // return
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted sm:flex-row">
        <Logo />
        <span>© {new Date().getFullYear()} Calma. Усі права захищено.</span>
      </div>
    </footer>
  );
}
