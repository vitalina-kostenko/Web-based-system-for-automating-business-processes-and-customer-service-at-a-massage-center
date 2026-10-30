import assert from "node:assert/strict";
import { test } from "node:test";
import { applyPromo, checkPromo } from "../src/entities/promo/lib/promo.util";

const base = { kind: "percent" as const, value: 10, expiresAt: null, maxUses: null, usedCount: 0, active: true };

test("valid promo passes checks", () => {
  assert.equal(checkPromo(base).ok, true);
});

test("expired, exhausted and inactive promos are rejected", () => {
  assert.equal(checkPromo({ ...base, expiresAt: new Date("2020-01-01") }).ok, false);
  assert.equal(checkPromo({ ...base, maxUses: 5, usedCount: 5 }).ok, false);
  assert.equal(checkPromo({ ...base, active: false }).ok, false);
  assert.equal(checkPromo(undefined).ok, false);
});

test("percent and fixed discounts never go below zero", () => {
  assert.equal(applyPromo(1000, { kind: "percent", value: 15 }), 850);
  assert.equal(applyPromo(300, { kind: "fixed", value: 500 }), 0);
});
