// Minimal GitHub REST client for the office: start runs, cancel runs, read the publishing repo.
import type { DeployInfo, ProposalDetail, ProposalFile, ProposalSummary } from "@office/protocol";
// @ts-expect-error Node's native TypeScript test runner needs the file extension.
import { markdownTitle, needsDeploy, proposalKind, validBranch, validRun } from "./proposals.ts";

export interface GhEnv { GITHUB_TOKEN: string; GITHUB_REPO: string; AI_COURSE_REPO: string }

function headers(env: GhEnv, accept = "application/vnd.github+json"): HeadersInit {
  return {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: accept,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "content-office",
  };
}

async function github(env: GhEnv, path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`https://api.github.com/repos/${env.GITHUB_REPO}${path}`, { ...init, headers: { ...headers(env), ...(init.body ? { "Content-Type": "application/json" } : {}), ...init.headers } });
}

async function githubJson<T>(env: GhEnv, path: string, init: RequestInit = {}): Promise<T> {
  const r = await github(env, path, init);
  if (!r.ok) throw new Error(`GitHub ${path} failed (${r.status}): ${(await r.text()).slice(0, 200)}`);
  return r.json() as Promise<T>;
}

type GhFile = { filename: string; status: string; additions: number; deletions: number; patch?: string };
type Compare = { ahead_by: number; behind_by: number; files?: GhFile[]; commits?: { commit: { message: string; committer?: { date?: string } } }[]; head_commit?: { sha: string; commit?: { committer?: { date?: string }; message?: string } } };

