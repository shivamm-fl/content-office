// Minimal GitHub REST client for the office: start runs, cancel runs, read the publishing repo.

export interface GhEnv { GITHUB_TOKEN: string; GITHUB_REPO: string; AI_COURSE_REPO: string }

function headers(env: GhEnv, accept = "application/vnd.github+json"): HeadersInit {
  return {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: accept,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "content-office",
  };
}

/** Start office-run.yml. Returns the GitHub run id when GitHub reports it. */
export async function dispatchRun(
  env: GhEnv, inputs: { run_id: string; team: string; profile: string },
): Promise<{ gh_run_id: string | null; url: string | null }> {
  const r = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/actions/workflows/office-run.yml/dispatches`, {
    method: "POST",
    headers: { ...headers(env), "Content-Type": "application/json" },
    body: JSON.stringify({ ref: "main", inputs, return_run_details: true }),
  });
  if (r.status === 204) return { gh_run_id: null, url: null };
  if (!r.ok) throw new Error(`GitHub refused to start the run (${r.status}): ${(await r.text()).slice(0, 300)}`);
  const j = (await r.json().catch(() => ({}))) as { workflow_run_id?: number; html_url?: string };
  return { gh_run_id: j.workflow_run_id ? String(j.workflow_run_id) : null, url: j.html_url ?? null };
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
