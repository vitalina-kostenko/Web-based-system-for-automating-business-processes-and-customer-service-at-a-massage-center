import assert from "node:assert/strict";
import { test } from "node:test";
import { masterUtilization, topServices } from "../src/entities/appointment/lib/analytics.util";
import type { AppointmentView } from "../src/entities/appointment/model/appointment.types";

const make = (serviceId: string, masterId: string, price: number, start: string, minutes = 60): AppointmentView => ({
  id: `${serviceId}${start}`,
  serviceId,
  masterId,
  clientName: "c",
  clientEmail: "c@c",
  serviceName: serviceId,
  masterName: masterId,
  startsAt: new Date(start),
  endsAt: new Date(new Date(start).getTime() + minutes * 60_000),
  status: "completed",
  price,
});

test("topServices sorts by popularity", () => {
  const items = [make("a", "m", 100, "2026-01-05T10:00:00"), make("b", "m", 200, "2026-01-05T12:00:00"), make("b", "m", 200, "2026-01-06T12:00:00")];
  const result = topServices(items);
  assert.equal(result[0].name, "b");
  assert.equal(result[0].revenue, 400);
});

test("masterUtilization computes booked share of capacity", () => {
  const now = new Date("2026-01-05T23:00:00");
  const masters = [{ id: "m", name: "M", schedule: [{ weekday: 1, startMin: 540, endMin: 1020 }] }];
  const items = [make("a", "m", 100, "2026-01-05T10:00:00", 240)];
  assert.equal(masterUtilization(items, masters, 1, now)[0].percent, 50);
});
