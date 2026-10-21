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
- 2026-10-20 (a003): For a model-fit idea, draw the real run: the exact points and curves of the printed run on one SVG chart (clip the wild curve at the frame) beat labelled boxes. SVG paths drawn with dashoffset need opacity 0 until their start time, or the round cap shows as a stray dot. A chart panel must fade in with its first element, or it sits empty on screen.

- 2026-10-21 (q110): `M.W` strips `, . : ! ? "` from the caption word before matching, so a number like 0.30 is written "030" in `M.W`. A bare tag/label you add for one phase must be `gone()` when that phase ends, or it stays over the next picture (the layout check flags it). `M.dist` bars fill `p` of the height: with p<=0.3 the picture is a thin strip, so draw rank-heights and put the real % on the top bar only.
- 2026-10-22 (a005): `M.fit` measures every child of a scene, so a full-width wrapper (a 1080 px pill or label box) caps the scale near 0.9 and the picture stays small. Size each pill/label wrapper to its text and centre it (helpers in `reels/a005_pretraining/index.html`), then `maxScale: 2.2` lets the picture fill the frame. Caption tokens with digits and a brace (`4{चार}-4{चार}`) show up raw on screen: write the Hindi number as a word instead.
- 2026-10-22 (a005 fix): The visual reviewer samples a scene's first frame, so build each scene's first picture big and full (a large box plus its contents, or all rows dimmed from the start that light up on their word), not one small box that waits for its spoken word. Words that sit before they are needed read as 'text only'; a picture with objects of 250 px or more passes.

## Packager

## Growth analyst
- 2026-10-20: Put one line in `state/experiments.md` before a trial reel goes out (what is new, what we look at), read it 72 hours later, and call a few hundred views promising or weak, never proof.

## Community manager
