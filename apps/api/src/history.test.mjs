import assert from "node:assert/strict";
import { test } from "node:test";
import { buildHistory, historyText } from "./history.ts";

test("history carries the owner's exact edited script and card", () => {
  const rows = [
    { author: "agent:a", kind: "approval", body: { title: "Script", text: "[script] first draft" } },
    { author: "owner", kind: "decision", body: { decision: "approved_with_edits", notes: "keep this", edited: "Exact final wording" } },
  ];
  assert.match(buildHistory(rows)[0].text, /Script\n\n\[script\] first draft/);
  assert.match(buildHistory(rows)[1].text, /use this wording exactly\)\nExact final wording/);
  assert.equal(historyText({ author: "owner", kind: "answer", body: { notes: "answer text" } }), "Notes: answer text");
});