async function proposalMarkdown(env: GhEnv, run: string, branch: string): Promise<string | null> {
  const path = `teams/hq/proposals/${run}.md`;
  const r = await github(env, `/contents/${path}?ref=${encodeURIComponent(branch)}`, { headers: headers(env, "application/vnd.github.raw") });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub proposal markdown failed (${r.status})`);
  return (await r.text()).slice(0, 12000);
}

async function proposal(env: GhEnv, branch: string, detail: boolean): Promise<ProposalDetail> {
  const run = branch.slice("proposal/".length);
  const [compare, md] = await Promise.all([
    githubJson<Compare>(env, `/compare/main...${encodeURIComponent(branch)}`),
    proposalMarkdown(env, run, branch),
  ]);
  const files = compare.files ?? [];
  const paths = files.map((f) => f.filename);
  const subject = (compare.commits?.[0]?.commit.message ?? compare.head_commit?.commit?.message ?? branch).split("\n")[0];
  const named = subject.match(/^office: ([a-z][a-z0-9-]*) (?:work|proposal)\b/)?.[1];
  const team = named ?? paths[0]?.match(/^teams\/([^/]+)\//)?.[1] ?? null;
  const heading = md ? markdownTitle(md) : { title: null, summary: null };
  return {
    branch, run_id: run, team, title: heading.title ?? subject, summary: heading.summary,
    files: files.length, additions: files.reduce((n, f) => n + f.additions, 0), deletions: files.reduce((n, f) => n + f.deletions, 0),
    updated_at: Date.parse(compare.head_commit?.commit?.committer?.date ?? compare.commits?.at(-1)?.commit.committer?.date ?? "") || 0,
    kind: proposalKind(paths), needs_deploy: needsDeploy(paths), behind_by: compare.behind_by ?? 0, conflicts: null,
    proposal_md: md, files_list: detail ? files.slice(0, 60).map((f): ProposalFile => ({ path: f.filename, status: (["added", "removed", "renamed"].includes(f.status) ? f.status : "modified") as ProposalFile["status"], additions: f.additions, deletions: f.deletions, patch: f.patch?.slice(0, 4000) ?? null })) : [],
  };
}

export async function listProposals(env: GhEnv): Promise<ProposalSummary[]> {
  const branches = await githubJson<{ name: string; commit: { sha: string } }[]>(env, "/branches?per_page=100");
  const selected = branches.filter((b) => validBranch(b.name)).sort((a, b) => b.name.localeCompare(a.name)).slice(0, 40);
  const result: ProposalSummary[] = [];
  for (let i = 0; i < selected.length; i += 6) {
    const chunk = await Promise.all(selected.slice(i, i + 6).map(async (b): Promise<ProposalSummary> => {
      try { const { proposal_md, files_list, ...summary } = await proposal(env, b.name, false); return summary; }
      catch { return { branch: b.name, run_id: b.name.slice(9), team: null, title: b.name, summary: null, files: 0, additions: 0, deletions: 0, updated_at: 0, kind: "content", needs_deploy: false, behind_by: 0, conflicts: null }; }
    }));
    result.push(...chunk);
  }
  return result.sort((a, b) => b.updated_at - a.updated_at);
}

export async function getProposal(env: GhEnv, run: string): Promise<ProposalDetail | null> {
  if (!validRun(run)) return null;
  const branch = `proposal/${run}`;
  const r = await github(env, `/branches/${encodeURIComponent(branch)}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub branch read failed (${r.status})`);
  return proposal(env, branch, true);
}

export async function deleteProposal(env: GhEnv, run: string): Promise<boolean> {
  if (!validRun(run)) return false;
  const r = await github(env, `/git/refs/heads/proposal/${run}`, { method: "DELETE" });
  if (r.status === 404) return false;
  if (!r.ok) throw new Error(`GitHub branch delete failed (${r.status})`);
  return true;
}

export async function mergeProposal(env: GhEnv, run: string): Promise<{ commit: string; needs_deploy: boolean } | { conflict: true }> {
  const detail = await getProposal(env, run);
  if (!detail) throw new Error("proposal not found");
  const r = await github(env, "/merges", { method: "POST", body: JSON.stringify({ base: "main", head: detail.branch, commit_message: `Merge ${detail.branch}: ${detail.title}` }) });
  if (r.status === 409) return { conflict: true };
  if (r.status !== 201 && r.status !== 204) throw new Error(`GitHub merge failed (${r.status}): ${(await r.text()).slice(0, 200)}`);
  const commit = r.status === 201 ? ((await r.json()) as { sha: string }).sha : (await githubJson<{ commit: { sha: string } }>(env, `/branches/main`)).commit.sha;
  await deleteProposal(env, run).catch(() => undefined);
  return { commit, needs_deploy: detail.needs_deploy };
}

export async function latestDeploy(env: GhEnv): Promise<DeployInfo> {
  const r = await github(env, "/actions/workflows/deploy.yml/runs?per_page=1");
  if (r.status === 404) return { status: "none", run_url: null, commit: null, started_at: null };
  if (!r.ok) throw new Error(`GitHub deploy read failed (${r.status})`);
  const run = ((await r.json()) as { workflow_runs: { status: string; conclusion: string | null; html_url: string; head_sha: string; created_at: string; run_started_at?: string }[] }).workflow_runs[0];
  if (!run) return { status: "none", run_url: null, commit: null, started_at: null };
  return { status: run.status === "completed" ? (run.conclusion === "success" ? "success" : "failure") : ["queued", "waiting", "requested", "pending"].includes(run.status) ? "queued" : "running", run_url: run.html_url, commit: run.head_sha, started_at: Date.parse(run.run_started_at ?? run.created_at) || null };
}

export async function dispatchDeploy(env: GhEnv): Promise<void> {
  const r = await github(env, "/actions/workflows/deploy.yml/dispatches", { method: "POST", body: JSON.stringify({ ref: "main" }) });
  if (r.status !== 204) throw new Error(`GitHub deploy dispatch failed (${r.status})`);
}

export async function workflowLog(env: GhEnv, ghRunId: string, grep: string | null, tail: number): Promise<string> {
  if (!/^\d{1,20}$/.test(ghRunId)) throw new Error("bad GitHub run id");
  const jobs = await githubJson<{ jobs: { id: number; name: string }[] }>(env, `/actions/runs/${ghRunId}/jobs?per_page=100`);
  let pattern: RegExp | null = null;
  if (grep) { try { pattern = new RegExp(grep, "i"); } catch { pattern = new RegExp(grep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"); } }
  const sections = await Promise.all(jobs.jobs.slice(0, 30).map(async (job) => {
    const r = await github(env, `/actions/jobs/${job.id}/logs`);
    if (!r.ok) return `# ${job.name}\nLogs unavailable (${r.status}).`;
    const lines = (await r.text()).split("\n").map((s) => s.replace(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z\s*/, ""));
    return `# ${job.name}\n${(pattern ? lines.filter((s) => pattern!.test(s)) : lines).slice(-Math.min(2000, Math.max(1, tail))).join("\n")}`;
  }));
  return sections.join("\n\n").slice(0, 60_000);
}

