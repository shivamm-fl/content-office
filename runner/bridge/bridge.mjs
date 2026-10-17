#!/usr/bin/env node
// Office bridge: runs inside .github/workflows/office-run.yml (or locally for testing).
// 1. proves to the office that GitHub started it for RUN_ID (OIDC) and receives the work,
// 2. starts Claude Code headless (stream-json in/out) in teams/<team>/ with the team's agents and skills,
// 3. relays every message, tool call and teammate hand-off to the office live room, and the owner's
//    messages, answers and Stop back into the session,
// 4. serves the office tools (ask_owner, request_approval, ...) to the session over a local MCP server,
// 5. ends after IDLE minutes without a message from the owner, saves the transcript for the next run.
// The public Actions log only gets coarse progress lines; the conversation goes to the office only.
import { spawn } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import http from "node:http";
import os from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync, gzipSync } from "node:zlib";
import { mapClaudeEvent, newMapState, parseFrontmatter, roster } from "./events.mjs";
import { makeStudio, STUDIO_TOOLS } from "./studio.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const OFFICE = (process.env.OFFICE_URL || "").replace(/\/$/, "");
const RUN_ID = process.env.RUN_ID || "";
const TEAM = process.env.TEAM || "learnai";
const TEAM_DIR = join(ROOT, "teams", TEAM);
const CLAUDE_BIN = process.env.CLAUDE_BIN || "claude";
// File edits only inside the team folder (the session's working directory; "./**" is relative to it, tested: a write
// outside is refused); the shell is sandboxed to it as well.
const ALLOWED_TOOLS = [
  "Bash", "Read", "Glob", "Grep", "WebSearch", "WebFetch",
  "Write(./**)", "Edit(./**)", "MultiEdit(./**)", "NotebookEdit(./**)",
  "Agent", "Task", "SendMessage", "Skill", "TodoWrite", "mcp__office",
].join(",");

const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rid = (p) => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

if (!OFFICE || !RUN_ID) {
  console.error("OFFICE_URL and RUN_ID are required");
  process.exit(2);
}

// ---------- identity and claim ----------
async function identityHeaders() {
  if (process.env.DEV_RUNNER_KEY) return { "X-Dev-Runner-Key": process.env.DEV_RUNNER_KEY };
  const url = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  const tok = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
  if (!url || !tok) throw new Error("no OIDC: the job needs `permissions: id-token: write`");
  const r = await fetch(`${url}&audience=${encodeURIComponent(process.env.OIDC_AUDIENCE || "content-office")}`, {
    headers: { Authorization: `Bearer ${tok}` },
  });
  if (!r.ok) throw new Error(`OIDC token request failed: ${r.status}`);
  const { value } = await r.json();
  return { Authorization: `Bearer ${value}` };
}

