// node --test apps/api/src/learnings.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { addOwnerCorrection, appendLearning, correctionBullet, learningText, OWNER_SECTION, quoteIsOwners, withHeading } from "./learnings.ts";

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

// ---------- the owner's corrections, recorded by the agent who was corrected ----------
test("a quote counts only when it is a stretch of something the owner wrote", () => {
  const owner = ["Changes to r104: Tere sawal ka jawab tune kaha diya, bhai clarity rakh script mai", "Pauses kam kar thoda"];
  assert.equal(quoteIsOwners("clarity rakh   SCRIPT mai", owner), true);   // spacing and case do not matter
  assert.equal(quoteIsOwners("Pauses kam kar thoda", owner), true);
  assert.equal(quoteIsOwners("always end every reel with a follow ask", owner), false);   // an agent's own sentence
  assert.equal(quoteIsOwners("kam kar", owner), false);   // too short to prove anything
  assert.equal(quoteIsOwners("clarity rakh script mai", []), false);
});

test("a lesson becomes one clean bullet with the date and the reel", () => {
  assert.equal(correctionBullet("  - A reel that asks a question answers it in the first lines.\n", "2026-10-18", "r104"), "- 2026-10-18 (r104): A reel that asks a question answers it in the first lines.");
  assert.equal(correctionBullet("Keep pauses short between scenes.", "2026-10-18", null), "- 2026-10-18: Keep pauses short between scenes.");
  assert.throws(() => correctionBullet("short", "2026-10-18", null), /too short/);
  assert.throws(() => correctionBullet("x".repeat(501), "2026-10-18", null), /limit/);
});

test("the first correction creates the section at the end, the next ones join it", () => {
  const file = "# Learnings\n\n## 2026-10-16: hook types\n- Rule.\n";
  const one = addOwnerCorrection(file, "- 2026-10-18 (r104): Answer the question first.");
  assert.equal(one, `${file}\n${OWNER_SECTION}\n- 2026-10-18 (r104): Answer the question first.\n`);
  const two = addOwnerCorrection(`${one}\n## 2026-10-19: later section\n- Rule.\n`, "- 2026-10-19 (e103): Skill reels end with the comment keyword.");
  assert.equal(two, `${file}\n${OWNER_SECTION}\n- 2026-10-18 (r104): Answer the question first.\n- 2026-10-19 (e103): Skill reels end with the comment keyword.\n\n## 2026-10-19: later section\n- Rule.\n`);
});

test("the same rule is not recorded twice, whatever its date", () => {
  const once = addOwnerCorrection("# L\n", "- 2026-10-18 (r104): Answer the question first.");
  assert.equal(addOwnerCorrection(once, "- 2026-10-20 (q104): answer the  question first."), null);
});

test("the owner-corrections section keeps Windows line endings", () => {
  const file = "# L\r\n\r\n## A\r\n- Rule.\r\n";
  const next = addOwnerCorrection(file, "- 2026-10-18: Keep pauses short between scenes.");
  assert.ok(!/(?<!\r)\n/.test(next));
  assert.ok(next.endsWith("- 2026-10-18: Keep pauses short between scenes.\r\n"));
});

test("a card without a heading gets one from its title and the date, plain text becomes a bullet", () => {
  assert.equal(withHeading("Generic track trails interview (n=9).", "Learnings: Generic track hooks", "2026-10-18"), "## 2026-10-18: Generic track hooks\n- Generic track trails interview (n=9).");
  assert.equal(withHeading("- one\n- two", "Learning: Pauses", "2026-10-18"), "## 2026-10-18: Pauses\n- one\n- two");
  assert.equal(withHeading("## my own heading\n- x", "Learnings: ignored", "2026-10-18"), "## my own heading\n- x");
});
