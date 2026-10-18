# Content office

A content company you run from your phone. Each brand (handle) has a **team** of AI agents (Producer, Strategist, Researcher, Scriptwriter, Packager, Growth Analyst, Community Manager, and the studio desks) on its own **floor**. You talk to any agent, they hand work to each other, and you approve the plan, every script and every final video. Nothing runs on a schedule. Agents never post; you post from the **Calendar** tab.

- **The office app** (PWA): https://content-office.learnai-ai.workers.dev, installable from the browser menu ("Add to Home Screen").
- **Where agents run**: GitHub Actions in this repo, started by the office, never on a schedule:
  - `office-run.yml` (desk): chat, planning, scripts, the daily sync and the work day. The runner closes after 15 minutes without a message; the next message reopens the conversation where it was.
  - `office-studio.yml` (studio): one reel per run: build (agent) → independent reviews → fix (agent, if needed) → final gate, video to the release `office-<team>-<item>`, the reel to the owner's inbox. The final gate judges the best-reviewed of the up to three versions (`runner/scripts/pick_best.py`), not just the last: a fix session can make a passing reel worse. A closing "comment and follow" scene is shown in the mute test but not rated. The owner reviews every reel, so the gate only holds back a **broken** one (missing file, not 1080x1920 h264, no audio, length outside 20 to 120 s, frozen frames; `runner/scripts/delivery.py`); every other check (mute test, layout, hook score, caption lint, a fact finding...) is a note shown on the reel's card, never a reason to withhold it. A finished run can be delivered later with the `from_run` input (the GitHub run id of an earlier run with the same `run_id`).
- **A work day**: the owner taps "Start the day"; the Producer picks the day's reels (team pace), the team plans and writes, and each reel goes to the studio. The owner approves only finished reels (Approve, Changes, Reject).
- **Calendar and posting** (Calendar tab, one calendar per floor): the reels that are ready to post, what goes out in which slot of the next days (posted, scheduled, next in line, empty), what is still being made, and what was posted lately. Each ready reel has **Post** with two choices: *Post now* (07:00 to 21:00 IST, after a second tap to confirm) or *Put on a slot*. There is also the switch for automatic slot posting. The buttons are owner-session routes of the Worker (`/api/teams/:team/calendar`, `/publish`, `/posting`); no agent can reach them. They start the publishing repo's `office-handover` workflow (ai-course): it takes the approved reel from the release `office-<team>-<item>` into ai-course as a released item, edits `post_schedule` or starts `post-reel`, and the posting itself stays with ai-course's `post-reel` (Instagram, then Facebook, then YouTube). The slot rules live in `apps/api/src/calendar.ts` (`node --test apps/api/src/calendar.test.mjs`).
- **Preview before posting**: every ready reel (and every reel in a slot of the calendar) has a Preview: the video with its cover, the Instagram caption and the YouTube text that would go out, then "Post this…". A reel from the office plays from its public release; a reel already released in the private publishing repo is streamed through the owner's session (`/api/teams/:team/preview/:item/video`).
- **A team that improves itself**: the goal of every team is to grow its handle (`company/office-protocol.md`, "What we are here for" and "How the team works": use your judgment, consult each other, get better every day). When the owner corrects an agent, the agent calls `record_learning`; the Worker checks that the quoted words really are the owner's and appends the lesson to `state/learnings.md` (Owner corrections, in the team's copy and in ai-course's) with no approval card. A rule from the numbers still goes to the owner as a `learning` card. `state/team_playbook.md` and `state/experiments.md` are the team's own notes, free to edit; the work day starts with a short standup and one experiment.
- **Voice**: the owner's own ElevenLabs voice by default, Swara (Edge TTS) when its monthly characters are used up (`ELEVENLABS_API_KEY`, used only by the bridge's `make_voice` step).
- **Brains**: Claude Code with the owner's subscription (`CLAUDE_CODE_OAUTH_TOKEN`).

## How it fits together
```
Phone (PWA) ──► Cloudflare Worker (apps/api) ── one Office Durable Object per team: threads, runs, questions, live room
                     │ workflow_dispatch(run_id)                     ▲ events (WebSocket)
                     ▼                                               │
          GitHub Actions: office-run.yml ── runner/bridge ── claude -p (stream-json) in teams/<team>/
                     └── save job: path check, content to main, rules/prompts/agents to proposal/<run>
```

## Safety in a public repo
- Agents never post, reply, like, follow or DM. Only the owner's taps in the Calendar tab start a posting, and only for reels the owner approved (or that are already released in the publishing repo).
- The agent session holds no GitHub write access and no sudo; its commands cannot see the Claude token (`CLAUDE_CODE_SUBPROCESS_ENV_SCRUB`).
- Changes to rules, prompts, agents, skills and scripts become `proposal/<run>` branches for the owner, never direct commits.
- Conversations live in the office (private); the public Actions log only shows coarse progress lines.
- The runner proves who it is with GitHub OIDC (this repo, this workflow, on main, started by the owner); there is no shared secret in the repo.

## Setup (done once)
| Where | What |
|---|---|
| GitHub secret | `CLAUDE_CODE_OAUTH_TOKEN` (from `claude setup-token`) |
| GitHub variable | `OFFICE_URL` = the Worker URL |
| GitHub webhook | `workflow_run` to `<OFFICE_URL>/api/github/webhook` (secret = the Worker's `WEBHOOK_SECRET`) |
| Worker secrets | `OWNER_KEY` (the office login key), `SESSION_SECRET`, `GITHUB_TOKEN` (starts runs here, reads ai-course), `WEBHOOK_SECRET` |

## Develop
```
pnpm install
pnpm --filter @office/web build          # the PWA (served by the Worker)
cd apps/api && npx wrangler dev          # local office; .dev.vars with DISPATCH_MODE=manual and DEV_RUNNER_KEY
OFFICE_URL=http://127.0.0.1:8787 RUN_ID=<id> DEV_RUNNER_KEY=... node runner/bridge/bridge.mjs
pnpm test                                # bridge events and the calendar rules
python3 runner/scripts/test_pick_best.py # the best-version choice of the studio
```

Third-party notices: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
