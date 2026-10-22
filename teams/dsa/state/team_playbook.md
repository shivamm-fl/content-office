# Team playbook

The team's living craft notes, by role: how a good hook, script, picture or caption is made here. Every agent may edit this file freely. Add a short dated line when you learn something that will help the next reel.

## Everyone
- 2026-10-18: Read `state/learnings.md` (Owner corrections) before you start; the owner's own words are the strongest signal we have.
- 2026-10-18: This floor runs 150 Days of DSA. Read `docs-notes/series-style.md` before you plan, script or draw.

## Scriptwriter

## Researcher

## Strategist

## Motion designer
- 2026-10-19 (d001 FIX): `M.fit` measures the whole scene, so a card that appears late leaves the lower half empty early. Put every panel on screen from the start (dim it, then light it on its word). A true-scale sliver (20 of 1,000,000) is invisible: show the halving ladder (÷2 bars) instead. A real page screenshot needs a crop (cookie banner, faces) before it goes on screen.
- 2026-10-19 (d002): `M.W(scene, word)` compares the word without punctuation ("double!" is "double"); repeated words need the nth index. Show doubling as the same objects growing (a second column of tiles, a bar that extends, a 4x4 grid next to an 8x8 grid for x4), with the real printed count beside it. A text label inside a same-colour bar must use a dark colour.
- 2026-10-20 (d003): `M.pill` `x` is the LEFT edge, not the centre: for a centred pill pass `w` and `x = 540 - w/2`, or it runs off the canvas. `M.W` strips punctuation, so use "duplicate", not "duplicate."; repeated words need the nth index (count them in `data.json` first). Draw a memory bar that grows with the input and then shrinks to a sliver for the method with no extra memory, instead of two bars that contradict each other.
- 2026-10-22 (d004): For a row of memory boxes use touching tiles (no gap) so "no gap" is visible; show an insert as 7 dashed slots where the tail tiles tween x by one slot and a NEW tile drops in, with a counter beside it. Keep a floating NEW tile below the panel label (top >= 62) and keep counters clear of scattered tiles (tiles y max + 40 < counter top). The brief said the folder was scaffolded but it was not: run new_reel.py and add the queue item first.