async function claim() {
  const r = await fetch(`${OFFICE}/api/runner/claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await identityHeaders()) },
    body: JSON.stringify({ team: TEAM, run_id: RUN_ID }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`claim refused (${r.status}): ${j.error || "?"}`);
  return j;
}

// ---------- office socket (events out, commands in) ----------
class OfficeLink {
  constructor(token, onCommand) {
    this.url = `${OFFICE.replace(/^http/, "ws")}/api/runner/ws?team=${TEAM}&run=${RUN_ID}&token=${encodeURIComponent(token)}`;
    this.onCommand = onCommand;
    this.queue = [];
    this.ws = null;
    this.closing = false;
    this.backoff = 1000;
    this.timer = setInterval(() => this.flush(), 250);
  }
  connect() {
    return new Promise((resolveOpen) => {
      const ws = new WebSocket(this.url);
      ws.addEventListener("open", () => { this.ws = ws; this.backoff = 1000; this.flush(); resolveOpen(); });
      ws.addEventListener("message", (m) => {
        try { this.onCommand(JSON.parse(typeof m.data === "string" ? m.data : Buffer.from(m.data).toString())); } catch (e) { log("bad command", e.message); }
      });
      ws.addEventListener("close", () => {
        if (this.ws === ws) this.ws = null;
        if (!this.closing) setTimeout(() => this.connect().catch(() => undefined), (this.backoff = Math.min(this.backoff * 2, 15000)));
        resolveOpen();
      });
      ws.addEventListener("error", () => undefined);
    });
  }
  send(ev) {
    const last = this.queue[this.queue.length - 1];
    if (ev.t === "delta" && last?.t === "delta" && last.agent === ev.agent && last.parent === ev.parent) last.text += ev.text;
    else this.queue.push(ev);
    if (this.queue.length > 5000) this.queue = this.queue.filter((e) => e.t !== "delta").slice(-4000);
  }
  flush() {
    if (!this.ws || this.ws.readyState !== 1 || !this.queue.length) return;
    const batch = this.queue.splice(0, 200);
    try { this.ws.send(JSON.stringify({ events: batch })); } catch { this.queue.unshift(...batch); }
  }
  async drain(ms = 8000) {
    const end = Date.now() + ms;
    while (this.queue.length && Date.now() < end) { this.flush(); await sleep(150); }
  }
  close() {
    this.closing = true;
    clearInterval(this.timer);
    try { this.ws?.close(1000, "done"); } catch { /* */ }
  }
}

// ---------- office tools over MCP (local HTTP, JSON-RPC) ----------
const TOOLS = [
  {
    name: "ask_owner",
    description: "Ask the owner a question on their phone and wait for the answer (up to 60 minutes). Use for decisions you should not take alone. Give 2-4 short options when the answer is a choice.",
    inputSchema: { type: "object", properties: { question: { type: "string" }, options: { type: "array", items: { type: "string" } }, details: { type: "string", description: "Optional context shown under the question." } }, required: ["question"] },
  },
  {
    name: "request_approval",
    description: "Send a plan slate, a script or another deliverable to the owner for approval and wait for the decision (up to 60 minutes). The owner can approve, approve with edits (use their wording exactly), ask for changes with notes, or reject. Put the complete content in `content` (markdown).",
    inputSchema: { type: "object", properties: { kind: { type: "string", enum: ["plan", "script", "final", "other"] }, title: { type: "string" }, content: { type: "string" }, item_ids: { type: "array", items: { type: "string" } } }, required: ["kind", "title", "content"] },
  },
  {
    name: "report_progress",
    description: "Show one short status line on your desk in the office (what you are doing now).",
    inputSchema: { type: "object", properties: { text: { type: "string" } }, required: ["text"] },
  },
  {
    name: "message_agent",
    description: "Leave a task for a teammate who is not in this session (the owner sees it as a task card and can start it). Use the teammate's slug, e.g. strategist, researcher, scriptwriter, packager, growth-analyst, community-manager.",
    inputSchema: { type: "object", properties: { to: { type: "string" }, message: { type: "string" } }, required: ["to", "message"] },
  },
  {
    name: "request_build",
    description: "Hand one reel to the studio: it builds the video (voice, animation, render, cover, captions), the independent reviewers check it, and the finished reel goes to the owner for approval. Give the item id, the full queue item (JSON object) and the script the scriptwriter wrote. One call per reel; the studio builds a few at a time.",
    inputSchema: { type: "object", properties: { item_id: { type: "string" }, item: { type: "object" }, script: { type: "string" }, notes: { type: "string" } }, required: ["item_id", "item"] },
  },
  {
    name: "team_feed",
    description: "What the other desks did: the team's recent conversations (who, what, what the owner decided), open tasks between desks, or one conversation in full when you pass its thread_id. Use it before you say a teammate has done nothing, and whenever the owner refers to another desk's work.",
    inputSchema: { type: "object", properties: { thread_id: { type: "string", description: "Optional: a conversation id from the feed, to read it in full." } } },
  },
  {
    name: "team_roster",
    description: "Who is on the team in this session and how to reach them: teammate slug -> the address for SendMessage (the lead is \"main\"). Use it to talk to a teammate directly with SendMessage(to=<address>, message=...); their answer comes back to you as a message. A teammate missing from the roster is not working yet: ask the lead (SendMessage to \"main\") to bring them in.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "read_ai_course",
    description: "Read a file of the private publishing repo ai-course (read-only), e.g. state/covered.json, state/phase5_status.json, state/insights.json, state/yt_insights.json, state/learnings.md, roadmap/ai-engineer.json, reels/<folder>/script.txt, social/<folder>.hi.caption.txt.",
    inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] },
  },
];

function startMcp(ctx) {
  const waiters = new Map();
  ctx.resolveAsk = (askId, answer) => {
    const w = waiters.get(askId);
    if (w) { waiters.delete(askId); w(answer); }
  };
  const waitFor = (askId) => new Promise((res) => {
    waiters.set(askId, res);
    setTimeout(() => { if (waiters.delete(askId)) res(null); }, 60 * 60_000);
  });
  const text = (t, isError = false) => ({ content: [{ type: "text", text: t }], isError });

  async function call(name, a) {
    const agent = ctx.currentAgent();
    if (name === "report_progress") { ctx.link.send({ t: "progress", agent, text: String(a.text || "").slice(0, 200) }); return text("ok"); }
    if (name === "message_agent") {
      const to = String(a.to || "").trim();
      if (!ctx.team.agents.some((x) => x.slug === to)) return text(`Unknown teammate "${to}". Teammates: ${ctx.team.agents.map((x) => x.slug).join(", ")}`, true);
      ctx.link.send({ t: "task", id: rid("task"), from: agent, to, body: String(a.message || "").slice(0, 8000) });
      return text(`Task left for ${to}. The owner decides when it starts.`);
    }
    if (name === "request_build") {
      const r = await fetch(`${OFFICE}/api/runner/build?team=${TEAM}&run=${RUN_ID}`, {
        method: "POST", headers: { "X-Run-Token": ctx.token, "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: a.item_id, item: a.item, script: a.script, notes: a.notes }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) return text(`The studio refused: ${j.error ?? r.status}`, true);
      return text(j.reused ? `${a.item_id} is already in the studio (run ${j.run_id}).` : `${a.item_id} is in the studio queue (run ${j.run_id}). The finished reel goes to the owner's inbox.`);
    }
    if (name === "team_feed") {
      const q = a.thread_id ? `&thread=${encodeURIComponent(String(a.thread_id))}` : "";
      const r = await fetch(`${OFFICE}/api/runner/feed?team=${TEAM}&run=${RUN_ID}${q}`, { headers: { "X-Run-Token": ctx.token } });
      return text(await r.text(), !r.ok);
    }
    if (name === "team_roster") {
      const r = ctx.roster();
      const names = Object.fromEntries(ctx.team.agents.map((x) => [x.slug, x.name]));
      const lines = Object.entries(r).map(([slug, addr]) => `${slug} (${names[slug] ?? slug}): ${addr}`);
      const absent = ctx.team.agents.filter((x) => !(x.slug in r)).map((x) => x.slug);
      const missing = absent.length ? [`Not working yet: ${absent.join(", ")} (ask main to bring one in)`] : [];
      return text(["On the team now (slug: SendMessage address):", ...lines, ...missing].join("\n"));
    }
    if (name === "read_ai_course") {
      const r = await fetch(`${OFFICE}/api/runner/ai-course?team=${TEAM}&run=${RUN_ID}&path=${encodeURIComponent(a.path || "")}`, { headers: { "X-Run-Token": ctx.token } });
      return text(await r.text(), !r.ok);
    }
    if (name === "ask_owner" || name === "request_approval") {
      const id = rid("ask");
      const approval = name === "request_approval";
      const options = approval ? [] : Array.isArray(a.options) ? a.options.slice(0, 6).map(String) : [];
      const title = approval ? String(a.title || "Approval") : String(a.question || "");
      const body = approval ? String(a.content || "") : String(a.details || "");
      ctx.link.send({ t: "ask", id, agent, kind: approval ? "approval" : "question", title, body: approval ? `${a.kind ? `[${a.kind}] ` : ""}${body}` : body, options });
      ctx.waiting++;
      const ans = await waitFor(id);
      ctx.waiting--;
      if (!ans) return text("No answer within 60 minutes. Continue with your best judgement where it is safe, say so in your report, or stop and summarise.");
      if (!approval) return text(`Owner's answer: ${ans.choice ?? ""}${ans.choice && ans.text ? " | " : ""}${ans.text ?? ""}`.trim());
      const parts = [`Decision: ${ans.decision}`];
      if (ans.notes) parts.push(`Owner's notes: ${ans.notes}`);
      if (ans.edited) parts.push(`Owner's edited version (use this wording exactly):\n${ans.edited}`);
      return text(parts.join("\n\n"));
    }
    if (ctx.studio && STUDIO_TOOLS.some((t) => t.name === name)) {
      try { return await ctx.studio.call(name, a); } catch (e) { return text(e.message, true); }
    }
    return text(`unknown tool ${name}`, true);
  }

  const server = http.createServer(async (req, res) => {
    if (req.method !== "POST") { res.writeHead(405).end(); return; }
    let raw = "";
    for await (const c of req) raw += c;
    let msg;
    try { msg = JSON.parse(raw); } catch { res.writeHead(400).end(); return; }
    const handle = async (m) => {
      if (m.id === undefined) return null; // notification
      if (m.method === "initialize") {
        return { jsonrpc: "2.0", id: m.id, result: { protocolVersion: m.params?.protocolVersion || "2025-06-18", capabilities: { tools: {} }, serverInfo: { name: "office", version: "1.0.0" } } };
      }
      if (m.method === "ping") return { jsonrpc: "2.0", id: m.id, result: {} };
      if (m.method === "tools/list") return { jsonrpc: "2.0", id: m.id, result: { tools: ctx.studio ? [...TOOLS, ...STUDIO_TOOLS] : TOOLS } };
      if (m.method === "tools/call") {
        try { return { jsonrpc: "2.0", id: m.id, result: await call(m.params?.name, m.params?.arguments || {}) }; }
        catch (e) { return { jsonrpc: "2.0", id: m.id, result: text(`office tool failed: ${e.message}`, true) }; }
      }
      return { jsonrpc: "2.0", id: m.id, error: { code: -32601, message: "method not found" } };
    };
    const out = Array.isArray(msg) ? (await Promise.all(msg.map(handle))).filter(Boolean) : await handle(msg);
    if (!out || (Array.isArray(out) && !out.length)) { res.writeHead(202).end(); return; }
    res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify(out));
  });
  return new Promise((res) => server.listen(0, "127.0.0.1", () => res({ server, port: server.address().port })));
}

