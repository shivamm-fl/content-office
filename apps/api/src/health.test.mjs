import assert from "node:assert/strict";
import { test } from "node:test";
import { findAnomalies } from "./health.ts";

test("health detects delayed saves and stale owner asks", () => {
  const now = 2_000_000;
  const anomalies = findAnomalies({ now, runs: [{ id: "r", thread_id: "t", profile: "desk", status: "done", created_at: 1, ended_at: 1, gh_run_id: "2", gh_done_at: null }], lastOwnerMessageAt: {}, asks: [{ thread_id: "t", status: "pending", created_at: 1 }], savePending: ["r"] });
  assert.deepEqual(anomalies.map((a) => a.kind), ["save_pending_long", "old_ask"]);
});

test("health detects a stalled desk, recent failure, and long live run", () => {
  const now = 10_000_000;
  const anomalies = findAnomalies({
    now,
    runs: [
      { id: "desk", thread_id: "t", profile: "desk", status: "live", created_at: 1, ended_at: null, last_activity: now - 7 * 60_000 },
      { id: "fail", thread_id: "u", profile: "desk", status: "failed", created_at: 1, ended_at: now - 1_000, error: "broken" },
    ],
    lastOwnerMessageAt: { t: now - 60_000 }, asks: [], savePending: [],
  });
  assert.deepEqual(anomalies.map((a) => a.kind), ["stalled", "long_run", "failed"]);
  assert.equal(anomalies.at(-1).text, "broken");
});
