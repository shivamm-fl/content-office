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
- 2026-10-22 (q113): `M.box(...).show()` and `M.arrow(...).show()` return nothing, so keep the handle in a variable (`const h = M.box(...); h.show(t)`) when you want `h.hide(t)` later. When the voice's example numbers must be real, run the measurement yourself and use the printed numbers: the script's numbers did not reproduce on the run machine (0.2 / 4.8 / 47.9 ms, not 0.3 / 7.7 / 84.6). Start a scene's first picture on its first spoken word: q113 scene I showed ~1 s of empty frame.
- 2026-10-24 (q114): A long scene with phases (card, chat, stamps) needs one `data-nofit` full-canvas container per phase (`grp`), shown and faded on spoken words; `M.fit` measures only elements with a size, so call it only in scenes without containers. The template has just `#sA`: add a `<div class="beat" id="sX">` per scene or every `M.$` target is null. Put mini-animations (cells) where they do not overlap the sub-label text.

- 2026-10-24 (a006): `M.icon`/`M.box` kinds that do not exist (e.g. "hat") silently draw a star: check `Viz.ICONS` first. Put the "?" placeholder under a value `gone()` when the real value lands, or the layout check flags overlapping text. Keep EXAMPLE pills clear of other labels (they collided with scissors and a section title).

- 2026-10-24 (q115): `M.W` matches the caption token case-sensitively ("Reranker", "Cohere", "Comment" capitalised in the voice text). For a list that re-orders, draw ONE card list and move the cards with `tl.to(y)` (badge swaps old/new rank); the same objects across scenes teach better than new boxes. Show a scene's first picture at its first phrase, not on the key word, or the opening seconds are empty.
- 2026-10-25 (q117): A concept about "what goes inside a box" (context window) reads best as one labelled window whose cards land on their spoken words, then the same window again with cards turning red and sliding into a bin. Do the counter (x10) with a plain-object tween and onUpdate; keep the wrong answer bubble on screen while it runs.

## Packager

## Growth analyst
- 2026-10-20: Put one line in `state/experiments.md` before a trial reel goes out (what is new, what we look at), read it 72 hours later, and call a few hundred views promising or weak, never proof.

## Community manager

## Motion Designer: a007 notes (2026-10-25)
- `M.W` strips punctuation from the caption words and the number commas ("1,000" is "1000"): look up `"bill"`, `"order"`, `"10000"`, never `"bill:"` or `"10,000"`.
- To show a size ratio honestly, draw equal frames with grid cells of true relative area (a 4.2x token cost = 2.05x side) instead of counting out hundreds of tiles.
- Devanagari token pieces are byte fragments and cannot be shown as text: use blank coloured tiles for them, and real text only for English pieces.
- Do not name a scene `M`: it clashes with the `M` kit object; call the element `M_`.

- 2026-10-26 (q119): A card that moves out of one panel into another must be created after the target panel or get `style.zIndex`, or the glass panel hides it. For a "size stays flat" idea, true-scale bars (25 vs 750 words, 55 vs 750) with a counter beat a table; a tile strip (30 turns) shows "history" before the bars appear.

- 2026-10-27 (q120): For "split work across agents", reuse one visual unit (a window) in every scene: one shared window buried in pages (D), three own windows with true-scale bars (E), notes flying into a small LEAD window plus a 12000 bar struck out against a 44 px sliver for 600 (F). `M.icon` returns a handle: keep it and call `.hide(t)` before the next phase, or the icon stays over the next picture. A `M.box` row with an icon and a sub-label needs h 190 or more, or the icon touches the border.
