# HyperFrames cheatsheet (pipeline edition)

Distilled from hyperframes.heygen.com docs + `.claude/skills/hyperframes-*` + `--help` (CLI v0.8.92, Node 22, ffmpeg, system Chrome).
Items tagged **[verified]** were rendered on this M1 Mac (scratch project, CPU/SwiftShader too). **[untested]** = from docs only.
Skills own the full contract (`.claude/skills/hyperframes-core|audio|cli|animation`); do not copy them into course skills.

## 0. Machine facts
- Run everything as `npx hyperframes ...`. `npx hyperframes doctor` first when anything fails (Chrome/ffmpeg/whisper/Kokoro checks).
- Chrome = system Chrome (found). Bundled fallback: `npx hyperframes browser ensure` (downloads, ask first).
- `hyperframes init` re-checks/updates global skills over the network. Prefer hand-writing/generating `index.html` from a Node script.
- Docs topics: `npx hyperframes docs [data-attributes|examples|rendering|gsap|troubleshooting|compositions]`.
- 16 GB / ~2.5 GB free at times: each render worker = a Chrome (~256 MB). `<=8 GB` machines auto-enter low-memory mode (1 worker).

## 1. Project layout (one dir per episode x language x aspect)
```
episodes/epNNN/hf/            # HyperFrames project root (cwd for CLI)
  hyperframes.json            # optional settings
  index.html                  # STANDALONE root (no <template>)   <- render entry
  compositions/*.html         # scenes/captions: <template>-wrapped sub-compositions
  assets/{voice,bgm,sfx}/ fonts/  transcript.json
  renders/                    # output (default name is TIMESTAMPED; always pass -o)
```
- `npx hyperframes compositions` lists comps + resolved duration; `npx hyperframes timeline --json` lists tracks/clips (use instead of reading HTML).
- Two entry files can share sub-compositions: render a non-default one with `-c reel.html` (or `-c compositions/x.html`). **[untested for top-level non-index file]**

## 2. Sizing: 1920x1080 vs 1080x1920
- Canvas = root `data-width`/`data-height` (compile-time, NOT a variable). Author separate roots per aspect: `index.html` (16:9) and `reel.html` (9:16), generated from one Node template with different W/H + layout CSS.
- Root CSS is `width:100%;height:100%` (never hardcode 1920px/1080px). Also put `<meta name="viewport" content="width=1080, height=1920">`.
- `render --resolution portrait|landscape|square|landscape-4k|...` only SUPERSAMPLES (integer multiple, aspect must match). It does not change layout. Skip it for 1080p.
- Scaffold shortcut: `npx hyperframes init NAME --resolution portrait|landscape --non-interactive --example blank`.
- Portrait text: caption `maxWidth` ~900, video/text safe gutter >= 64px; keep captions ~600-700px above bottom, clear of Shorts/Reels UI (bottom ~20%, top ~12%) [convention, not from docs].
- Registry **blocks** ship at fixed 1920x1080 (code-*, charts). Re-author/resize for 9:16; do not just drop them in. **[untested]**

## 3. Standalone root skeleton  **[verified render]**
```html
<!doctype html>
<html lang="en" data-composition-variables='[...see §5...]'>
<head><meta charset="UTF-8"><meta name="viewport" content="width=1920, height=1080">
<script src="assets/gsap.min.js"></script>  <!-- local copy worked offline; CDN https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js also works online -->
<style>
 @font-face{font-family:"Noto Sans Devanagari";src:url("fonts/NotoSansDevanagari.ttf");font-weight:100 900}
 body{margin:0;background:#0B0D12}  #root{position:relative;width:100%;height:100%;overflow:hidden}
 .clip{position:absolute;inset:0}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="212.4">
  <div id="scene1" class="clip" data-composition-id="scene1" data-composition-src="compositions/scene1.html"
       data-start="0" data-duration="12" data-track-index="1" data-width="1920" data-height="1080"></div>
  <audio id="vo" src="assets/voice/narration.wav" data-start="0" data-duration="212.4" data-track-index="10" data-volume="1"></audio>
</div>
<script>
 const tl = gsap.timeline({ paused: true });
 /* ...tweens... */
 window.__timelines["main"] = tl;         // key === root data-composition-id
</script></body></html>
```
### data-* essentials
| attr | rule |
|---|---|
| `data-composition-id` | root + host + sub-comp root + `__timelines` key must ALL match |
| `data-start` / `data-duration` | seconds; `data-start` alone makes an element a clip. Window is half-open `[start, start+dur)`: finish tweens slightly BEFORE the end |
| `class="clip"` | convention (lint `timed_element_missing_clip_class`); omit on `<audio>/<video>` |
| `data-track-index` | Studio lane only; no effect on paint order (use z-index) or timing |
| `data-media-start` | trim offset into source (s); `data-volume` 0..3.98 static gain; `data-fade-in/out` linear edge fades; `data-playback-rate` 0.1-10 |
| root `data-duration` | **compile-time constant**; scripts/`--variables` cannot change it (see §5). Clip durations CAN be script-driven |
| `data-hidden` | hides element in preview+render |
| `data-fps` | optional hint; `render --fps` overrides (default 30) |
- Direct root children with `data-start` get forced `position:absolute; top/left:0`; untimed backgrounds need their own `position:absolute; inset:0`.
- A timed element with children triggers lint warning `nested_structure_needs_subcomposition`: build each scene as a sub-composition (harmless if ignored).

