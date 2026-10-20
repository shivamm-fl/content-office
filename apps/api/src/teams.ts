// Team rosters are bundled from teams/<team>/team.json at deploy time.
import type { Team } from "@office/protocol";
import { GENERATED_TEAMS } from "./teams.generated";

// learnai stays first: the office opens on the first team until the owner picks another floor.
export const TEAMS: Record<string, Team> = Object.fromEntries(GENERATED_TEAMS.map((t) => [t.slug, t as Team]));

export function team(slug: string): Team | null {
  return Object.prototype.hasOwnProperty.call(TEAMS, slug) ? TEAMS[slug] : null;
}
