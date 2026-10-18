// The office Worker: serves the PWA, the owner's API, the runner endpoints and the GitHub webhook.
import { Hono, type Context } from "hono";
import { hmacHex, makeSession, readSession, sessionCookie, timingSafeEqual } from "./auth";
import { readAiCourse, releaseAssetResponse, WORKFLOWS } from "./github";
import { verifyGithubOidc } from "./oidc";
import { Office, type Env } from "./office";
import { TEAMS, team as getTeam } from "./teams";

export { Office };

type C = Context<{ Bindings: Env; Variables: { owner: string } }>;
const app = new Hono<{ Bindings: Env; Variables: { owner: string } }>();

const office = (env: Env, slug: string) => env.OFFICE.get(env.OFFICE.idFromName(slug));
const bad = (c: C, status: 400 | 401 | 403 | 404 | 409 | 429 | 500, error: string) => c.json({ error }, status);
const MAX_LOGIN_FAILS = 5;
const LOGIN_LOCK_SECONDS = 15 * 60;

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: err.message || "server error" }, 500);
});

// ---------- owner login ----------
app.post("/api/login", async (c) => {
  // Wrong keys are counted per network (KV, 15 minutes); after 5 the network waits.
  const failKey = `login-fail:${c.req.header("CF-Connecting-IP") ?? "unknown"}`;
  const fails = Number((await c.env.TRANSCRIPTS.get(failKey)) ?? "0");
  if (fails >= MAX_LOGIN_FAILS) return bad(c, 429, "Too many wrong tries. Wait 15 minutes and try again.");
  const { key } = await c.req.json<{ key?: string }>().catch(() => ({ key: undefined }));
  if (!key || !c.env.OWNER_KEY || !timingSafeEqual(key.trim(), c.env.OWNER_KEY)) {
    await c.env.TRANSCRIPTS.put(failKey, String(fails + 1), { expirationTtl: LOGIN_LOCK_SECONDS });
    await new Promise((r) => setTimeout(r, 800));
    return bad(c, 401, "wrong key");
  }
  if (fails) await c.env.TRANSCRIPTS.delete(failKey);
  c.header("Set-Cookie", sessionCookie(await makeSession(c.env.SESSION_SECRET, c.env.OWNER_LOGIN)));
  return c.json({ ok: true, owner: c.env.OWNER_LOGIN });
});

app.post("/api/logout", (c) => {
  c.header("Set-Cookie", sessionCookie("", true));
  return c.json({ ok: true });
});

// Every owner route below needs the session cookie; state-changing requests must come from this origin.
app.use("/api/teams/*", async (c, next) => {
  const owner = await readSession(c.env.SESSION_SECRET, c.req.header("Cookie") ?? null);
  if (!owner) return bad(c, 401, "login required");
  if (c.req.method !== "GET") {
    const origin = c.req.header("Origin");
    if (origin && origin !== new URL(c.req.url).origin) return bad(c, 403, "bad origin");
  }
  c.set("owner", owner);
  await next();
});
app.get("/api/me", async (c) => {
  const owner = await readSession(c.env.SESSION_SECRET, c.req.header("Cookie") ?? null);
  return owner ? c.json({ owner, teams: Object.values(TEAMS).map((t) => ({ slug: t.slug, name: t.name })) }) : bad(c, 401, "login required");
});

// ---------- owner API ----------
const teamOr404 = (c: C) => (getTeam(c.req.param("team") ?? "") ? (c.req.param("team") as string) : null);

app.get("/api/teams/:team/state", async (c) => {
  const slug = teamOr404(c);
  if (!slug) return bad(c, 404, "no such team");
  return c.json(await office(c.env, slug).getState(slug));
});

app.get("/api/teams/:team/threads/:id", async (c) => {
  const slug = teamOr404(c);
  if (!slug) return bad(c, 404, "no such team");
  const t = await office(c.env, slug).getThread(slug, c.req.param("id"));
  return t ? c.json(t) : bad(c, 404, "no such thread");
});

app.post("/api/teams/:team/messages", async (c) => {
  const slug = teamOr404(c);
  if (!slug) return bad(c, 404, "no such team");
  const body = await c.req.json<{ thread_id?: string; agent?: string; text?: string }>();
  if (!body.text?.trim()) return bad(c, 400, "empty message");
  if (body.text.length > 20_000) return bad(c, 400, "message too long");
  return c.json(await office(c.env, slug).postMessage(slug, { thread_id: body.thread_id ?? null, agent: body.agent, text: body.text }));
});

