// Network and account credentials stay in the trusted bridge, outside the agent's environment.
// Enable only for an account/access arrangement that permits this integration. No challenge bypass.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { codeHash, codingTrack, potdId, readEvidence, signEvidence } from "../../apps/api/src/coding.ts";

export const LEETCODE_TOOLS = [
  { name: "leetcode_problem", description: "Fetch the current LeetCode POTD, or a Blind 75 problem by position (1–75), through the configured authorized account. Returns problem constraints, Python starter and signed intake. POTD dates are UTC. Never invent an intake or substitute a different problem.", inputSchema: { type: "object", properties: { track: { type: "string", enum: ["blind75", "potd"] }, position: { type: "integer", minimum: 1, maximum: 75 } }, required: ["track"] } },
  { name: "leetcode_judge", description: "Submit an original, locally tested Python solution to LeetCode and wait for the final verdict. Requires signed problem_token from leetcode_problem and exact solution_code. Only an actual Accepted result yields accepted_proof. A timeout is resumed, not blindly resubmitted. At most three submissions per item across runs.", inputSchema: { type: "object", properties: { problem_token: { type: "string" }, solution_code: { type: "string" } }, required: ["problem_token", "solution_code"] } },
];

export function makeLeetcode({ teamDir, env = process.env, fetch: request = fetch, now = () => new Date(), sleep = (ms) => new Promise((r) => setTimeout(r, ms)), reserveAttempt }) {
  // Freeze the canonical manifest before the agent can edit it.
  const manifest = JSON.parse(readFileSync(join(teamDir, "roadmap/blind75.json"), "utf8"));
  const active = new Set();
  const secret = env.CODING_PROOF_SECRET ?? "";
  function configured() {
    if (env.LEETCODE_AUTOMATION_AUTHORIZED !== "true") throw new Error("blocked_access: authorized LeetCode automation is not enabled; see docs-notes/coding-series.md");
    if (!env.LEETCODE_SESSION_COOKIE || !env.LEETCODE_CSRF_TOKEN || secret.length < 32) throw new Error("blocked_setup: LeetCode account credentials and CODING_PROOF_SECRET are required");
  }
  async function api(path, body) {
    const r = await request(`https://leetcode.com${path}`, {
      method: body ? "POST" : "GET", redirect: "error", signal: AbortSignal.timeout(30000),
      headers: { "Content-Type": "application/json", Referer: "https://leetcode.com/problemset/", "X-CSRFToken": env.LEETCODE_CSRF_TOKEN, Cookie: `LEETCODE_SESSION=${env.LEETCODE_SESSION_COOKIE}; csrftoken=${env.LEETCODE_CSRF_TOKEN}` },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!r.ok) throw new Error(`blocked_leetcode_http_${r.status}: account login, permission or service availability needs attention`);
    const data = await r.json().catch(() => { throw new Error("blocked_leetcode_response: expected JSON; no challenge bypass will be attempted"); });
    if (data.errors) throw new Error("blocked_leetcode_schema: the configured integration needs updating");
    return data;
  }
  const gql = async (query, variables = {}) => (await api("/graphql/", { query, variables })).data;
  async function problem(a) {
    configured();
    let slug, id, date = null;
    if (a.track === "blind75") {
      const row = manifest.problems.find((p) => p.position === a.position);
      if (!row) throw new Error("Blind 75 position must be 1–75");
      slug = row.slug; id = row.id;
    } else if (a.track === "potd") {
      const d = (await gql("query { activeDailyCodingChallengeQuestion { date question { titleSlug } } }"))?.activeDailyCodingChallengeQuestion;
      if (!d || d.date !== now().toISOString().slice(0, 10)) throw new Error("blocked_stale_daily: LeetCode did not return today's UTC challenge");
      date = d.date; slug = d.question?.titleSlug; id = potdId(date);
    } else throw new Error("unknown coding track");
    if (!/^[a-z0-9-]+$/.test(slug)) throw new Error("invalid LeetCode problem slug");
    const q = (await gql("query($slug: String!) { question(titleSlug: $slug) { questionId questionFrontendId title titleSlug difficulty isPaidOnly content exampleTestcases codeSnippets { langSlug code } } }", { slug }))?.question;
    if (!q?.content || q.titleSlug !== slug || !/^\d+$/.test(q.questionId)) throw new Error("blocked_problem: statement/constraints unavailable; account may need Premium");
    const starter = q.codeSnippets?.find((s) => s.langSlug === "python3")?.code;
    if (!starter) throw new Error("blocked_language: Python 3 is unavailable for this problem");
    const intake = { v: 1, kind: "problem", item: id, track: a.track, slug, question_id: q.questionId, challenge_date: date, fetched_at: now().toISOString() };
    return { id, track: a.track, ...(date ? { challenge_date: date } : { position: a.position }), problem: { slug, question_id: q.questionId, number: q.questionFrontendId, title: q.title, difficulty: q.difficulty, url: `https://leetcode.com/problems/${slug}/` }, statement_html: q.content, example_testcases: q.exampleTestcases, python_starter: starter, problem_token: await signEvidence(intake, secret) };
  }
  async function judge(a) {
    configured();
    const p = await readEvidence(a.problem_token, secret);
    if (p.kind !== "problem" || p.v !== 1 || codingTrack(p.item) !== p.track || !/^[a-z0-9-]+$/.test(p.slug) || !/^\d+$/.test(p.question_id)) throw new Error("invalid signed problem intake");
    if (p.track === "blind75" && !manifest.problems.some((r) => r.id === p.item && r.slug === p.slug)) throw new Error("problem is not the canonical Blind 75 entry");
    if (p.track === "potd" && potdId(p.challenge_date) !== p.item) throw new Error("POTD date mismatch");
    if (typeof a.solution_code !== "string" || !a.solution_code.trim() || a.solution_code.length > 60000) throw new Error("provide exact Python solution_code, at most 60,000 characters");
    const code = a.solution_code.replaceAll("\r\n", "\n");
    if (active.has(p.item)) throw new Error("this problem already has a submission in progress");
    active.add(p.item);
    try {
      const hash = await codeHash(code);
      const dir = join(teamDir, "state/judge"); mkdirSync(dir, { recursive: true });
      const file = join(dir, `${p.item}.json`);
      let pending = null;
      try { pending = await readEvidence(readFileSync(file, "utf8"), secret); } catch { /* first attempt or invalid untrusted cache */ }
      let sid;
      if (pending?.kind === "submitting" && pending.item === p.item) throw new Error("blocked_unknown_submission: an earlier submit has no confirmed id; inspect the account before sending another submission");
      if (pending?.kind === "submission" && pending.code_sha256 === hash && pending.slug === p.slug && pending.item === p.item) sid = pending.submission_id;
      else {
        if (!reserveAttempt) throw new Error("trusted attempt counter is unavailable");
        await reserveAttempt(p.item);
        writeFileSync(file, await signEvidence({ ...p, kind: "submitting", code_sha256: hash }, secret));
        const result = await api(`/problems/${p.slug}/submit/`, { lang: "python3", question_id: p.question_id, typed_code: code });
        sid = String(result.submission_id ?? "");
        if (!/^\d+$/.test(sid)) throw new Error("blocked_submit: LeetCode returned no submission id");
        writeFileSync(file, await signEvidence({ ...p, kind: "submission", code_sha256: hash, submission_id: sid }, secret));
      }
      let result;
      for (let i = 0; i < 30; i++) {
        result = await api(`/submissions/detail/${sid}/check/`);
        if (result.state === "SUCCESS") break;
        await sleep(2000);
      }
      if (result?.state !== "SUCCESS") return { status: "pending", submission_id: sid, message: "Call leetcode_judge again with the same intake and code to resume polling, without resubmission." };
      if (result.status_code !== 10 || result.status_msg !== "Accepted") {
        writeFileSync(file, await signEvidence({ ...p, kind: "finished", submission_id: sid }, secret));
        // Only explicit judge feedback; no cookies, HTML or raw network errors in the transcript.
        return { status: result.status_msg ?? "Rejected", submission_id: sid, total_correct: result.total_correct, total_testcases: result.total_testcases, input: result.last_testcase, expected: result.expected_output, actual: result.code_output, error: result.compile_error ?? result.runtime_error };
      }
      // Read the actual submitted code and question back from the account, not the agent's claim.
      const d = (await gql("query($id: Int!) { submissionDetails(submissionId: $id) { id code statusCode question { questionId titleSlug } lang { name } } }", { id: Number(sid) }))?.submissionDetails;
      if (String(d?.id) !== sid || d.statusCode !== 10 || d.question?.titleSlug !== p.slug || String(d.question?.questionId) !== p.question_id || await codeHash(d.code ?? "") !== hash || !/^Python3?$/i.test(d.lang?.name?.replaceAll(" ", "") ?? "")) throw new Error("blocked_verification: Accepted could not be bound to this exact submitted Python code and question");
      const proof = await signEvidence({ ...p, kind: "accepted", language: "python3", code_sha256: hash, submission_id: sid, status: "Accepted", verified_at: now().toISOString(), total_testcases: result.total_testcases }, secret);
      return { status: "Accepted", accepted_proof: proof, submission_id: sid, submission_url: `https://leetcode.com/submissions/detail/${sid}/`, solution_code: code };
    } finally { active.delete(p.item); }
  }
  return { async call(name, a) { try { return { content: [{ type: "text", text: JSON.stringify(await (name === "leetcode_problem" ? problem(a) : judge(a))) }] }; } catch (e) { return { isError: true, content: [{ type: "text", text: e.message.startsWith("blocked_") ? e.message : String(e.message).slice(0, 300) }] }; } } };
}
