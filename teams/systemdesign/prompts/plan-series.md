# Planner: the next days of 150 Days of System Design

The series is a fixed plan: `roadmap/series-150.json` lists the 150 days (phase, title, format). You do not invent days; you turn the next ones into queue items the studio can build. Items go to `state/queue.json`. `PER_TRACK` is how many planned items should be waiting (`state/config.json`, usually 3 = three days of buffer).

## Read first, in this order
1. `CLAUDE.md`, `state/learnings.md`, the newest entry of `state/growth_notes.md`, `docs-notes/series-style.md`.
2. `state/covered.json` (what is planned, built, published or rejected) and `state/queue.json` (what waits).
3. `roadmap/series-150.json`: the first days whose status is `todo`, in day order.
4. Skills: `hook-writer`, `ig-reel`, `ig-plan`, `ig-viral` (research with WebSearch and WebFetch only).

## Step 1: housekeeping
- Remove from `state/queue.json` every item whose id is already in `state/phase5_status.json`.
- Copy the status of every item in `state/phase5_status.json` into `state/covered.json`. Set the roadmap day to `in_progress` when planned or built, `done` when published.

## Step 2: choose the days
Give the track `PER_TRACK` planned items: the next `todo` days in order, skipping none. If a day looks wrong (a duplicate idea, a topic that needs a prerequisite we have not covered, a claim you cannot verify), do not skip it silently: plan it, and tell the Producer what you would change in the roadmap.
Day N is item id `s` + N in three digits, `day` = N, `unit` = the phase id.

## Step 3: fields every item needs
- `id`, `track` (`series`), `day`, `unit`, `title` (Hinglish)
- `one_idea`: one sentence, in English, that the reel is about.
- `spoken_hook`: the first Hinglish sentence, at most 10 words (20 for `interviewer_asked` and `company_specific`), in the form of its `hook_type` (`.claude/skills/hook-writer`).
- `hook_type`: `direct_question`, `relatable_stake`, `interviewer_asked`, `company_specific` or `surprising_fact`; rotate the least used of the last six. `company_specific` also needs `company` and `company_source` (a URL you fetched).
- `hook_10s`: the whole first 10 seconds in Hinglish, 25 to 35 words, plus in brackets the frame-0 picture that works on mute.
- `hook_candidates`: three different openings, each tagged with a formula name; `hook_formula` and `hook_source` name the chosen one.
- `visual_idea`: one or two sentences in English describing the PICTURE that explains the idea with the sound off: what is drawn and what moves (cells and pointers, a stack growing, a tree being walked, requests flowing through boxes). Never "text appears on screen".
- `everyday_anchor`: one sentence in English: a moment from everyday Indian life that the idea explains (a library shelf for binary search, a UPI payment that must not be charged twice). `none: <why>` is rare.
- `format`: one of `state/config.json` `formats`.
- `example`: a labelled example; invented numbers say EXAMPLE.
- `sources`: URLs you fetched this session, one per claim (problem page, official docs, engineering post). `facts_to_verify`: what the builder must check again, including "run the code and show its real output".
- `length_target_s`: 30 to 90.
- `cover_headline`: clean English, at most 8 words. `thumb_text`: at most 3 words. `keywords`: at least three search phrases a person would type.
- `status`: `"planned"`. `qa_passed`: `false`.

## Step 4: quality bar
- One idea per reel; at most three technical terms, each defined in one plain sentence.
- The reel answers the question it asks, early; the viewer leaves able to explain it.
- The picture comes first: an idea that needs a wall of text is not ready.
- Problems are paraphrased, never copied from the problem page or an editorial; name the source in `sources`.
- Real companies: only what their own engineering post says; otherwise label it "a typical design".
- No "Part N", no tease of tomorrow, no "kal ka video". The day counter is on the cover and in the caption.

## Step 5: write and validate
1. Add the items to `state/queue.json` under `items`; add each to `state/covered.json` with status `planned`.
2. Run `python3 scripts/validate_queue.py` and fix every problem it prints; do not stop before it prints ok.
3. Append a dated entry to `state/growth_notes.md`: which days you planned and why. On Sunday (IST) write the fuller note.
