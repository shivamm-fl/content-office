import assert from "node:assert/strict";
import { test } from "node:test";
import { stallAction } from "./stall.ts";

test("warns once then restarts an unresponsive desk", () => {
  const x = { now: 400_001, status: "live", profile: "desk", last_activity: 1, delivered_at: 2, pending_asks: 0, warned: false };
  assert.equal(stallAction(x), "warn");
  assert.equal(stallAction({ ...x, warned: true }), null);
  assert.equal(stallAction({ ...x, now: 900_001 }), "restart");
  assert.equal(stallAction({ ...x, pending_asks: 1 }), null);
});
