import Link from "next/link";
import { AuthForm } from "@/features/auth";
import { ThemeToggle } from "@/features/toggle-theme";
import { Logo } from "@/shared/ui";

// interface
type AuthPageProps = { mode: "sign-in" | "sign-up" };

// page
export function AuthPage({ mode }: AuthPageProps) {
  const isSignUp = mode === "sign-up";
  // return
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <Link href="/">
        <Logo />
      </Link>
      <div className="card w-full max-w-sm space-y-5">
        <div>
          <h1 className="page-title">{isSignUp ? "Створення акаунта" : "Вітаємо знову"}</h1>
          <p className="text-sm text-muted">
            {isSignUp ? "Зареєструйтесь, щоб записатись на масаж" : "Увійдіть до особистого кабінету"}
          </p>
        </div>
        <AuthForm mode={mode} />
      </div>
    </div>
  );
}