/** Desk runs (chat, planning, scripts) and studio runs (build one reel) have their own workflow. */
export const WORKFLOWS = { desk: "office-run.yml", studio: "office-studio.yml" } as const;

/** Start a run on GitHub. Returns the GitHub run id when GitHub reports it. */
export async function dispatchRun(
  env: GhEnv, inputs: { run_id: string; team: string; profile: string; item?: string },
): Promise<{ gh_run_id: string | null; url: string | null }> {
  const studio = inputs.profile === "studio";
  const workflow = studio ? WORKFLOWS.studio : WORKFLOWS.desk;
  const body = studio
    ? { run_id: inputs.run_id, team: inputs.team, item: inputs.item ?? "" }
    : { run_id: inputs.run_id, team: inputs.team, profile: inputs.profile };
  const r = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/actions/workflows/${workflow}/dispatches`, {
    method: "POST",
    headers: { ...headers(env), "Content-Type": "application/json" },
    body: JSON.stringify({ ref: "main", inputs: body, return_run_details: true }),
  });
  if (r.status === 204) return { gh_run_id: null, url: null };
  if (!r.ok) throw new Error(`GitHub refused to start the run (${r.status}): ${(await r.text()).slice(0, 300)}`);
  const j = (await r.json().catch(() => ({}))) as { workflow_run_id?: number; html_url?: string };
  return { gh_run_id: j.workflow_run_id ? String(j.workflow_run_id) : null, url: j.html_url ?? null };
}

/** Floors whose reels the publishing repo can post: ai-course's scripts/publish_teams.py knows each of them (handle, secrets, Facebook and YouTube switches). */
export const PUBLISHING_TEAMS: readonly string[] = ["learnai", "dsa", "systemdesign"];
/** The one floor with slot posting (the slot poster, post_schedule and its pause switch) and with the shared copy of state/learnings.md in the publishing repo. */
export const SLOT_TEAM = "learnai";

/** The publishing repo of a team's floor (null: the floor has no publisher yet, so its calendar shows the pipeline only). */
export function publishRepo(env: GhEnv, team: string): string | null {
  return PUBLISHING_TEAMS.includes(team) && env.AI_COURSE_REPO ? env.AI_COURSE_REPO : null;
}

/** The publishing repo that keeps a copy of the team's state/learnings.md: learnai's only (the other floors' lessons must not reach learnai's agents). */
export function learningsRepo(env: GhEnv, team: string): string | null {
  return team === SLOT_TEAM && env.AI_COURSE_REPO ? env.AI_COURSE_REPO : null;
}

/** Start a workflow of the publishing repo. Only the owner's buttons call this (owner session routes), never an agent. */
export async function dispatchPublisher(
  env: GhEnv, repo: string, workflow: string, inputs: Record<string, string>,
): Promise<{ gh_run_id: string | null; url: string | null }> {
  const r = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/${workflow}/dispatches`, {
    method: "POST",
    headers: { ...headers(env), "Content-Type": "application/json" },
    body: JSON.stringify({ ref: "main", inputs, return_run_details: true }),
  });
  if (r.status === 204) return { gh_run_id: null, url: null };
  if (!r.ok) throw new Error(`GitHub refused to start ${workflow} (${r.status}): ${(await r.text()).slice(0, 300)}`);
  const j = (await r.json().catch(() => ({}))) as { workflow_run_id?: number; html_url?: string };
  return { gh_run_id: j.workflow_run_id ? String(j.workflow_run_id) : null, url: j.html_url ?? null };
}

/** State of one GitHub run of a repo: null when it cannot be read. */
export async function runOutcome(env: GhEnv, repo: string, ghRunId: string): Promise<{ done: boolean; ok: boolean; url: string | null } | null> {
  const r = await fetch(`https://api.github.com/repos/${repo}/actions/runs/${ghRunId}`, { headers: headers(env) });
  if (!r.ok) return null;
  const j = (await r.json()) as { status?: string; conclusion?: string | null; html_url?: string };
  return { done: j.status === "completed", ok: j.conclusion === "success", url: j.html_url ?? null };
}

const utf8ToB64 = (s: string) => {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 8192) bin += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(bin);
};
const b64ToUtf8 = (b64: string) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, "")), (c) => c.charCodeAt(0)));

