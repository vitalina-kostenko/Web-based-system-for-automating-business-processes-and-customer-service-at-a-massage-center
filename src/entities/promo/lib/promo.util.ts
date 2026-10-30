// interface
export type PromoRule = {
  kind: "percent" | "fixed";
  value: number;
  expiresAt: Date | null;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
};

export type PromoCheck = { ok: true } | { ok: false; error: string };

export function checkPromo(promo: PromoRule | undefined, now = new Date()): PromoCheck {
  if (!promo || !promo.active) return { ok: false, error: "Промокод не знайдено" };
  if (promo.expiresAt && promo.expiresAt < now) return { ok: false, error: "Термін дії промокоду минув" };
  if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
    return { ok: false, error: "Ліміт використань вичерпано" };
  }
  return { ok: true };
}

export function applyPromo(price: number, promo: Pick<PromoRule, "kind" | "value">) {
  const reduced = promo.kind === "percent" ? price * (1 - promo.value / 100) : price - promo.value;
  return Math.max(0, Math.round(reduced));
}
