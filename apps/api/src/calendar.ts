// The content calendar of one floor (team): what is ready to post, what goes out in which slot, what is still being made.
// Pure functions (no I/O) so the slot rules can be tested. The rules mirror the publishing repo's slot poster
// (ai-course scripts/post_plan.py): one released reel per track and slot in the order generic, course, interview, taken from
// the lowest id up; an explicit entry of state/config.json post_schedule names exactly the ids of its slot; nothing posts while
// posting_paused is true, outside the posting window, or later than slot_late_min minutes after a slot started.
import type { CalendarCell, CalendarData, CalendarDay, CalendarSlot, PipelineItem, PostRecord, PostedReel, PublishRequest, ReadyReel } from "@office/protocol";

export interface Phase5Entry {
  status?: string; track?: string; title?: string; mp4?: string; duration_s?: number; published?: boolean; published_at?: string;
  qa_passed?: boolean; release_assets?: boolean; permalink?: string; fb_video_id?: string; youtube_id?: string;
}
export interface PostingConfig {
  slots_ist?: string[]; posts_per_slot?: number; posting_paused?: boolean; posting_window_ist?: [string, string]; slot_late_min?: number;
  post_schedule?: { date: string; time: string; ids: string[] }[];
}
/** What the office itself knows about a reel it built (from its build threads and final approvals). */
export interface OfficeReel {
  item: string; title: string; track: string; thread_id: string | null; duration_s: number | null; cover_url: string | null;
  stage: PipelineItem["stage"] | "approved"; detail: string | null;
}
/** Where one reel stands, from its newest studio run and its newest final card (the owner's answer to it). A rework that did not pass leaves the
 * version the owner approved in place: it is still the newest reel anyone approved, so it stays postable and is not hidden as "failed". */
export function reelStage(
  run: { status: string; created_at: number; stage?: string | null; summary?: string | null; error?: string | null } | null,
  ask: { status: string; created_at: number; answer: { decision?: string; notes?: string } | null } | null,
  active: readonly string[],
): { stage: OfficeReel["stage"]; detail: string | null } {
  if (run && active.includes(run.status)) return { stage: "studio", detail: run.status === "queued" ? "waiting for a free studio slot" : run.stage ?? "build" };
  const decision = ask?.answer?.decision;
  if (ask && !(run && run.created_at > ask.created_at)) {   // a final approval belongs to the newest studio work
    if (ask.status === "pending") return { stage: "approval", detail: "waiting for your approval" };
    if (decision === "approved") return { stage: "approved", detail: null };
    if (decision === "changes_requested") return { stage: "changes", detail: ask.answer?.notes?.slice(0, 160) ?? null };
    return { stage: "rejected", detail: null };
  }
  const why = (run?.summary ?? run?.error ?? "did not pass the gate").slice(0, 160);
  if (ask && ask.status !== "pending" && decision === "approved") return { stage: "approved", detail: `a newer rework did not pass (${why}); this is the version you approved` };
  return { stage: "failed", detail: why };
}
export interface CalendarInput {
  team: string; publishing: boolean; now: number; cfg: PostingConfig; status: Record<string, Phase5Entry>;
  office: OfficeReel[]; posts: PostRecord[]; days?: number; note?: string | null;
  /** the floor has slot posting (learnai); false: reels are posted with Post now only, so there is no slot grid and no pause switch (default true) */
  slots?: boolean;
}

export const TRACKS = [
  { id: "generic", prefix: "e" }, { id: "course", prefix: "r" }, { id: "interview", prefix: "q" },
] as const;
const IST_MS = 330 * 60_000;
const DAY_MS = 86_400_000;
const DEFAULT_SLOTS = ["09:00", "13:00", "17:00"];

export const istDate = (ms: number) => new Date(ms + IST_MS).toISOString().slice(0, 10);
export const istClock = (ms: number) => new Date(ms + IST_MS).toISOString().slice(11, 16);
const toMinutes = (hhmm: string) => { const [h, m] = hhmm.split(":"); return Number(h) * 60 + Number(m); };
/** The instant a slot starts: its IST date and clock time. */
export const slotStartMs = (date: string, time: string) => Date.parse(`${date}T${time}:00Z`) - IST_MS;

