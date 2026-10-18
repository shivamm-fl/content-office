# Learnvora System Design team

Learnvora System Design teaches system design to Hindi and Hinglish speakers (backend engineers and people preparing for system design interviews) on Instagram (@systemdesign.learnvora). It is one of three Learnvora floors (ai.learnvora, dsa.learnvora, systemdesign.learnvora). This folder is the team's workspace in the content office: the owner starts the work day from the office app, approves the finished reels, and posts them. Agents never post.

## The goal
**Grow the handle**: more people who watch a reel to the end, save it, share it and follow, week after week. That is the team's single goal and the measure of every choice. You are a small reel team that owns this result, not stations of a pipeline: talk to each other, ask each other early, challenge each other's work, try things, keep what works and write down what you learned (`state/learnings.md`, `state/team_playbook.md`, `state/experiments.md`). Every day the team should be a little better than the day before.

## The series (owner, 2026-10-18)
**150 Days of System Design**: one idea a day, Day 1 to Day 150, in the order of `roadmap/series-150.json`. Track `series`, ids `s001` to `s150`: the id number is the day. `docs-notes/series-style.md` has the day types, the arcs and the caption rule; `docs-notes/teaching-flow.md` has how a day is taught (beats, detail checklist, pacing). The same series runs on the other two Learnvora handles.

## Where things live (paths are relative to this folder)
- `roadmap/series-150.json`: the 150 days (phases, titles, formats, status). The owner's plan; changes are proposals.
- `state/queue.json`: planned items. `state/covered.json`: memory of every planned or published day. `state/phase5_status.json`: build status per item, written by the scripts. `state/config.json`: ids, formats, buffer.
- `state/learnings.md`: rules proven on our own numbers. They beat generic advice and the skills; read it before you start. Agents never edit it by hand. When the owner corrects you, fix it and call `record_learning` (their own words are the authority, no card). A rule that comes from our numbers goes to the owner as a `request_approval` card of kind `learning`.
- `state/team_playbook.md`: the team's living craft notes by role; `state/experiments.md`: what we are trying; `state/growth_notes.md`: the growth analyst's and planner's dated notes. All free to edit except learnings.
- `reels/_template`, `reels/_kit`, `brand/covers/_template`: starting points; `scripts/new_reel.py` creates a reel project from them. Diagram rules: `docs-notes/diagram-first-visuals.md`. Brand: `brand/brand.md`.
- `prompts/`: the planner (`plan-series.md`), the work day, the builder and the studio prompts.

## Guardrails
These are the hard limits (true facts, safety, no posting, the owner's final say). Inside them, use your judgment: where a rule or a prompt step makes the reel worse, do it better and say so.
1. **Facts.** Every factual claim (complexities, numbers, dates, versions, "how company X does it") needs a URL you fetched in this session with WebFetch. Put the URLs in the queue entry and the spec. A claim you cannot verify is dropped or labelled as an example. Code shown on screen is run first and the screen shows its real output.
2. **Stand-alone, with a day counter.** One idea per reel. Define every term inside the reel. The day (`DAY 087 / 150`) is a label on the cover and in the caption; the script never says "yesterday", "kal", "Part N", "next video" or tease the next day.
3. **Voice and Hinglish.** The voice is the owner's own (ElevenLabs "Shivam Trainer", owner decision 2026-10-17) by default, and Swara (Edge TTS) when the owner's voice is not available or its monthly characters are used up; in the studio the office tool `make_voice` picks it. The narration source has Hindi words in Devanagari and English words in Roman letters. On-screen captions are Roman Hinglish (`make_reel_audio.py` romanizes them). Every text we post (Instagram caption) is Roman Hinglish with no Devanagari.
4. **Hook.** The first spoken line (at most 10 words; for `interviewer_asked` the question may run to 16) gives the payoff or the question within two seconds. Score its Roman form with the hookscore script; a DEALBREAKER means rewrite it. Every item records its `hook_type` (`.claude/skills/hook-writer`); types are tested side by side and retired only on our own numbers.
5. **Length** 30 to 120 seconds, teaching days 90 to 120 are fine (owner, 2026-10-18); clarity beats brevity. Voice pace 1.3.
6. **Covers are clean English.** Instagram cover (1080x1920): one headline of at most 8 English words, one small pill with the category only (SYSTEM DESIGN), the DAY NNN / 150 counter with its progress bar, the handle (`scripts/render_cover.py`; the day comes from the folder name, d047_slug is Day 47, or from `--day N`). No mascot, no Hindi, no emoji.
7. **Packaging.** Captions pass the ig-caption linter (no FAIL) and start with `Day N/150:`.
8. **The owner approves.** Finished reels wait for the owner in the office (a plan or a script only when the owner asks to see it; then it goes with `request_approval` before any audio or visuals are made). The automatic gate (`scripts/ci_verify_reel.py`) only holds back a reel that is broken (a file missing, not 1080x1920 h264, no audio, length outside 20 to 120 seconds, frozen frames); its other checks are notes shown on the reel.
9. **No posting.** Agents never post, reply, like, follow or DM. The owner posts. (This floor has no publishing repo yet: the Calendar shows the pipeline only.)
10. **Engagement.** Comment replies are drafts for the owner. Reels may ask viewers to comment a keyword; the owner's own automation answers. Never copy other people's comment text or usernames into the repo.
11. **Safety.** No medical, financial or legal advice. No real people's likeness or voice. Logos and real screenshots are welcome when they make the reel concrete: the logo of the company or product the reel names, a screenshot of the real page. Credit the source on screen (a small "Source: <site>" label), use a logo to identify, never to suggest endorsement, and blur private people's names, emails and faces. Music only from the bundled bed. Disclose AI content where the platform supports it. Real companies' internals: only what their own post says; otherwise "a typical design".
12. **Memory.** Before you plan, read `state/covered.json` and the roadmap. Nothing is planned twice.
13. **Scripts in the owner's voice.** When the owner gives wording, keep it: shorten by deleting whole lines, never rewrite English-mixed lines into stiff translated Hindi.
14. **Visuals are diagrams, not words.** Every beat is a picture of the idea, synced to the voice. On-screen text is a label of one to three words, never the sentence being spoken. The mute test decides. Process: `visual_plan.md` before the code, then build, `scripts/lint_visuals.py`, snapshots, render, `scripts/visual_review.py`. Clean style (`.claude/skills/clean-reel`): no glow, flicker, glitch, flash or sparkle; calm colours; `"audio": "v2"`.
15. **Benchmarks** teach format and strategy only. Never copy another account's scripts, wording, visuals, audio, mascot, colours or layout. The standard teaching order of the subject (for example arrays before two pointers, replication before consensus) belongs to the subject, not to any account, and is fine to follow.

## Working locally (same commands on the runner)
- Scaffold: `python scripts/new_reel.py s047_<slug> "<title>" "SYSTEM DESIGN"`.
- Audio: `python scripts/make_reel_audio.py reels/<folder>`. Render: `python scripts/render_job.py start reels/<folder>`, then `wait`.
- HyperFrames is pinned: `npx --yes hyperframes@0.8.149 <check|snapshot|render>`.
- Lints: `python scripts/validate_queue.py`, `python scripts/lint_script.py`, `python scripts/lint_visuals.py reels/<folder>`. Gate: `python scripts/ci_verify_reel.py <id>`.
