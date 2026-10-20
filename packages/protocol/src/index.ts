// Shared shapes between the PWA (apps/web), the Worker (apps/api) and the runner bridge
// (runner/bridge/bridge.mjs mirrors the event names in plain JS).

export type AgentStatus = "idle" | "working" | "waiting" | "blocked" | "offline";
export type RunStatus =
  | "queued" | "starting" | "live" | "idle" | "blocked_limit" | "done" | "failed" | "cancelled" | "lost";
export type Profile = "desk" | "studio";

export interface TeamAgent { slug: string; name: string; title: string; color: string; desk: Profile; skills?: string[] }
/** A room on the team's floor: desks for agents, the meeting room for the daily sync, or the reception (inbox). */
export interface Room { id: string; name: string; kind?: "desks" | "meeting" | "reception"; agents?: string[] }
export interface Team {
  slug: string; name: string; tagline: string; lead: string; model: string;
  handles: { platform: string; handle: string }[];
  /** `retired`: the track keeps its ids (finished reels stay on this floor) but the work day neither plans nor builds it. */
  tracks: { id: string; prefix: string; name: string; retired?: boolean }[];
  agents: TeamAgent[];
  rooms?: Room[];
  /** Reels the team aims to finish per work day (owner decision). */
  pace?: number;
  /** The work day's fixed set per track id, e.g. { series: 1, interview: 2 }; without it `pace` is spread over the tracks. */
  daily?: Record<string, number>;
  /** `floor` (default): a team that makes reels, its agents work inside teams/<slug>/. `company` (HQ): its agents see the whole repo and
   *  every change they make goes to a proposal branch for the owner (nothing of theirs reaches main on its own, except teams/<slug>/state). */
  scope?: "floor" | "company";
}

/** `done` counts finished pieces of work (turns as lead, hand-offs as teammate): the agent's XP. */
export interface Desk { agent: string; status: AgentStatus; activity: string | null; run_id: string | null; updated_at: number; done?: number }
export interface Thread {
  id: string; agent: string; title: string; kind: string; created_at: number; updated_at: number;
  last_run: string | null; session_id: string | null; preview: string | null;
  /** build threads: the reel and the work day it belongs to; work days: when the last reel finished */
  item?: string | null; day?: string | null; done_at?: number | null;
}
export type MessageKind = "text" | "tool" | "question" | "answer" | "approval" | "decision" | "system" | "handoff" | "dm" | "brief";
export interface Message {
  id: string; thread_id: string; run_id: string | null; author: string; kind: MessageKind;
  body: Record<string, unknown>; parent: string | null; created_at: number;
}
export interface Run {
  id: string; thread_id: string | null; agent: string; profile: Profile; status: RunStatus;
  gh_run_id: string | null; created_at: number; claimed_at: number | null; last_seen: number | null;
  ended_at: number | null; cost_usd: number; summary: string | null; error: string | null;
  /** Studio runs: the reel being built, and where the build is (build, review, fix, final). */
  item?: string | null; stage?: string | null; gh_url?: string | null;
}
/** A finished reel waiting for the owner's decision. */
export interface FinalReel {
  type: "final"; item: string; title: string; video_url: string | null; cover_url: string | null; thumb_url: string | null;
  caption: string; youtube: string; script: string; duration_s: number | null; checks: string[];
}
export interface Ask {
  id: string; run_id: string; thread_id: string; agent: string; kind: "question" | "approval";
  title: string; body: string; options: string[]; status: "pending" | "answered" | "expired";
  answer: Record<string, unknown> | null; created_at: number; answered_at: number | null;
  meta?: FinalReel | null;
}
export interface Task { id: string; from_agent: string; to_agent: string; body: string; status: "proposed" | "started" | "done" | "dismissed"; thread_id: string | null; created_at: number }
export interface Usage { five_hour: number | null; seven_day: number | null; five_hour_resets: number | null; seven_day_resets: number | null; status: string | null; updated_at: number }

export interface OfficeState {
  team: Team; desks: Desk[]; runs: Run[]; asks: Ask[]; tasks: Task[]; threads: Thread[]; usage: Usage | null;
}

