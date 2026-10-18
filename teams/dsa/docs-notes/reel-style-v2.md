> Carried over from the LearnAI floor on 2026-10-18. The structure and the craft rules apply here; the examples and some track names (q##, r##, e##) are about AI. Write ours about DSA, and use `docs-notes/series-style.md` where it is more specific.

# Reel style v2 (owner decision 2026-10-14, read before you plan, script or draw a reel)

Why: on 2026-10-14 the owner compared our reels with a Hindi AI account whose reels got far more reach (`docs-notes/laxmikant-benchmark.md`, format and strategy only, rule 15). Their winners opened on something the viewer has lived or a wrong belief, and explained with one big concrete picture. Ours opened on a concept and drew small abstract blocks. The reference build of the new style is `reels/q07_lost_in_middle` (read its `spec.json`, `index.html`, `visual_plan.md`).

## 1. The hook is an experience the viewer has had
- The first line starts from something the viewer has personally done or felt (gave ChatGPT a long PDF and it ignored a detail; a free model download; a search that returned a surprising result), or from a belief of theirs that is wrong. Never from a behaviour nobody has noticed, never from a concept name. Test: "has my target viewer actually seen this happen?" If not, rewrite.
- Interview track (q##), updated 2026-10-15: the narration opens on the relatable stake itself (not on `Interviewer ने पूछा:`, which spent our first second, see `.claude/skills/hook-writer`), and the interview frame follows in the third beat (`Interview में यही पूछा जाता है`) and as an `INTERVIEW QUESTION` chip on screen from frame 0. The viewer must still feel "this is a real interview question". Updated 2026-10-16: this is one of three interview hook types. `Interviewer ने पूछा:` (with a clear, complete question) and the company-specific opener stay in rotation (see hook-writer); nothing that worked is discarded.
- Course (r##) and generic (e##): the same experience-first opener without the interviewer frame.
- At most 10 words in the first spoken sentence group; the hook is on screen from frame 0 with the picture already drawn under it.

## 2. Our own example, our own words
- Same topic and the same beat arc is fine (trap or wrong belief, mechanism, fixes, one-line answer, share/save line). Scripts are written fresh from the facts in the sources, never a light rewrite of another channel. Examples are our own (a refund policy line in a 9-part prompt, a Swiggy-style order, etc.); invented numbers get an `EXAMPLE` pill.

## 3. The picture is big, concrete, and never empty
- Draw the viewer's example with its real words (`REFUND: 7 DAYS` as a gold row inside a grey list), not abstract Step boxes. Rows of at least 90 px, labels of at least 38 px, 60 percent or more of the band between the top bar and the captions filled.
- Every scene has something on screen in its first 0.3 s (a header label such as `3 FIXES`, `POSITION`). No two seconds of an empty background; no scene that is only dashed outlines.
- Shows-then-marks: objects appear, one moves (a gold row jumps to the start), the result is marked (green and red bars, a ring).
- Opaque rows that sit on top of other rows must not hide text under them (the visual lint flags `text_occluded` and `content_overlap`): leave the covered row out instead.
- Keep the last scene (share) inside y 170 to 1300, never in the caption lane.

## 4. Process (unchanged, plus)
`visual_plan.md` first, `lint_visuals.py`, `hyperframes check`, snapshots at the end of every beat, render, `frames.py` and Read every sheet. Fix an overlap or empty second yourself before the reviewers see it.

## 5. Look and sound: the clean style (owner decision 2026-10-14)
The neon look (moving floor grid, dust, orbs, glitch cuts, white flashes, glows, sparkle bursts, bouncing pops) is retired: the owner called it "jhagmag, chamkila, not professional". Every reel now uses the clean style that the kit implements: a static dark surface, flat cards with a soft shadow, calm colours (navy + gold accent, red only for wrong, green only for right), one `power3.out` entrance per object timed to its word, clean pushes between scenes, word-by-word captions with 1-2 coloured key words. Sound: Swara at pace 1.26, the bundled lo-fi bed ~15 dB under the voice with a -4 dB duck, synthesized SFX on beats, the mix at -14 LUFS (`"audio": "v2"`). One save line, never repeated. Full rules, cue names, re-render steps and a verified example: `.claude/skills/clean-reel/SKILL.md`.

