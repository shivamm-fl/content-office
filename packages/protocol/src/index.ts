// Shared shapes between the PWA (apps/web), the Worker (apps/api) and the runner bridge
// (runner/bridge/bridge.mjs mirrors the event names in plain JS).

export type AgentStatus = "idle" | "working" | "waiting" | "blocked" | "offline";
export type RunStatus =
  | "queued" | "starting" | "live" | "idle" | "blocked_limit" | "done" | "failed" | "cancelled" | "lost";
export type Profile = "desk" | "studio";

export interface TeamAgent { slug: string; name: string; title: string; color: string; desk: Profile }
export interface Team {
  slug: string; name: string; tagline: string; lead: string; model: string;
  handles: { platform: string; handle: string }[];
  tracks: { id: string; prefix: string; name: string }[];
  agents: TeamAgent[];
}

export interface Desk { agent: string; status: AgentStatus; activity: string | null; run_id: string | null; updated_at: number }
export interface Thread {
  id: string; agent: string; title: string; kind: string; created_at: number; updated_at: number;
  last_run: string | null; session_id: string | null; preview: string | null;
}
export type MessageKind = "text" | "tool" | "question" | "answer" | "approval" | "decision" | "system" | "handoff";
export interface Message {
  id: string; thread_id: string; run_id: string | null; author: string; kind: MessageKind;
  body: Record<string, unknown>; parent: string | null; created_at: number;
}
export interface Run {
  id: string; thread_id: string | null; agent: string; profile: Profile; status: RunStatus;
  gh_run_id: string | null; created_at: number; claimed_at: number | null; last_seen: number | null;
  ended_at: number | null; cost_usd: number; summary: string | null; error: string | null;
}
export interface Ask {
  id: string; run_id: string; thread_id: string; agent: string; kind: "question" | "approval";
  title: string; body: string; options: string[]; status: "pending" | "answered" | "expired";
  answer: Record<string, unknown> | null; created_at: number; answered_at: number | null;
}
export interface Task { id: string; from_agent: string; to_agent: string; body: string; status: "proposed" | "started" | "done" | "dismissed"; thread_id: string | null; created_at: number }
export interface Usage { five_hour: number | null; seven_day: number | null; five_hour_resets: number | null; seven_day_resets: number | null; status: string | null; updated_at: number }

export interface OfficeState {
  team: Team; desks: Desk[]; runs: Run[]; asks: Ask[]; tasks: Task[]; threads: Thread[]; usage: Usage | null;
}

/** Runner -> office (batched over the runner WebSocket). */
export type RunnerEvent =
  | { t: "session"; session_id: string; model: string }
  | { t: "delta"; agent: string; parent: string | null; text: string }
  | { t: "message"; agent: string; parent: string | null; text: string }
  | { t: "tool"; agent: string; parent: string | null; id: string; name: string; summary: string }
  | { t: "tool_result"; id: string; ok: boolean; summary: string }
  | { t: "subagent"; id: string; agent: string; parent_agent: string; task: string; state: "start" | "end" }
  | { t: "turn_end"; cost_usd: number; is_error: boolean; text: string }
  | { t: "progress"; agent: string; text: string }
  | { t: "usage"; five_hour: number | null; seven_day: number | null; five_hour_resets: number | null; seven_day_resets: number | null; status: string | null }
  | { t: "limit"; text: string; resets_at: number | null }
  | { t: "ask"; id: string; agent: string; kind: "question" | "approval"; title: string; body: string; options: string[] }
  | { t: "task"; id: string; from: string; to: string; body: string }
  | { t: "heartbeat" }
  | { t: "done"; status: "done" | "failed"; summary: string; transcript_key: string | null; session_id: string | null };

/** Office -> runner. */
export type RunnerCommand =
  | { t: "user_message"; id: string; text: string }
  | { t: "answer"; ask_id: string; answer: Record<string, unknown> }
  | { t: "interrupt" }
  | { t: "end" };

/** Office -> PWA (live room). */
export type RoomEvent =
  | { t: "state"; state: OfficeState }
  | { t: "message"; message: Message }
  | { t: "message_update"; message: Message }
  | { t: "delta"; thread_id: string; run_id: string; agent: string; parent: string | null; text: string }
  | { t: "desk"; desk: Desk }
  | { t: "run"; run: Run }
  | { t: "ask"; ask: Ask }
  | { t: "task"; task: Task }
  | { t: "thread"; thread: Thread }
  | { t: "usage"; usage: Usage };
