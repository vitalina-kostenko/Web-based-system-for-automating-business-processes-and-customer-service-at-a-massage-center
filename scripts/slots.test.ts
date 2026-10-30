import assert from "node:assert/strict";
import { test } from "node:test";
import { getFreeSlots, overlaps } from "../src/entities/appointment/lib/slots.util";

const day = "2099-01-10";
const at = (h: number, m = 0) => new Date(`${day}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`);

test("empty day returns slots inside working hours", () => {
  const slots = getFreeSlots({ date: day, durationMin: 60, busy: [] });
  assert.equal(slots[0].getTime(), at(9).getTime());
  assert.equal(slots.at(-1)?.getTime(), at(19).getTime());
});

test("busy interval blocks overlapping slots", () => {
  const slots = getFreeSlots({ date: day, durationMin: 60, busy: [{ start: at(10), end: at(11) }] });
  const times = slots.map((s) => s.getTime());
  assert.ok(!times.includes(at(9, 30).getTime()));
  assert.ok(!times.includes(at(10).getTime()));
  assert.ok(times.includes(at(11).getTime()));
});

test("day off returns no slots", () => {
  assert.equal(getFreeSlots({ date: day, durationMin: 60, busy: [], window: null }).length, 0);
});

test("master window limits slots", () => {
  const slots = getFreeSlots({ date: day, durationMin: 60, busy: [], window: { startMin: 600, endMin: 720 } });
  assert.deepEqual(slots.map((s) => s.getTime()), [at(10).getTime(), at(10, 30).getTime(), at(11).getTime()]);
});

test("overlaps detects touching intervals as free", () => {
  assert.equal(overlaps(at(9), at(10), at(10), at(11)), false);
  assert.equal(overlaps(at(9), at(10, 30), at(10), at(11)), true);
});
