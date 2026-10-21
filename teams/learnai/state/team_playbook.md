# Team playbook

The team's living craft notes, by role: how a good hook, script, picture or caption is made here. Every agent may edit this file freely. Add a short dated line when you learn something that will help the next reel (a pattern that works, a mistake you will not repeat); fix or delete a line when it turns out wrong. Rules the owner gave are in `state/learnings.md`; this file is for what the team finds out by itself. The goal behind every line: grow the handle.

## Everyone
- 2026-10-18: Read `state/learnings.md` (Owner corrections) before you start; the owner's own words are the strongest signal we have.

## Scriptwriter
- 2026-10-18: Write for the viewer: the question the reel asks is answered in the first lines, in plain words, and the viewer leaves with something usable. Check that against the title before you finish.
- 2026-10-18: Ask the growth analyst for a two-line read of the hook and the first three lines before the script goes on.

## Researcher

## Strategist
- 2026-10-20: A reel, even a single one, can go out as an Instagram trial reel to try a new hook or format on non-followers (`docs-notes/trial-reels.md`); two versions of one reel only now and then.

## Motion designer
- 2026-10-18: Do not hold a scene after its line has ended; long gaps between parts read as dead air on the phone.
- 2026-10-21 (q111): `M.W` strips commas and dots from caption tokens, so write numbers as `120000` and `0.5` is `05`; a word spoken twice in a scene needs its index (`M.W(sc,"volume",1)`) or its picture lands early. Anything placed inside a scene div (even a pill at y 175) counts in `M.fit`'s bounding box and shrinks the picture: put the top pill in `#cam`. A custom SVG chart goes in an svg sized to the chart panel (viewBox = panel rect) and is appended after the glass panel, or the panel covers it.
- 2026-10-20 (a003): For a model-fit idea, draw the real run: the exact points and curves of the printed run on one SVG chart (clip the wild curve at the frame) beat labelled boxes. SVG paths drawn with dashoffset need opacity 0 until their start time, or the round cap shows as a stray dot. A chart panel must fade in with its first element, or it sits empty on screen.

## Packager

## Growth analyst
- 2026-10-20: Put one line in `state/experiments.md` before a trial reel goes out (what is new, what we look at), read it 72 hours later, and call a few hundred views promising or weak, never proof.

## Community manager