// ---------- transcript ----------
function findTranscript(sessionId) {
  const base = join(os.homedir(), ".claude", "projects");
  if (!sessionId || !existsSync(base)) return null;
  for (const d of readdirSync(base)) {
    const p = join(base, d, `${sessionId}.jsonl`);
    if (existsSync(p)) return p;
  }
  return null;
}

async function uploadTranscript(token, sessionId) {
  const p = findTranscript(sessionId);
  if (!p) return null;
  const data = gzipSync(readFileSync(p));
  const r = await fetch(`${OFFICE}/api/runner/transcript?team=${TEAM}&run=${RUN_ID}`, { method: "PUT", headers: { "X-Run-Token": token, "Content-Type": "application/gzip" }, body: data });
  return r.ok ? (await r.json()).key : null;
}

async function downloadTranscript(token, resume) {
  const r = await fetch(`${OFFICE}/api/runner/transcript?team=${TEAM}&run=${RUN_ID}&key=${encodeURIComponent(resume.key)}`, { headers: { "X-Run-Token": token } });
  if (!r.ok) return null;
  const dir = join(os.tmpdir(), "office-resume");
  mkdirSync(dir, { recursive: true });
  const p = join(dir, `${resume.session_id}.jsonl`);
  writeFileSync(p, gunzipSync(Buffer.from(await r.arrayBuffer())));
  return p;
}

