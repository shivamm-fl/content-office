export function stallAction(input: { now: number; status: string; profile: string; last_activity: number | null; delivered_at: number | null; pending_asks: number; warned: boolean }): "warn" | "restart" | null {
  if (input.profile !== "desk" || !["live", "idle"].includes(input.status) || input.pending_asks || !input.last_activity || !input.delivered_at || input.delivered_at < input.last_activity) return null;
  const silence = input.now - input.last_activity;
  if (silence >= 15 * 60_000) return "restart";
  if (silence > 6 * 60_000 && !input.warned) return "warn";
  return null;
}
