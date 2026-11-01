// Run against a fresh `wrangler dev --local --test-scheduled` with DISPATCH_MODE=manual and fake credentials.
// Explicit local URL only: this test creates local workdays/attempt counters and must never target production.
import assert from "node:assert/strict";
const base = process.argv[2];
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base ?? "")) throw new Error("provide an explicit localhost Worker URL");
const login = await fetch(`${base}/api/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "offline-smoke-key" }) });
assert.equal(login.status, 200);
const cookie = login.headers.get("set-cookie").split(";")[0];
async function api(path, body, headers = {}) {
  const r = await fetch(`${base}${path}`, { method: body ? "POST" : "GET", headers: { Cookie: cookie, Origin: base, "Content-Type": "application/json", ...headers }, ...(body ? { body: JSON.stringify(body) } : {}) });
  return { status: r.status, body: await r.json() };
}
const state = async () => (await api("/api/teams/dsa/state")).body;
const codingDays = (s) => s.threads.filter((t) => t.title.startsWith("Coding day,"));
const trigger = () => fetch(`${base}/cdn-cgi/local/explorer/api/local/scheduled?worker=content-office`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cron: "10 0 * * *", scheduled_time: Date.parse("2026-11-01T00:10:00Z") }) });
assert.equal((await api("/api/teams/dsa/coding")).body.configured, true);
assert.equal((await fetch(`${base}/api/teams/dsa/coding`)).status, 401);
await api("/api/teams/dsa/coding", { potd: false, blind75: false });
assert.equal((await trigger()).status, 200);
assert.equal(codingDays(await state()).length, 0);
await api("/api/teams/dsa/coding", { potd: false, blind75: true });
for (const r of await Promise.all([trigger(), trigger()])) assert.equal(r.status, 200);
let s = await state();
assert.equal(codingDays(s).length, 1, "duplicate cron launches one workday");
const day = codingDays(s)[0];
const thread = (await api(`/api/teams/dsa/threads/${day.id}`)).body;
assert.ok(JSON.stringify(thread).includes("POTD paused"));
const run = s.runs.find((r) => r.thread_id === day.id);
const claim = await api("/api/runner/claim", { team: "dsa", run_id: run.id }, { "X-Dev-Runner-Key": "offline-runner" });
assert.equal(claim.status, 200);
const headers = { "X-Run-Token": claim.body.token };
for (let n = 1; n <= 3; n++) {
  const r = await api(`/api/runner/coding-attempt?team=dsa&run=${run.id}`, { item: "b001" }, headers);
  assert.equal(r.status, 200); assert.equal(r.body.attempt, n);
}
assert.equal((await api(`/api/runner/coding-attempt?team=dsa&run=${run.id}`, { item: "b001" }, headers)).status, 409);
assert.equal((await api(`/api/runner/build?team=dsa&run=${run.id}`, { item_id: "b001", item: { id: "b001", track: "blind75", solution_code: "pass" } }, headers)).status, 400);
assert.equal((await api(`/api/runner/build?team=dsa&run=${run.id}`, { item_id: "q101", item: { track: "interview" } }, headers)).status, 400);
console.log("Local Worker passed: owner auth, per-track pause, concurrent cron idempotency, persistent three-attempt cap, forged Accepted refusal, cross-floor refusal.");
