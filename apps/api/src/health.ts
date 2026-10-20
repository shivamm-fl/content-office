export interface HealthRun { id: string; thread_id: string | null; status: string; profile: string; created_at: number; ended_at: number | null; last_activity?: number | null; error?: string | null; gh_run_id?: string | null; gh_done_at?: number | null }
export interface HealthAsk { thread_id: string; created_at: number; status: string }
export interface Anomaly { kind: "stalled" | "failed" | "save_pending_long" | "old_ask" | "long_run"; severity: "info" | "warn" | "error"; run_id?: string; thread_id?: string; text: string }

export function findAnomalies(input: { now: number; runs: HealthRun[]; lastOwnerMessageAt: Record<string, number>; asks: HealthAsk[]; savePending: string[] }): Anomaly[] {
  const out: Anomaly[] = [];
  for (const run of input.runs) {
    const pending = input.asks.some((a) => a.status === "pending" && a.thread_id === run.thread_id);
    const ownerAt = run.thread_id ? input.lastOwnerMessageAt[run.thread_id] : undefined;
    if (run.profile === "desk" && ["live", "idle"].includes(run.status) && !pending && ownerAt && run.last_activity && ownerAt > run.last_activity && input.now - run.last_activity > 6 * 60_000)
      out.push({ kind: "stalled", severity: "warn", run_id: run.id, thread_id: run.thread_id ?? undefined, text: "Desk has not responded to the owner's message." });
    if (["failed", "lost"].includes(run.status) && run.ended_at && input.now - run.ended_at < 86_400_000)
      out.push({ kind: "failed", severity: "error", run_id: run.id, thread_id: run.thread_id ?? undefined, text: run.error ?? run.status });
    if (input.savePending.includes(run.id) && run.ended_at && input.now - run.ended_at > 6 * 60_000)
      out.push({ kind: "save_pending_long", severity: "warn", run_id: run.id, thread_id: run.thread_id ?? undefined, text: "Workflow has not finished saving files." });
    if (run.status === "live" && input.now - run.created_at > 120 * 60_000)
      out.push({ kind: "long_run", severity: "info", run_id: run.id, thread_id: run.thread_id ?? undefined, text: "Run has been live for over 120 minutes." });
  }
  for (const ask of input.asks) if (ask.status === "pending" && input.now - ask.created_at > 30 * 60_000)
    out.push({ kind: "old_ask", severity: "warn", thread_id: ask.thread_id, text: "Owner question has waited over 30 minutes." });
  return out;
}
