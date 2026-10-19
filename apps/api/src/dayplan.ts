import type { Team } from "@office/protocol";

/** The line the owner's "Start the day" tap sends to the floor's lead: how many reels today and of which track.
 *  A floor with `daily` has a fixed set per track (retired tracks are named so nobody plans them); the others spread `pace` over their tracks. */
export function dayPlanLine(team: Pick<Team, "pace" | "tracks" | "daily">, iso: string): string {
  const live = team.tracks.filter((t) => !t.retired);
  const retired = team.tracks.filter((t) => t.retired).map((t) => t.id);
  const set = team.daily ? live.map((t) => ({ id: t.id, n: Math.max(0, Math.floor(team.daily![t.id] ?? 0)) })).filter((d) => d.n > 0) : [];
  if (set.length) {
    const total = set.reduce((a, d) => a + d.n, 0);
    const parts = set.map((d) => `${d.n} ${d.id}`).join(" and ");
    return `Start the day (${iso}): ${total} reels, ${parts}.${retired.length ? ` Retired for now, do not plan or build: ${retired.join(", ")}.` : ""} Follow prompts/work-day.md.`;
  }
  const pace = team.pace ?? 6;
  return `Start the day (${iso}): ${pace} reels, ${Math.round(pace / Math.max(1, live.length))} per track. Follow prompts/work-day.md.`;
}
