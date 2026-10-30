import { AppointmentsPage } from "@/views/appointments.page";

export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  return <AppointmentsPage scope="mine" tab={tab} />;
}
