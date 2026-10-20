const clip = (text: string, n: number) => text.length > n ? text.slice(0, n) + "…" : text;
const readable = (content: unknown): string => {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.filter((b) => b?.type === "text").map((b) => String(b.text ?? "")).join("\n");
  return "";
};

export function renderTranscript(source: string, from = 0, tail = 200): string {
  const lines = source.split("\n");
  const out: string[] = [];
  for (let i = Math.max(0, from); i < lines.length; i++) {
    let record: Record<string, any>;
    try { record = JSON.parse(lines[i]); } catch { continue; }
    if (!record || !["user", "assistant"].includes(record.type)) continue;
    const stamp = String(record.timestamp ?? record.time ?? "").match(/(\d\d:\d\d:\d\d)/)?.[1] ?? "--:--:--";
    const blocks = Array.isArray(record.message?.content) ? record.message.content : [record.message?.content];
    for (const b of blocks) {
      if (typeof b === "string") out.push(`${stamp} ${record.type.toUpperCase()}: ${clip(b, 1500)}`);
      else if (b?.type === "text") out.push(`${stamp} ${record.type.toUpperCase()}: ${clip(String(b.text ?? ""), 1500)}`);
      else if (b?.type === "tool_use") out.push(`${stamp} TOOL ${b.name ?? "unknown"}: ${clip(JSON.stringify(b.input ?? {}), 400)}`);
      else if (b?.type === "tool_result") out.push(`${stamp} RESULT: ${clip(readable(b.content), 300)}`);
    }
  }
  return clip(out.slice(-Math.min(1000, Math.max(1, tail))).join("\n"), 60_000) || "No readable transcript lines.";
}
