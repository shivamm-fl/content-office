import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { generate, generateSource } from "./gen_teams.mjs";

test("generator orders rosters and skips folders without team.json", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "office-teams-"));
  const teams = path.join(root, "teams");
  for (const slug of ["zeta", "learnai", "alpha", "empty"]) await mkdir(path.join(teams, slug), { recursive: true });
  for (const slug of ["zeta", "learnai", "alpha"]) await writeFile(path.join(teams, slug, "team.json"), "{}");
  const out = path.join(root, "api", "teams.generated.ts");
  await mkdir(path.dirname(out));
  const source = await generate(teams, out);
  assert.equal(source, await readFile(out, "utf8"));
  assert.match(source, /learnai.*team\.json";\nimport team1.*alpha.*team\.json";\nimport team2.*zeta/s);
  assert.doesNotMatch(source, /empty/);
});

test("committed registry is current", async () => {
  const root = path.resolve(import.meta.dirname, "..");
  const expected = await generateSource(path.join(root, "teams"), path.join(root, "apps/api/src/teams.generated.ts"));
  assert.equal(await readFile(path.join(root, "apps/api/src/teams.generated.ts"), "utf8"), expected);
});
