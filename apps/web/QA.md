# Content Office UI QA

## Browser setup

Chrome was driven by `qa/smoke.mjs` against the locally built Vite preview at 127.0.0.1:4173. Playwright routed every `/api/*` request and the team WebSocket to typed local fixtures. No owner's backend was contacted. The fixtures load all three checked-in team rosters and cover a busy work day, studio runs, final reel and script approvals, a ready Calendar reel, slots, usage at 70%, and agent XP.

The script wrote screenshots to ignored `qa/out/`. I opened and inspected the 390 × 844 Office, Inbox, Calendar, Chat, login, fallback, and 15-agent roster screenshots, plus the 1280 × 800 Office screenshot. The mobile screen has no horizontal overflow; the floor, start action, and bottom dock fit the first view. The remainder of the quest board and roster is reached by the main vertical scroll. The desktop view shows the scene beside its daily controls. Long reel titles truncate inside cards without widening the page.

## Interaction checks

- Character tap opens the matching AgentSheet; room tap and the accessible room list focus the camera; pointer drag orbits; wheel zooms; reset restores the opening view.
- Floor switching remounts the chosen team's live state. Socket closure shows Reconnecting.
- Start the day and daily sync navigate to their returned threads. Tapping 3D reception opens Inbox. Inbox approval posts the unchanged answer payload, removes the pending card from the mocked live state, and then shows a brief approval celebration.
- Calendar Post opens its sheet and Pause sends the existing pause action. Chat renders a WebSocket streaming delta. Runs, Login, and the bottom navigation open.
- The 2D/3D choice survives reload. WebGL disabled, reduced motion, and a simulated two-core device select the 2D floor. A 15-agent fixture renders all roster buttons. The empty floor and usage-limit/resume states render.
- A four-times CPU throttle reached a usable roster. No mobile console errors or horizontal overflow were observed.
- The generated service worker precached 16 entries; after loading once, the PWA shell opened while Chrome was offline.

## Build and size

The original `origin/main` web UI was built in an ignored QA baseline directory with the same installed Vite version. Sizes are Vite output:

| Asset | Before | After |
| --- | ---: | ---: |
| Main JS gzip | 136.84 KB | 138.74 KB |
| CSS gzip | 5.69 KB | 12.03 KB |
| Lazy scene JS gzip | — | 2.98 KB |
| PWA precache | 866.81 KiB | 904.74 KiB |

`corepack pnpm --filter @office/web build` and `corepack pnpm -r typecheck` pass. The Vite PWA settings, including the API navigation denylist, remain in place.

`corepack pnpm test` passes 48 of 48 (two studio voice tests need a `python` on PATH). The browser QA used the production Vite preview, not `pnpm dev:web`.

## Known limits

The office is procedural CSS 3D, so it has no canvas pixel ratio, downloaded model, or WebGL draw loop. Work and idle motion is limited to light CSS character animation; entering an active sync places teammates at the meeting table with a short seat transition. The protocol has no streak history or achievement records, so the trophy shelf only shows verified XP and levels from `desks[].done`. Audio is off and no sound asset is included.