// ---------- the session ----------
function systemPrompt(work) {
  const protocol = readFileSync(join(ROOT, "company", "office-protocol.md"), "utf8");
  const agentFile = join(TEAM_DIR, ".claude", "agents", `${work.agent.slug}.md`);
  const { body } = existsSync(agentFile) ? parseFrontmatter(readFileSync(agentFile, "utf8")) : { body: "" };
  const team = work.team.agents.map((a) => `${a.slug} (${a.name})`).join(", ");
  const recent = work.digest
    ? `\n\n# What the other desks did recently\nOther conversations of the team (newest first). Read one in full with mcp__office__team_feed(thread_id). Their files reach the repo when their session closes.\n${work.digest}`
    : "";
  return `${protocol}\n\n# Who you are\nYou are **${work.agent.name}** (${work.agent.title}) of the ${work.team.name} team. Teammates: ${team}.\nOffice run ${RUN_ID}. Today is ${new Date().toISOString().slice(0, 10)}.\n\n${body}${recent}`;
}

function agentModel(work) {
  const f = join(TEAM_DIR, ".claude", "agents", `${work.agent.slug}.md`);
  const fm = existsSync(f) ? parseFrontmatter(readFileSync(f, "utf8")).meta : {};
  return process.env.OFFICE_MODEL || (fm.model && fm.model !== "inherit" ? fm.model : work.team.model);
}

