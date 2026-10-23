# Team playbook

The team's living craft notes, by role: how a good hook, script, picture or caption is made here. Every agent may edit this file freely. Add a short dated line when you learn something that will help the next reel.

## Everyone
- 2026-10-18: Read `state/learnings.md` (Owner corrections) before you start; the owner's own words are the strongest signal we have.
- 2026-10-18: This floor runs 150 Days of System Design. Read `docs-notes/series-style.md` before you plan, script or draw.

## Scriptwriter

## Researcher

## Strategist

## Motion designer
- 2026-10-19 (s001): new_reel.py gives scene #sA only; add one `<div class="beat" id="sX">` per scene before `check`. `M.W` keys are the caption token without punctuation (`fresh`, not `fresh,`), use the nth argument for repeats. Fade a whole card by collecting its children in an array, or text under the next card overlaps. A 112 s day with 8 scenes held at one new object every 3 to 4 s.
- 2026-10-19 (s002): phone and server rack drawn as small SVG-div helpers (same shape, same place every day); a stamp or label placed over a menu panel overlaps its rows, so size the panel for the last row first. A per-word `M.W` key is case-sensitive (`Server` vs `server`).
- 2026-10-20 (s003): `M.W` keys drop punctuation on both sides (`kaam:` is `kaam`, `jawab.` is `jawab`); a key with a comma throws. A repeated word needs its index (`at("F","page",0)`), a missing index silently falls back to the first. Anything that stays on screen across a step (kick label, TIME strip) must be faded when the next step in the same scene starts, or `check` reports content_overlap. A TIME strip of five segments (one red segment fills per step) carried the "each step costs time" idea across scenes C to F.
- 2026-10-22 (s004 DNS): `M.W` keys drop every `.` so `.com` is `com`. A vertical chain of boxes (same x/y in each scene, earlier nodes dimmed) carried a five-step lookup across scenes C to E; pointer answers are small green chips beside the box plus an up arrow. A shrinking bar (scaleX to 0, ease none) is a cheap TTL clock. Register new icons with `Viz.ICONS.name = (c) => ...` before `M.box`. Shell `npx hyperframes` has no network here: use the office `hyperframes` tool for check and snapshot.
- 2026-10-23 (s005 HTTP/HTTPS): vertical layout (phone on top, server at the bottom, wire between, the message card in the middle) reads bigger on a phone than left/right. The kit's arrow layer sits under opaque cards but shows through a card that recolors with a translucent fill: recolor the border only. A text swap inside one card must hide the old text with a 0.01 s tween first, or `check` flags content_overlap. `M.W` is case-sensitive (`Server` at a sentence start); `check` names the missing word. Labels placed over the dashed wire collide: use a stamp (opaque box) instead.
