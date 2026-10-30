import Link from "next/link";
import { ArrowRight } from "lucide-react";

// component
export function LandingHero() {
  // return
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-28">
      <span className="badge bg-soft text-brand">Масажний центр · онлайн-запис 24/7</span>
      <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
        Спокій і відновлення — у кілька кліків
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-muted">
        Оберіть послугу, майстра та зручний час. Ми нагадаємо про візит, а історія ваших записів завжди під рукою.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/sign-up" className="btn-primary h-12 px-6">
          Почати <ArrowRight className="size-4" />
        </Link>
        <Link href="#services" className="btn-outline h-12 px-6">
          Переглянути послуги
        </Link>
      </div>
    </section>
  );
}
