# Playbooks: how each company change is made

Every playbook ends the same way: the change is a proposal (`prompts/proposal-template.md`), reviewed by the auditor, merged by the owner, and deployed when the app is involved (a `team.json` is bundled into the Worker at deploy time, so a changed roster or track needs a deploy). Nothing here posts anything.

## Add a floor
A floor is a folder `teams/<slug>/` (slug: lowercase letters, digits, dashes, 2 to 40 characters). Start from the closest existing floor (`teams/dsa` or `teams/systemdesign` for a one-series floor, `teams/learnai` for several tracks) and copy its structure instead of inventing one.
1. `team.json`: slug, name, tagline, handles, `tracks` (each with an id and a **prefix letter no other floor uses**: item ids start with it, `grep '"prefix"' teams/*/team.json`), `lead`, `model`, agents (each needs `teams/<slug>/.claude/agents/<slug>.md`), rooms, `daily`/`pace`. Leave `scope` out (a floor is a floor).
2. `CLAUDE.md` of the floor (goal, guardrails, where things live: copy and adapt, keep the company rules), `prompts/` (work-day, studio, build-reel, ci-build-mode), `scripts/` (copy the toolchain), `docs-notes/`, `.claude/skills/`, `requirements.txt`, `skills-lock.json`.
3. `state/` (empty `queue.json` `{"items": []}`, `covered.json`, `phase5_status.json` `{}`, `config.json`, `learnings.md`, `team_playbook.md`, `experiments.md`, `growth_notes.md`) and `roadmap/` with the series plan when there is one.
4. Register: run `node tools/gen_teams.mjs` (it rewrites `apps/api/src/teams.generated.ts`; the floor then shows in the app after a deploy).
5. Posting: the Calendar and Post work only for floors in `PUBLISHING_TEAMS` (`apps/api/src/github.ts`), and posting needs a publishing repo and accounts the owner sets up. Do not wire posting yourself: tell the owner what is needed.
6. The owner's brand choices (avatar, colours, handle names) are theirs: ask with `ask_owner` instead of inventing them.

## Add, retire or reorder a series or a track
- A track is an entry in the floor's `team.json` `tracks`. **Retire**: add `"retired": true` (ids and finished reels stay; the work day neither plans nor builds it). **Bring it back**: remove the flag. **New series**: a roadmap file in `roadmap/`, a track with a free prefix letter, `daily` in `team.json` (how many reels per track per work day), the planner and work-day prompts updated to read the new roadmap, and `state/queue.json` / `covered.json` untouched (agents fill them).
- The work day's set is `daily` in `team.json` (and the floor's `prompts/work-day.md`, which names it). Change both together.

## Hire an agent
`teams/<floor>/.claude/agents/<slug>.md` (frontmatter `name`, `description`, `model`; the body is the role: what it returns, its rules, who it asks), then the roster in `team.json` (`agents`: slug, name, title, color, `desk` = `desk` for chat work or `studio` for render work, skills) and its room. Copy a close teammate's file and change the role. Tell the lead (`prompts/work-day.md` or its agent file) when and how to use the new teammate.

## Fire an agent
Remove its file, its entry in `team.json` `agents` and its name from `rooms`; remove it from any prompt that names it. Its past work (reels, notes) stays. Say in the proposal who takes over its job.

## Change the app (screens, behaviour)
`apps/web/src/` (React, Tailwind; screens in `components/`, state in `store.ts`, API calls in `api.ts`), the Worker in `apps/api/src/`, shared types in `packages/protocol/src/index.ts`. Keep it phone-first. Run what can run (`node --test apps/api/src/*.test.mjs`); the deploy workflow runs the type check and the tests before it deploys, so a broken change cannot go live. Say in the proposal which screens change and how the owner can see it.

## Change a floor's pipeline or the gate
`teams/<floor>/scripts/`, `prompts/`, and the shared `runner/scripts/` (save rules, delivery, script lock). Copy a fix to every floor that has the same file (the floors' `scripts/` are copies). Add or extend a test next to the code (`runner/scripts/test_*.py`).

## Change company rules
`CLAUDE.md` (root), `company/office-protocol.md`, a floor's `CLAUDE.md` and `docs-notes/`: always a proposal; quote the owner's own words when the change comes from a correction (use `record_learning` for the lesson itself).
