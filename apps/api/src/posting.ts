import type { PostRecord, PublishRequest } from "@office/protocol";

export function toPost(r: Record<string, unknown>): PostRecord {
  return {
    id: r.id as string, item: r.item as string, mode: r.mode as PostRecord["mode"], date: (r.date as string) ?? null, time: (r.time as string) ?? null,
    status: r.status as PostRecord["status"], gh_url: (r.gh_url as string) ?? null, error: (r.error as string) ?? null,
    created_at: r.created_at as number, updated_at: r.updated_at as number, trial: Boolean(r.trial),
  };
}

export function handoverInputs(team: string, req: PublishRequest, source: "office" | "released", meta: { caption?: string; youtube?: string } | null): Record<string, string> {
  return {
    team, item: req.item, action: req.mode, date: req.date ?? "", time: req.time ?? "", source,
    caption: (meta?.caption ?? "").slice(0, 8000), youtube: (meta?.youtube ?? "").slice(0, 8000), trial: req.trial ? "true" : "false",
  };
}