function firstMessage(work, resumed) {
  const name = (author) => author === "owner" ? "Owner" : work.team.agents.find((a) => `agent:${a.slug}` === author)?.name || author.replace(/^agent:/, "");
  const notes = work.messages.map((m) => m.text).join("\n\n");
  const item = work.run.item;
  // Studio sessions: one reel, one job of the studio workflow (prompts/studio.md has the three modes).
  if (work.run.mode === "build") return `Studio BUILD. Follow prompts/studio.md (BUILD) for this brief.\n\n${notes}`;
  if (work.run.mode === "fix") return `Studio FIX for REEL=${item}. The independent reviewers found problems (qa/visual_${item}.json, qa/facts_${item}.json). Follow prompts/studio.md (FIX).`;
  if (work.run.mode === "revise") return `Studio REVISE for REEL=${item}. The owner watched the reel and asked for changes:\n\n${notes}\n\nFollow prompts/studio.md (REVISE).`;
  const parts = [];
  if (!resumed && work.history?.length) {
    parts.push("Earlier in this chat (for context):\n\n" + work.history.map((h) => `${name(h.author)}: ${h.text}`).join("\n\n") + "\n\n---\nThe owner's new message:");
  }
  parts.push(work.messages.map((m) => m.text).join("\n\n"));
  return parts.join("\n\n");
}

function childEnv() {
  const env = { ...process.env };
  for (const k of Object.keys(env)) {
    if (k === "CLAUDE_CODE_OAUTH_TOKEN" || k === "ANTHROPIC_API_KEY") continue;
    if (/TOKEN|SECRET|PASSWORD|KEY$|_KEY_|COOKIE/i.test(k)) delete env[k];
  }
  Object.assign(env, {
    CLAUDE_CODE_SUBPROCESS_ENV_SCRUB: "1",
    CLAUDE_CODE_FORWARD_SUBAGENT_TEXT: "1",
    MCP_TOOL_TIMEOUT: "3700000",
    CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT: "3700000",
    DISABLE_AUTOUPDATER: "1",
    BASH_MAX_TIMEOUT_MS: "600000",
  });
  return env;
}