app.post("/api/teams/:team/day", async (c) => {
  const slug = teamOr404(c);
  if (!slug) return bad(c, 404, "no such team");
  return c.json(await office(c.env, slug).startDay(slug));
});

app.post("/api/teams/:team/resume", async (c) => {
  const slug = teamOr404(c);
  if (!slug) return bad(c, 404, "no such team");
  return c.json(await office(c.env, slug).resume(slug));
});

app.post("/api/teams/:team/sync", async (c) => {
  const slug = teamOr404(c);
  if (!slug) return bad(c, 404, "no such team");
  return c.json(await office(c.env, slug).startSync(slug));
});

// The content calendar of a floor, and the owner's posting buttons (post now, put on a slot, pause or resume the slot posting).
// These routes need the owner's session cookie and this origin; no runner or agent identity reaches them.
app.get("/api/teams/:team/calendar", async (c) => {
  const slug = teamOr404(c);
  if (!slug) return bad(c, 404, "no such team");
  return c.json(await office(c.env, slug).calendar(slug));
});

// Watch a reel before it is posted: its video, cover and the texts that would go out. For a reel released in the private publishing repo the
// video and cover are streamed from its release through the owner's session (the file is not public).
app.get("/api/teams/:team/preview/:item", async (c) => {
  const slug = teamOr404(c);
  if (!slug) return bad(c, 404, "no such team");
  try {
    return c.json(await office(c.env, slug).previewInfo(slug, c.req.param("item")));
  } catch (e) {
    return bad(c, 404, (e as Error).message);
  }
});

app.get("/api/teams/:team/preview/:item/:kind", async (c) => {
  const slug = teamOr404(c);
  const kind = c.req.param("kind");
  if (!slug || (kind !== "video" && kind !== "cover")) return bad(c, 404, "not found");
  const a = await office(c.env, slug).previewAsset(slug, c.req.param("item"), kind);
  if (!a) return bad(c, 404, "not found");
  return releaseAssetResponse(c.env, a.repo, a.tag, a.name, a.type, c.req.header("Range") ?? null);
});

app.post("/api/teams/:team/publish", async (c) => {
  const slug = teamOr404(c);
  if (!slug) return bad(c, 404, "no such team");
  const body = await c.req.json<{ item?: string; mode?: string; date?: string; time?: string }>().catch(() => ({} as Record<string, string | undefined>));
  if (typeof body.item !== "string" || (body.mode !== "now" && body.mode !== "slot")) return bad(c, 400, "item and mode (now or slot) are required");
  try {
    return c.json(await office(c.env, slug).publish(slug, { item: body.item, mode: body.mode, date: body.date, time: body.time }));
  } catch (e) {
    return bad(c, 400, (e as Error).message);
  }
});

app.post("/api/teams/:team/posting", async (c) => {
  const slug = teamOr404(c);
  if (!slug) return bad(c, 404, "no such team");
  const { paused } = await c.req.json<{ paused?: boolean }>().catch(() => ({ paused: undefined }));
  if (typeof paused !== "boolean") return bad(c, 400, "paused (true or false) is required");
  try {
    return c.json(await office(c.env, slug).setPosting(slug, paused));
  } catch (e) {
    return bad(c, 400, (e as Error).message);
  }
});

app.post("/api/teams/:team/asks/:id", async (c) => {
  const slug = teamOr404(c);
  if (!slug) return bad(c, 404, "no such team");
  const answer = await c.req.json<Record<string, unknown>>();
  return c.json(await office(c.env, slug).answerAsk(slug, c.req.param("id"), answer));
});

app.post("/api/teams/:team/runs/:id/stop", async (c) => {
  const slug = teamOr404(c);
  if (!slug) return bad(c, 404, "no such team");
  const { mode } = await c.req.json<{ mode?: "interrupt" | "end" }>().catch(() => ({ mode: undefined }));
  return c.json(await office(c.env, slug).stopRun(slug, c.req.param("id"), mode === "end" ? "end" : "interrupt"));
});

app.post("/api/teams/:team/tasks/:id", async (c) => {
  const slug = teamOr404(c);
  if (!slug) return bad(c, 404, "no such team");
  const { action } = await c.req.json<{ action?: "start" | "dismiss" }>();
  return c.json(await office(c.env, slug).taskAction(slug, c.req.param("id"), action === "start" ? "start" : "dismiss"));
});

