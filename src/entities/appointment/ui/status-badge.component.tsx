import { Badge } from "@/shared/ui";
import { statusLabels, type AppointmentStatus } from "../model/appointment.types";

// interface
const tones = {
  pending: "warn",
  confirmed: "success",
  completed: "neutral",
  cancelled: "danger",
} as const;

// component
export function StatusBadge({ status }: { status: AppointmentStatus }) {
  // return
  return <Badge tone={tones[status]}>{statusLabels[status]}</Badge>;
}
