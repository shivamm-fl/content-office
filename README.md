# Content office

A content company you run from your phone. Each brand (handle) has a **team** of AI agents (Producer, Strategist, Researcher, Scriptwriter, Packager, Growth Analyst, Community Manager, and the studio desks) on its own **floor**. You talk to any agent, they hand work to each other, and you approve the plan, every script and every final video. Nothing runs on a schedule and nothing is posted from here.

- **The office app** (PWA): https://content-office.learnai-ai.workers.dev, installable from the browser menu ("Add to Home Screen").
- **Where agents run**: GitHub Actions in this repo (`.github/workflows/office-run.yml`), started by the office when you send a message. The runner closes after 15 minutes without a message; the next message reopens the conversation where it was.
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
- Agents never post, reply, like, follow or DM.
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
node --test runner/bridge/events.test.mjs
```

Third-party notices: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
