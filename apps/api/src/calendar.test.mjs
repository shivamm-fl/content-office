// node --test apps/api/src/calendar.test.mjs   (Node 24 runs the TypeScript module directly)
import assert from "node:assert/strict";
import { test } from "node:test";
import { buildCalendar, canPostNow, floorOfItem, floorStatus, reelStage, refusePublish, slotStartMs, trackOfItem } from "./calendar.ts";

const IST = (date, time) => slotStartMs(date, time);
const cfg = { slots_ist: ["09:00", "13:00", "17:00"], posts_per_slot: 3, slot_late_min: 150, posting_window_ist: ["07:00", "21:00"], posting_paused: false, post_schedule: [] };
const rel = (title, extra = {}) => ({ title, qa_passed: true, release_assets: true, published: false, ...extra });
const base = () => ({
  e101: rel("E one"), e102: rel("E two"), r101: rel("R one"), q101: rel("Q one"), q102: rel("Q two"),
  q24: rel("Old Q", { published: true, published_at: "2026-10-18T03:35" }),   // 09:05 IST on 18 Oct
});
const input = (now, over = {}) => ({ team: "learnai", publishing: true, now, cfg, status: base(), office: [], posts: [], ...over });
const slot = (cal, day, time) => cal.days[day].slots.find((s) => s.time === time);

test("automatic fill: one reel per track and slot, the lowest id first, consumed across slots", () => {
  const cal = buildCalendar(input(IST("2026-10-18", "12:00")));   // the 09:00 slot is over; at 10:00 it would still take e101 and r101 (a partial slot is completed)
  const s13 = slot(cal, 0, "13:00");
  assert.deepEqual(s13.cells.map((c) => [c.track, c.item, c.state]), [["generic", "e101", "auto"], ["course", "r101", "auto"], ["interview", "q101", "auto"]]);
  const s17 = slot(cal, 0, "17:00");
  assert.deepEqual(s17.cells.map((c) => [c.track, c.item, c.state]), [["generic", "e102", "auto"], ["course", null, "empty"], ["interview", "q102", "auto"]]);
});

test("a posted reel sits in its slot and its track is done for that slot", () => {
  const cal = buildCalendar(input(IST("2026-10-18", "10:00")));
  const s09 = slot(cal, 0, "09:00");
  assert.equal(s09.started, true);
  assert.equal(s09.open, true);   // inside the 150 minute window
  assert.equal(s09.cells[0].state, "posted");
  assert.equal(s09.cells[0].item, "q24");
  assert.equal(s09.cells[0].at, "09:05");
  assert.ok(!s09.cells.some((c) => c.track === "interview" && c.state !== "posted"));
});

test("after the window of a slot only what was posted is left", () => {
  const cal = buildCalendar(input(IST("2026-10-18", "12:00")));
  const s09 = slot(cal, 0, "09:00");
  assert.equal(s09.open, false);
  assert.deepEqual(s09.cells.map((c) => c.state), ["posted"]);
});

test("an explicit plan names exactly its ids and keeps them out of the automatic fill", () => {
  const plan = [{ date: "2026-10-19", time: "13:00", ids: ["q102", "e101"] }];
  const cal = buildCalendar(input(IST("2026-10-18", "10:00"), { cfg: { ...cfg, post_schedule: plan } }));
  const s = slot(cal, 1, "13:00");
  assert.deepEqual(s.cells.map((c) => [c.item, c.state]), [["q102", "scheduled"], ["e101", "scheduled"]]);
  assert.equal(s.scheduled, 2);
  const auto = cal.days.flatMap((d) => d.slots).flatMap((x) => x.cells).filter((c) => c.state === "auto").map((c) => c.item);
  assert.ok(!auto.includes("q102") && !auto.includes("e101"));
});

test("a plan for a slot that is over is history and an unknown id is ignored", () => {
  const plan = [{ date: "2026-10-18", time: "09:00", ids: ["e101"] }, { date: "2026-10-18", time: "17:00", ids: ["x12"] }];
  const cal = buildCalendar(input(IST("2026-10-18", "14:00"), { cfg: { ...cfg, post_schedule: plan }, status: { ...base(), x12: rel("Exp") } }));
  assert.equal(slot(cal, 0, "09:00").cells.filter((c) => c.state === "scheduled").length, 0);
  assert.equal(slot(cal, 0, "17:00").scheduled, 0);   // the poster takes no x ids
});

