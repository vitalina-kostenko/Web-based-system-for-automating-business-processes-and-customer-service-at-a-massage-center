"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

// component
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // return
  return (
    <button
      type="button"
      aria-label="Змінити тему"
      className="btn-ghost size-10 px-0"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="size-5 dark:hidden" />
      <Moon className="hidden size-5 dark:block" />
    </button>
  );
}
