import assert from "node:assert/strict";
import { test } from "node:test";
import { applyDiscount, getLoyalty, pointsForPrice } from "../src/entities/loyalty/lib/loyalty.util";

test("points are one per 10 currency units", () => {
  assert.equal(pointsForPrice(805), 80);
});

test("tier and discount depend on points", () => {
  assert.equal(getLoyalty(0).tier, "Bronze");
  assert.equal(getLoyalty(300).discountPercent, 5);
  assert.equal(getLoyalty(900).tier, "Gold");
  assert.equal(getLoyalty(900).next, null);
});

test("progress towards next tier", () => {
  const info = getLoyalty(150);
  assert.equal(info.next?.name, "Silver");
  assert.equal(info.next?.pointsToGo, 150);
  assert.equal(info.progress, 50);
});

test("discount is applied to price", () => {
  assert.equal(applyDiscount(1000, 10), 900);
});
