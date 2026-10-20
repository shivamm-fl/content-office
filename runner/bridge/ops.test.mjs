import assert from "node:assert/strict";
import test from "node:test";
import { callOps, OPS_TOOLS } from "./ops.mjs";

const context = { office: "https://office.example/", team: "hq", runId: "run_abc123", token: "test-token" };

test("company ops tools are read-only and have the expected inputs", () => {
  assert.deepEqual(OPS_TOOLS.map((tool) => tool.name), [
    "ops_overview", "ops_runs", "ops_thread", "ops_log", "ops_transcript", "ops_proposals",
  ]);
  assert.ok(OPS_TOOLS.every((tool) => tool.description.includes("Read-only")));
  assert.deepEqual(OPS_TOOLS.find((tool) => tool.name === "ops_thread").inputSchema.required, ["team", "thread_id"]);
});

test("ops requests carry the company run token and target arguments", async () => {
  const requests = [];
  const fetch = async (url, init) => {
    requests.push({ url: new URL(url), init });
    return { ok: true, text: async () => "office view" };
  };
  const response = await callOps("ops_thread", { team: "learnai", thread_id: "thread 1", limit: 20, tools: false }, { ...context, fetch });
  assert.equal(response, "office view");
  assert.equal(requests[0].url.pathname, "/api/runner/ops/thread");
  assert.deepEqual(requests[0].url.searchParams.getAll("team"), ["hq"]);
  assert.equal(requests[0].url.searchParams.get("target"), "learnai");
  assert.equal(requests[0].url.searchParams.get("run"), "run_abc123");
  assert.equal(requests[0].url.searchParams.get("id"), "thread 1");
  assert.equal(requests[0].url.searchParams.get("limit"), "20");
  assert.equal(requests[0].url.searchParams.get("tools"), "0");
  assert.equal(requests[0].init.headers["X-Run-Token"], "test-token");
  await callOps("ops_transcript", { team: "learnai", run: "run_other", from: 10, tail: 5 }, { ...context, fetch });
  assert.deepEqual(requests[1].url.searchParams.getAll("run"), ["run_abc123"]);
  assert.equal(requests[1].url.searchParams.get("source_run"), "run_other");
  assert.equal(requests[1].url.searchParams.get("target"), "learnai");
});

test("ops responses are clipped and HTTP errors pass through", async () => {
  const long = await callOps("ops_overview", {}, { ...context, fetch: async () => ({ ok: true, text: async () => "x".repeat(60_050) }) });
  assert.equal(long.length, 60_000);
  const error = await callOps("ops_log", { gh_run: "123" }, { ...context, fetch: async () => ({ ok: false, status: 404, text: async () => "run not found" }) });
  assert.equal(error, "run not found");
});