test("the posting window decides whether a reel can go now", () => {
  assert.equal(canPostNow(cfg, IST("2026-10-18", "06:59")), false);
  assert.equal(canPostNow(cfg, IST("2026-10-18", "07:00")), true);
  assert.equal(canPostNow(cfg, IST("2026-10-18", "20:59")), true);
  assert.equal(canPostNow(cfg, IST("2026-10-18", "21:00")), false);
});

test("ready list: approved office reel not yet handed over, released reels, x reel cannot be scheduled", () => {
  const office = [
    { item: "e150", title: "Fresh", track: "generic", thread_id: "t1", duration_s: 40, cover_url: "/c.png", stage: "approved", detail: null },
    { item: "r101", title: "R one", track: "course", thread_id: "t2", duration_s: 50, cover_url: null, stage: "approved", detail: null },   // already released in the publishing repo
    { item: "q150", title: "In studio", track: "interview", thread_id: "t3", duration_s: null, cover_url: null, stage: "studio", detail: "build" },
  ];
  const cal = buildCalendar(input(IST("2026-10-18", "10:00"), { office, status: { ...base(), x12: rel("Exp", { duration_s: 24 }) } }));
  const by = Object.fromEntries(cal.ready.map((r) => [r.item, r]));
  assert.equal(by.e150.source, "office");
  assert.equal(by.e150.can_schedule, true);
  assert.equal(by.r101.source, "released");
  assert.equal(by.x12.can_schedule, false);
  assert.equal(by.q150, undefined);
  assert.deepEqual(cal.pipeline.map((p) => [p.item, p.stage]), [["q150", "studio"]]);
  assert.equal(cal.ready[0].item, "e150");   // office reels first
});

test("a reel being handed over is not offered again", () => {
  const office = [{ item: "e150", title: "Fresh", track: "generic", thread_id: "t1", duration_s: 40, cover_url: null, stage: "approved", detail: null }];
  const posts = [{ id: "p1", item: "e150", mode: "now", date: null, time: null, status: "handing_over", gh_url: null, error: null, created_at: 1, updated_at: 1 }];
  const cal = buildCalendar(input(IST("2026-10-18", "10:00"), { office, posts }));
  assert.equal(cal.ready.find((r) => r.item === "e150"), undefined);
});

test("empty slots are counted and paused is reported", () => {
  const cal = buildCalendar(input(IST("2026-10-18", "10:00"), { status: { q24: base().q24 }, cfg: { ...cfg, posting_paused: true } }));
  assert.equal(cal.paused, true);
  assert.equal(cal.empty_slots, 2 + 3 * 6);   // today 13:00 and 17:00, then 3 slots a day for 6 days
  assert.equal(cal.last_post_hours, 0.9);
});

test("refusePublish: window, slots, capacity, ids", () => {
  const now = IST("2026-10-18", "10:00");
  assert.equal(refusePublish({ item: "e101", mode: "now" }, cfg, base(), now), null);
  for (const t of ["00:30", "06:59", "21:00", "22:00", "23:59"]) {   // the owner's own tap works at any hour; only the automatic slots keep the window
    assert.equal(refusePublish({ item: "e101", mode: "now" }, cfg, base(), IST("2026-10-18", t)), null, t);
  }
  assert.match(refusePublish({ item: "q24", mode: "now" }, cfg, base(), now), /already posted/);
  assert.match(refusePublish({ item: "../x", mode: "now" }, cfg, base(), now), /bad item/);
  assert.equal(refusePublish({ item: "e101", mode: "slot", date: "2026-10-18", time: "13:00" }, cfg, base(), now), null);
  assert.match(refusePublish({ item: "e101", mode: "slot", date: "2026-10-18", time: "09:00" }, cfg, base(), now), /already started/);
  assert.match(refusePublish({ item: "e101", mode: "slot", date: "2026-10-18", time: "10:30" }, cfg, base(), now), /pick one of the slots/);
  assert.match(refusePublish({ item: "x12", mode: "slot", date: "2026-10-18", time: "13:00" }, cfg, base(), now), /Only e, r and q/);
  const full = { ...cfg, post_schedule: [{ date: "2026-10-18", time: "13:00", ids: ["e101", "r101", "q101"] }] };
  assert.match(refusePublish({ item: "q102", mode: "slot", date: "2026-10-18", time: "13:00" }, full, base(), now), /full/);
  assert.equal(refusePublish({ item: "q101", mode: "slot", date: "2026-10-18", time: "13:00" }, full, base(), now), null);   // already in it: idempotent
});

