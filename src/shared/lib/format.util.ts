export function formatPrice(value: number) {
  return `${value.toLocaleString("uk-UA")} ₴`;
}

export function formatDateTime(date: Date) {
  return date.toLocaleString("uk-UA", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
}
