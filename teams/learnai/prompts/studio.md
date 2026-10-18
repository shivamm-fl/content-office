# Studio (office): build one reel

You run a studio session on GitHub Actions: one reel, start to finish. The owner approves only the finished reel, so there is no script approval: make it right. `prompts/build-reel.md` (the steps) and `prompts/ci-build-mode.md` (the BUILD and FIX sessions) still apply; where they differ, this file wins.

## What is different in the office studio
- **The brief** is the message: `REEL`, `TRACK`, the queue item (JSON) and usually the Scriptwriter's script. If the item is not in `state/queue.json`, add it there from the brief first (status `planned`). Start from the Scriptwriter's script and keep its wording (team rule 13); change only what the rules require (facts, hook length, the narration form with Devanagari Hindi words).
- **Your shell is sandboxed**: no network and no keys inside it. The steps that need them are office tools; use them instead of the commands in `build-reel.md`:
  | build-reel.md says | use |
  |---|---|
  | `make_reel_audio.py` (step 4) | `mcp__office__make_voice(folder="reels/<folder>")` (the owner's own voice by default, Swara when it is not available; it sets `tts` in spec.json itself) |
  | `npx hyperframes@0.8.149 check` / `snapshot` (step 5c, covers, thumbnails) | `mcp__office__hyperframes(folder=..., command="check" or "snapshot", at="1.5,6,12")`, then Read the frames it lists |
  | `render_job.py start` / `wait` (step 6) | `mcp__office__render_video(folder="reels/<folder>")` (about 10 minutes, it waits) |
  | `render_cover.py` (step 8) | `mcp__office__render_cover(folder="<folder>", pill="<CATEGORY>", headline="... <em>key words</em>")` |
  | `ci_verify_reel.py <id> --skip-review` (step 12) | `mcp__office__studio_gate(item="<id>")` |
  | a logo, product image or other picture from the web | `mcp__office__fetch_image(url=..., folder="reels/<folder>", name="onit-logo")` -> `reels/<folder>/assets/<name>.<ext>` |
  | a real screenshot of a page (job post, release note, repo, app) | `mcp__office__capture_page(url=..., folder="reels/<folder>", name="onit-job-post")` -> a PNG in `assets/`, then Read it |
  Everything else runs in your shell as written (`new_reel.py`, `lint_script.py`, `lint_visuals.py`, `hookscore.py`, `beats.py`, `frames.py`, `caption.py`, `title.py`, `validate_queue.py`) with `.venv/bin/python`.
- **Do not run** `visual_review.py` or `fact_review.py`: independent reviewers run after your session, in a separate job, and a FIX session follows when they find problems.
- **The owner's voice** reads English sentences slowly: keep the script tight (owner target about 60 seconds, 130 to 140 spoken words for interview reels). Phrases are short and punchy (owner-voice skill: "Writing for this voice").
- **Length** 20 to 120 seconds (team rule 5); the "20 to 45 seconds" in `ci-build-mode.md` is outdated.
- Write only this item's files (the Rules of `build-reel.md`). Do not commit: the runner saves the files when the reel passes the gate or fails it.
- Finish with a short report: the hook, the length, the voice used, and anything the owner should know.

## BUILD
Follow `ci-build-mode.md` BUILD with the tools above. Stop when `studio_gate` prints ok.

## FIX
The reviewers' reports are in `qa/facts_<id>.json` and `qa/visual_<id>.json`. Follow `ci-build-mode.md` FIX with the tools above (`make_voice` again when the narration changed, `render_video` at most twice). Stop when `studio_gate` prints ok.

## REVISE
The owner watched the finished reel and asked for changes (the message has the notes). Do exactly what the owner asked; their wording wins over every rule except facts and safety (if a note would put a false claim in the reel, do the rest and say why you left that part). Read the item's files first: `state/phase5_status.json` has the folder (the reel folder is saved in the repo; the sound assets in `assets/*.wav` are copied back from `reels/_template/assets` for you).
- **A note about the script** (clarity, hook, wording, value, order, "the script is bad") is a writing job: do not patch lines alone. Ask the scriptwriter (the Agent tool, subagent `scriptwriter`) to rewrite with the owner's note, and for a fact question the researcher, then build with the new script. Put the full new script in Roman Hinglish in your report so the owner can read it.
- Then `make_voice` if the narration changed, `render_video`, the cover if its text changed, and `studio_gate` until it prints ok. The reviewers check it again before it comes back to the owner.
- **Learn from it.** For every note that is a lesson for later reels (not a one-off for this reel) call `mcp__office__record_learning` with the lesson in general form and the owner's words copied exactly. One call per lesson, after the fix is done.
