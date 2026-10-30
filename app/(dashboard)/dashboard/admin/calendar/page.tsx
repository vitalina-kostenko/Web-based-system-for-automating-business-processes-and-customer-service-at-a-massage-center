import { AdminCalendarPage } from "@/views/admin-calendar.page";

export default async function Page({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date } = await searchParams;
  return <AdminCalendarPage date={date} />;
}
