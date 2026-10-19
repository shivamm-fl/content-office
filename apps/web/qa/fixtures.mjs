// @ts-check
// Browser-only fixtures. Shapes are checked against @office/protocol with JSDoc.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = resolve(fileURLToPath(new URL("../../../", import.meta.url)));
export const teams = ["learnai", "dsa", "systemdesign"].map((slug) =>
  JSON.parse(readFileSync(resolve(root, "teams", slug, "team.json"), "utf8")));
const now = Date.now();
const thread = (id, title, kind, agent = "producer", more = {}) => ({
  id, agent, title, kind, created_at: now - 3600000, updated_at: now - 15000,
  last_run: null, session_id: null, preview: "The team is moving this forward.", ...more,
});
const run = (id, thread_id, agent, profile = "desk", more = {}) => ({
  id, thread_id, agent, profile, status: "live", gh_run_id: null, created_at: now - 360000,
  claimed_at: now - 350000, last_seen: now - 1000, ended_at: null,
  cost_usd: .42, summary: null, error: null, ...more,
});
const finalMeta = {
  type: "final", item: "e034", title: "How a retrieval system finds the right answer",
  video_url: "/qa/placeholder.mp4", cover_url: "/qa/placeholder.svg", thumb_url: "/qa/placeholder.svg",
  caption: "A retrieval system is a map from questions to evidence.", youtube: "Retrieval, explained",
  script: "Hook. Show the index. Retrieve. Rank. Answer.", duration_s: 24, checks: [],
};
export function makeFixture(slug = "learnai", scenario = "busy") {
  const base = teams.find((t) => t.slug === slug) ?? teams[0];
  /** @type {import('@office/protocol').Team} */
  const team = scenario === "fifteen" ? { ...base,
    agents: [...base.agents, ...base.agents.slice(0, 6).map((a, i) => ({ ...a, slug: `${a.slug}-extra-${i}`, name: `${a.name} ${i + 2}` }))],
    rooms: base.rooms.map((r) => r.id === "plan" ? { ...r, agents: [...(r.agents ?? []), ...base.agents.slice(0, 6).map((a, i) => `${a.slug}-extra-${i}`)] } : r),
  } : base;
  const empty = scenario === "empty";
  const threads = empty ? [] : [
    thread("day-1", "Monday production run", "workday", "producer", { last_run: "run-day" }),
    thread("build-1", "Build e034: How retrieval systems find answers", "build", "post-production", { item: "e034", day: "day-1", last_run: "run-studio" }),
    thread("build-2", "Build e035: A very long title about retrieval augmented generation, index selection, ranking, embeddings, caching, latency budgets, production failures and what teams should measure before launch", "build", "post-production", { item: "e035", day: "day-1", last_run: "run-studio-2" }),
    thread("chat-1", "Questions for the Producer", "chat", "producer", { preview: "Let's make the next three reels." }),
  ];
  const runs = empty ? [] : [
    run("run-day", "day-1", "producer"),
    run("run-studio", "build-1", "post-production", "studio", { item: "e034", stage: "final" }),
    run("run-studio-2", "build-2", "motion-designer", "studio", { item: "e035", stage: "build" }),
  ];
  /** @type {import('@office/protocol').Ask[]} */
  const asks = empty ? [] : [{
    id: "ask-final", run_id: "run-studio", thread_id: "build-1", agent: "post-production",
    kind: "approval", title: "Approve the finished reel", body: "[final] Ready for review",
    options: [], status: "pending", answer: null, created_at: now - 40000, answered_at: null,
    meta: finalMeta,
  }, {
    id: "ask-script", run_id: "run-day", thread_id: "day-1", agent: "scriptwriter",
    kind: "approval", title: "Approve the opening hook", body: "[script] Retrieval is only useful when it finds evidence.",
    options: [], status: "pending", answer: null, created_at: now - 30000, answered_at: null,
  }];
  /** @type {import('@office/protocol').OfficeState} */
  const state = {
    team,
    desks: team.agents.map((a, i) => ({ agent: a.slug, status: empty ? "idle" : i === 0 || i === 8 ? "working" : i === 3 ? "waiting" : i === 7 ? "working" : "idle",
      activity: empty ? null : i === 0 ? "Coordinating today's reels" : i === 8 ? "Rendering e034" : i === 3 ? "Needs hook approval" : i === 7 ? "Composing e035" : null,
      run_id: empty ? null : i === 0 ? "run-day" : i === 8 ? "run-studio" : i === 7 ? "run-studio-2" : null,
      updated_at: now - 10000, done: i * 3 + 2 })),
    runs, asks, tasks: empty ? [] : [{ id: "task-1", from_agent: "researcher", to_agent: "strategist", body: "Check the source for the next reel.", status: "proposed", thread_id: "chat-1", created_at: now - 55000 }],
    threads,
    usage: { five_hour: scenario === "limit" ? .99 : .7, seven_day: .42, five_hour_resets: now + 7200000, seven_day_resets: now + 172800000, status: scenario === "limit" ? "rejected" : null, updated_at: now },
  };
  /** @type {import('@office/protocol').CalendarData} */
  const calendar = {
    team: team.slug, publishing: true, now, today: "2026-10-19", clock: "10:00", paused: false,
    window: ["09:00", "21:00"], slot_times: ["12:00", "18:00"], posts_per_slot: 1,
    can_post_now: true, last_post_hours: 24, slots: true,
    ready: [{ item: "e033", track: team.tracks[0].id, title: "Indexing for real products",
      duration_s: 27, cover_url: "/qa/placeholder.svg", source: "office", can_schedule: true }],
    days: [{ date: "2026-10-20", label: "Tomorrow", slots: [{ date: "2026-10-20", time: "12:00", started: false, open: true, scheduled: 0,
      cells: [{ track: team.tracks[0].id, item: null, title: null, link: null, at: null, state: "empty" }] }], extras: [] }],
    pipeline: [{ item: "e034", track: team.tracks[0].id, title: finalMeta.title, stage: "approval", detail: "Waiting for your review", thread_id: "build-1" },
      { item: "e035", track: team.tracks[0].id, title: "Inside a vector index", stage: "studio", detail: "Rendering", thread_id: "build-2" }],
    recent: [], posts: [], empty_slots: 1, note: null,
  };
  return { state, calendar };
}

export function threadData(state, id) {
  const selected = state.threads.find((t) => t.id === id) ?? thread(id, "New work day", "workday");
  return { thread: selected, runs: state.runs.filter((r) => r.thread_id === id), messages: [
    { id: "message-1", thread_id: id, run_id: null, author: "owner", kind: "text",
      body: { text: "Plan a thoughtful reel about retrieval." }, parent: null, created_at: now - 180000 },
    { id: "message-2", thread_id: id, run_id: "run-day", author: "agent:producer", kind: "text",
      body: { text: "The team is planning and building the next reel." }, parent: null, created_at: now - 150000 },
  ] };
}
