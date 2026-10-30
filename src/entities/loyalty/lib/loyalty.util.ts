// interface
export type Tier = { name: string; min: number; discount: number };

export const tiers: Tier[] = [
  { name: "Bronze", min: 0, discount: 0 },
  { name: "Silver", min: 300, discount: 5 },
  { name: "Gold", min: 800, discount: 10 },
];

export function pointsForPrice(price: number) {
  return Math.floor(price / 10);
}

export function applyDiscount(price: number, percent: number) {
  return Math.round(price * (1 - percent / 100));
}

export function getLoyalty(points: number) {
  const index = tiers.reduce((found, tier, i) => (points >= tier.min ? i : found), 0);
  const current = tiers[index];
  const next = tiers[index + 1];
  return {
    points,
    tier: current.name,
    discountPercent: current.discount,
    next: next ? { name: next.name, pointsToGo: next.min - points, discount: next.discount } : null,
    progress: next ? Math.round(((points - current.min) / (next.min - current.min)) * 100) : 100,
  };
}
