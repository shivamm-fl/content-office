# Diagram-first visuals (read before you design a reel)

Learnvora System Design explains AI. A reel that only shows the words the voice already says teaches nothing the captions do not. The pictures must carry the idea.

## The mute test
Switch the sound off and ignore the captions. Would a smart 15-year-old who has never heard of the topic understand the idea from the pictures alone? Labels of one to three words are allowed. If a beat is a sentence on a dark background, it fails.

## Design order (never start from the kit)
1. Read the queue item: `one_idea` and `visual_idea`. The `visual_idea` is the planner's first picture. Improve it if you can.
2. Name the *kind* of idea, then pick the picture that shows that kind of idea:
   | The idea is about... | The picture |
   |---|---|
   | things that are alike or different (embeddings, similarity, clustering) | `M.map`: points on a 2D map; alike things land close, different things far; draw the "close" and "far" links |
   | how X turns into Y (tokenizing, embedding, encoding) | `M.flow`: the real example goes in, a box transforms it, the result comes out; a token travels through |
   | a step-by-step process (RAG, agent, pipeline) | `M.flow` or composed `M.box` + `M.arrow`; run a token through it |
   | something repeats (autocomplete, think-act-observe) | `M.loop`, or a sentence that grows one word per turn with `M.dist` bars before every pick |
   | a choice among options (temperature, top-k, top-p, sampling) | `M.dist`: bars that reshape; cut the tail; mark the pick |
   | a limit or memory (context window, cache) | `M.stack`: it fills, then the oldest block is pushed out |
   | A against B (keyword vs meaning, RAG vs fine-tuning) | `M.versus`, with a measured difference inside each panel (numbers, bars, a map) |
   | size, cost, speed, growth | `M.plot` (trend) or `M.bars` (comparison) with true proportions, one big number via `M.count` |
   | how words relate (attention) | `M.heat` grid, or arcs between word chips |
   | code or an API | `M.code` with the key line highlighted and the result beside it |
   | what is hidden or unknown (a game with hidden pieces, a black box) | a board or box built from `M.box` tiles; reveal or probe it |
   | something with no technical diagram (a token, a watermark, a limit) | a physical metaphor you draw yourself: scissors cutting a sentence into blocks, a glass filling up, scales, a funnel |
3. Write `reels/<folder>/visual_plan.md` BEFORE editing `index.html` (the scaffold has the table): one row per beat with the spoken words (short), the picture (what is drawn and what moves, at least six words), the on-screen labels, and which helper or custom code builds it.
4. Build. Use a template when it fits, compose `M.box` / `M.arrow` / `M.icon` when it nearly fits, write your own HTML/SVG/GSAP when nothing fits. The kit saves time; it never decides what the picture is. A concept that needs a picture the kit does not have gets a custom picture.

## Rules for every beat
- **Show, move, mark.** Objects appear, something moves or connects (a link, a token, a bar, a fill), then the takeaway is marked (a colour change, a ring, a label; never a glow, clean style). A diagram that appears and sits for four seconds is a slide.
- **Sync to the voice.** The key moment of the picture lands on the key spoken word: `M.W("B","numbers")`, `M.P("B",1)`. Read `data.json` (`hi.caps`) for the exact tokens and times. Never guess seconds.
- **Use the real example.** Draw the actual words, numbers or sentence the voice uses, not abstract "Step 1" boxes. Invented numbers or splits get an `EXAMPLE` pill (`M.pill`) on screen, in line with the facts rule.
- **Labels, not sentences.** One to three words, at least 36 px, high contrast. Never put the spoken sentence on screen. At most two big-text takeaways (`M.slam`, `M.big`) per reel, each under 1.5 s, for the single line the viewer must keep.
- **One focus at a time.** At most seven objects on screen. Use `M.cam` to move or zoom to the part being explained, and the handles' `dim`/`hide` methods to drop what is done.
- **Hook beat.** From frame 0 the hook line is on screen and something is already moving or already drawn (the board, the map, the box). The hook line may be text; the picture under it is not optional.
- **Facts stay facts.** A diagram that states a number or a claim needs the same source as the narration. Comparisons are drawn to true scale: a value that is 400 times smaller is a sliver, and that is the point (label it, never stretch it; `M.bars` draws a track behind each bar, so for true-scale comparisons draw plain bars without a track).