// ---------- content calendar and posting (the owner posts from the office) ----------
/** One reel waiting for the owner to post it: approved in the office, or already released in the publishing repo. */
export interface ReadyReel {
  item: string; track: string; title: string; duration_s: number | null; cover_url: string | null;
  /** office: approved here, still to be handed to the publishing repo; released: already there, waiting for its slot */
  source: "office" | "released";
  /** only e, r and q reels can be put on a slot (the slot poster takes no other ids); every reel can be posted now */
  can_schedule: boolean;
}
export interface CalendarCell {
  track: string; item: string | null; title: string | null; link: string | null; at: string | null;
  /** posted: out on Instagram; scheduled: named by the owner for this slot; auto: next in line by the slot rules; empty: no reel for this track */
  state: "posted" | "scheduled" | "auto" | "empty";
}
export interface CalendarSlot { date: string; time: string; /** the slot has started */ started: boolean; /** it can still take a reel */ open: boolean; cells: CalendarCell[]; scheduled: number }
export interface CalendarDay { date: string; label: string; slots: CalendarSlot[]; extras: CalendarCell[] }
export interface PipelineItem { item: string; track: string; title: string; stage: "studio" | "approval" | "failed" | "changes" | "rejected"; detail: string | null; thread_id: string | null }
export interface PostedReel { item: string; track: string; title: string; at: string | null; link: string | null; facebook: boolean; youtube: boolean }
/** A hand-over of one reel to the publishing repo (and, for "now", its posting), or a change of the posting pause. */
export interface PostRecord {
  id: string; item: string; mode: "now" | "slot" | "pause" | "resume"; date: string | null; time: string | null;
  status: "handing_over" | "done" | "failed"; gh_url: string | null; error: string | null; created_at: number; updated_at: number;
  trial?: boolean;
}
export interface CalendarData {
  team: string; publishing: boolean; now: number; today: string; clock: string;
  paused: boolean; window: [string, string]; slot_times: string[]; posts_per_slot: number; can_post_now: boolean; last_post_hours: number | null;
  ready: ReadyReel[]; days: CalendarDay[]; pipeline: PipelineItem[]; recent: PostedReel[]; posts: PostRecord[];
  /** open slots in the next days that have no reel at all */
  empty_slots: number;
  note: string | null;
  /** the floor has slot posting (learnai: slots, automatic posting and its pause switch); false: its reels are posted with Post now only (dsa, systemdesign) */
  slots: boolean;
}
export interface PublishRequest { item: string; mode: "now" | "slot"; date?: string; time?: string; trial?: boolean }
/** What the owner sees when previewing a reel before it is posted: the video, the cover and the texts that would go out. */
export interface PreviewInfo {
  item: string; title: string; video_url: string; cover_url: string | null; caption: string; youtube: string; duration_s: number | null;
  source: "office" | "released";
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
  /** One agent messaged another directly inside the session. */
  | { t: "dm"; from: string; to: string; text: string }
  | { t: "heartbeat" }
  /** keep_open: a studio session finished its part; the run goes on (reviews, fix, final gate) in later jobs.
   *  unread: ids of messages that reached the runner while it was closing, so nobody read them. */
  | { t: "done"; status: "done" | "failed"; summary: string; transcript_key: string | null; session_id: string | null; keep_open?: boolean; unread?: string[] };

/** Office -> runner. */
export type RunnerCommand =
  /** chat: the owner is talking to this desk, so the session stays open like a chat instead of ending when the task is done. */
  | { t: "user_message"; id: string; text: string; chat?: boolean }
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

// ---------- proposals: changes the agents made that wait for the owner (branch proposal/<run_id>) ----------
export type ProposalKind = "rules" | "code" | "content" | "mixed";
export interface ProposalFile { path: string; status: "added" | "modified" | "removed" | "renamed"; additions: number; deletions: number; patch: string | null }
export interface ProposalSummary {
  branch: string;                 // "proposal/run_abc"
  run_id: string;                 // "run_abc"
  team: string | null;            // the floor whose session made it (from the commit message "office: <team> ...")
  title: string;                  // first heading of teams/hq/proposals/<run_id>.md when the branch has it, else the commit subject
  summary: string | null;         // that file's text (first ~800 characters)
  files: number; additions: number; deletions: number;
  updated_at: number;             // ms
  kind: ProposalKind;             // rules = prompts/agents/skills/team settings, code = apps/ packages/ runner/ tools/ .github/, content = reels/state/social, mixed = more than one
  needs_deploy: boolean;          // touches apps/, packages/ or a team.json: the Worker must be deployed after the merge
  behind_by: number;              // commits main gained since the branch was cut (conflict risk)
  conflicts: boolean | null;      // null = unknown
}
export interface ProposalDetail extends ProposalSummary { proposal_md: string | null; files_list: ProposalFile[] }
export interface DeployInfo { status: "none" | "queued" | "running" | "success" | "failure"; run_url: string | null; commit: string | null; started_at: number | null }
export interface ProposalsState { proposals: ProposalSummary[]; deploy: DeployInfo | null; active_runs: number }
