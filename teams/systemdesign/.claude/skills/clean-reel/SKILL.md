---
name: clean-reel
description: The Learnvora System Design house style for every reel (series reels) since 2026-10-14 — clean, professional motion graphics (static dark surface, flat cards, no glow/flicker/glitch/flash/sparkle, calm colours, smooth slides, word-by-word captions) and the clean sound (Swara voice at pace 1.26, synthesized lo-fi bed ~15 dB under the voice with a -4 dB duck, synthesized SFX on beats, mix at -14 LUFS). Read before building, fixing or re-rendering any reel; also use when the owner says "clean style", "naya style", "is style mein re-render kar", "jaisa interview reels mein tha".
---

# Clean reel style (owner decision 2026-10-14)

Why: the owner compared our neon look (moving floor grid, dust, orbs, glitch cuts, white flashes, glows, sparkle bursts, bouncing pops) with a clean build and said the neon one is "jhagmag, chamkila, not professional". The clean build, its voice speed and its sound were approved. Professional = restraint: one picture per idea, few colours, nothing moving that does not carry meaning.

The kit already implements the look and the sound. Your job is to not fight it.

## What the kit does for you (reels/_kit, scripts/make_reel_audio.py)
- `motion.css`: static gradient + faint grid + vignette; `.glass` cards are flat with a soft shadow; no text glows; captions 68 px Space Grotesk with a dark stroke.
- `motion.js`: hook visible at frame 0 and settles gently; text/cards/pills rise or fade in with `power3.out` (no blur, no 3D flips, no `back.out` bounce). `M.flash`, `M.shake`, `M.glitch`, `M.ring`, `M.burst`, `M.streaks` are no-ops; `M.wipe` / `M.glitchCut` / `M.zoomCut` are one clean push. Older reels that call them still run.
- `viz.js`: no glows; a "glow" highlight is a solid 3 px ring in the colour.
- Captions: `M.finish({ kw: { word: "gold|cyan|hot|good|violet|#hex" } })` — words appear as they are spoken, the listed key words are coloured and upper-case (1–2 per phrase). `M.finish()` without `kw` also works.
- Sound (`"audio": "v2"` in spec.json, `scripts/new_reel.py` sets it with `"pace": 1.26`): bundled lo-fi bed (`assets/music.wav`, 91 s seamless loop, made by `scripts/gen_audio_assets.py`), ducked -4 dB under the voice, cue `dip` drops the music 0.15 s before a key line, synthesized SFX, voice+bed+sfx normalised to -14 LUFS. Specs without `"audio"` keep the old mix.

## Your rules when you build
1. **Look:** never add glows (`box-shadow: 0 0 Npx colour`, `text-shadow`, `drop-shadow`), blur entrances, shakes, flashes, RGB splits, particle bursts, blinking/yoyo loops or moving backgrounds in custom code. Highlight by colour, a ring, a label, or by dimming the rest.
2. **Colour:** navy surface, gold `ACC` as the brand accent, plus at most two meaning colours per reel: red `HOT` = wrong/failure, green `GOOD` = right/success, cyan `CYAN` = neutral system part. No rainbow scenes.
3. **Motion:** one entrance per object, timed to its spoken word with `M.W(scene,"word")`; 0.4–0.6 s, `power3.out`. Scene changes: `M.wipe(M.S.X)` (a push). Camera only for meaning (`M.cam` to focus a part), small (scale ≤ 1.1).
4. **Pictures:** big, concrete, filled (reel-style-v2 §3): the hook has a picture under it from frame 0; one diagram per scene; labels 1–3 words ≥ 36 px; `EXAMPLE` pill on invented data; `M.fit` every scene. Draw the real artifact (chat, policy line, DB row, code with the bug), not labelled rectangles: recipes and code in `visual-recipes.md` (next to this file).
5. **Sound cues** (spec `cues`: `[name, scene, phraseIndex, offsetSeconds]`; `[name, null, null, t]` = absolute): `impact` at 0.05 (already in the skeleton); `click`/`tick` when a card or row lands; `pop` for a chip; `err` on a failure; `ok` on a success; `lock`/`unlock` for a gate; `slice` for a cut; `save` on the save line; `dip` 0.1 s before the contradiction or the rule line. 5–12 cues per reel; whooshes between scenes are automatic. All names: hit/impact, whoosh, click, tick, pop, beep, err, ok/ding, save, lock, unlock, flip, slice, bass, thud, scan, rise, warn, type.
6. **Voice:** pace 1.26 (calm ≈ +20 %), `@hook` first phrase, `@emph` for the one-line answer and the closing rule, `|` / `||` pauses as before. Check acronyms the voice says oddly (JSON → `जेसन`, written `JSON{जेसन}`).
7. **Close with a comment + follow close (owner decision 2026-10-15): an easy comment question the viewer answers with a number or one word ("1, 2 ya 3, tumne kaun sa dekha?"), then a follow line with value ("Aise aur interview traps ke liye follow karo."); no "save kar lo" line.** On screen: a COMMENT card with the answer options popping on their words, then the handle and a `+ FOLLOW` pill that presses on "follow".

