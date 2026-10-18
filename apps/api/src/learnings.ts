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

/** A card's text without a `## ` heading would land inside the section above it: give it a heading from the card's title and the date (and a bullet when it is plain text). */
export function withHeading(section: string, title: string, date: string): string {
  if (/^## /m.test(section)) return section;
  const clean = title.replace(/\s+/g, " ").replace(/^Learnings?:\s*/i, "").trim() || "learning";
  return `## ${date}: ${clean}\n${/^[-*] /.test(section) ? section : `- ${section}`}`;
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

// ---------- what the owner corrects, recorded by the agent who was corrected ----------
// No approval card: the owner's correction is the authority. The office only accepts a lesson whose quoted words really are the owner's
// (checked against what the owner wrote), so text from a web page or a file can never become a rule this way.

export const OWNER_SECTION = "## Owner corrections (recorded automatically)";
export const MAX_RULE_CHARS = 500;
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
const oneLine = (s: string) => s.replace(/\s+/g, " ").replace(/^[-*#>\s]+/, "").trim();

/** True when `quote` (at least 12 characters) is a stretch of one of the owner's own messages. */
export function quoteIsOwners(quote: string, ownerTexts: string[]): boolean {
  const q = norm(quote);
  return q.length >= 12 && ownerTexts.some((t) => norm(t).includes(q));
}

/** The bullet for one lesson. The owner's exact words stay in the chat; the file only gets the clean rule. */
export function correctionBullet(rule: string, date: string, item: string | null): string {
  const r = oneLine(rule);
  if (r.length < 15) throw new Error("The rule is too short to be a lesson another agent can follow. Write it as one or two full sentences.");
  if (r.length > MAX_RULE_CHARS) throw new Error(`The rule is ${r.length} characters; ${MAX_RULE_CHARS} is the limit. State the lesson in one or two sentences.`);
  return `- ${date}${item ? ` (${item})` : ""}: ${r}`;
}

/** learnings.md with the bullet added to the "Owner corrections" section (created at the end when missing); null when the same rule is already there. */
export function addOwnerCorrection(existing: string, bullet: string): string | null {
  const rule = norm(bullet.replace(/^- \d{4}-\d{2}-\d{2}( \([^)]*\))?:\s*/, ""));
  if (norm(existing).includes(rule)) return null;
  const crlf = existing.includes("\r\n");
  const nl = crlf ? "\r\n" : "\n";
  const lines = existing.replace(/\s*$/, "").split(/\r?\n/);
  const head = lines.findIndex((l) => l.trim() === OWNER_SECTION);
  if (head === -1) return lines.join(nl) + nl + nl + OWNER_SECTION + nl + bullet + nl;
  let end = head + 1;
  for (let i = head + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) break;
    if (lines[i].trim()) end = i + 1;
  }
  lines.splice(end, 0, bullet);
  return lines.join(nl) + nl;
}