## 4. Timeline / animation rules (break = blank, frozen, or nondeterministic render)
- Exactly ONE `gsap.timeline({paused:true})` per composition, registered `window.__timelines["<id>"]` AFTER all tweens are added. No need for `window.__timelines = ...||{}`.
- Async build (`document.fonts.ready`) allowed, but register at the END of the callback; early registration = blank render.
- Mismatched key with >=2 timelines = frozen at t=0. Sub-comp host/inner id mismatch = 45 s wait per scene then static frames.
- Never `tl.play()`, `video.play()`, `.pause()`, `currentTime=`. No `Date.now()`, `performance.now()`, unseeded `Math.random()` (use mulberry32), network fetches, hover/scroll state.
- No `repeat:-1`; use `Math.max(0, Math.floor(dur/cycle)-1)` (floor, not ceil).
- Never tween `display/visibility/autoAlpha` on a `.clip` (lint `gsap_animates_clip_element`); animate a child. No `tl.set(...visibility:hidden)` scene exits (runtime hides clips).
- Center with flex/grid/`inset`, NOT `transform:translate(-50%,-50%)` + GSAP x/y (`gsap_css_transform_conflict`). Use `fromTo`, `xPercent/yPercent`.
- Prefer `gsap.fromTo` over `from` (esp. in sub-comps; seek-back safety). A `fromTo` shows its from-state BEFORE it starts (immediateRender): use `to()`+ `tl.set` at the cue when something must be absent earlier.
- Initial hidden state: CSS or bare `gsap.set()` OUTSIDE the timeline (not `tl.set` at 0). Reveal tweens must state `opacity:1` in the destination.
- No relative `+=`/`-=` on a property another tween animates; no DOM measurement (`getBoundingClientRect`, `getTotalLength`) inside tween callbacks; compute layout once at build time.
- Don't animate width/height/top/left on `<video>`; animate a non-timed wrapper div.
- Hold/idle: `check` fails `sweep_static` if a 3 s+ comp shows zero change at every sample (reveal finishes early, rest frozen). Keep a continuously animated element (blinking caret, slow underline sweep).
- Sub-comp timelines cannot animate host-root elements; animate those from the main timeline in GLOBAL time.
- Sub-comp file: everything (`<style>`, `<script>`, markup) INSIDE `<template>`; `<head>` content is dropped. Style root by `#root`, not a class. `#id`s unique across assembled page (prefix with comp id). Don't `master.add(childTimeline)`.
- Host `data-duration` = visible window; a sub-comp shorter than the host holds its last frame; host shorter than root goes blank after it.
- Standalone root wrapped in `<template>` = blank (lint error `standalone_composition_wrapped_in_template`).