## Check before render
`python3 scripts/lint_visuals.py reels/<folder>`, `npx --yes hyperframes@0.8.149 check` in the folder (0 errors), snapshots at the end of every scene and Read them: look for glows/neon left in custom code, overlaps, empty bands, text outside y 170–1300.
Preview the look and sound fast: `PREVIEW_SECS=10 .venv/bin/python scripts/render_reel.py reels/<folder> tmp/<folder>_preview hi` (then the full render as usual; `render_reel.py` restores the full length from data.json).

## Re-render an existing reel in the clean style
```
F=reels/<folder>
cp reels/_kit/motion.css reels/_kit/motion.js reels/_kit/viz.js $F/kit/
cp reels/_template/assets/* $F/assets/
python3 - <<'PY'
import json,sys; p="reels/<folder>/spec.json"; s=json.load(open(p)); s.update(pace=1.26, audio="v2"); json.dump(s,open(p,"w"),ensure_ascii=False,indent=1)
PY
.venv/bin/python scripts/make_reel_audio.py $F
```
Then remove glows/flashes the reel's own `index.html` adds by hand (search `box-shadow:0 0`, `text-shadow`, `drop-shadow`, `blur(`, `yoyo`), check, snapshot, preview, render (`scripts/render_job.py start $F`). Keep the old mp4 until the owner approves the new one.

## Example (`.claude/skills/clean-reel/example/`, verified 2026-10-14)
spec.json (Hinglish narration, Devanagari for Hindi words):
```json
{"tts": "edge", "voice": "hi-IN-SwaraNeural", "pace": 1.26, "audio": "v2", "tone": "calm",
 "scenes": ["A", "B", "C", "D"], "min": {"A": 4.0, "B": 6.0, "C": 5.0, "D": 4.0}, "tail": {},
 "cues": [["impact", null, null, 0.05], ["click", "B", 1, 0.0], ["dip", "C", 1, -0.1], ["err", "C", 1, 0.3], ["save", "D", 2, 0.4]],
 "copy": {"hi": {
  "A": "@hook Interviewer ने पूछा: | Binary search की complexity क्या है?",
  "B": "@emph Context window, | model की working memory है। || Prompt, chat history और answer, | सब tokens में गिने जाते हैं।",
  "C": "Limit से ज़्यादा text हो, | तो कुछ हिस्सा छोड़ना पड़ता है।",
  "D": "@emph Save कर लो: | prompt, history, answer, | सब एक ही window में।"}}}
```
index.html scenes (structure from `reels/_kit/template_motion.html`):
```js
const M = Mo.init({ order: ["A","B","C","D"], tag: "SYSTEM DESIGN" }); Viz.install(M);
const { tl } = M; const A = M.$("#sA"), B = M.$("#sB"), C = M.$("#sC"), D = M.$("#sD"); const { ACC, CYAN, GOOD } = M;
M.hook(["Interviewer:", "Context window?"], { size: 96, top: 250 });                       // frame 0
M.box(A, { x: 290, y: 600, w: 500, h: 280, label: "LLM", icon: "model", color: CYAN }).show(0.05);
M.arrow(A, { from: [540, 960], to: [540, 1080], color: CYAN, w: 10 }).show(M.W("A", "context"), 0.3);
M.box(A, { x: 240, y: 1090, w: 600, h: 150, label: "WINDOW = ?", color: ACC }).show(M.W("A", "window"));
M.fit(A, { y: 460, h: 840 });
M.pill(B, "WORKING MEMORY", M.W("B", "working"), { x: 290, y: 230, size: 44 });
const win = M.stack(B, { x: 190, y: 420, w: 700, h: 720, title: "CONTEXT WINDOW",
  items: [{ label: "PROMPT", color: CYAN, h: 230 }, { label: "HISTORY", color: "#9A8CEB", h: 230 }, { label: "ANSWER", color: GOOD, h: 170 }] });
win.show(M.W("B", "Context")); win.fill(M.W("B", "Prompt"), 0.45); M.fit(B, { y: 200, h: 1100 });
// C: a full window drops its oldest part on "chhodna";  D: SAVE THIS + three rows on their spoken words (see example/index.html)
M.wipe(M.S.B); M.wipe(M.S.C); M.wipe(M.S.D);
M.finish({ kw: { context: "cyan", window: "cyan", memory: "good", tokens: "gold", chhodna: "hot", save: "gold" } });
window.__timelines["main"] = tl;
```
Try it end to end (verified 2026-10-14, the preview takes ~15 s):
```
X=tmp/clean_try; mkdir -p $X/kit $X/fonts $X/audio/hi
cp -R reels/_template/assets reels/_template/hyperframes.json reels/_template/package.json $X/
cp reels/_kit/motion.css reels/_kit/motion.js reels/_kit/viz.js $X/kit/; cp brand/fonts/*.ttf $X/fonts/
cp .claude/skills/clean-reel/example/* $X/
echo '{"lang":"hi","voiceSrc":"audio/hi/voice.wav","bedSrc":"audio/hi/bed.wav","sfxSrc":"audio/hi/sfx.wav"}' > $X/vars.hi.json
.venv/bin/python scripts/make_reel_audio.py $X && PREVIEW_SECS=10 .venv/bin/python scripts/render_reel.py $X tmp/clean_try hi
```
