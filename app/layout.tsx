import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "@/app/providers/providers.component";
import "@/app/styles/globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Calma — масажний центр",
  description: "Онлайн-запис та керування масажним центром",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" suppressHydrationWarning className={geist.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}