app.get("/api/teams/:team/ws", async (c) => {
  const slug = teamOr404(c);
  if (!slug) return bad(c, 404, "no such team");
  if (c.req.header("Upgrade") !== "websocket") return bad(c, 400, "websocket expected");
  return office(c.env, slug).fetch(new Request(`https://office/client?team=${slug}`, c.req.raw));
});

// ---------- runner ----------
async function runnerIdentity(c: C, slug: string): Promise<{ ghRunId: string | null }> {
  const auth = c.req.header("Authorization") ?? "";
  const dev = c.req.header("X-Dev-Runner-Key");
  if (dev && c.env.DEV_RUNNER_KEY && timingSafeEqual(dev, c.env.DEV_RUNNER_KEY)) return { ghRunId: null };
  if (!auth.startsWith("Bearer ")) throw new Error("runner identity required");
  const claims = await verifyGithubOidc(auth.slice(7), {
    audience: c.env.OIDC_AUDIENCE, repo: c.env.GITHUB_REPO, workflowFiles: Object.values(WORKFLOWS), actor: c.env.OWNER_LOGIN,
  });
  if (!getTeam(slug)) throw new Error("no such team");
  return { ghRunId: claims.run_id };
}

async function runToken(c: C): Promise<{ slug: string; runId: string } | null> {
  const slug = c.req.query("team") ?? "";
  const runId = c.req.query("run") ?? "";
  const token = c.req.query("token") ?? c.req.header("X-Run-Token") ?? "";
  if (!getTeam(slug) || !runId || !token) return null;
  return (await office(c.env, slug).verifyRunToken(runId, token)) ? { slug, runId } : null;
}

app.post("/api/runner/claim", async (c) => {
  const { team, run_id } = await c.req.json<{ team: string; run_id: string }>();
  let ghRunId: string | null;
  try {
    ({ ghRunId } = await runnerIdentity(c, team));
  } catch (e) {
    return bad(c, 403, (e as Error).message);
  }
  try {
    return c.json(await office(c.env, team).claim(team, run_id, ghRunId));
  } catch (e) {
    return bad(c, 409, (e as Error).message);
  }
});

app.post("/api/runner/saved", async (c) => {
  const body = await c.req.json<{ team: string; run_id: string; commit?: string; files?: number; proposal_branch?: string; note?: string }>();
  try {
    await runnerIdentity(c, body.team);
  } catch (e) {
    return bad(c, 403, (e as Error).message);
  }
  await office(c.env, body.team).runnerSaved(body.team, body.run_id, body);
  return c.json({ ok: true });
});

app.get("/api/runner/ws", async (c) => {
  const slug = c.req.query("team") ?? "";
  if (!getTeam(slug)) return bad(c, 404, "no such team");
  if (c.req.header("Upgrade") !== "websocket") return bad(c, 400, "websocket expected");
  const u = new URL(c.req.url);
  return office(c.env, slug).fetch(new Request(`https://office/runner${u.search}`, c.req.raw));
});

app.put("/api/runner/transcript", async (c) => {
  const id = await runToken(c);
  if (!id) return bad(c, 403, "bad run token");
  const body = await c.req.arrayBuffer();
  if (body.byteLength > 24 * 1024 * 1024) return bad(c, 400, "transcript too large");
  const key = `transcript/${id.slug}/${id.runId}.jsonl.gz`;
  await c.env.TRANSCRIPTS.put(key, body, { expirationTtl: 60 * 60 * 24 * 30 });
  return c.json({ key });
});

app.get("/api/runner/transcript", async (c) => {
  const id = await runToken(c);
  if (!id) return bad(c, 403, "bad run token");
  const key = c.req.query("key") ?? "";
  if (!key.startsWith(`transcript/${id.slug}/`)) return bad(c, 403, "not this team's transcript");
  const data = await c.env.TRANSCRIPTS.get(key, "arrayBuffer");
  return data ? new Response(data, { headers: { "Content-Type": "application/gzip" } }) : bad(c, 404, "transcript expired");
});

// An agent teaches the team what the owner just corrected (office tool record_learning). Accepted only for a quote that is the owner's own.
app.post("/api/runner/learning", async (c) => {
  const id = await runToken(c);
  if (!id) return bad(c, 403, "bad run token");
  const body = await c.req.json<{ rule?: string; owner_said?: string }>().catch(() => ({} as { rule?: string; owner_said?: string }));
  const r = await office(c.env, id.slug).recordLearning(id.slug, id.runId, body);
  return c.json(r, r.ok ? 200 : 400);
});

