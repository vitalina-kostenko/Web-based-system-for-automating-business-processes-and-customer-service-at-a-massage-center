import { Bell } from "lucide-react";
import { getNotifications } from "@/entities/notification";
import { MarkReadButton } from "@/features/read-notifications";
import { cn } from "@/shared/lib/cn.util";

// component
export async function NotificationBell({ userId }: { userId: string }) {
  const { items, unread } = await getNotifications(userId);
  // return
  return (
    <details className="group relative">
      <summary className="btn-ghost relative size-10 cursor-pointer list-none px-0 [&::-webkit-details-marker]:hidden">
        <Bell className="size-5" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-white">
            {unread}
          </span>
        )}
      </summary>
      <div className="absolute right-0 z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] space-y-3 rounded-2xl border border-border bg-surface p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Сповіщення</p>
          {unread > 0 && <MarkReadButton />}
        </div>
        {items.length === 0 && <p className="text-sm text-muted">Поки нічого немає</p>}
        <ul className="max-h-80 space-y-2 overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className={cn("rounded-xl p-3 text-sm", item.read ? "" : "bg-soft")}>
              <p className="font-medium">{item.title}</p>
              {item.body && <p className="text-muted">{item.body}</p>}
              <p className="mt-1 text-xs text-muted">
                {item.createdAt.toLocaleString("uk-UA", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
