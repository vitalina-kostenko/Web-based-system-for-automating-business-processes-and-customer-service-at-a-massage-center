import { CalendarClock, ShieldCheck, UserRound } from "lucide-react";

// interface
const features = [
  { icon: CalendarClock, title: "Розумний запис", text: "Система сама показує лише вільні слоти з урахуванням тривалості процедури." },
  { icon: UserRound, title: "Особистий кабінет", text: "Історія візитів, статуси та скасування окремо для кожного клієнта." },
  { icon: ShieldCheck, title: "Безпека даних", text: "Захищена авторизація, ролі доступу та перевірка всіх дій на сервері." },
];

// component
export function LandingFeatures() {
  // return
  return (
    <section className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-3">
      {features.map(({ icon: Icon, title, text }) => (
        <div key={title} className="card space-y-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-soft text-brand">
            <Icon className="size-5" />
          </span>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted">{text}</p>
        </div>
      ))}
    </section>
  );
}