// A desk hands a reel to the studio (office tool request_build).
app.post("/api/runner/build", async (c) => {
  const id = await runToken(c);
  if (!id) return bad(c, 403, "bad run token");
  const body = await c.req.json<{ item_id: string; item?: unknown; script?: string; notes?: string }>();
  try {
    return c.json(await office(c.env, id.slug).requestBuild(id.slug, id.runId, body));
  } catch (e) {
    return bad(c, 400, (e as Error).message);
  }
});

// The studio's final job (GitHub OIDC): the gate result, the media and the texts of the reel.
app.post("/api/runner/final", async (c) => {
  const body = await c.req.json<{ team: string; run_id: string; ok: boolean; item: string }>();
  try {
    await runnerIdentity(c, body.team);
  } catch (e) {
    return bad(c, 403, (e as Error).message);
  }
  await office(c.env, body.team).finalReport(body.team, body.run_id, body);
  return c.json({ ok: true });
});

app.get("/api/runner/feed", async (c) => {
  const id = await runToken(c);
  if (!id) return bad(c, 403, "bad run token");
  return c.text(await office(c.env, id.slug).feed(id.slug, id.runId, c.req.query("thread") ?? null));
});

app.get("/api/runner/ai-course", async (c) => {
  const id = await runToken(c);
  if (!id) return bad(c, 403, "bad run token");
  try {
    return c.text(await readAiCourse(c.env, c.req.query("path") ?? ""));
  } catch (e) {
    return bad(c, 404, (e as Error).message);
  }
});

// ---------- GitHub webhook (workflow_run): catches runs that end without reporting ----------
app.post("/api/github/webhook", async (c) => {
  const raw = new Uint8Array(await c.req.arrayBuffer());
  const sig = c.req.header("X-Hub-Signature-256") ?? "";
  if (!c.env.WEBHOOK_SECRET || !timingSafeEqual(sig, `sha256=${await hmacHex(c.env.WEBHOOK_SECRET, raw)}`)) return bad(c, 401, "bad signature");
  const event = c.req.header("X-GitHub-Event");
  const payload = JSON.parse(new TextDecoder().decode(raw));
  if (event === "workflow_run" && payload.action === "completed" && Object.values(WORKFLOWS).some((f) => payload.workflow_run?.path?.endsWith(f))) {
    // run-name is "office <team> <profile> <run_id>"
    const [, slug, , runId] = String(payload.workflow_run.display_title ?? "").split(" ");
    if (slug && runId && getTeam(slug)) {
      await office(c.env, slug).ghRunCompleted(slug, runId, String(payload.workflow_run.id), payload.workflow_run.conclusion ?? "unknown", payload.workflow_run.html_url ?? null);
    }
  }
  return c.json({ ok: true });
});

// Finished reels live as GitHub release assets (office-<team>-<item>) of this public repo. The office serves them with
// proper types and range requests so the phone's video player (iOS included) can play and seek them.
const MEDIA_TYPES: Record<string, string> = { mp4: "video/mp4", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg" };
app.get("/media/:team/:item/:file", async (c) => {
  const { team: slug, item, file } = c.req.param();
  const ext = file.split(".").pop()?.toLowerCase() ?? "";
  if (!getTeam(slug) || !/^[a-z]\d{2,4}$/.test(item) || !/^[\w.-]{1,120}$/.test(file) || !MEDIA_TYPES[ext]) return bad(c, 404, "not found");
  const url = `https://github.com/${c.env.GITHUB_REPO}/releases/download/office-${slug}-${item}/${encodeURIComponent(file)}`;
  const range = c.req.header("Range");
  const r = await fetch(url, { headers: range ? { Range: range } : {}, redirect: "follow" });
  if (!r.ok && r.status !== 206) return bad(c, 404, "not found");
  const h = new Headers({ "Content-Type": MEDIA_TYPES[ext], "Accept-Ranges": "bytes", "Cache-Control": "public, max-age=3600" });
  for (const k of ["Content-Length", "Content-Range"]) { const v = r.headers.get(k); if (v) h.set(k, v); }
  return new Response(r.body, { status: r.status, headers: h });
});

app.all("/api/*", (c) => bad(c, 404, "not found"));
app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
