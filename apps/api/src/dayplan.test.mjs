// node --test apps/api/src/dayplan.test.mjs   (Node 24 runs the TypeScript module directly)
import assert from "node:assert/strict";
import { test } from "node:test";
import { dayPlanLine } from "./dayplan.ts";

const learnai = {
  pace: 3, daily: { series: 1, interview: 2 },
  tracks: [{ id: "series", prefix: "a" }, { id: "generic", prefix: "e", retired: true }, { id: "course", prefix: "r", retired: true }, { id: "interview", prefix: "q" }],
};

test("a floor with a fixed daily set names it and the retired tracks", () => {
  assert.equal(dayPlanLine(learnai, "2026-10-20"), "Start the day (2026-10-20): 3 reels, 1 series and 2 interview. Retired for now, do not plan or build: generic, course. Follow prompts/work-day.md.");
});

test("a track missing from daily, or with 0, is not planned; a retired track in daily is ignored", () => {
  const t = { ...learnai, daily: { series: 1, interview: 0, generic: 5 } };
  assert.equal(dayPlanLine(t, "d"), "Start the day (d): 1 reels, 1 series. Retired for now, do not plan or build: generic, course. Follow prompts/work-day.md.");
});

test("a floor without daily spreads pace over its tracks, as before", () => {
  assert.equal(dayPlanLine({ pace: 1, tracks: [{ id: "series", prefix: "d" }] }, "d"), "Start the day (d): 1 reels, 1 per track. Follow prompts/work-day.md.");
  assert.equal(dayPlanLine({ tracks: [{ id: "a", prefix: "a" }, { id: "b", prefix: "b" }, { id: "c", prefix: "c" }] }, "d"), "Start the day (d): 6 reels, 2 per track. Follow prompts/work-day.md.");
});

test("a daily set that names no live track falls back to pace", () => {
  assert.equal(dayPlanLine({ pace: 2, daily: { generic: 2 }, tracks: [{ id: "series", prefix: "a" }, { id: "generic", prefix: "e", retired: true }] }, "d"), "Start the day (d): 2 reels, 2 per track. Follow prompts/work-day.md.");
});