async function main() {
  log(`office run ${RUN_ID} (${TEAM}) claiming…`);
  const work = await claim();
  log(`claimed: agent ${work.agent.slug}, ${work.messages.length} message(s)`);
  const ctx = { token: work.token, team: work.team, waiting: 0, link: null, resolveAsk: () => undefined, currentAgent: () => work.agent.slug };
  const state = newMapState(work.agent.slug);
  ctx.roster = () => roster(state);
  if (work.run.profile === "studio") {
    const python = process.env.OFFICE_PY || join(TEAM_DIR, ".venv", process.platform === "win32" ? "Scripts/python.exe" : "bin/python");
    ctx.studio = makeStudio({ teamDir: TEAM_DIR, python, onProgress: (t) => ctx.link?.send({ t: "progress", agent: ctx.currentAgent(), text: t }) });
  }
  let child = null;
  let ending = false;
  let busy = true;
  let idleTimer = null;
  const seen = new Set(work.messages.map((m) => m.id));
  const idleMs = (work.settings?.idle_minutes ?? 15) * 60_000;
  const hardStop = setTimeout(() => endSession("time limit of this runner reached"), (work.settings?.max_minutes ?? 340) * 60_000);

  const writeUser = (text) => {
    if (!child || ending) return;
    child.stdin.write(JSON.stringify({ type: "user", message: { role: "user", content: text }, parent_tool_use_id: null }) + "\n");
    busy = true;
    clearTimeout(idleTimer);
  };
  const endSession = (why) => {
    if (ending) return;
    ending = true;
    log(`ending session: ${why}`);
    clearTimeout(idleTimer);
    try { child?.stdin.end(); } catch { /* */ }
    // Claude Code finishes background teammates itself after stdin closes (its own 10-minute ceiling).
    setTimeout(() => child?.kill("SIGINT"), 12 * 60_000);
    setTimeout(() => child?.kill("SIGKILL"), 13 * 60_000);
  };
  // Teammates working in the background (system/background_tasks_changed). The session never ends while one works:
  // a lead's turn can finish while the scriptwriter is still writing.
  let background = 0;
  const scheduleEnd = () => {
    clearTimeout(idleTimer);
    if (busy || ctx.waiting || background > 0 || ending) return;
    const wait = work.settings?.task_mode ? 45_000 : idleMs;
    idleTimer = setTimeout(() => {
      if (!busy && !ctx.waiting && background === 0) endSession(work.settings?.task_mode ? "the task is done" : `no message for ${idleMs / 60000} minutes`);
    }, wait);
  };

  ctx.link = new OfficeLink(work.token, (cmd) => {
    if (cmd.t === "user_message" && !seen.has(cmd.id)) { seen.add(cmd.id); writeUser(cmd.text); }
    else if (cmd.t === "answer") ctx.resolveAsk(cmd.ask_id, cmd.answer);
    else if (cmd.t === "interrupt" && child) child.stdin.write(JSON.stringify({ type: "control_request", request_id: rid("req"), request: { subtype: "interrupt" } }) + "\n");
    else if (cmd.t === "end") endSession("the owner ended the session");
  });
  await ctx.link.connect();
  const heartbeat = setInterval(() => ctx.link.send({ t: "heartbeat" }), 30_000);

  const mcp = await startMcp(ctx);
  const tmp = join(os.tmpdir(), `office-${RUN_ID}`);
  mkdirSync(tmp, { recursive: true });
  const promptFile = join(tmp, "system.md");
  writeFileSync(promptFile, systemPrompt(work));
  const mcpFile = join(tmp, "mcp.json");
  writeFileSync(mcpFile, JSON.stringify({ mcpServers: { office: { type: "http", url: `http://127.0.0.1:${mcp.port}/mcp` } } }));

  let resumePath = null;
  if (work.resume) {
    resumePath = await downloadTranscript(work.token, work.resume).catch(() => null);
    log(resumePath ? "resuming the previous session" : "previous session not available; briefing from the chat");
  }

  const start = (useResume) => {
    const args = [
      "-p", "--input-format", "stream-json", "--output-format", "stream-json", "--verbose",
      "--include-partial-messages", "--forward-subagent-text",
      "--model", agentModel(work), "--max-turns", String(work.settings?.max_turns ?? 400),
      "--permission-mode", "acceptEdits", "--permission-prompts", "none",
      "--allowedTools", ALLOWED_TOOLS,
      "--mcp-config", mcpFile, "--strict-mcp-config",
      "--append-system-prompt-file", promptFile,
      // no unsandboxed retries: a command that needs the network or a key is a studio tool, run by the bridge
      "--settings", JSON.stringify({ sandbox: { allowUnsandboxedCommands: false } }),
    ];
    if (useResume && resumePath) args.push("--resume", resumePath);
    const win = process.platform === "win32";
    const c = spawn(CLAUDE_BIN, win ? args.map((a) => (/[\s"]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a)) : args, {
      cwd: TEAM_DIR, env: childEnv(), stdio: ["pipe", "pipe", "pipe"], shell: win,
    });
    let buf = "";
    let gotInit = false;
    c.stdout.on("data", (d) => {
      buf += d.toString();
      let i;
      while ((i = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, i);
        buf = buf.slice(i + 1);
        if (!line.trim()) continue;
        let ev;
        try { ev = JSON.parse(line); } catch { continue; }
        if (ev.type === "system" && ev.subtype === "init") gotInit = true;
        if (process.env.OFFICE_DEBUG_EVENTS) appendFileSync(process.env.OFFICE_DEBUG_EVENTS, `${line}\n`);
        for (const out of mapClaudeEvent(state, ev, { teamDir: TEAM_DIR })) ctx.link.send(out);
        if (ev.type === "assistant" || ev.type === "stream_event") {
          // a turn is running (also one Claude starts by itself when a background teammate reports back)
          busy = true;
          clearTimeout(idleTimer);
        }
        if (ev.type === "system" && ev.subtype === "background_tasks_changed") {
          background = (ev.tasks ?? []).length;
          if (background === 0) scheduleEnd();
          else clearTimeout(idleTimer);
        }
        if (ev.type === "result") {
          busy = false;
          log(`turn finished (${ev.num_turns ?? "?"} steps, session cost so far $${(ev.total_cost_usd ?? 0).toFixed(3)}${background ? `, ${background} teammate(s) still working` : ""})`);
          // Task mode (studio jobs, the work day): done when the turn is done and no teammate works in the background.
          scheduleEnd();
        }
      }
    });
    c.stderrTail = "";
    c.stderr.on("data", (d) => {
      const s = d.toString();
      c.stderrTail = (c.stderrTail + s).slice(-4000);
      if (s.trim()) log("claude:", s.trim().slice(0, 300));
    });
    c.gotInit = () => gotInit;
    return c;
  };

  let usedResume = Boolean(resumePath);
  child = start(usedResume);
  writeUser(firstMessage(work, usedResume));

  let code = await new Promise((res) => child.on("exit", (c) => res(c)));
  if (code !== 0 && usedResume && !child.gotInit()) {
    log("resume failed; starting a fresh session briefed from the chat");
    usedResume = false;
    state.reset?.();
    child = start(false);
    writeUser(firstMessage(work, false));
    code = await new Promise((res) => child.on("exit", (c) => res(c)));
  }
  clearTimeout(hardStop);
  clearInterval(heartbeat);
  log(`claude exited with code ${code}`);

  const key = await uploadTranscript(work.token, state.sessionId).catch(() => null);
  const failed = code !== 0 && !ending;
  let summary = "";
  if (failed && !child.gotInit()) {
    // A start-up crash carries no conversation; print the end of it so the public log shows the cause.
    const lines = child.stderrTail.split("\n").filter((l) => !/^\s*\d+ \| /.test(l));
    log(`claude start-up error:\n${lines.join("\n").replace(/sk-ant-[\w-]+/g, "***").slice(-1500)}`);
    const auth = /auth|login|token|401|403|credential/i.test(child.stderrTail);
    summary = auth
      ? "Claude Code could not sign in. Check the CLAUDE_CODE_OAUTH_TOKEN secret of the office repo (claude setup-token makes a new one)."
      : "Claude Code could not start on the runner (see the GitHub log).";
  } else if (failed) {
    summary = `Claude Code stopped with exit code ${code}.`;
  }
  // A studio session is one job of the studio workflow: the run stays open for the reviews and the final gate.
  const keepOpen = Boolean(work.run.mode) && !failed;
  ctx.link.send({ t: "done", status: failed ? "failed" : "done", summary, transcript_key: key, session_id: state.sessionId, keep_open: keepOpen });
  await ctx.link.drain();
  ctx.link.close();
  mcp.server.close();
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  log(`bridge failed: ${e.message}`);
  process.exit(1);
});
