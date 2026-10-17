// Team rosters are bundled from teams/<team>/team.json at deploy time.
import type { Team } from "@office/protocol";
import learnai from "../../../teams/learnai/team.json";

export const TEAMS: Record<string, Team> = { learnai: learnai as unknown as Team };

export function team(slug: string): Team | null {
  return Object.prototype.hasOwnProperty.call(TEAMS, slug) ? TEAMS[slug] : null;
}