## 5. Variables and templating (EN/HI from one design)
Declare on `<html>` as a JSON ARRAY of `{id,type,label,default}` (types: `string number color boolean enum font image`; enum needs `options:[{value,label}]`; optional `min/max/step/unit/placeholder/maxLength`):
```html
<html data-composition-variables='[
 {"id":"name","type":"string","label":"Output key","default":"ep"},
 {"id":"lang","type":"enum","label":"Lang","default":"en","options":[{"value":"en","label":"EN"},{"value":"hi","label":"HI"}]},
 {"id":"title","type":"string","label":"Title","default":"Hello"},
 {"id":"words","type":"string","label":"Caption words JSON","default":"[]"},
 {"id":"accent","type":"color","label":"Accent","default":"#B6FF3B"}]'>
```
Consume: `data-var-text="title"` (element text), `data-var-src="img"` (keep a real fallback `src`, esp. audio), scalar vars auto-exposed as CSS `var(--accent)`, or in JS once at init: `const V = window.__hyperframes.getVariables();`
- **[verified]** `data-var-text` OVERRIDES a script's `textContent` on the same element. Use one mechanism per element.
- **[verified]** Arrays/objects: pass as a JSON **string** variable and `JSON.parse` it (e.g. caption words). A long string via `--variables-file` works.
- Precedence: declared default < sub-comp host `data-variable-values='{"title":"Pro"}'` (OBJECT keyed by id) < CLI `--variables`. An authored `:root{--accent}` beats a same-named declared variable, but `--variables` beats both.
- Two shapes: declaration = ARRAY; values (`--variables`, `data-variable-values`, rows) = OBJECT.
**Render with values (exact):**
```
npx hyperframes render . --quality delivery --variables '{"lang":"hi","title":"ट्रांसफॉर्मर"}' --strict-variables -o renders/ep005-hi.mp4
npx hyperframes render . --variables-file vars/ep005.hi.json --strict-variables -o renders/ep005-hi.mp4   # preferred on Windows (quoting)
npx hyperframes render . --batch rows.json --output "renders/{name}.mp4" --strict-variables --batch-concurrency 1
```
- Windows shells mangle inline JSON quotes: always use `--variables-file` (single JSON object) from Node `child_process` with an args array.
- `--batch rows.json` = array (or `{"rows":[...]}`) of value objects; do not combine with `--variables/--variables-file`. `{key}`/`{index}` in `--output` fill from the row. Writes `renders/manifest.json` (status per row). `--batch-fail-fast` to stop early.
- **[verified]** Under `--strict-variables` EVERY row key must be declared, including the filename key (`name`); otherwise "Variable ... not declared", batch aborts before rendering.
- Without `--strict-variables`, a typo'd key only warns and renders the DEFAULT. Prove re-skinning: render twice and compare, or grep a frame.
- **Cannot be variables** (compile-time): `data-width/height`, root `data-duration`, fps, format/codec/quality. EN and HI audio lengths differ, so **stamp root `data-duration` per language with a build script** (audio ffprobe duration + 0.5-1 s tail) and generate `index.<lang>.html`, or per-lang project dirs. Alternative: omit root `data-duration` so it is inferred from timeline/media (lint `root_composition_duration_derived` warning) **[untested]**.
- Keep `spoken` vs `display` text separate: on-screen Latin ("AI") via `title`/`display` vars, spoken Devanagari only in the TTS script.
- Sub-comp scripts read their OWN per-instance table: forward values at the host via `data-variable-values`.

