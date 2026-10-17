// One Office Durable Object per team: the team's threads, messages, runs, desks, questions and tasks
// (SQLite), and the live room that the phone (client sockets) and the runners (runner sockets) join.
import { DurableObject } from "cloudflare:workers";
import type {
  Ask, Desk, Message, MessageKind, OfficeState, Profile, RoomEvent, Run, RunStatus, RunnerCommand, RunnerEvent,
  Task, Team, Thread, Usage,
} from "@office/protocol";
import { randomToken, sha256Hex, timingSafeEqual } from "./auth";
import { cancelRun, dispatchRun } from "./github";
import { team as getTeam } from "./teams";

export interface Env {
  OFFICE: DurableObjectNamespace<Office>;
  TRANSCRIPTS: KVNamespace;
  ASSETS: Fetcher;
  GITHUB_TOKEN: string;
  GITHUB_REPO: string;
  AI_COURSE_REPO: string;
  OWNER_LOGIN: string;
  OWNER_KEY: string;
  SESSION_SECRET: string;
  WEBHOOK_SECRET: string;
  OIDC_AUDIENCE: string;
  DEV_RUNNER_KEY?: string;
  DISPATCH_MODE?: string;
  MAX_PARALLEL_RUNS?: string;
  IDLE_MINUTES?: string;
}

const ACTIVE: RunStatus[] = ["queued", "starting", "live", "idle", "blocked_limit"];
const ACTIVE_SQL = `('queued','starting','live','idle','blocked_limit')`;
const START_TIMEOUT_MS = 15 * 60_000;
const LOST_AFTER_MS = 3 * 60_000;

const newId = (p: string) => `${p}_${Date.now().toString(36)}${randomToken(5).replace(/[-_]/g, "x")}`;

type Row = Record<string, SqlStorageValue>;