// ---- floors that only post now (dsa: d, systemdesign: s): the publishing repo's status and settings are shared by every floor
const CLAIMS = { e: "learnai", r: "learnai", q: "learnai", d: "dsa", s: "systemdesign" };
const shared = () => ({ ...base(), x12: rel("Old experiment"), d001: rel("DSA one", { mp4: "reels/d001_hi.mp4", duration_s: 70 }), d002: rel("DSA posted", { published: true, published_at: "2026-10-18T03:35" }), s001: rel("SD one") });

test("floors: a reel belongs to the floor whose track has its prefix; an unclaimed id is learnai's", () => {
  assert.deepEqual(["e1", "r1", "q1", "d1", "s1", "x12"].map((i) => floorOfItem(i, CLAIMS)), ["learnai", "learnai", "learnai", "dsa", "systemdesign", "learnai"]);
  assert.equal(floorOfItem("d001", { e: "learnai" }), "learnai");   // a floor that is not registered claims nothing
  assert.equal(trackOfItem("d001"), "series");
  assert.equal(trackOfItem("s150"), "series");
  assert.equal(trackOfItem("x12"), "experiment");
});

test("floors: each floor sees its own reels of the shared status", () => {
  const keys = (team) => Object.keys(floorStatus(shared(), team, CLAIMS)).sort();
  assert.deepEqual(keys("dsa"), ["d001", "d002"]);
  assert.deepEqual(keys("systemdesign"), ["s001"]);
  assert.deepEqual(keys("learnai"), ["e101", "e102", "q101", "q102", "q24", "r101", "x12"]);   // learnai keeps what it had, minus the new floors' reels
});

test("a floor without slots: no slot grid, no pause switch, its released reel is ready to post now", () => {
  const status = floorStatus(shared(), "dsa", CLAIMS);
  const office = [{ item: "d003", title: "DSA approved", track: trackOfItem("d003"), thread_id: "t1", duration_s: 104, cover_url: null, stage: "approved", detail: null }];
  const cal = buildCalendar({ ...input(IST("2026-10-18", "10:00"), { status, office, cfg: { ...cfg, posting_paused: true } }), team: "dsa", slots: false });
  assert.equal(cal.slots, false);
  assert.deepEqual(cal.days, []);
  assert.equal(cal.empty_slots, 0);
  assert.equal(cal.paused, false);   // learnai's pause is not this floor's
  assert.deepEqual(cal.ready.map((r) => [r.item, r.track, r.source, r.can_schedule]), [["d003", "series", "office", false], ["d001", "series", "released", false]]);
  assert.deepEqual(cal.recent.map((r) => [r.item, r.track]), [["d002", "series"]]);
  assert.equal(cal.ready[0].duration_s, 104);
});

test("learnai keeps its slots, its pause switch and its old experiment reels", () => {
  const cal = buildCalendar(input(IST("2026-10-18", "10:00"), { status: floorStatus(shared(), "learnai", CLAIMS), cfg: { ...cfg, posting_paused: true } }));
  assert.equal(cal.slots, true);
  assert.equal(cal.paused, true);
  assert.equal(cal.days.length, 7);
  assert.ok(cal.ready.some((r) => r.item === "x12"));
  assert.ok(!cal.ready.some((r) => r.item[0] === "d" || r.item[0] === "s"));
});