/** The runner writes published_at in UTC without a zone ("2026-10-17T14:05"). */
export function publishedMs(e: Phase5Entry): number | null {
  const s = e.published_at;
  if (!s) return null;
  const ms = Date.parse(/Z$|[+-]\d\d:\d\d$/.test(s) ? s : `${s}Z`);
  return Number.isFinite(ms) ? ms : null;
}

/** The series floors (dsa: d, systemdesign: s) have one track, "series" (their team.json). */
const SERIES_PREFIXES = ["d", "s"];
export const trackOfItem = (item: string) =>
  TRACKS.find((t) => t.prefix === item[0])?.id ?? (SERIES_PREFIXES.includes(item[0]) ? "series" : item[0] === "x" ? "experiment" : "other");

/** The floor a reel belongs to: the floor whose track has its id prefix (`claims`: prefix to team slug). An id no floor claims (old x experiments) is learnai's. */
export const floorOfItem = (item: string, claims: Record<string, string>): string => claims[item[0]] ?? "learnai";
/** The publishing repo's status holds the reels of every floor: only the ones of this floor go into its calendar. */
export function floorStatus<T>(status: Record<string, T>, team: string, claims: Record<string, string>): Record<string, T> {
  return Object.fromEntries(Object.entries(status).filter(([k]) => floorOfItem(k, claims) === team));
}
const idNum = (id: string) => Number(id.slice(1));
const isItem = (k: string) => /^[a-z]\d{1,4}$/.test(k);

export function postingWindow(cfg: PostingConfig): [string, string] {
  return cfg.posting_window_ist && cfg.posting_window_ist.length === 2 ? cfg.posting_window_ist : ["07:00", "21:00"];
}
export function canPostNow(cfg: PostingConfig, now: number): boolean {
  const [a, b] = postingWindow(cfg);
  const m = toMinutes(istClock(now));
  return m >= toMinutes(a) && m < toMinutes(b);
}

