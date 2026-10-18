// Team rosters are bundled from teams/<team>/team.json at deploy time.
import type { Team } from "@office/protocol";
import learnai from "../../../teams/learnai/team.json";
import dsa from "../../../teams/dsa/team.json";
import systemdesign from "../../../teams/systemdesign/team.json";

// learnai stays first: the office opens on the first team until the owner picks another floor.
export const TEAMS: Record<string, Team> = {
  learnai: learnai as unknown as Team,
  dsa: dsa as unknown as Team,
  systemdesign: systemdesign as unknown as Team,
};

export function team(slug: string): Team | null {
  return Object.prototype.hasOwnProperty.call(TEAMS, slug) ? TEAMS[slug] : null;
}