test("refusePublish: a floor hands over its own reels only; d and s reels are posted now, never on a slot", () => {
  const now = IST("2026-10-18", "10:00");
  const owns = (floor) => (item) => floorOfItem(item, CLAIMS) === floor;
  assert.equal(refusePublish({ item: "d001", mode: "now" }, cfg, shared(), now, owns("dsa")), null);
  assert.equal(refusePublish({ item: "s001", mode: "now" }, cfg, shared(), now, owns("systemdesign")), null);
  assert.match(refusePublish({ item: "e101", mode: "now" }, cfg, shared(), now, owns("dsa")), /not a reel of this floor/);
  assert.match(refusePublish({ item: "d001", mode: "now" }, cfg, shared(), now, owns("learnai")), /not a reel of this floor/);
  assert.match(refusePublish({ item: "d001", mode: "slot", date: "2026-10-18", time: "13:00" }, cfg, shared(), now, owns("dsa")), /Only e, r and q/);
  assert.equal(refusePublish({ item: "d001", mode: "now" }, cfg, shared(), IST("2026-10-18", "22:00"), owns("dsa")), null);   // the owner's tap works at any hour
  assert.match(refusePublish({ item: "d002", mode: "now" }, cfg, shared(), now, owns("dsa")), /already posted/);
  assert.equal(refusePublish({ item: "x12", mode: "now" }, cfg, shared(), now, owns("learnai")), null);   // as before for learnai
});

// ---- where a reel stands: a rework that fails must not hide the version the owner approved ----
const ACTIVE = ["queued", "starting", "live", "idle", "blocked_limit"];
const askAt = (created_at, decision, status = "answered") => ({ status, created_at, answer: decision ? { decision, notes: "make the hook shorter" } : null });
const runAt = (created_at, status, extra = {}) => ({ status, created_at, ...extra });

test("reel stage: a running studio run is 'studio', a queued one says it waits", () => {
  assert.deepEqual(reelStage(runAt(5, "live", { stage: "render" }), askAt(1, "approved"), ACTIVE), { stage: "studio", detail: "render" });
  assert.equal(reelStage(runAt(5, "queued"), null, ACTIVE).detail, "waiting for a free studio slot");
});

test("reel stage: the owner's answer to the newest final card decides while no newer run exists", () => {
  assert.equal(reelStage(runAt(1, "done"), askAt(2, null, "pending"), ACTIVE).stage, "approval");
  assert.equal(reelStage(runAt(1, "done"), askAt(2, "approved"), ACTIVE).stage, "approved");
  assert.equal(reelStage(runAt(1, "done"), askAt(2, "changes_requested"), ACTIVE).stage, "changes");
  assert.equal(reelStage(runAt(1, "done"), askAt(2, "rejected"), ACTIVE).stage, "rejected");
});

test("reel stage: a rework that did not pass keeps the approved version postable (q103 and s001 vanished from the Calendar)", () => {
  const r = reelStage(runAt(9, "done", { summary: "q103 is broken" }), askAt(2, "approved"), ACTIVE);
  assert.equal(r.stage, "approved");
  assert.match(r.detail, /newer rework did not pass \(q103 is broken\)/);
  assert.equal(reelStage(runAt(9, "cancelled"), askAt(2, "approved"), ACTIVE).stage, "approved");
});

test("reel stage: a failure with no approved version behind it is still 'failed'", () => {
  assert.deepEqual(reelStage(runAt(9, "done", { summary: "s002 is broken" }), null, ACTIVE), { stage: "failed", detail: "s002 is broken" });
  assert.equal(reelStage(runAt(9, "done"), askAt(2, "changes_requested"), ACTIVE).stage, "failed");   // the owner asked for changes and the rework failed: nothing was approved
  assert.equal(reelStage(runAt(9, "done"), askAt(2, null, "pending"), ACTIVE).stage, "failed");
  assert.equal(reelStage(runAt(9, "error", { error: "boom" }), askAt(2, "rejected"), ACTIVE).detail, "boom");
});

test("reel stage: an approved reel whose rework failed is in the ready list of the Calendar", () => {
  const stage = reelStage(runAt(9, "done", { summary: "broken" }), askAt(2, "approved"), ACTIVE);
  const cal = buildCalendar(input(IST("2026-10-18", "10:00"), { status: {}, office: [{ item: "q103", title: "Q three", track: "interview", thread_id: "t1", duration_s: 70, cover_url: null, ...stage }] }));
  assert.deepEqual(cal.ready.map((r) => r.item), ["q103"]);
  assert.equal(cal.pipeline.length, 0);
});