function dayLabel(date: string, today: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  const base = d.toLocaleDateString("en-IN", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" });
  if (date === today) return `Today, ${base}`;
  if (date === new Date(Date.parse(`${today}T00:00:00Z`) + DAY_MS).toISOString().slice(0, 10)) return `Tomorrow, ${base}`;
  return base;
}

const cell = (track: string, item: string | null, title: string | null, state: CalendarCell["state"], link: string | null = null, at: string | null = null): CalendarCell =>
  ({ track, item, title, link, at, state });

export function buildCalendar(inp: CalendarInput): CalendarData {
  const { cfg, status, now } = inp;
  const today = istDate(now);
  const slotTimes = [...(cfg.slots_ist?.length ? cfg.slots_ist : DEFAULT_SLOTS)].sort((a, b) => toMinutes(a) - toMinutes(b));
  const perSlot = Math.max(1, Number(cfg.posts_per_slot ?? 3));
  const late = Number(cfg.slot_late_min ?? 150);
  const [, windowEnd] = postingWindow(cfg);
  const slotsOn = inp.slots !== false;
  const paused = slotsOn && Boolean(cfg.posting_paused);   // the pause switch is the slot poster's: a floor without slots shows none
  const titleOf = (k: string) => status[k]?.title ?? inp.office.find((o) => o.item === k)?.title ?? k;

  // released and waiting: what the slot poster can take (qa_passed, media in the release, not yet published)
  const postedByOffice = new Set(inp.posts.filter((p) => p.mode === "now" && p.status === "done").map((p) => p.item));
  const waiting = (k: string) => isItem(k) && status[k]?.qa_passed === true && status[k]?.release_assets === true && !status[k]?.published && !postedByOffice.has(k);
  const pools: Record<string, string[]> = {};
  for (const t of TRACKS) {
    pools[t.id] = Object.keys(status).filter((k) => k[0] === t.prefix && /^[a-z]\d+$/.test(k) && waiting(k)).sort((a, b) => idNum(a) - idNum(b));
  }

  // posted reels, newest first
  const posted = Object.keys(status).filter((k) => isItem(k) && status[k]?.published && publishedMs(status[k]) !== null)
    .map((k) => ({ k, ms: publishedMs(status[k])! })).sort((a, b) => b.ms - a.ms);
  const postedCell = (k: string, ms: number) => cell(trackOfItem(k), k, titleOf(k), "posted", status[k]?.permalink ?? null, istClock(ms));

  // explicit plans of the owner: these ids are removed from the pools before the automatic fill
  const horizon = inp.days ?? (slotsOn ? 7 : 0);
  const dates = Array.from({ length: horizon }, (_, i) => istDate(now + i * DAY_MS));
  const plans = new Map<string, string[]>();
  const named = new Set<string>();
  for (const p of cfg.post_schedule ?? []) {
    if (!dates.includes(p.date) || !slotTimes.includes(p.time)) continue;
    if (now >= slotStartMs(p.date, p.time) + late * 60_000) continue;   // a plan of a slot that is over is history
    const ids = (p.ids ?? []).filter((id) => TRACKS.some((t) => pools[t.id].includes(id)));
    plans.set(`${p.date} ${p.time}`, ids);
    ids.forEach((id) => named.add(id));
  }
  const free: Record<string, string[]> = {};
  for (const t of TRACKS) free[t.id] = pools[t.id].filter((id) => !named.has(id));

  let emptySlots = 0;
  const days: CalendarDay[] = dates.map((date) => {
    const slots: CalendarSlot[] = [];
    for (const time of slotTimes) {
      const start = slotStartMs(date, time);
      const windowEndMs = slotStartMs(date, windowEnd);
      const end = Math.min(start + late * 60_000, windowEndMs > start ? windowEndMs : Infinity);
      const started = now >= start;
      const open = now < end;
      const here = posted.filter((p) => p.ms >= start && p.ms < end).sort((a, b) => a.ms - b.ms);
      const cells: CalendarCell[] = here.map((p) => postedCell(p.k, p.ms));
      let scheduled = 0;
      if (open) {
        const plan = plans.get(`${date} ${time}`);
        if (plan) {
          for (const id of plan) {
            if (status[id]?.published) continue;
            cells.push(cell(trackOfItem(id), id, titleOf(id), "scheduled"));
            scheduled += 1;
          }
        } else {
          const postedTracks = new Set(here.map((p) => trackOfItem(p.k)));
          let n = here.length;
          for (const t of TRACKS) {
            if (postedTracks.has(t.id)) continue;
            if (free[t.id].length && n < perSlot) {
              const id = free[t.id].shift()!;
              cells.push(cell(t.id, id, titleOf(id), "auto"));
              n += 1;
            } else {
              cells.push(cell(t.id, null, null, "empty"));
            }
          }
        }
        if (cells.every((c) => c.state === "empty")) emptySlots += 1;
      }
      slots.push({ date, time, started, open, cells, scheduled });
    }
    const slotted = new Set(slots.flatMap((s) => s.cells.map((c) => c.item)));
    const extras = posted.filter((p) => istDate(p.ms) === date && !slotted.has(p.k)).sort((a, b) => a.ms - b.ms).map((p) => postedCell(p.k, p.ms));
    return { date, label: dayLabel(date, today), slots, extras };
  });

  // reels the owner can post now or put on a slot
  const handing = new Set(inp.posts.filter((p) => p.status === "handing_over").map((p) => p.item));
  const ready: ReadyReel[] = [];
  for (const o of inp.office) {
    if (o.stage !== "approved" || waiting(o.item) || status[o.item]?.published || postedByOffice.has(o.item) || handing.has(o.item)) continue;
    ready.push({ item: o.item, track: o.track || trackOfItem(o.item), title: o.title, duration_s: o.duration_s, cover_url: o.cover_url, source: "office", can_schedule: TRACKS.some((t) => t.prefix === o.item[0]) });
  }
  for (const k of Object.keys(status).filter((x) => waiting(x) && !handing.has(x)).sort((a, b) => a[0].localeCompare(b[0]) || idNum(a) - idNum(b))) {
    if (ready.some((r) => r.item === k)) continue;
    ready.push({ item: k, track: trackOfItem(k), title: titleOf(k), duration_s: status[k].duration_s ?? null, cover_url: inp.office.find((o) => o.item === k)?.cover_url ?? null, source: "released", can_schedule: TRACKS.some((t) => t.prefix === k[0]) });
  }

  const pipeline: PipelineItem[] = inp.office.filter((o) => o.stage !== "approved")
    .map((o) => ({ item: o.item, track: o.track || trackOfItem(o.item), title: o.title, stage: o.stage as PipelineItem["stage"], detail: o.detail, thread_id: o.thread_id }));

  const recent: PostedReel[] = posted.slice(0, 6).map((p) => ({
    item: p.k, track: trackOfItem(p.k), title: titleOf(p.k), at: `${istDate(p.ms)} ${istClock(p.ms)}`, link: status[p.k]?.permalink ?? null,
    facebook: Boolean(status[p.k]?.fb_video_id), youtube: Boolean(status[p.k]?.youtube_id),
  }));

  return {
    team: inp.team, publishing: inp.publishing, now, today, clock: istClock(now), paused, window: postingWindow(cfg), slot_times: slotTimes, posts_per_slot: perSlot,
    can_post_now: canPostNow(cfg, now), last_post_hours: posted.length ? Math.round(((now - posted[0].ms) / 3_600_000) * 10) / 10 : null,
    ready, days, pipeline, recent, posts: inp.posts.slice(0, 8), empty_slots: emptySlots, note: inp.note ?? null, slots: slotsOn,
  };
}

/**
 * The rules a hand-over must pass before the office starts it; returns the reason it is refused, or null.
 * `ownsItem`: whether the reel belongs to this floor (the publishing repo posts a reel to the handle of its id's team, so a floor must never hand over another floor's reel).
 */
export function refusePublish(
  req: PublishRequest, cfg: PostingConfig, status: Record<string, Phase5Entry>, now: number,
  ownsItem?: (item: string) => boolean,
): string | null {
  if (!/^[a-z]\d{2,4}$/.test(req.item)) return "bad item id";
  if (req.trial && req.mode !== "now") return "Trial reels can only be posted now. Switch to Post now.";
  if (ownsItem && !ownsItem(req.item)) return `${req.item} is not a reel of this floor`;
  if (status[req.item]?.published) return `${req.item} is already posted`;
  // The owner's own tap works at any hour (owner decision 2026-10-18: "post now kabhi bhi"); the posting window only limits the automatic slots.
  if (req.mode === "now") return null;
  if (req.mode !== "slot") return "bad mode";
  if (!TRACKS.some((t) => t.prefix === req.item[0])) return "Only e, r and q reels can be put on a slot. Post this one now.";
  const slots = cfg.slots_ist?.length ? cfg.slots_ist : DEFAULT_SLOTS;
  if (!req.date || !req.time || !/^\d{4}-\d{2}-\d{2}$/.test(req.date) || !slots.includes(req.time)) return "pick one of the slots";
  const start = slotStartMs(req.date, req.time);
  if (!Number.isFinite(start) || start <= now) return "That slot has already started. Pick a later one.";
  if (start > now + 8 * DAY_MS) return "That slot is too far ahead.";
  const taken = (cfg.post_schedule ?? []).find((p) => p.date === req.date && p.time === req.time)?.ids ?? [];
  if (!taken.includes(req.item) && taken.length >= Math.max(1, Number(cfg.posts_per_slot ?? 3))) return "That slot is full. Pick another one.";
  return null;
}
