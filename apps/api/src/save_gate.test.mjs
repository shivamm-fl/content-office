import assert from "node:assert/strict";
import { test } from "node:test";
import { waitForSave } from "./save_gate.ts";

const prior = { status: "done", gh_run_id: "123", gh_done_at: null, ended_at: 1_000 };
test("waits for a recent workflow save, then releases after six minutes", () => {
  assert.equal(waitForSave(prior, 1_000 + 359_999), true);
  assert.equal(waitForSave(prior, 1_000 + 360_000), false);
  assert.equal(waitForSave({ ...prior, gh_done_at: 2_000 }, 3_000), false);
  assert.equal(waitForSave({ ...prior, gh_run_id: null }, 3_000), false);
});
