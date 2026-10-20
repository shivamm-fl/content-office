import assert from "node:assert/strict";
import { test } from "node:test";
import { renderTranscript } from "./ops.ts";

test("transcript renders readable blocks and skips thinking", () => {
  const source = [
    { type: "assistant", timestamp: "2026-10-20T12:34:56Z", message: { content: [{ type: "thinking", thinking: "private" }, { type: "text", text: "Done" }, { type: "tool_use", name: "Read", input: { file: "a" } }] } },
    { type: "user", message: { content: [{ type: "tool_result", content: "result" }] } },
  ].map(JSON.stringify).join("\n");
  const result = renderTranscript(source);
  assert.match(result, /12:34:56 ASSISTANT: Done/);
  assert.match(result, /TOOL Read:/);
  assert.match(result, /RESULT: result/);
  assert.doesNotMatch(result, /private/);
});
