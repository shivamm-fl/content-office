type Entry = { author: string; kind: string; body: string | Record<string, unknown> };
const value = (v: unknown) => typeof v === "string" ? v : "";
export function historyText(entry: Entry): string {
  const b = typeof entry.body === "string" ? JSON.parse(entry.body) as Record<string, unknown> : entry.body;
  const parts = [entry.kind === "approval" || entry.kind === "question" ? [value(b.title), value(b.text)].filter(Boolean).join("\n\n").slice(0, 4000) : value(b.text)];
  if (entry.kind === "decision" || entry.kind === "answer") {
    if (b.decision) parts.push(`Decision: ${value(b.decision)}`);
    if (b.notes) parts.push(`Notes: ${value(b.notes)}`);
    if (b.edited) parts.push(`(owner's edited version, use this wording exactly)\n${value(b.edited).slice(0, 8000)}`);
  }
  return parts.filter(Boolean).join("\n\n");
}

export function buildHistory(rows: Entry[]): { author: string; text: string }[] {
  return rows.slice(-40).map((m) => ({ author: m.author, text: historyText(m) }));
}
