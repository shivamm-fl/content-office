// node --test apps/api/src/learnings.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { appendLearning, learningText } from "./learnings.ts";

const SECTION = "## 2026-10-18: first-line shape (our numbers)\n- Rule: the first line is a complete concrete question.\n- Open: generic track has 1 reel.";

test("an approved learning card gives its section; the agent's lead-in sentence is dropped", () => {
  const body = `[learning] ${SECTION}`;
  assert.equal(learningText(body, { decision: "approved" }), SECTION);
  assert.equal(learningText(`[learning] Add this section to the end of \`state/learnings.md\`:\n\n${SECTION}`, { decision: "approved" }), SECTION);
});

test("the owner's edited text wins and is used exactly", () => {
  const edited = "## 2026-10-18: my words\n- Keep both hook types.";
  assert.equal(learningText(`[learning] ${SECTION}`, { decision: "approved_with_edits", edited }), edited);
  assert.equal(learningText(`[learning] ${SECTION}`, { decision: "approved_with_edits", edited: "   " }), SECTION);
});

test("only an approved learning card is saved", () => {
  for (const decision of ["changes_requested", "rejected", "", undefined]) assert.equal(learningText(`[learning] ${SECTION}`, { decision }), null);
  assert.equal(learningText(`[other] ${SECTION}`, { decision: "approved" }), null);
  assert.equal(learningText(`[other] [learning] ${SECTION}`, { decision: "approved" }), null);   // an agent cannot forge the kind inside the text
  assert.equal(learningText("[learning]   ", { decision: "approved" }), null);
});

test("a learning that is too long is refused loudly", () => {
  assert.throws(() => learningText(`[learning] ## x\n${"a".repeat(6001)}`, { decision: "approved" }), /limit/);
});

test("the section is appended after a blank line, once", () => {
  const file = "# Learnings\n\nRules.\n\n## 2026-10-16: hook types\n- Rule.\n";
  const next = appendLearning(file, SECTION);
  assert.equal(next, `# Learnings\n\nRules.\n\n## 2026-10-16: hook types\n- Rule.\n\n${SECTION}\n`);
  assert.equal(appendLearning(next, SECTION), null);   // the same heading is already there
});

test("a file with Windows line endings keeps them", () => {
  const file = "# Learnings\r\n\r\n## 2026-10-16: x\r\n- Rule.\r\n";
  const next = appendLearning(file, SECTION);
  assert.ok(next.endsWith("- Open: generic track has 1 reel.\r\n"));
  assert.ok(!/(?<!\r)\n/.test(next), "every line break is CRLF");
  assert.equal(appendLearning(next, SECTION), null);
});
