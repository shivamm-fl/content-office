// An approved learning becomes a section of state/learnings.md. The owner reads the exact text in the approval card and
// approves (or edits) it; the Worker, never an agent, appends it. Pure functions so the rules can be tested.

export const MAX_LEARNING_CHARS = 6000;

/** The section to append for an approval card: null when the card is not a learning or the owner did not approve it. */
export function learningText(body: string, answer: { decision?: unknown; edited?: unknown }): string | null {
  const m = /^\[learning\]\s*([\s\S]*)$/.exec(body);
  if (!m) return null;
  const decision = String(answer.decision ?? "");
  if (decision !== "approved" && decision !== "approved_with_edits") return null;
  const source = decision === "approved_with_edits" && typeof answer.edited === "string" && answer.edited.trim() ? answer.edited : m[1];
  const text = source.replace(/\r\n/g, "\n").trim().replace(/^\[learning\]\s*/, "").replace(/^Add this section to the end of `?state\/learnings\.md`?:\s*/i, "").trim();
  if (!text) return null;
  if (text.length > MAX_LEARNING_CHARS) throw new Error(`The learning is ${text.length} characters; ${MAX_LEARNING_CHARS} is the limit. Ask the agent for a shorter one.`);
  return text;
}

/** learnings.md with the section appended, in the file's own line ending; null when a section with that heading is already there. */
export function appendLearning(existing: string, section: string): string | null {
  const heading = section.split("\n").find((l) => l.startsWith("## "));
  if (heading && existing.replace(/\r\n/g, "\n").split("\n").some((l) => l.trim() === heading.trim())) return null;
  const crlf = existing.includes("\r\n");
  const nl = crlf ? "\r\n" : "\n";
  const add = crlf ? section.replace(/\n/g, "\r\n") : section;
  return existing.replace(/\s*$/, "") + nl + nl + add + nl;
}