## Custom pictures (when no helper fits)
Write plain DOM/SVG plus GSAP inside `index.html`, on the one paused timeline `tl`:
```js
const bd = M.mk("abs", A);                       // an absolutely positioned div inside scene A
bd.style.cssText += ";left:120px;top:300px;width:200px;height:200px;border-radius:24px;background:#1a2a4a";
tl.set(bd, { opacity: 0, scale: 0.6 }, 0);       // start state at time 0
tl.to(bd, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false }, M.W("A", "board"));
```
Seek-safe rules (the renderer jumps around the timeline): everything goes on `tl`; no `tl.call`, `setTimeout`, `Math.random` (use a seeded generator), CSS transitions/animations, `<video>`; state at time 0 with `tl.set`, every later tween has `immediateRender: false`; moving or counting things tween a plain object `{u:0}` with `onUpdate` (see `loop.spin`, `arrow.travel`). Fonts: `var(--lat)` English labels, `var(--code)` numbers/code, `var(--head)` Devanagari. Colours: `M.ACC` gold, `M.CYAN`, `M.HOT`, `M.GOOD`, `M.VIOLET`; tween `rgba()` colours (`M.ca(hex, alpha)`), not 8-digit hex.
Ready-made custom pictures (chat that answers wrong, highlighted source line, contradicting DB row, code bug caret, ranked list with cutoff, gate, state machine, comment + follow close): `.claude/skills/clean-reel/visual-recipes.md`.
If you write a custom picture for a scene, put the comment `// diagram: <scene letter>` above it so the lint recognises it.

## Layout
The picture is BIG: it fills most of the area y 170-1300 (at least two thirds of its height), centred, with objects of at least 140 px and labels of at least 40 px, so it reads on a phone. Fewer, larger objects beat many small ones; do not park a small diagram at the top with an empty gap below it.
Think in portrait: stack things vertically instead of lining them up in one wide row. A good skeleton is a short label strip (y 170-300), the main picture (y 330-1240, boxes at least 200 px tall) and one takeaway label under it (y 1240-1300). Three or four big objects beat six small ones. End each scene's code with `M.fit(<scene>)`: it scales the finished scene up (at most 1.45x) and centres it in the safe area. In the hook scene pass a rect that starts below the hook text, `M.fit(A, { y: 460, h: 840 })`.
Canvas 1080x1920. Content in y 170-1300 and x 60-1020. The caption lane (y 1330-1600) stays empty. Two things side by side are each at most 460 px wide. A labelled arrow needs 150 px between its boxes; a short arrow carries no label. Keep the bottom 250 px and the top 150 px free of key information.

## Check your work
1. `npx --yes hyperframes@0.8.149 check` in the reel folder: no errors.
2. `python3 scripts/lint_visuals.py reels/<folder>`: the plan, the diagram scenes and the text budget.
3. Snapshot the end of every beat: `npx --yes hyperframes@0.8.149 snapshot . --at <t1,t2,...> --no-end`, then Read the images. Look for overlapping labels, things outside the safe area, tiny text, empty space, and a beat that is only words.
4. After the render, `scripts/frames.py`, then `python3 scripts/visual_review.py <id>`: a fresh reviewer sees only the pictures (sound off, captions ignored) and says what a beginner learns from each scene. A scene it calls text only, or whose picture does not teach the narrated idea, is redrawn. The gate needs a passing, fresh review.

## Worked example
`reels/_kit/example_diagrams.html` uses every template once and composes a small retrieval pipeline from boxes, arrows and icons. `reels/_kit/viz.js` has the full API in its header comment. Look at them before you write code; do not copy their content into a reel.

## Style v2 (2026-10-14)
Read `docs-notes/reel-style-v2.md`: experience-first hooks, the viewer's example drawn with its real words in big rows, a header label in the first 0.3 s of every scene, no empty seconds. Reference: `reels/q07_lost_in_middle`.
