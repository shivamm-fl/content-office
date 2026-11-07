# Reel playbook v4: how the owner-approved reels are made

Owner, 2026-11-07, after rejecting the older reels as boring ("no value, no hook, monotonous") and approving these five: `t01_distillation`, `t06_weight_space`, `q144_input_vs_output`, `q145_reasoning_bill`, `a018_temperature` ("thik lag rahi hai ye reels"). Where this note conflicts with `reel-style-v2.md`, `script-style-v3.md` or the hook-writer skill, this note wins.

## 1. Pick the topic

- **Current only.** Use the models and news people talk about now (Kimi K3, GPT-6 Astra, Claude Opus 5.5, Qwen3.5, last weeks' research). BERT, GPT-3 or T5 as the example is an instant reject ("Adam baba ke zamane ke examples").
- **Interview questions must be real ones.** The cost, latency and failure questions an AI engineer gets in a production interview (prefill vs decode, hidden reasoning tokens), not a definition a child could answer.
- Check `state/covered.json` and the queue so the topic is new.

## 2. Write the script (45 to 70 s)

Build it on one of the five retention templates (from the reference reel the owner sent):

| Template | Shape | Used in |
|---|---|---|
| Results first | result → how it was done → stay → learn | t01, t06, q145 |
| Not A, neither B | not A → not B → actually C → stay | a018 |
| Common belief | belief → contradict it → why | q144 |
| Better, best | better way → best way → rehook → keep watching | (speculative decoding draft) |
| Won't work unless | won't work → unless → do this → stay | (ReLU draft) |

- **The punch line is the first sentence.** "Ye AI khud ko Claude bata raha hai." / "Jawab 162 tokens ka, bill 1186 ka." Never open with setup ("Moonshot ke AI se poocha gaya..."). Never open with "Interviewer poochta hai".
- One idea, one story. Each beat grows out of the last.
- Explain every mechanism with an everyday Indian picture: exam copy where the roll number gets copied too (distillation), chai / coffee / paani scores (temperature), the pahada table (LoRA), UPI fraud (accuracy), the electricity bill V (ReLU).
- Numbers come from a page fetched in this session, or from arithmetic you ran in python first (the temperature percentages were computed, then rounded to match the narration).
- No disclaimer lines ("ye numbers illustrative hain", "code se verify hain") and no source-talk in the narration. Credits go on screen ("Source: ...") and in the caption.
- Reported, unproven claims are said as reported ("viral chat", "Anthropic ka daava") and a recreated UI is labelled "recreated". If an idea the owner gives cannot be verified, use the verified version and tell him.
- Interview reels end the teaching with a one-line answer to say in the interview.
- Close with a question that has a real answer ("T = 2 par 100 baar poochho to kitni baar paani?"), then "Comment karo".
- Spec: `"tts": "owner"`, `"owner_tempo": 1.0` (faster than the old 0.9), mostly single `|` pauses, `min` 2.0 per scene. Lint with `scripts/lint_script.py` and fix every FAIL.

## 3. Build the visuals by hand

The owner wants Claude to build the picture itself (not Codex).

- **Something changes every 1.5 to 3 s.** One idea per screen, hard cuts.
- **Kinetic text is the main element:** 90 to 200 px lines, key word gold, red or green, nothing under 44 px.
- **Real screenshots** of the source page (browser screenshot, cropped), 960 px wide, with a slow push-in and a highlighter drawn on the exact phrase being spoken, plus a "Source: site" label.
- One picture that changes beats many static ones: the a018 bar chart changes shape at T = 1, 0.5 and 2.
- Frame 0 shows the hook (the feed autoplays muted). Content stays in y 170 to 1300; captions own 1330 to 1600.
- Tools:
  - `reels/_kit/fx.css` and `fx.js` (copied into each new reel's `kit/` by `new_reel.py`) give `at(scene, word, n)` (it keeps decimals like 7.9, which `M.W` strips), `show`, `hide`, `wipe`, `count`.
  - Write only the scenes (`beats.html`) and the timeline (`timeline.js`, ending with `M.finish({kw})`), then run `python scripts/wrap_reel.py reels/<folder> beats.html timeline.js "<TAG>" "<title>"`.
  - Reference builds: `reels/q144_input_vs_output`, `reels/a018_temperature`, `reels/t06_weight_space`.
- Before any render, run `python scripts/snap_sheet.py reels/<folder>` and read the sheet (two frames per scene). It catches wrapped headlines, overflowing boxes and blank stretches.

## 4. Render on GitHub, not on the laptop

- Push a `render/<name>` branch that holds the reel folders and a `render.json` at the repo root (`{"team": "learnai", "audio_tag": "<draft release>", "reels": ["<folder>", ...]}`). `.github/workflows/render-branch.yml` renders the list in parallel and uploads the mp4s as artifacts. No agent, no voice spend.
- The audio is gitignored. Put each reel's `audio/hi/{voice,bed,sfx}.wav` in `<folder>_audio.tgz` on the draft release named in `audio_tag`.
- Collect the mp4s with `gh run download <run> -R shivamm-fl/content-office`. Pushing needs the repo owner's token (see the README).

## 5. Covers

- **Series (a-items):** `python scripts/render_cover.py <folder> "AI" "<headline with <em>key words</em>>"`. This gives pill AI and DAY NNN / 150 with the bar.
- **Interview (q-items):** `"AI ENGINEER INTERVIEW"`. This gives the pill and QUESTION (id minus 104).
- **Standalone reels:** headline only, no pill and no mascot. Use `--template` with a copy of `brand/covers/_template` that hides `#pillrow` and `#bit` and carries hidden `qnum` / `daynum` / `dayof` / `fill` divs.
- The owner was angry both when a tag was added to a standalone cover and when the tag and day were stripped from series and interview covers.

## 6. Captions

Hinglish, written for a person. No hashtags and no "Tags:" line. A source line at the end. The YouTube text lists the source URLs and ends with "AI-assisted visuals and narration."

## 7. Delivery

Never post (company rule 1).

1. Run `python scripts/save_library_items.py <out_dir> <items.json>`. It puts video and cover into the Office's Saved reels with hash checks. It replaces only an earlier version that this tool delivered itself.
2. Run `python tools/stage_office_library.py --manifest <out_dir>/stage-manifest.json --team-root teams/learnai --out <dir>` to stage the private package for the publisher.
3. The owner approves and taps Post.
