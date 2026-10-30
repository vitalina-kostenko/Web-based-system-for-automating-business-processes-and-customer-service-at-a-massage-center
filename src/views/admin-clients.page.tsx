import { listAppointments } from "@/entities/appointment";
import { requireAdmin } from "@/shared/lib/auth/session.service";
import { formatPrice } from "@/shared/lib/format.util";

// page
export async function AdminClientsPage() {
  await requireAdmin();
  const items = await listAppointments();
  const clients = new Map<string, { name: string; email: string; visits: number; spent: number }>();
  for (const item of items) {
    const entry = clients.get(item.clientEmail) ?? { name: item.clientName, email: item.clientEmail, visits: 0, spent: 0 };
    entry.visits += 1;
    if (item.status === "completed") entry.spent += item.price;
    clients.set(item.clientEmail, entry);
  }
  // return
  return (
    <div className="space-y-6">
      <h1 className="page-title">Клієнти</h1>
      <ul className="grid gap-3 md:grid-cols-2">
        {[...clients.values()].map((client) => (
          <li key={client.email} className="card flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium">{client.name}</p>
              <p className="truncate text-sm text-muted">{client.email}</p>
            </div>
            <div className="text-right text-sm">
              <p>{client.visits} записів</p>
              <p className="text-muted">{formatPrice(client.spent)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