## 6. Audio
**Voiceover (Kokoro, local):**
```
HYPERFRAMES_PYTHON=.venv/bin/python npx hyperframes tts script.txt -v af_heart -o assets/voice/narration.wav            # EN
HYPERFRAMES_PYTHON=.venv/bin/python npx hyperframes tts script_hi.txt -v hf_alpha --lang hi -s 1.0 -o assets/voice/narration.hi.wav
```
(Windows: `.venv/Scripts/python.exe`; set env via Node `spawn({env})`.) `tts --list` only shows 12 voices; `hf_alpha hf_beta hm_omega hm_psi` work (any Kokoro id). Prefix: a=US b=UK h=Hindi. TTS emits NO word timestamps: transcribe after.
**Composition tags (every rule silent-fails):**
```html
<audio id="vo"  src="assets/voice/narration.wav" data-start="0" data-duration="212.4" data-track-index="10" data-volume="1"></audio>
<audio id="bgm" src="assets/bgm/bed.mp3" data-start="0" data-duration="212.4" data-track-index="11" data-volume="0.2"
  data-automation='{"version":1,"lanes":[{"target":"volume","points":[{"t":0,"v":0.2},{"t":3,"v":0.2},{"t":3.3,"v":0.07},{"t":40,"v":0.07},{"t":41,"v":0.2}]}]}'></audio>
<audio id="sfx-1" src="assets/sfx/whoosh.wav" data-start="12.0" data-duration="0.6" data-track-index="12" data-volume="0.6"></audio>
```
- EVERY `<audio>` needs a unique `id` (id-less = never mixed = SILENT render; lint `media_missing_id`). Never add `crossorigin`. Video must be `muted playsinline`; sound goes on a separate `<audio>` (even same source file).
- Volume over time: use the `data-automation` volume lane ONLY (lane `t` = seconds from that clip's own start, ramp past `data-duration` never finishes). A GSAP `volume` tween on a laned track is ignored (`audio_volume_double_automation`). Don't put both.
- **Ducking recipe (CPU-cheap, no install):** in the build script, merge word spans from `transcript.json` (join gaps < 0.4 s), emit lane points: full -> duck level 0.25 s before speech, back 0.5 s after. Bed ~ -18 dB to -12 dB under VO (data-volume 0.15-0.25 linear).
- Better than a plain duck: `carve` (only removes voice bands from the bed). `node .agents/skills/hyperframes-audio/scripts/carve.mjs --comp index.html` needs `npm i -D @hyperframes/core` in the project (install = ask). Carve goes on the BED and names a voice GROUP (`data-audio-group="voiceover"` on VO clips; `data-fx-carve='{"enabled":true,"sources":["voiceover"],"strength":0.8}'`); never carve the voice track; keep bed/SFX out of the voice group.
- Effects chains (`data-fx-chain`): voice cleanup preset names `voice-clean`, `rumble-cut`, `room-gate`. Compressor/limiter/gate/bitcrush params can't be automated (use a `gain` stage). Reverb/delay tails extend a track past its `data-duration`.
- Loudness match: `npx hyperframes normalize-audio . --reference vo --target bgm [--write]` (dry-run without `--write`; measures integrated LUFS, edits target's `data-volume`, refuses clipping/`+12 dB` ceiling). TTS is usually far quieter than music, so measure before carving.
- `data-fade-in="0.5" data-fade-out="1"` for clip-edge fades (multiplies with volume/lane).
- Verify: `ffprobe -v error -show_entries stream=codec_type,duration -of csv=p=0 out.mp4` (expect video + aac, durations ~= root `data-duration`).

## 7. Captions from word timestamps
**Whisper (whisper.cpp, project has `.models/ggml-small.bin`, multilingual):**
```
npx hyperframes transcribe assets/voice/narration.wav --model small.en -d .                  # known EN -> ./transcript.json
npx hyperframes transcribe assets/voice/narration.hi.wav --model small --language hi -d .    # HI: NEVER use *.en models (they TRANSLATE to English)
npx hyperframes transcribe whisper_out.json                                                  # import whisper.cpp / OpenAI verbose_json / .srt / .vtt / normalized array
```
- CLI default model is `small.en`; always pass `--model` explicitly. `--engine auto` uses Parakeet only if installed (`models install parakeet`) and it covers `--language`; else whisper.cpp. Force `--engine whisper` for Hindi.
- Slow CPU: `--timeout <ms>` (env `HYPERFRAMES_TRANSCRIBE_TIMEOUT_MS`).
**`transcript.json` = FLAT array of words, seconds as floats (no `segments`, no wrapper):**
```json
[{"id":"w0","text":"Hello","start":0.0,"end":0.5},{"id":"w1","text":"world.","start":0.6,"end":1.2}]
```
- `id` optional. Sanity-read every transcript: drop `♪`/`�`/empty tokens, drop <0.05 s fragments, enforce `end < next.start`; if >20% junk -> retry bigger model. Devanagari ASR may split/spell differently than your script: align to the `display` text per scene rather than trusting raw ASR tokens.
- Word timing must match audio within ~80 ms; regenerate timings after ANY new TTS take.
**Authoring rules (own caption comp generated by Node from transcript; recommended for automation):**
- Group words: reels 2-3 words, YouTube 3-5; break on sentence end, gap >= 150 ms, max count. ONE group visible at a time; ONE style per video.
- Each group `position:absolute` in a full-width container; do NOT center with `left:50%;transform:translateX(-50%)`. `overflow:visible` (hidden clips scaled/glow words).
- Entrance at `word.start`, exit tween at `group.end-0.12`, then HARD KILL: `tl.set(el,{opacity:0,visibility:"hidden"},group.end)` (only allowed on caption groups, not `.clip`s).
- Fit text: `window.__hyperframes.fitTextFontSize(text,{fontFamily,fontWeight,maxWidth:900|1600,baseFontSize:78,minFontSize:42})`.
- Emphasis on few words only (numbers, terms); active word = brand accent `#B6FF3B`.
- Optional ready components: `npx hyperframes add caption-highlight` (TikTok sweep) / `caption-pill-karaoke` / `caption-kinetic-slam` / `caption-editorial-emphasis` / `caption-clip-wipe`. They are 1920x1080 DEMOS with fixed word lists; you must rewrite words/timings/sizing; mount via `data-composition-src` (blocks) or paste (components). `npx hyperframes catalog --tag caption-style`.
- Gate band: `npx hyperframes check --caption-zone "x0=0;y0=.62;x1=1;y1=.8;severity=error"`; waive intentional copy with `data-layout-allow-caption-zone`.

## 8. Code animation blocks
- Registry blocks (all 1920x1080, tokens re-baked to your snippet, deterministic): `code-typing` (5 s), `code-diff` (6 s), `code-highlight` (5 s), `code-scroll` (6 s), `code-morph` (7 s); chrome/theme blocks `code-snippet-dark-2026`, `code-snippet-dark-modern`, `code-snippet-apple-terminal-pro` (VS Code vs Terminal themes: match surface to content).
- `npx hyperframes catalog --query "code typing" --json` (English queries only), `npx hyperframes add code-typing` -> `compositions/code-typing.html`; wire like any block (host id == inner id; set start/duration/width/height).
- Always quote the exact, already-executed code (course rule); name the target line for highlight/scroll; end with a HOLD (blinking caret) so `check` doesn't flag a frozen tail.
- Show real captured output as static text in a panel; for 9:16 hand-roll a typewriter (GSAP per-char/token, seedable) sized for ~900px width, mono `JetBrains Mono`, min ~34 px.

## 9. Fonts (incl. Devanagari) **[verified]**
- Only ~18 families auto-embed (Inter, Roboto, Open Sans, Noto Sans, Poppins, Outfit, Sora, Playfair, ...). Anything else, INCLUDING Noto Sans Devanagari, Space Grotesk, JetBrains Mono, needs `@font-face` to a local file, else lint error `font_family_without_font_face` and (on other machines) silent fallback.
- Use the brand files: `@font-face{font-family:"Noto Sans Devanagari";src:url("fonts/NotoSansDevanagari.ttf");font-weight:100 900}` (variable TTF works; copy `brand/fonts/*.ttf` into project `fonts/`; forward slashes). Repeat for `Space Grotesk`, `JetBrains Mono`.
- Stack for anything that can show Hindi: `font-family:"Noto Sans Devanagari","Space Grotesk",sans-serif`. Conjuncts (ट्रांसफॉर्मर) rendered correctly.
- `src:local('Font Name')` satisfies lint but depends on the host: don't use for cross-platform.
- Windows/Docker/clean Chrome have no fonts installed: never rely on a locally-installed family.

## 10. Lint / check / snapshot / inspect
```
npx hyperframes lint [dir] [--json] [--verbose]      # fast static pass (also runs inside check/render)
npx hyperframes check [dir] --json                   # FINAL GATE: lint + runtime + layout + motion + WCAG contrast, one browser
npx hyperframes check --snapshots --samples 15 --at 1.5,4,7.25 --at-transitions --strict --no-contrast
npx hyperframes snapshot [dir] --at 0,3,8 | --frames 10 [--zoom "#el"|"x,y,w,h" --zoom-scale 2]   # PNG stills to eyeball
npx hyperframes timeline --json | compositions | info
```
- `validate`, `inspect`, `layout` = deprecated aliases of `check`.
- A lint ERROR skips the browser audits: `check` then shows "0 samples / 0/0 text checks" (NOT clean). Fix lint errors first. A lint error does not block plain `render` unless `--strict`.
- Contrast failures are errors (4.5:1 normal, 3:1 large >=24 px); finding includes `suggestedColor`.
- Escape hatches (narrowest node): `data-layout-allow-overflow|overlap|occlusion|caption-zone`, `data-layout-ignore`. `allow-occlusion` also silences the contrast gate for that subtree.
- Motion intent sidecar `index.motion.json`: assertions `appearsBy`, `before`, `staysInFrame`, `keepsMoving`.
- Preview: `npx hyperframes preview --background --port 3017` -> `http://localhost:3017/#project/<dir-name>`. Never render just because checks pass in interactive work; automated pipeline may render after `check --strict` passes.

## 11. Render flags and CPU-only tips
```
npx hyperframes render . -q draft -o renders/x.mp4                                       # iterate
npx hyperframes render . -q looks -o renders/x.mp4                                       # default (CRF 16)
npx hyperframes render . -q delivery -f 30 -o renders/final.mp4                          # YouTube master; 9:16 reel same flags
```
| flag | notes |
|---|---|
| `-q/--quality` | `draft`, `looks` (default, CRF16), `delivery` (high); `standard/high` legacy |
| `-f/--fps` | 24/25/30/60/rational; default = root `data-fps` else 30. 60 = 2x time; use 30 |
| `-w/--workers` | number or `auto` (default). Windows/RAM-tight: `-w 2`. Each = Chrome ~256 MB |
| `--no-browser-gpu` | force SwiftShader software GL **[verified: renders fine, `screenshot capture - software gpu`]**. Default `auto` probes GPU, falls back to software |
| `--low-memory-mode` | 1 worker + screenshot capture (auto on <=8 GB) |
| `--experimental-fast-capture=false` | disable drawElement capture (macOS+GPU default on; self-verifies and falls back; may log "blank-frame suspect" for near-empty frames, harmless) |
| `--crf N` / `--video-bitrate 10M` | mutually exclusive; ignore for MOV |
| `--strict` / `--strict-all` | fail render on lint errors / errors+warnings; `--strict-variables` |
| `--browser-timeout S`, `--protocol-timeout ms`, `--player-ready-timeout ms` | raise on slow CPUs (defaults 60 s / 300 s / 45 s) |
| `--frames-cache-dir DIR` (or `off`) | move extracted-frame cache off small C: on Windows |
| `-c/--composition FILE`, `--json` (batch only), `--quiet`, `--debug` | |
| `--format mp4|webm|mov|gif|png-sequence|hls` | mp4 for YouTube/Reels; transparent = webm/mov, root `html/body` must have NO background |
| `--gpu` / `--hdr` / `--docker` | GPU encode / HDR10 (mp4, needs HDR source) / pinned Chrome+fonts (needs Docker; slow, use only for repro) |
- Read the summary 2nd line: `screenshot capture . software gpu` is the CPU path (slow but correct); `drawelement/beginframe . hardware gpu` fast. A composition with no registered timeline waits 45 s per render (`missing_data_no_timeline`: add `data-no-timeline`).
- CPU speed: fewer/lighter layers, avoid big `backdrop-filter`/blur/box-shadow on animated nodes, shrink oversized images, shader transitions/WebGL are costly (`--page-side-compositing` ~6x faster for SDR shader transitions). Iterate with `draft` + `snapshot`, render `delivery` once.
- 4K only via flag, 4x slower; never for Reels/YouTube 1080p.
- After render: `test -s out.mp4` (Node: `fs.statSync().size>0`), then ffprobe duration ~= root `data-duration`, h264/aac, expected WxH.
- Default outputs are timestamped; batch writes `manifest.json`; `npx hyperframes clean --dry-run` frees leftover render temp.
- Windows: quote-free args via Node, forward slashes, `--frames-cache-dir`, keep `-w` small.

## 12. Hard rules / anti-patterns (quick list)
1. One paused timeline, key == `data-composition-id`, registered last, no async before registration.
2. `<audio>` needs `id`; video `muted`; no `crossorigin`; no `<video data-start>` inside another `data-start` element (`video_nested_in_timed_element`).
3. No clocks/`Math.random`/fetch/`repeat:-1`; no tweening `.clip` visibility; no CSS-transform+GSAP conflict.
4. Root `data-duration` and W/H are static; generate per language/aspect. `--strict-variables` always; declare every row key.
5. Non-bundled fonts need local `@font-face` (Devanagari!). Lint errors hide `check` audits.
6. Sub-comp: all styles/scripts inside `<template>`; host id == inner id == timeline key.
7. Entrance animation on every element (nothing pops in), hard-kill exits on captions, keep something moving (`sweep_static`).
8. No `<br>` in body text; transformed elements must be block/inline-block with real size; pulsing decoratives need peak clearance.
9. Keep text inside safe area; `fitTextFontSize` for dynamic text; `overflow:visible` on caption boxes.
10. Don't hard-time a verbatim script: length follows the audio. Pace visuals to word timestamps; the narration never waits for visuals.
11. Style hygiene (from storyboards guide): one ground + one ink/accent color, emphasis by scale/weight/inversion, ONE calm "breather" beat, one callback motif; storyboard = arc + direction block + per-frame `type/persuasion/beat/focal`.
12. Motion grammar (premium look): nothing fully stops, overlap actions, overshoot then settle (`back.out(1.7)`), depth planes, no random drift/"breathing" idles.
13. Cold-seek safety: parallel workers seek non-linearly; state absolute end values; workers are not bit-identical (+-1 px level is normal); use `--docker` only if bit-exactness matters.
14. `hyperframes feedback` is telemetry; skip unless asked.