/**
 * Change one text file of a repo on main with a commit: `build` gets the current text and returns the new text, or null for "nothing to change".
 * Retries when someone else committed in between. Returns the commit sha, or null when nothing changed.
 */
export async function editRepoFile(env: GhEnv, repo: string, path: string, build: (existing: string) => string | null, message: string): Promise<string | null> {
  const url = `https://api.github.com/repos/${repo}/contents/${path}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const g = await fetch(`${url}?ref=main`, { headers: headers(env) });
    if (!g.ok && g.status !== 404) throw new Error(`could not read ${repo}/${path} (${g.status})`);
    const cur = g.status === 404 ? null : (await g.json()) as { sha: string; content: string };
    const next = build(cur ? b64ToUtf8(cur.content) : "");
    if (next === null) return null;
    const p = await fetch(url, {
      method: "PUT",
      headers: { ...headers(env), "Content-Type": "application/json" },
      body: JSON.stringify({ message, content: utf8ToB64(next), ...(cur ? { sha: cur.sha } : {}), branch: "main" }),
    });
    if (p.ok) return ((await p.json()) as { commit: { sha: string } }).commit.sha;
    if (p.status !== 409 && p.status !== 422) throw new Error(`could not write ${repo}/${path} (${p.status}): ${(await p.text()).slice(0, 200)}`);
  }
  throw new Error(`${repo}/${path} kept changing; try again`);
}

/**
 * One asset of a (private) release as a response the phone's video player can play and seek: GitHub answers the asset request with a signed
 * redirect, which is then fetched with the Range header (iOS needs ranges). Only owner-session routes use it.
 */
export async function releaseAssetResponse(env: GhEnv, repo: string, tag: string, name: string, type: string, range: string | null): Promise<Response> {
  const rel = await fetch(`https://api.github.com/repos/${repo}/releases/tags/${encodeURIComponent(tag)}`, { headers: headers(env) });
  if (!rel.ok) return new Response("not found", { status: 404 });
  const asset = ((await rel.json()) as { assets?: { id: number; name: string }[] }).assets?.find((a) => a.name === name);
  if (!asset) return new Response("not found", { status: 404 });
  const first = await fetch(`https://api.github.com/repos/${repo}/releases/assets/${asset.id}`, { headers: headers(env, "application/octet-stream"), redirect: "manual" });
  const signed = first.headers.get("Location");
  const src = signed ? await fetch(signed, { headers: range ? { Range: range } : {} }) : first;
  if (!src.ok && src.status !== 206) return new Response("not found", { status: 404 });
  const h = new Headers({ "Content-Type": type, "Accept-Ranges": "bytes", "Cache-Control": "private, max-age=300" });
  for (const k of ["Content-Length", "Content-Range"]) { const v = src.headers.get(k); if (v) h.set(k, v); }
  return new Response(src.body, { status: src.status, headers: h });
}

export async function cancelRun(env: GhEnv, ghRunId: string): Promise<void> {
  await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/actions/runs/${ghRunId}/cancel`, { method: "POST", headers: headers(env) });
}

// Files of the private publishing repo that agents may read (never credentials, engagement drafts or competitor dumps).
const AI_COURSE_ALLOWED =
  /^(state\/[\w.-]+\.(json|md)|roadmap\/[\w.-]+\.json|reels\/[\w-]+\/(script\.txt|spec\.json|visual_plan\.md)|social\/[\w.-]+\.txt|docs-notes\/[\w.-]+\.md)$/;
const MAX_CHARS = 400_000;

export async function readAiCourse(env: GhEnv, path: string): Promise<string> {
  const clean = path.replace(/^\/+/, "");
  if (!AI_COURSE_ALLOWED.test(clean) || clean.includes("..")) {
    throw new Error(`not readable from the office: ${clean}`);
  }
  const r = await fetch(`https://api.github.com/repos/${env.AI_COURSE_REPO}/contents/${clean}?ref=main`, {
    headers: headers(env, "application/vnd.github.raw"),
  });
  if (r.status === 404) throw new Error(`not found in ai-course: ${clean}`);
  if (!r.ok) throw new Error(`ai-course read failed (${r.status})`);
  const text = await r.text();
  return text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) + `\n\n[truncated: ${text.length} characters in total]` : text;
}
