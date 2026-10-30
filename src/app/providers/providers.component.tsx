import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { siteConfig } from "@/shared/config/site.config";

// component
export function Providers({ children }: { children: ReactNode }) {
  const content = (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
  // return
  return siteConfig.isClerkEnabled ? <ClerkProvider>{content}</ClerkProvider> : content;
}
