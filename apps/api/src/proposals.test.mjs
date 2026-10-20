import assert from "node:assert/strict";
import { test } from "node:test";
import { validRun, proposalKind, needsDeploy, markdownTitle } from "./proposals.ts";

test("proposal paths classify changes and deployment need", () => {
  assert.equal(proposalKind(["teams/hq/prompts/cto.md"]), "rules");
  assert.equal(proposalKind(["apps/api/src/index.ts", "teams/hq/state/note.md"]), "mixed");
  assert.equal(proposalKind(["teams/learnai/reels/e101/script.txt"]), "content");
  assert.equal(needsDeploy(["teams/hq/team.json"]), true);
  assert.equal(needsDeploy(["runner/bridge/bridge.mjs"]), false);
  assert.equal(validRun("run_Ab1234"), true);
  assert.equal(validRun("../main"), false);
  assert.deepEqual(markdownTitle("# Fix save\n\nWhy it matters"), { title: "Fix save", summary: "Why it matters" });
});
