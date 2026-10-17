import assert from "node:assert/strict";
import test from "node:test";
import { mapClaudeEvent, newMapState, parseFrontmatter, summarizeTool } from "./events.mjs";

test("init gives the session id", () => {
  const s = newMapState("producer");
  const out = mapClaudeEvent(s, { type: "system", subtype: "init", session_id: "abc", model: "m" });
  assert.deepEqual(out, [{ t: "session", session_id: "abc", model: "m" }]);
  assert.equal(s.sessionId, "abc");
});

test("subagent hand-off is attributed and its messages carry the teammate", () => {
  const s = newMapState("producer");
  const start = mapClaudeEvent(s, { type: "assistant", parent_tool_use_id: null, message: { content: [{ type: "tool_use", id: "tu1", name: "Agent", input: { subagent_type: "strategist", description: "Plan 3 items" } }] } });
  assert.equal(start[0].t, "subagent");
  assert.equal(start[0].agent, "strategist");
  assert.equal(start[0].parent_agent, "producer");
  const inner = mapClaudeEvent(s, { type: "assistant", parent_tool_use_id: "tu1", message: { content: [{ type: "text", text: "Here is the slate" }] } });
  assert.deepEqual(inner, [{ t: "message", agent: "strategist", parent: "tu1", text: "Here is the slate" }]);
  const end = mapClaudeEvent(s, { type: "user", parent_tool_use_id: null, message: { content: [{ type: "tool_result", tool_use_id: "tu1", content: "done" }] } });
  assert.equal(end[0].state, "end");
});

test("tools are summarised and office tools are not shown twice", () => {
  const s = newMapState("producer");
  const out = mapClaudeEvent(s, { type: "assistant", message: { content: [
    { type: "tool_use", id: "a", name: "WebFetch", input: { url: "https://example.com/x" } },
    { type: "tool_use", id: "b", name: "mcp__office__ask_owner", input: { question: "?" } },
  ] } }, { teamDir: "/t" });
  assert.equal(out.length, 1);
  assert.equal(out[0].summary, "Read https://example.com/x");
  const res = mapClaudeEvent(s, { type: "user", message: { content: [{ type: "tool_result", tool_use_id: "a", is_error: true, content: [{ type: "text", text: "404" }] }] } });
  assert.deepEqual(res, [{ t: "tool_result", id: "a", ok: false, summary: "404" }]);
});

test("text deltas stream", () => {
  const s = newMapState("producer");
  const out = mapClaudeEvent(s, { type: "stream_event", parent_tool_use_id: null, event: { type: "content_block_delta", delta: { type: "text_delta", text: "Hi" } } });
  assert.deepEqual(out, [{ t: "delta", agent: "producer", parent: null, text: "Hi" }]);
});

test("usage and limits", () => {
  const s = newMapState("producer");
  const out = mapClaudeEvent(s, { type: "rate_limit_event", rate_limit_info: { status: "rejected", resetsAt: 1792258800, rateLimitType: "five_hour", unifiedWindows: { five_hour: { utilization: 1, resetsAt: 1792258800 }, seven_day: { utilization: 0.5, resetsAt: 1792562400 } } } });
  assert.equal(out[0].t, "usage");
  assert.equal(out[0].five_hour, 1);
  assert.equal(out[1].t, "limit");
  assert.equal(out[1].resets_at, 1792258800000);
  const r = mapClaudeEvent(s, { type: "result", is_error: true, result: "Claude AI usage limit reached|1792258800", total_cost_usd: 0.1 });
  assert.equal(r[1].t, "limit");
});

test("frontmatter and summaries", () => {
  const { meta, body } = parseFrontmatter("---\nname: x\nmodel: inherit\n---\nHello");
  assert.equal(meta.model, "inherit");
  assert.equal(body, "Hello");
  assert.equal(summarizeTool("Bash", { command: "ls", description: "List files" }), "List files");
});
