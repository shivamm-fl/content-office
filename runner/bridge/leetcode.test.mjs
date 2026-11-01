import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, mkdirSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { makeLeetcode } from "./leetcode.mjs";
import { readEvidence } from "../../apps/api/src/coding.ts";

const secret = "offline-test-secret-32-characters-long";
const code = "class Solution:\n    pass\n";
const env = { LEETCODE_AUTOMATION_AUTHORIZED: "true", LEETCODE_SESSION_COOKIE: "fake-cookie-never-real", LEETCODE_CSRF_TOKEN: "fake-csrf", CODING_PROOF_SECRET: secret };
function folder() {
  const p = mkdtempSync(join(tmpdir(), "leetcode-office-")); mkdirSync(join(p, "roadmap"));
  copyFileSync(new URL("../../teams/dsa/roadmap/blind75.json", import.meta.url), join(p, "roadmap/blind75.json")); return p;
}
const bodyOf = (r) => JSON.parse(r.content[0].text);
function fixture(options = {}) {
  const calls = [];
  let reservations = 0;
  const teamDir = options.teamDir ?? folder();
  const request = async (url, init) => {
    calls.push([url, init]);
    if (options.http) return new Response("sensitive upstream page", { status: options.http });
    const body = init.body ? JSON.parse(init.body) : {};
    let data;
    if (url.endsWith("submit/")) data = { submission_id: 12345 };
    else if (url.endsWith("check/")) data = options.pending ? { state: "PENDING" } : { state: "SUCCESS", status_code: options.rejected ? 11 : 10, status_msg: options.rejected ? "Wrong Answer" : "Accepted", total_testcases: 20 };
    else if (body.query.includes("activeDaily")) data = { data: { activeDailyCodingChallengeQuestion: { date: options.date ?? "2026-11-01", question: { titleSlug: "two-sum" } } } };
    else if (body.query.includes("submissionDetails")) data = { data: { submissionDetails: { id: "12345", code: options.differentCode ? "different source" : code, statusCode: 10, question: { questionId: "1", titleSlug: options.differentProblem ? "other" : "two-sum" }, lang: { name: "Python3" } } } };
    else data = { data: { question: { questionId: "1", questionFrontendId: "1", title: "Two Sum", titleSlug: "two-sum", difficulty: "Easy", content: "<p>Original intake fixture constraints</p>", codeSnippets: [{ langSlug: "python3", code: "class Solution: pass" }] } } };
    return Response.json(data);
  };
  const make = (over = {}) => makeLeetcode({ teamDir, env, now: () => new Date("2026-11-01T00:10:00Z"), fetch: request, sleep: async () => {}, reserveAttempt: async () => { reservations++; if (options.exhausted) throw new Error("blocked_attempt_limit"); }, ...over });
  return { tool: make(), make, calls, teamDir, get reservations() { return reservations; } };
}
test("disabled integration fails closed without making network calls", async () => {
  const f = fixture();
  const r = await f.make({ env: {} }).call("leetcode_problem", { track: "potd" });
  assert.equal(r.isError, true); assert.match(r.content[0].text, /blocked_access/); assert.equal(f.calls.length, 0);
});
test("POTD refuses yesterday's cached response", async () => {
  const f = fixture({ date: "2026-10-31" });
  const r = await f.tool.call("leetcode_problem", { track: "potd" });
  assert.equal(r.isError, true); assert.match(r.content[0].text, /blocked_stale_daily/);
});
test("real judge flow only signs Accepted after reading back exact submitted code", async () => {
  const f = fixture();
  const intake = bodyOf(await f.tool.call("leetcode_problem", { track: "potd" }));
  assert.equal(intake.id, "p0001");
  const r = bodyOf(await f.tool.call("leetcode_judge", { problem_token: intake.problem_token, solution_code: code }));
  assert.equal(r.status, "Accepted"); assert.equal((await readEvidence(r.accepted_proof, secret)).item, "p0001");
  assert.equal(f.reservations, 1); assert.equal(f.calls.filter(([u]) => u.endsWith("submit/")).length, 1);
  assert.match(f.calls[0][1].headers.Cookie, /LEETCODE_SESSION=/);
});
test("wrong answer yields feedback without an Accepted token", async () => {
  const f = fixture({ rejected: true }); const intake = bodyOf(await f.tool.call("leetcode_problem", { track: "blind75", position: 1 }));
  const r = bodyOf(await f.tool.call("leetcode_judge", { problem_token: intake.problem_token, solution_code: code }));
  assert.equal(r.status, "Wrong Answer"); assert.equal(r.accepted_proof, undefined);
});
test("mismatched submitted code or question never yields Accepted proof", async () => {
  for (const options of [{ differentCode: true }, { differentProblem: true }]) {
    const f = fixture(options); const intake = bodyOf(await f.tool.call("leetcode_problem", { track: "blind75", position: 1 }));
    const r = await f.tool.call("leetcode_judge", { problem_token: intake.problem_token, solution_code: code });
    assert.equal(r.isError, true); assert.match(r.content[0].text, /blocked_verification/);
  }
});
test("pending submission resumes after a process restart without resubmitting", async () => {
  const f = fixture({ pending: true }); const intake = bodyOf(await f.tool.call("leetcode_problem", { track: "blind75", position: 1 }));
  const args = { problem_token: intake.problem_token, solution_code: code };
  assert.equal(bodyOf(await f.tool.call("leetcode_judge", args)).status, "pending");
  const next = f.make();
  assert.equal(bodyOf(await next.call("leetcode_judge", args)).status, "pending");
  assert.equal(f.calls.filter(([u]) => u.endsWith("submit/")).length, 1); assert.equal(f.reservations, 1);
});
test("exhausted submission budget stops before POST; HTTP 403 hides upstream content", async () => {
  const f = fixture({ exhausted: true }); const intake = bodyOf(await f.tool.call("leetcode_problem", { track: "blind75", position: 1 }));
  assert.equal((await f.tool.call("leetcode_judge", { problem_token: intake.problem_token, solution_code: code })).isError, true);
  assert.equal(f.calls.filter(([u]) => u.endsWith("submit/")).length, 0);
  const r = await fixture({ http: 403 }).tool.call("leetcode_problem", { track: "potd" });
  assert.match(r.content[0].text, /403/); assert.doesNotMatch(r.content[0].text, /sensitive/);
});
