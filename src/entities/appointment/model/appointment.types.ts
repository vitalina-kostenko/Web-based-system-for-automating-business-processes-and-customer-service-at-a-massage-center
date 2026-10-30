export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type AppointmentView = {
  id: string;
  serviceId: string;
  masterId: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  masterName: string;
  startsAt: Date;
  endsAt: Date;
  status: AppointmentStatus;
  price: number;
};

export const statusLabels: Record<AppointmentStatus, string> = {
  pending: "Очікує",
  confirmed: "Підтверджено",
  completed: "Завершено",
  cancelled: "Скасовано",
};
