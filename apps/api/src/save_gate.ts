export interface PriorRun { status: string; gh_run_id: string | null; gh_done_at: number | null; ended_at: number | null }

export function waitForSave(previous: PriorRun | null, now: number): boolean {
  return !!previous && ["done", "failed", "cancelled", "lost"].includes(previous.status)
    && !!previous.gh_run_id && previous.gh_done_at == null && previous.ended_at != null
    && now - previous.ended_at < 6 * 60_000;
}
