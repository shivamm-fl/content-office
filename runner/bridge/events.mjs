// Map Claude Code stream-json events to office events (pure, unit-tested in events.test.mjs).
import { relative } from "node:path";

export function newMapState(lead) {
  const s = { lead, sessionId: null, subagents: new Map() };
  s.reset = () => { s.sessionId = null; s.subagents.clear(); };
  return s;
}

export function parseFrontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: text.slice(m[0].length) };
}

const clip = (s, n) => {
  const t = String(s ?? "").replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n - 1) + "…" : t;
};

export function summarizeTool(name, input = {}, teamDir = "") {
  const rel = (p) => (p && teamDir ? relative(teamDir, String(p)).replace(/\\/g, "/") : String(p ?? ""));
  switch (name) {
    case "Bash": return input.description ? clip(input.description, 140) : `$ ${clip(input.command, 140)}`;
    case "Read": return `Read ${rel(input.file_path)}`;
    case "Write": return `Write ${rel(input.file_path)}`;
    case "Edit": case "MultiEdit": return `Edit ${rel(input.file_path)}`;
    case "NotebookEdit": return `Edit ${rel(input.notebook_path)}`;
    case "Glob": return `Find files ${clip(input.pattern, 80)}`;
    case "Grep": return `Search for "${clip(input.pattern, 80)}"`;
    case "WebFetch": return `Read ${clip(input.url, 140)}`;
    case "WebSearch": return `Search the web: ${clip(input.query, 120)}`;
    case "Skill": return `Use the ${clip(input.skill ?? input.command ?? "", 60)} skill`;
    case "TodoWrite": return "Update the to-do list";
    default: return name.startsWith("mcp__") ? name.split("__").slice(-1)[0].replace(/_/g, " ") : name;
  }
}

function resultText(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map((c) => (c?.type === "text" ? c.text : c?.type === "image" ? "[image]" : "")).join(" ");
  return "";
}

// Shown in the chat in their own form (questions, approvals) or not at all (internal plumbing).
const HIDDEN_TOOLS = new Set(["mcp__office__ask_owner", "mcp__office__request_approval", "mcp__office__report_progress", "mcp__office__message_agent", "ToolSearch"]);

/** Returns a list of office events for one Claude Code stream-json event. */
export function mapClaudeEvent(state, ev, opts = {}) {
  const out = [];
  const agentOf = (parent) => (parent ? state.subagents.get(parent) ?? "teammate" : state.lead);
  const parent = ev.parent_tool_use_id ?? null;
  switch (ev.type) {
    case "system":
      if (ev.subtype === "init") {
        state.sessionId = ev.session_id;
        out.push({ t: "session", session_id: ev.session_id, model: ev.model });
      }
      break;
    case "rate_limit_event": {
      const i = ev.rate_limit_info ?? {};
      const w = i.unifiedWindows ?? {};
      const ms = (s) => (typeof s === "number" ? s * 1000 : null);
      out.push({
        t: "usage",
        five_hour: w.five_hour?.utilization ?? null, seven_day: w.seven_day?.utilization ?? null,
        five_hour_resets: ms(w.five_hour?.resetsAt), seven_day_resets: ms(w.seven_day?.resetsAt), status: i.status ?? null,
      });
      if (i.status === "rejected") out.push({ t: "limit", text: `${i.rateLimitType ?? "usage"} limit reached`, resets_at: ms(i.resetsAt) });
      break;
    }
    case "stream_event": {
      const e = ev.event;
      if (e?.type === "content_block_delta" && e.delta?.type === "text_delta" && e.delta.text) {
        out.push({ t: "delta", agent: agentOf(parent), parent, text: e.delta.text });
      }
      break;
    }
    case "assistant": {
      const agent = agentOf(parent);
      for (const b of ev.message?.content ?? []) {
        if (b.type === "text" && b.text?.trim()) out.push({ t: "message", agent, parent, text: b.text });
        else if (b.type === "tool_use") {
          if (b.name === "Agent" || b.name === "Task") {
            const sub = String(b.input?.subagent_type || "general-purpose");
            state.subagents.set(b.id, sub);
            out.push({ t: "subagent", id: b.id, agent: sub, parent_agent: agent, task: clip(b.input?.description || b.input?.prompt, 160), state: "start" });
          } else if (!HIDDEN_TOOLS.has(b.name)) {
            out.push({ t: "tool", agent, parent, id: b.id, name: b.name, summary: summarizeTool(b.name, b.input, opts.teamDir) });
          }
        }
      }
      break;
    }
    case "user": {
      const content = ev.message?.content;
      if (!Array.isArray(content)) break;
      for (const b of content) {
        if (b.type !== "tool_result") continue;
        if (state.subagents.has(b.tool_use_id)) {
          out.push({ t: "subagent", id: b.tool_use_id, agent: state.subagents.get(b.tool_use_id), parent_agent: agentOf(parent), task: "", state: "end" });
        } else {
          out.push({ t: "tool_result", id: b.tool_use_id, ok: !b.is_error, summary: clip(resultText(b.content), 400) });
        }
      }
      break;
    }
    case "result": {
      out.push({ t: "turn_end", cost_usd: ev.total_cost_usd ?? 0, is_error: Boolean(ev.is_error), text: clip(ev.result, 300) });
      if (ev.is_error && /usage limit|rate limit|limit reached/i.test(String(ev.result ?? ""))) {
        const m = /\|(\d{10})/.exec(String(ev.result));
        out.push({ t: "limit", text: clip(ev.result, 200), resets_at: m ? Number(m[1]) * 1000 : null });
      }
      break;
    }
  }
  return out;
}
