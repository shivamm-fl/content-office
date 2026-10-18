// node --test apps/api/src/github.test.mjs   (Node 24 runs the TypeScript module directly)
import assert from "node:assert/strict";
import { test } from "node:test";
import { learningsRepo, publishRepo, PUBLISHING_TEAMS, SLOT_TEAM } from "./github.ts";

const env = { GITHUB_TOKEN: "t", GITHUB_REPO: "o/office", AI_COURSE_REPO: "o/publisher" };

test("publishRepo: learnai, dsa and systemdesign post through the publishing repo, nobody else", () => {
  assert.deepEqual([...PUBLISHING_TEAMS], ["learnai", "dsa", "systemdesign"]);
  for (const team of PUBLISHING_TEAMS) assert.equal(publishRepo(env, team), "o/publisher");
  assert.equal(publishRepo(env, "somebody"), null);
  assert.equal(publishRepo(env, ""), null);
});

test("publishRepo: no publishing repo configured means no publisher for any floor", () => {
  for (const team of PUBLISHING_TEAMS) assert.equal(publishRepo({ ...env, AI_COURSE_REPO: "" }, team), null);
});

test("learningsRepo: the publishing repo's copy of state/learnings.md is learnai's only", () => {
  assert.equal(SLOT_TEAM, "learnai");
  assert.equal(learningsRepo(env, "learnai"), "o/publisher");
  assert.equal(learningsRepo(env, "dsa"), null);
  assert.equal(learningsRepo(env, "systemdesign"), null);
  assert.equal(learningsRepo({ ...env, AI_COURSE_REPO: "" }, "learnai"), null);
});