export class Office extends DurableObject<Env> {
  private sql: SqlStorage;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    ctx.blockConcurrencyWhile(async () => this.migrate());
  }

  // ---------- storage ----------
  private migrate() {
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT);
      CREATE TABLE IF NOT EXISTS threads (id TEXT PRIMARY KEY, agent TEXT NOT NULL, title TEXT NOT NULL, kind TEXT NOT NULL DEFAULT 'chat',
        created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, last_run TEXT, session_id TEXT, transcript_key TEXT, preview TEXT);
      CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, thread_id TEXT NOT NULL, run_id TEXT, author TEXT NOT NULL, kind TEXT NOT NULL,
        body TEXT NOT NULL, parent TEXT, created_at INTEGER NOT NULL, delivered INTEGER NOT NULL DEFAULT 1, tool_id TEXT);
      CREATE INDEX IF NOT EXISTS messages_thread ON messages (thread_id, created_at);
      CREATE INDEX IF NOT EXISTS messages_tool ON messages (run_id, tool_id);
      CREATE TABLE IF NOT EXISTS runs (id TEXT PRIMARY KEY, thread_id TEXT, agent TEXT NOT NULL, profile TEXT NOT NULL, status TEXT NOT NULL,
        gh_run_id TEXT, gh_url TEXT, token_hash TEXT, created_at INTEGER NOT NULL, claimed_at INTEGER, last_seen INTEGER, ended_at INTEGER,
        cost_usd REAL NOT NULL DEFAULT 0, summary TEXT, error TEXT, session_id TEXT);
      CREATE TABLE IF NOT EXISTS desks (agent TEXT PRIMARY KEY, status TEXT NOT NULL, activity TEXT, run_id TEXT, updated_at INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS asks (id TEXT PRIMARY KEY, run_id TEXT NOT NULL, thread_id TEXT NOT NULL, agent TEXT NOT NULL, kind TEXT NOT NULL,
        title TEXT NOT NULL, body TEXT NOT NULL, options TEXT NOT NULL, status TEXT NOT NULL, answer TEXT, created_at INTEGER NOT NULL, answered_at INTEGER);
      CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, from_agent TEXT NOT NULL, to_agent TEXT NOT NULL, body TEXT NOT NULL, status TEXT NOT NULL,
        thread_id TEXT, created_at INTEGER NOT NULL);
    `);
    for (const ddl of [
      "ALTER TABLE desks ADD COLUMN done INTEGER NOT NULL DEFAULT 0",
      "ALTER TABLE runs ADD COLUMN item TEXT",     // studio runs: the reel being built
      "ALTER TABLE runs ADD COLUMN stage TEXT",    // studio runs: build, review, fix, final
      "ALTER TABLE threads ADD COLUMN item TEXT",  // build threads: one per reel
      "ALTER TABLE asks ADD COLUMN meta TEXT",     // final reels: video, cover, texts
    ]) {
      try { this.sql.exec(ddl); } catch { /* already there */ }
    }
  }

  private rows<T = Row>(q: string, ...b: SqlStorageValue[]): T[] {
    return this.sql.exec(q, ...b).toArray() as T[];
  }
  private one<T = Row>(q: string, ...b: SqlStorageValue[]): T | null {
    return (this.sql.exec(q, ...b).toArray()[0] as T) ?? null;
  }
  private meta(k: string): string | null {
    return this.one<{ v: string }>("SELECT v FROM meta WHERE k = ?", k)?.v ?? null;
  }
  private setMeta(k: string, v: string | null) {
    if (v === null) this.sql.exec("DELETE FROM meta WHERE k = ?", k);
    else this.sql.exec("INSERT INTO meta (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v", k, v);
  }

  private team(): Team {
    const slug = this.meta("team");
    const t = slug ? getTeam(slug) : null;
    if (!t) throw new Error("office not initialised");
    return t;
  }
  private ensureTeam(slug: string): Team {
    const t = getTeam(slug);
    if (!t) throw new Error(`unknown team ${slug}`);
    if (this.meta("team") !== slug) this.setMeta("team", slug);
    const now = Date.now();
    for (const a of t.agents) {
      this.sql.exec("INSERT OR IGNORE INTO desks (agent, status, activity, run_id, updated_at) VALUES (?, 'idle', NULL, NULL, ?)", a.slug, now);
    }
    return t;
  }

  private toThread(r: Row): Thread {
    return {
      id: r.id as string, agent: r.agent as string, title: r.title as string, kind: r.kind as string,
      created_at: r.created_at as number, updated_at: r.updated_at as number, last_run: (r.last_run as string) ?? null,
      session_id: (r.session_id as string) ?? null, preview: (r.preview as string) ?? null,
    };
  }
  private toMessage(r: Row): Message {
    return {
      id: r.id as string, thread_id: r.thread_id as string, run_id: (r.run_id as string) ?? null, author: r.author as string,
      kind: r.kind as MessageKind, body: JSON.parse(r.body as string), parent: (r.parent as string) ?? null, created_at: r.created_at as number,
    };
  }
  private toRun(r: Row): Run {
    return {
      id: r.id as string, thread_id: (r.thread_id as string) ?? null, agent: r.agent as string, profile: r.profile as Profile,
      status: r.status as RunStatus, gh_run_id: (r.gh_run_id as string) ?? null, created_at: r.created_at as number,
      claimed_at: (r.claimed_at as number) ?? null, last_seen: (r.last_seen as number) ?? null, ended_at: (r.ended_at as number) ?? null,
      cost_usd: (r.cost_usd as number) ?? 0, summary: (r.summary as string) ?? null, error: (r.error as string) ?? null,
      gh_url: (r.gh_url as string) ?? null, item: (r.item as string) ?? null, stage: (r.stage as string) ?? null,
    };
  }
  private toAsk(r: Row): Ask {
    return {
      id: r.id as string, run_id: r.run_id as string, thread_id: r.thread_id as string, agent: r.agent as string,
      kind: r.kind as Ask["kind"], title: r.title as string, body: r.body as string, options: JSON.parse(r.options as string),
      status: r.status as Ask["status"], answer: r.answer ? JSON.parse(r.answer as string) : null,
      created_at: r.created_at as number, answered_at: (r.answered_at as number) ?? null,
      meta: r.meta ? JSON.parse(r.meta as string) : null,
    };
  }
  private toTask(r: Row): Task {
    return {
      id: r.id as string, from_agent: r.from_agent as string, to_agent: r.to_agent as string, body: r.body as string,
      status: r.status as Task["status"], thread_id: (r.thread_id as string) ?? null, created_at: r.created_at as number,
    };
  }
  private getRun(id: string): Run | null {
    const r = this.one("SELECT * FROM runs WHERE id = ?", id);
    return r ? this.toRun(r) : null;
  }
  private getThreadRow(id: string): Thread | null {
    const r = this.one("SELECT * FROM threads WHERE id = ?", id);
    return r ? this.toThread(r) : null;
  }
  private usage(): Usage | null {
    const u = this.meta("usage");
    return u ? (JSON.parse(u) as Usage) : null;
  }

  // ---------- live room ----------
  private broadcast(ev: RoomEvent) {
    const data = JSON.stringify(ev);
    for (const ws of this.ctx.getWebSockets("client")) {
      try { ws.send(data); } catch { /* closed */ }
    }
  }
  private runnerSocket(runId: string): WebSocket | null {
    return this.ctx.getWebSockets(`run:${runId}`)[0] ?? null;
  }
  private sendRunner(runId: string, cmd: RunnerCommand): boolean {
    const ws = this.runnerSocket(runId);
    if (!ws) return false;
    try { ws.send(JSON.stringify(cmd)); return true; } catch { return false; }
  }

  private addMessage(m: { thread_id: string; run_id: string | null; author: string; kind: MessageKind; body: Record<string, unknown>; parent?: string | null; delivered?: boolean; tool_id?: string | null }): Message {
    const id = newId("m");
    const now = Date.now();
    this.sql.exec(
      "INSERT INTO messages (id, thread_id, run_id, author, kind, body, parent, created_at, delivered, tool_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      id, m.thread_id, m.run_id, m.author, m.kind, JSON.stringify(m.body), m.parent ?? null, now, m.delivered === false ? 0 : 1, m.tool_id ?? null,
    );
    const text = typeof m.body.text === "string" ? m.body.text : null;
    if (text && (m.kind === "text" || m.kind === "question" || m.kind === "approval") && !m.parent) {
      this.sql.exec("UPDATE threads SET updated_at = ?, preview = ? WHERE id = ?", now, text.slice(0, 160), m.thread_id);
    } else {
      this.sql.exec("UPDATE threads SET updated_at = ? WHERE id = ?", now, m.thread_id);
    }
    const msg: Message = { id, thread_id: m.thread_id, run_id: m.run_id, author: m.author, kind: m.kind, body: m.body, parent: m.parent ?? null, created_at: now };
    this.broadcast({ t: "message", message: msg });
    return msg;
  }
  private system(threadId: string | null, runId: string | null, text: string, extra: Record<string, unknown> = {}) {
    if (threadId) this.addMessage({ thread_id: threadId, run_id: runId, author: "system", kind: "system", body: { text, ...extra } });
  }
  private setDesk(agent: string, status: Desk["status"], activity: string | null, runId: string | null) {
    if (!this.team().agents.some((a) => a.slug === agent)) return;
    const now = Date.now();
    this.sql.exec(
      "INSERT INTO desks (agent, status, activity, run_id, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(agent) DO UPDATE SET status = excluded.status, activity = excluded.activity, run_id = excluded.run_id, updated_at = excluded.updated_at",
      agent, status, activity, runId, now,
    );
    this.broadcast({ t: "desk", desk: this.one<Desk>("SELECT agent, status, activity, run_id, updated_at, done FROM desks WHERE agent = ?", agent)! });
  }
  private bumpDone(agent: string) {
    this.sql.exec("UPDATE desks SET done = done + 1 WHERE agent = ?", agent);
  }
  private updateRun(id: string, fields: Partial<Record<string, SqlStorageValue>>) {
    const keys = Object.keys(fields);
    if (keys.length) this.sql.exec(`UPDATE runs SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`, ...keys.map((k) => fields[k] as SqlStorageValue), id);
    const run = this.getRun(id);
    if (run) this.broadcast({ t: "run", run });
    return run;
  }

  // ---------- reads ----------
  async getState(slug: string): Promise<OfficeState> {
    const team = this.ensureTeam(slug);
    return {
      team,
      desks: this.rows<Desk>("SELECT agent, status, activity, run_id, updated_at, done FROM desks"),
      runs: this.rows("SELECT * FROM runs ORDER BY created_at DESC LIMIT 25").map((r) => this.toRun(r)),
      asks: this.rows("SELECT * FROM asks WHERE status = 'pending' ORDER BY created_at").map((r) => this.toAsk(r)),
      tasks: this.rows("SELECT * FROM tasks WHERE status = 'proposed' ORDER BY created_at DESC").map((r) => this.toTask(r)),
      threads: this.rows("SELECT * FROM threads ORDER BY updated_at DESC LIMIT 50").map((r) => this.toThread(r)),
      usage: this.usage(),
    };
  }

  async getThread(slug: string, id: string): Promise<{ thread: Thread; messages: Message[]; runs: Run[] } | null> {
    this.ensureTeam(slug);
    const thread = this.getThreadRow(id);
    if (!thread) return null;
    const messages = this.rows("SELECT * FROM messages WHERE thread_id = ? ORDER BY created_at LIMIT 2000", id).map((r) => this.toMessage(r));
    const runs = this.rows("SELECT * FROM runs WHERE thread_id = ? ORDER BY created_at", id).map((r) => this.toRun(r));
    return { thread, messages, runs };
  }

  // ---------- owner actions ----------
  async postMessage(slug: string, input: { thread_id?: string | null; agent?: string; text: string; kind?: string; title?: string }): Promise<{ thread: Thread; message: Message }> {
    const team = this.ensureTeam(slug);
    const text = input.text.trim();
    if (!text) throw new Error("empty message");
    let thread = input.thread_id ? this.getThreadRow(input.thread_id) : null;
    if (input.thread_id && !thread) throw new Error("unknown thread");
    if (!thread) {
      const agent = team.agents.some((a) => a.slug === input.agent) ? (input.agent as string) : team.lead;
      const now = Date.now();
      const id = newId("t");
      this.sql.exec("INSERT INTO threads (id, agent, title, kind, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)", id, agent, (input.title ?? text).slice(0, 70), input.kind ?? "chat", now, now);
      thread = this.getThreadRow(id)!;
      this.broadcast({ t: "thread", thread });
    }
    const message = this.addMessage({ thread_id: thread.id, run_id: null, author: "owner", kind: "text", body: { text }, delivered: false });
    const active = this.activeRunFor(thread.id);
    if (active) this.deliverPending(active);
    else await this.startRun(thread, thread.kind === "build" ? "studio" : "desk");  // a note in a build thread revises the reel
    this.broadcast({ t: "thread", thread: this.getThreadRow(thread.id)! });
    return { thread: this.getThreadRow(thread.id)!, message };
  }

  /** The team's standup, called by the owner (never on a schedule). One sync conversation per day. */
  async startSync(slug: string): Promise<{ thread: Thread }> {
    const team = this.ensureTeam(slug);
    const day = new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short" });
    const iso = new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);
    const open = this.one("SELECT t.* FROM threads t JOIN runs r ON r.thread_id = t.id WHERE t.kind = 'sync' AND r.status IN " + ACTIVE_SQL + " LIMIT 1");
    if (open) return { thread: this.toThread(open) };
    const { thread } = await this.postMessage(slug, {
      agent: team.lead, kind: "sync", title: `Daily sync, ${day}`,
      text: `Daily sync for ${iso}. Follow prompts/daily-sync.md.`,
    });
    return { thread };
  }

  /** "Start the day": the Producer gets today's reels planned, written and into the studio. One tap, never scheduled. */
  async startDay(slug: string): Promise<{ thread: Thread }> {
    const team = this.ensureTeam(slug);
    const open = this.one("SELECT t.* FROM threads t JOIN runs r ON r.thread_id = t.id WHERE t.kind = 'workday' AND r.status IN " + ACTIVE_SQL + " LIMIT 1");
    if (open) return { thread: this.toThread(open) };
    const day = new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short" });
    const iso = new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);
    // A second tap on the same day continues that day's conversation (with its memory) instead of a new day.
    const today = this.one("SELECT * FROM threads WHERE kind = 'workday' AND title = ? ORDER BY created_at DESC LIMIT 1", `Work day, ${day}`);
    if (today) {
      await this.postMessage(slug, { thread_id: today.id as string, text: "Continue today's work day where it stopped: check what is already in the studio (team_feed) and finish the rest. Follow prompts/work-day.md." });
      return { thread: this.getThreadRow(today.id as string)! };
    }
    const pace = team.pace ?? 6;
    const { thread } = await this.postMessage(slug, {
      agent: team.lead, kind: "workday", title: `Work day, ${day}`,
      text: `Start the day (${iso}): ${pace} reels, ${Math.round(pace / Math.max(1, team.tracks.length))} per track. Follow prompts/work-day.md.`,
    });
    return { thread };
  }

  /** A desk hands one reel to the studio: a build thread per reel, its brief as the first message, a studio run. */
  async requestBuild(slug: string, fromRunId: string, input: { item_id: string; item?: unknown; script?: string; notes?: string }): Promise<{ thread_id: string; run_id: string; reused: boolean }> {
    const team = this.ensureTeam(slug);
    const itemId = String(input.item_id ?? "").trim();
    if (!/^[a-z]\d{2,4}$/.test(itemId)) throw new Error(`bad item id ${itemId}`);
    const from = this.getRun(fromRunId);
    const existing = this.one("SELECT * FROM threads WHERE kind = 'build' AND item = ? ORDER BY created_at DESC LIMIT 1", itemId);
    if (existing) {
      const active = this.activeRunFor(existing.id as string);
      if (active) return { thread_id: existing.id as string, run_id: active.id, reused: true };
    }
    const item = (input.item && typeof input.item === "object" ? input.item : {}) as Record<string, unknown>;
    const title = String(item.title ?? itemId);
    const track = String(item.track ?? team.tracks.find((t) => t.prefix === itemId[0])?.id ?? "");
    const studioLead = team.agents.find((a) => a.desk === "studio")?.slug ?? team.lead;
    let threadId = existing?.id as string | undefined;
    const now = Date.now();
    if (!threadId) {
      threadId = newId("t");
      this.sql.exec("INSERT INTO threads (id, agent, title, kind, item, created_at, updated_at) VALUES (?, ?, ?, 'build', ?, ?, ?)",
        threadId, studioLead, `Build ${itemId}: ${title}`.slice(0, 90), itemId, now, now);
    }
    const parts = [`REEL=${itemId} TRACK=${track}`, "Queue item:", "```json", JSON.stringify(item, null, 2), "```"];
    if (input.script?.trim()) parts.push("Script (from the Scriptwriter, keep its wording):", input.script.trim());
    if (input.notes?.trim()) parts.push(`Notes: ${input.notes.trim()}`);
    this.addMessage({
      thread_id: threadId, run_id: null, author: `agent:${from?.agent ?? team.lead}`, kind: "brief",
      body: { text: parts.join("\n\n"), item_id: itemId, title, track }, delivered: false,
    });
    const thread = this.getThreadRow(threadId)!;
    this.broadcast({ t: "thread", thread });
    const run = await this.startRun(thread, "studio");
    return { thread_id: threadId, run_id: run.id, reused: false };
  }

  /** The studio's final job reports: the reel passed the gate (an approval for the owner) or did not. */
  async finalReport(slug: string, runId: string, r: { ok: boolean; item: string; title?: string; video_url?: string; cover_url?: string; thumb_url?: string; caption?: string; youtube?: string; script?: string; duration_s?: number; failed?: string[]; note?: string }) {
    this.ensureTeam(slug);
    const run = this.getRun(runId);
    if (!run || !run.thread_id) throw new Error("unknown run");
    const failed = (r.failed ?? []).slice(0, 12);
    this.finishRun(runId, "done", r.ok ? `${r.item} passed the gate` : `${r.item} did not pass the gate`, null);
    if (!r.ok) {
      this.system(run.thread_id, runId, `The reel did not pass the final gate: ${failed.join("; ") || r.note || "see the GitHub log"}. Send a note here to have the studio fix it.`, { error: true });
      return;
    }
    const meta = {
      type: "final" as const, item: r.item, title: r.title ?? r.item, video_url: r.video_url ?? null, cover_url: r.cover_url ?? null,
      thumb_url: r.thumb_url ?? null, caption: r.caption ?? "", youtube: r.youtube ?? "", script: r.script ?? "", duration_s: r.duration_s ?? null, checks: failed,
    };
    const askId = newId("ask");
    const studio = run.agent;
    this.sql.exec(
      "INSERT INTO asks (id, run_id, thread_id, agent, kind, title, body, options, status, created_at, meta) VALUES (?, ?, ?, ?, 'approval', ?, ?, '[]', 'pending', ?, ?)",
      askId, runId, run.thread_id, studio, `Final reel: ${r.item}, ${meta.title}`.slice(0, 200), "[final] The reel passed the automatic gate and the independent reviews.", Date.now(), JSON.stringify(meta),
    );
    this.addMessage({ thread_id: run.thread_id, run_id: runId, author: `agent:${studio}`, kind: "approval", body: { ask_id: askId, title: `Final reel: ${r.item}, ${meta.title}`, text: "The reel is ready for your decision." } });
    this.broadcast({ t: "ask", ask: this.toAsk(this.one("SELECT * FROM asks WHERE id = ?", askId)!) });
  }

  async answerAsk(slug: string, askId: string, answer: Record<string, unknown>): Promise<Ask> {
    this.ensureTeam(slug);
    const r = this.one("SELECT * FROM asks WHERE id = ?", askId);
    if (!r) throw new Error("unknown question");
    const ask = this.toAsk(r);
    if (ask.status !== "pending") throw new Error("already answered");
    const now = Date.now();
    this.sql.exec("UPDATE asks SET status = 'answered', answer = ?, answered_at = ? WHERE id = ?", JSON.stringify(answer), now, askId);
    this.addMessage({ thread_id: ask.thread_id, run_id: ask.run_id, author: "owner", kind: ask.kind === "approval" ? "decision" : "answer", body: { ask_id: askId, ...answer } });
    if (ask.meta?.type === "final") {
      const updated = this.toAsk(this.one("SELECT * FROM asks WHERE id = ?", askId)!);
      this.broadcast({ t: "ask", ask: updated });
      const decision = String(answer.decision ?? "");
      if (decision === "changes_requested") {
        // The studio rebuilds with the owner's notes (a revise run in the same build thread).
        await this.postMessage(slug, { thread_id: ask.thread_id, text: `Changes to ${ask.meta.item}: ${String(answer.notes ?? answer.text ?? "")}` });
      } else if (decision === "approved") {
        this.system(ask.thread_id, ask.run_id, `${ask.meta.item} approved. It is ready to hand over for posting.`);
      } else {
        this.system(ask.thread_id, ask.run_id, `${ask.meta.item} rejected.`);
      }
      return updated;
    }
    const sent = this.sendRunner(ask.run_id, { t: "answer", ask_id: askId, answer });
    if (!sent) this.system(ask.thread_id, ask.run_id, "The agent's session has ended; your answer is saved and goes into the next run of this chat.");
    this.setDesk(ask.agent, "working", "Got your answer", ask.run_id);
    const updated = this.toAsk(this.one("SELECT * FROM asks WHERE id = ?", askId)!);
    this.broadcast({ t: "ask", ask: updated });
    return updated;
  }

  async stopRun(slug: string, runId: string, mode: "interrupt" | "end"): Promise<Run | null> {
    this.ensureTeam(slug);
    const run = this.getRun(runId);
    if (!run || !ACTIVE.includes(run.status)) return run;
    if (this.sendRunner(runId, { t: mode })) {
      this.system(run.thread_id, runId, mode === "end" ? "Ending the session…" : "Stopping the current step…");
      return run;
    }
    if (run.status === "queued" || run.status === "starting" || mode === "end") {
      if (run.gh_run_id) await cancelRun(this.env, run.gh_run_id).catch(() => undefined);
      return this.finishRun(runId, "cancelled", null, null);
    }
    return run;
  }

  async taskAction(slug: string, taskId: string, action: "start" | "dismiss"): Promise<Task> {
    this.ensureTeam(slug);
    const r = this.one("SELECT * FROM tasks WHERE id = ?", taskId);
    if (!r) throw new Error("unknown task");
    const task = this.toTask(r);
    if (action === "dismiss") {
      this.sql.exec("UPDATE tasks SET status = 'dismissed' WHERE id = ?", taskId);
    } else if (task.status === "proposed") {
      const from = this.team().agents.find((a) => a.slug === task.from_agent)?.name ?? task.from_agent;
      const { thread } = await this.postMessage(slug, { agent: task.to_agent, text: `Task from ${from}:\n\n${task.body}` });
      this.sql.exec("UPDATE tasks SET status = 'started', thread_id = ? WHERE id = ?", thread.id, taskId);
    }
    const updated = this.toTask(this.one("SELECT * FROM tasks WHERE id = ?", taskId)!);
    this.broadcast({ t: "task", task: updated });
    return updated;
  }

  // ---------- runs ----------
  private activeRunFor(threadId: string): Run | null {
    const r = this.one(`SELECT * FROM runs WHERE thread_id = ? AND status IN ${ACTIVE_SQL} ORDER BY created_at DESC LIMIT 1`, threadId);
    return r ? this.toRun(r) : null;
  }

  private async startRun(thread: Thread, profile: Profile): Promise<Run> {
    const id = newId("run");
    const now = Date.now();
    const cap = Number(this.env.MAX_PARALLEL_RUNS ?? "3");
    const busy = this.one<{ n: number }>("SELECT COUNT(*) AS n FROM runs WHERE status IN ('starting','live','idle','blocked_limit')")!.n;
    const blockedUntil = Number(this.meta("blocked_until") ?? 0);
    const wait = busy >= cap || blockedUntil > now;
    const item = profile === "studio" ? (this.one<{ item: string | null }>("SELECT item FROM threads WHERE id = ?", thread.id)?.item ?? null) : null;
    this.sql.exec("INSERT INTO runs (id, thread_id, agent, profile, status, created_at, item, stage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      id, thread.id, thread.agent, profile, wait ? "queued" : "starting", now, item, profile === "studio" ? "build" : null);
    this.sql.exec("UPDATE threads SET last_run = ? WHERE id = ?", id, thread.id);
    const agentName = this.team().agents.find((a) => a.slug === thread.agent)?.name ?? thread.agent;
    if (wait) {
      this.system(thread.id, id, blockedUntil > now
        ? `Claude usage limit reached. ${agentName} starts when it resets (${new Date(blockedUntil).toISOString().slice(11, 16)} UTC).`
        : `${busy} runs are busy; ${agentName} starts when one finishes.`);
      this.setDesk(thread.agent, "waiting", "In the queue", id);
    } else {
      this.system(thread.id, id, `Waking up ${agentName}'s desk on GitHub (about a minute)…`);
      this.setDesk(thread.agent, "working", "Starting up", id);
    }
    const run = this.updateRun(id, {})!;
    if (!wait) await this.dispatch(run);
    await this.ensureAlarm();
    return run;
  }

  private async dispatch(run: Run) {
    if (this.env.DISPATCH_MODE === "manual") {
      // Local testing: start the bridge by hand with RUN_ID=<id>.
      this.system(run.thread_id, run.id, `Manual mode: start the bridge with RUN_ID=${run.id}`);
      return;
    }
    try {
      const { gh_run_id, url } = await dispatchRun(this.env, { run_id: run.id, team: this.team().slug, profile: run.profile, item: run.item ?? "" });
      this.updateRun(run.id, { status: "starting", gh_run_id, gh_url: url });
    } catch (e) {
      this.finishRun(run.id, "failed", null, (e as Error).message);
    }
  }

  private finishRun(id: string, status: RunStatus, summary: string | null, error: string | null): Run | null {
    const run = this.getRun(id);
    if (!run || !ACTIVE.includes(run.status)) return run;
    const updated = this.updateRun(id, { status, ended_at: Date.now(), summary, error, token_hash: null });
    for (const d of this.rows<{ agent: string }>("SELECT agent FROM desks WHERE run_id = ?", id)) this.setDesk(d.agent, "idle", null, null);
    this.sql.exec("UPDATE asks SET status = 'expired' WHERE run_id = ? AND status = 'pending'", id);
    for (const r of this.rows("SELECT * FROM asks WHERE run_id = ? AND status = 'expired'", id)) this.broadcast({ t: "ask", ask: this.toAsk(r) });
    if (status === "failed" || status === "lost") this.system(run.thread_id, id, `The run stopped: ${error ?? status}.`, { error: true });
    if (status === "cancelled") this.system(run.thread_id, id, "Run cancelled.");
    for (const ws of this.ctx.getWebSockets(`run:${id}`)) { try { ws.close(1000, "run finished"); } catch { /* */ } }
    this.ctx.waitUntil(this.startQueued());
    return updated;
  }

  private async startQueued() {
    const cap = Number(this.env.MAX_PARALLEL_RUNS ?? "3");
    const blockedUntil = Number(this.meta("blocked_until") ?? 0);
    if (blockedUntil > Date.now()) return;
    let busy = this.one<{ n: number }>("SELECT COUNT(*) AS n FROM runs WHERE status IN ('starting','live','idle','blocked_limit')")!.n;
    for (const r of this.rows("SELECT * FROM runs WHERE status = 'queued' ORDER BY created_at")) {
      if (busy >= cap) break;
      const run = this.toRun(r);
      this.updateRun(run.id, { status: "starting" });
      this.setDesk(run.agent, "working", "Starting up", run.id);
      this.system(run.thread_id, run.id, "Starting now…");
      await this.dispatch(run);
      busy++;
    }
  }

  private deliverPending(run: Run) {
    if (!run.thread_id || !this.runnerSocket(run.id)) return;
    for (const m of this.rows("SELECT * FROM messages WHERE thread_id = ? AND author = 'owner' AND delivered = 0 ORDER BY created_at", run.thread_id)) {
      const body = JSON.parse(m.body as string);
      if (this.sendRunner(run.id, { t: "user_message", id: m.id as string, text: body.text })) {
        this.sql.exec("UPDATE messages SET delivered = 1, run_id = ? WHERE id = ?", run.id, m.id);
      }
    }
  }

  /** A runner proved (OIDC) that GitHub started it for this run. Hand it the work and a run token. */
  async claim(slug: string, runId: string, ghRunId: string | null) {
    const team = this.ensureTeam(slug);
    const run = this.getRun(runId);
    if (!run) throw new Error("unknown run");
    // A studio run is claimed once per agent job (build, then fix), always by the same GitHub run.
    const nextStudioJob = run.profile === "studio" && run.status === "idle" && !!run.gh_run_id && run.gh_run_id === ghRunId;
    if (run.status !== "starting" && run.status !== "queued" && !nextStudioJob) throw new Error(`run is ${run.status}`);
    if (run.gh_run_id && ghRunId && run.gh_run_id !== ghRunId) throw new Error("GitHub run id does not match");
    const token = randomToken(32);
    const now = Date.now();
    this.updateRun(runId, { status: "live", claimed_at: now, last_seen: now, gh_run_id: ghRunId ?? run.gh_run_id, token_hash: await sha256Hex(token) });
    const thread = run.thread_id ? this.getThreadRow(run.thread_id) : null;
    const pending = thread
      ? this.rows("SELECT * FROM messages WHERE thread_id = ? AND (author = 'owner' OR kind = 'brief') AND delivered = 0 ORDER BY created_at", thread.id)
      : [];
    // Studio: the first build of a reel, or a revision after the owner's notes (an earlier studio run exists).
    const studioMode = run.profile !== "studio" ? null
      : nextStudioJob ? "fix"
      : this.one("SELECT id FROM runs WHERE thread_id = ? AND profile = 'studio' AND id != ? AND status = 'done' LIMIT 1", run.thread_id, runId) ? "revise" : "build";
    if (run.profile === "studio") this.updateRun(runId, { stage: studioMode === "fix" ? "fix" : "build" });
    const taskMode = run.profile === "studio" || thread?.kind === "workday";
    for (const m of pending) this.sql.exec("UPDATE messages SET delivered = 1, run_id = ? WHERE id = ?", runId, m.id);
    const saved = thread ? this.one<{ transcript_key: string | null; session_id: string | null }>("SELECT transcript_key, session_id FROM threads WHERE id = ?", thread.id) : null;
    const resume = saved?.transcript_key && saved.session_id ? { key: saved.transcript_key, session_id: saved.session_id } : null;
    // The chat so far (text only): the bridge briefs the agent with it when there is no transcript to resume.
    const history = thread
      ? this.rows(
          "SELECT author, kind, body FROM messages WHERE thread_id = ? AND kind IN ('text','answer','decision') AND parent IS NULL AND delivered = 1 AND run_id IS NOT ? ORDER BY created_at DESC LIMIT 40",
          thread.id, runId,
        ).reverse().map((m) => ({ author: m.author as string, text: String(JSON.parse(m.body as string).text ?? JSON.stringify(JSON.parse(m.body as string))) }))
      : [];
    const agent = team.agents.find((a) => a.slug === run.agent) ?? team.agents.find((a) => a.slug === team.lead)!;
    this.setDesk(agent.slug, "working", "Reading your message", runId);
    await this.ensureAlarm();
    return {
      token,
      run: { id: runId, agent: agent.slug, profile: run.profile, thread_id: run.thread_id, item: run.item ?? null, mode: studioMode },
      team: { slug: team.slug, name: team.name, lead: team.lead, model: team.model, agents: team.agents.map((a) => ({ slug: a.slug, name: a.name })) },
      agent,
      messages: pending.map((m) => ({ id: m.id as string, text: String(JSON.parse(m.body as string).text) })),
      history,
      resume,
      digest: this.digest(run.thread_id),
      // task_mode: the session ends when its work is done (studio jobs, the work day), no waiting for chat.
      settings: { idle_minutes: taskMode ? 2 : Number(this.env.IDLE_MINUTES ?? "15"), max_minutes: run.profile === "studio" ? 110 : 340, max_turns: 500, task_mode: taskMode },
    };
  }

  // ---------- the team feed: what the other desks did (other conversations) ----------
  private lastWords(threadId: string, n: number): { author: string; kind: string; text: string; at: number }[] {
    return this.rows(
      "SELECT author, kind, body, created_at FROM messages WHERE thread_id = ? AND parent IS NULL AND kind IN ('text','approval','decision','answer','question','dm','handoff') ORDER BY created_at DESC LIMIT ?",
      threadId, n,
    ).reverse().map((m) => {
      const b = JSON.parse(m.body as string) as Record<string, unknown>;
      const text = String(b.text ?? b.title ?? "") + (b.notes ? ` (notes: ${b.notes})` : "") + (b.edited ? " (approved with the owner's edits)" : "");
      return { author: m.author as string, kind: m.kind as string, text, at: m.created_at as number };
    });
  }

  private label(author: string): string {
    if (author === "owner") return "Owner";
    return this.team().agents.find((a) => `agent:${a.slug}` === author)?.name ?? author.replace(/^agent:/, "");
  }

  /** A short digest of the other conversations, put into every agent's briefing. */
  private digest(excludeThread: string | null): string {
    const threads = this.rows("SELECT * FROM threads WHERE id IS NOT ? ORDER BY updated_at DESC LIMIT 6", excludeThread).map((r) => this.toThread(r));
    if (!threads.length) return "";
    const ago = (ms: number) => { const m = Math.round((Date.now() - ms) / 60000); return m < 60 ? `${m} min ago` : `${Math.round(m / 60)} h ago`; };
    return threads.map((t) => {
      const words = this.lastWords(t.id, 3).map((w) => `${this.label(w.author)}${w.kind === "decision" ? " decided" : ""}: ${w.text.replace(/\s+/g, " ").slice(0, 280)}`);
      const head = `- [${t.id}] ${this.label(`agent:${t.agent}`)}, "${t.title}" (${ago(t.updated_at)})`;
      return [head, ...words.map((w) => `  ${w}`)].join("\n");
    }).join("\n");
  }

  /** What other desks did: the recent conversations, or one conversation in full. For the team_feed tool. */
  async feed(slug: string, runId: string, threadId: string | null): Promise<string> {
    this.ensureTeam(slug);
    const run = this.getRun(runId);
    if (threadId) {
      const t = this.getThreadRow(threadId);
      if (!t) return `No conversation ${threadId}.`;
      const words = this.lastWords(threadId, 30).map((w) => `${this.label(w.author)} (${w.kind}): ${w.text}`);
      return [`Conversation "${t.title}" with ${this.label(`agent:${t.agent}`)}:`, ...words].join("\n\n");
    }
    const tasks = this.rows("SELECT * FROM tasks WHERE status = 'proposed' ORDER BY created_at DESC LIMIT 10").map((r) => this.toTask(r));
    const parts = [this.digest(run?.thread_id ?? null) || "No other conversations yet."];
    if (tasks.length) parts.push(["Open tasks between desks:", ...tasks.map((t) => `- ${t.from_agent} for ${t.to_agent}: ${t.body.slice(0, 200)}`)].join("\n"));
    parts.push("Files other desks write are saved to the repo when their session closes; read a full conversation with team_feed(thread_id).");
    return parts.join("\n\n");
  }

  async verifyRunToken(runId: string, token: string): Promise<boolean> {
    const r = this.one<{ token_hash: string | null; status: string }>("SELECT token_hash, status FROM runs WHERE id = ?", runId);
    if (!r?.token_hash || !ACTIVE.includes(r.status as RunStatus)) return false;
    return timingSafeEqual(r.token_hash, await sha256Hex(token));
  }

  async runnerSaved(slug: string, runId: string, info: { commit?: string | null; files?: number; proposal_branch?: string | null; note?: string | null }) {
    this.ensureTeam(slug);
    const run = this.getRun(runId);
    if (!run) return;
    const parts: string[] = [];
    if (info.commit) parts.push(`Saved ${info.files ?? 0} file(s) to the repo (commit ${info.commit.slice(0, 7)}).`);
    if (info.proposal_branch) parts.push(`Changes to rules, prompts or agents wait for your review on branch ${info.proposal_branch}.`);
    if (info.note) parts.push(info.note);
    if (parts.length) this.system(run.thread_id, runId, parts.join(" "), { commit: info.commit ?? null, proposal_branch: info.proposal_branch ?? null });
  }

  async ghRunCompleted(slug: string, runId: string, ghRunId: string, conclusion: string, url: string | null) {
    this.ensureTeam(slug);
    const run = this.getRun(runId);
    if (!run) return;
    if (url) this.updateRun(runId, { gh_url: url, gh_run_id: run.gh_run_id ?? ghRunId });
    if (ACTIVE.includes(run.status)) {
      this.finishRun(runId, conclusion === "success" ? "done" : conclusion === "cancelled" ? "cancelled" : "failed", null,
        conclusion === "success" ? null : `GitHub run ended: ${conclusion}`);
    }
  }

  // ---------- sockets ----------
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (request.headers.get("Upgrade") !== "websocket") return new Response("expected websocket", { status: 426 });
    const slug = url.searchParams.get("team") ?? "";
    this.ensureTeam(slug);
    const pair = new WebSocketPair();
    const [client, server] = [pair[0], pair[1]];
    if (url.pathname.endsWith("/client")) {
      this.ctx.acceptWebSocket(server, ["client"]);
      server.send(JSON.stringify({ t: "state", state: await this.getState(slug) } satisfies RoomEvent));
      return new Response(null, { status: 101, webSocket: client });
    }
    if (url.pathname.endsWith("/runner")) {
      const runId = url.searchParams.get("run") ?? "";
      if (!(await this.verifyRunToken(runId, url.searchParams.get("token") ?? ""))) return new Response("forbidden", { status: 403 });
      for (const old of this.ctx.getWebSockets(`run:${runId}`)) { try { old.close(4000, "replaced"); } catch { /* */ } }
      this.ctx.acceptWebSocket(server, ["runner", `run:${runId}`]);
      server.serializeAttachment({ runId });
      this.updateRun(runId, { last_seen: Date.now() });
      const run = this.getRun(runId);
      if (run) queueMicrotask(() => this.deliverPending(run));
      return new Response(null, { status: 101, webSocket: client });
    }
    return new Response("not found", { status: 404 });
  }

  async webSocketMessage(ws: WebSocket, raw: string | ArrayBuffer) {
    const att = ws.deserializeAttachment() as { runId?: string } | null;
    if (!att?.runId) {
      if (raw === "ping") ws.send("pong");
      return;
    }
    let data: { events?: RunnerEvent[] };
    try { data = JSON.parse(typeof raw === "string" ? raw : new TextDecoder().decode(raw)); } catch { return; }
    const run = this.getRun(att.runId);
    if (!run || !ACTIVE.includes(run.status)) return;
    this.sql.exec("UPDATE runs SET last_seen = ? WHERE id = ?", Date.now(), run.id);
    for (const ev of data.events ?? []) {
      try { await this.onRunnerEvent(run, ev); } catch (e) { console.error("event", ev.t, (e as Error).message); }
    }
  }

  async webSocketClose(ws: WebSocket) {
    try { ws.close(); } catch { /* already closed */ }
  }

  private async onRunnerEvent(run: Run, ev: RunnerEvent) {
    const threadId = run.thread_id;
    switch (ev.t) {
      case "session":
        this.updateRun(run.id, { session_id: ev.session_id });
        if (threadId) this.sql.exec("UPDATE threads SET session_id = ? WHERE id = ?", ev.session_id, threadId);
        return;
      case "delta":
        if (threadId) this.broadcast({ t: "delta", thread_id: threadId, run_id: run.id, agent: ev.agent, parent: ev.parent, text: ev.text });
        return;
      case "message":
        if (threadId && ev.text.trim()) this.addMessage({ thread_id: threadId, run_id: run.id, author: `agent:${ev.agent}`, kind: "text", body: { text: ev.text }, parent: ev.parent });
        return;
      case "tool":
        if (threadId) this.addMessage({ thread_id: threadId, run_id: run.id, author: `agent:${ev.agent}`, kind: "tool", body: { name: ev.name, summary: ev.summary, status: "running" }, parent: ev.parent, tool_id: ev.id });
        this.setDesk(ev.agent, "working", ev.summary.slice(0, 90), run.id);
        return;
      case "tool_result": {
        const r = this.one("SELECT * FROM messages WHERE run_id = ? AND tool_id = ?", run.id, ev.id);
        if (!r) return;
        const body = { ...JSON.parse(r.body as string), status: ev.ok ? "ok" : "error", result: ev.summary };
        this.sql.exec("UPDATE messages SET body = ? WHERE id = ?", JSON.stringify(body), r.id);
        this.broadcast({ t: "message_update", message: this.toMessage({ ...r, body: JSON.stringify(body) }) });
        return;
      }
      case "subagent":
        if (ev.state === "start") {
          const from = this.team().agents.find((a) => a.slug === ev.parent_agent)?.name ?? ev.parent_agent;
          const to = this.team().agents.find((a) => a.slug === ev.agent)?.name ?? ev.agent;
          if (threadId) this.addMessage({ thread_id: threadId, run_id: run.id, author: `agent:${ev.parent_agent}`, kind: "handoff", body: { text: ev.task, from, to, agent: ev.agent, tool_id: ev.id }, parent: null });
          this.setDesk(ev.agent, "working", ev.task.slice(0, 90), run.id);
        } else {
          this.bumpDone(ev.agent);
          this.setDesk(ev.agent, "idle", null, null);
        }
        return;
      case "turn_end":
        this.updateRun(run.id, { status: "idle", cost_usd: ev.cost_usd });
        if (!ev.is_error) this.bumpDone(run.agent);
        // Teammates who helped in this turn are done; anyone still working in the background reports again.
        for (const d of this.rows<{ agent: string }>("SELECT agent FROM desks WHERE run_id = ? AND agent != ?", run.id, run.agent)) this.setDesk(d.agent, "idle", null, null);
        this.setDesk(run.agent, "idle", "In chat with you", run.id);
        return;
      case "progress":
        this.setDesk(ev.agent, "working", ev.text.slice(0, 90), run.id);
        return;
      case "usage": {
        const u: Usage = { five_hour: ev.five_hour, seven_day: ev.seven_day, five_hour_resets: ev.five_hour_resets, seven_day_resets: ev.seven_day_resets, status: ev.status, updated_at: Date.now() };
        this.setMeta("usage", JSON.stringify(u));
        this.broadcast({ t: "usage", usage: u });
        return;
      }
      case "limit": {
        if (ev.resets_at) this.setMeta("blocked_until", String(ev.resets_at));
        this.updateRun(run.id, { status: "blocked_limit" });
        this.setDesk(run.agent, "blocked", "Claude usage limit", run.id);
        this.system(threadId, run.id, `Claude usage limit: ${ev.text}`, { error: true });
        await this.ensureAlarm();
        return;
      }
      case "ask": {
        if (!threadId) return;
        const now = Date.now();
        this.sql.exec(
          "INSERT OR IGNORE INTO asks (id, run_id, thread_id, agent, kind, title, body, options, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)",
          ev.id, run.id, threadId, ev.agent, ev.kind, ev.title.slice(0, 200), ev.body, JSON.stringify(ev.options ?? []), now,
        );
        this.addMessage({ thread_id: threadId, run_id: run.id, author: `agent:${ev.agent}`, kind: ev.kind, body: { ask_id: ev.id, title: ev.title, text: ev.body, options: ev.options ?? [] } });
        this.setDesk(ev.agent, "waiting", ev.kind === "approval" ? `Waiting for your approval: ${ev.title}` : `Asked you: ${ev.title}`, run.id);
        this.broadcast({ t: "ask", ask: this.toAsk(this.one("SELECT * FROM asks WHERE id = ?", ev.id)!) });
        return;
      }
      case "task": {
        const now = Date.now();
        this.sql.exec("INSERT OR IGNORE INTO tasks (id, from_agent, to_agent, body, status, created_at) VALUES (?, ?, ?, ?, 'proposed', ?)", ev.id, ev.from, ev.to, ev.body, now);
        const to = this.team().agents.find((a) => a.slug === ev.to)?.name ?? ev.to;
        this.system(threadId, run.id, `Left a task for ${to}.`);
        this.broadcast({ t: "task", task: this.toTask(this.one("SELECT * FROM tasks WHERE id = ?", ev.id)!) });
        return;
      }
      case "dm": {
        const name = (slug: string) => this.team().agents.find((a) => a.slug === slug)?.name ?? slug;
        if (threadId && ev.text.trim()) {
          this.addMessage({ thread_id: threadId, run_id: run.id, author: `agent:${ev.from}`, kind: "dm", body: { from: ev.from, to: ev.to, text: ev.text } });
        }
        this.setDesk(ev.from, "working", `Talking to ${name(ev.to)}`, run.id);
        if (ev.to !== run.agent) this.setDesk(ev.to, "working", `Reading a message from ${name(ev.from)}`, run.id);
        return;
      }
      case "heartbeat":
        return;
      case "done": {
        if (threadId && ev.transcript_key) this.sql.exec("UPDATE threads SET transcript_key = ?, session_id = COALESCE(?, session_id) WHERE id = ?", ev.transcript_key, ev.session_id, threadId);
        if (ev.keep_open && run.profile === "studio" && ev.status === "done") {
          // The studio session is done; independent reviews, a possible fix and the final gate run in later jobs.
          this.updateRun(run.id, { status: "idle", stage: "review", token_hash: null });
          for (const d of this.rows<{ agent: string }>("SELECT agent FROM desks WHERE run_id = ?", run.id)) this.setDesk(d.agent, "idle", null, null);
          this.system(threadId, run.id, "Studio session finished. The independent reviewers (mute test, fact check) and the final gate run next.");
          for (const ws of this.ctx.getWebSockets(`run:${run.id}`)) { try { ws.close(1000, "session finished"); } catch { /* */ } }
          return;
        }
        this.finishRun(run.id, ev.status, ev.summary || null, ev.status === "failed" ? ev.summary || "the agent session failed" : null);
        return;
      }
    }
  }

  // ---------- watchdog ----------
  private async ensureAlarm() {
    if (!(await this.ctx.storage.getAlarm())) await this.ctx.storage.setAlarm(Date.now() + 60_000);
  }

  async alarm() {
    const now = Date.now();
    for (const r of this.rows(`SELECT * FROM runs WHERE status IN ${ACTIVE_SQL}`)) {
      const run = this.toRun(r);
      // a studio job installs its tools (ffmpeg, Python, HyperFrames) before it reports in
      if (run.status === "starting" && now - (run.claimed_at ?? run.created_at) > (run.profile === "studio" ? 2 : 1) * START_TIMEOUT_MS) {
        this.finishRun(run.id, "failed", null, "the GitHub runner did not start within 15 minutes (see the Runs tab)");
      } else if (run.profile === "studio" && run.status === "idle") {
        // Between studio jobs nobody is connected; the GitHub webhook ends the run if the workflow dies.
        if (run.last_seen && now - run.last_seen > 5 * 3600_000) this.finishRun(run.id, "lost", null, "the studio run did not report back");
      } else if ((run.status === "live" || run.status === "idle") && run.last_seen && now - run.last_seen > LOST_AFTER_MS && !this.runnerSocket(run.id)) {
        this.finishRun(run.id, "lost", null, "lost contact with the runner");
      }
    }
    const blockedUntil = Number(this.meta("blocked_until") ?? 0);
    if (blockedUntil && blockedUntil <= now) {
      this.setMeta("blocked_until", null);
      for (const r of this.rows("SELECT * FROM runs WHERE status = 'blocked_limit'")) this.finishRun(r.id as string, "failed", null, "the usage limit ended the run; send a message to continue");
      await this.startQueued();
    }
    if (this.one<{ n: number }>(`SELECT COUNT(*) AS n FROM runs WHERE status IN ${ACTIVE_SQL}`)!.n > 0) {
      await this.ctx.storage.setAlarm(now + 60_000);
    }
  }
}
