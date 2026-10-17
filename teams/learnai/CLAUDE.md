# LearnAI team

LearnAI teaches AI to Hindi and Hinglish speakers who want to become AI engineers, on Instagram (@ig.learnai), Facebook (Learnai.ai) and YouTube (LearnAI). This folder is the team's workspace in the content office: the owner starts work from the office app and approves the plan, every script and every final video. The office never posts; approved reels are handed to the publishing repo (ai-course) later.

| Track | Ids in the office | What it is |
|---|---|---|
| generic | e101, e102 ... | Latest AI tools and features, agent skills, remarkable GitHub repos, and how to use AI to work faster. Not news. |
| course | r101, r102 ... | The next concept of the AI engineer roadmap |
| interview | q101, q102 ... | One question an interviewer asks an AI engineer, answered in about 30 to 60 seconds |

Every reel is stand-alone: reels are shown at random, so each one makes its own topic clear.

## Where things live (paths are relative to this folder)
- `roadmap/ai-engineer.json`: course units, built from the topic titles of roadmap.sh/ai-engineer. Only the titles are used. roadmap.sh text is copyrighted and must never be copied into reels, captions or this repo.
- `state/queue.json`: planned items. `state/covered.json`: memory of every planned or published concept, question, news item and hook formula (a snapshot; the live one is ai-course's, read it with `mcp__office__read_ai_course`). `state/phase5_status.json`: build status per item, written by the scripts.
- `state/learnings.md`: rules proven on our own numbers. They beat generic advice and the skills. Changes are proposals for the owner.
- `reels/_template`, `reels/_kit`, `brand/covers/_template`: starting points; `scripts/new_reel.py` creates a reel project from them. The design rules for diagrams are in `docs-notes/diagram-first-visuals.md`.
- `prompts/`: the ai-course planner and builder prompts, kept as the reference for how planning and building are done.

## Rules
1. **Facts.** Every factual claim (numbers, dates, versions, prices, "latest", what a product does) needs a URL you fetched in this session with WebFetch. Put the URLs in the queue entry and the spec. A claim you cannot verify is dropped or labelled as an example. A README claim like "98 % faster" is the author's claim: say so.
2. **Stand-alone.** One idea per reel. Define every term inside the reel. Never write "Part N", "next video" or a series tease.
3. **Hinglish narration, Roman Hinglish on screen.** The narration source has Hindi words in Devanagari (the Edge TTS voice reads them) and English words in Roman letters. On-screen captions are Roman Hinglish (`make_reel_audio.py` romanizes them; the voice is unchanged). Every text we post (Instagram and Facebook caption, YouTube title and description) is Roman Hinglish with no Devanagari. Add a `{Devanagari}` spelling only when the voice says one word wrongly, one word per brace (`ChatGPT{चैटजीपीटी}`); never a multi-word brace.
4. **Hook.** The first spoken line (at most 10 words; for `interviewer_asked` the question may run to 16) gives the payoff or the question within two seconds. Score its Roman form with the hookscore script; a DEALBREAKER means rewrite it. Every item records its `hook_type` (`.claude/skills/hook-writer`): course `direct_question`; interview a rotation of `relatable_stake`, `interviewer_asked` (ONE clear, complete, self-contained question) and `company_specific` (only with a fetched page; record `company` and `company_source`); generic `surprising_fact`. No hook type that works is discarded: types are tested side by side and retired only on our own numbers.
5. **Length** 20 to 120 seconds; owner's target for interview-style scripts is about 60 seconds (about 130 to 140 spoken words). Voice pace 1.3.
6. **Covers are clean English.** Instagram cover (1080x1920): one headline of at most 8 English words, one small gold pill with the category only (WHAT'S NEW IN AI, AI ENGINEER ROADMAP, AI ENGINEER INTERVIEW), the handle, and the LearnAI robot Bit as the only illustration (`scripts/render_cover.py`). No item count, no "Part N", no Hindi, no emoji. YouTube thumbnail (1280x720): at most 3 English words, not a copy of the title.
7. **Packaging.** Captions pass the ig-caption linter (no FAIL). The YouTube title follows yt-package, the description follows yt-seo.
8. **The owner approves.** Plan slate, script (before any audio or visuals are made) and final video wait for the owner in the office. The automatic gate (`scripts/ci_verify_reel.py`, with the independent visual review and fact check) must pass before a video is shown for final approval; a reel that fails after two fix rounds is not shown as ready.
9. **No posting.** The office never posts, replies, likes, follows or DMs.
10. **Engagement.** Comment replies are drafts for the owner. Reels may ask viewers to comment a keyword ("follow karo, phir comment karo PROMPT, guide DM mein"); the owner's own automation answers. Never copy other people's comment text or usernames into the repo.
11. **Safety.** No medical, financial or legal advice. No real people's likeness or voice. No logos or trademarks in visuals. Music only from the bundled bed. Disclose AI content where the platform supports it. Avoid repos or hacks that break a provider's terms, anomalous repos (impossible star counts), and voice cloning without a consent line.
12. **Memory.** Before you plan, read ai-course's `state/covered.json` (`mcp__office__read_ai_course`) and this folder's `state/covered.json`. When you plan something, add it to this folder's `state/covered.json`. Nothing from the last 60 days comes back as the same item.
13. **Scripts in the owner's voice.** When the owner gives wording, keep it: shorten by deleting whole lines, never rewrite English-mixed lines into stiff translated Hindi. Keep the beats the owner asked for (for interview: the pressure, a concrete common mistake, then the technique; something new every 5 to 7 seconds). End with the owner's CTA when the reel offers a guide.
14. **Generic track (owner, 2026-10-17)**: latest tools and features, agent skills, remarkable GitHub repos, "how to use AI to be 10x". Never promise a literal 10x: the honest framing comes from primary sources (for example METR's 2025 study found experienced developers 19 % slower while they felt faster). Verify at the primary source (release notes, the repo itself).
15. **Visuals are diagrams, not words.** Every beat is a picture of the idea, synced to the voice. On-screen text is a label of one to three words, never the sentence being spoken. The mute test decides. Process: `visual_plan.md` before the code, then build, `scripts/lint_visuals.py`, snapshots, render, `scripts/visual_review.py`. Clean style (`.claude/skills/clean-reel`): no glow, flicker, glitch, flash or sparkle; calm colours; `"audio": "v2"`.
16. **Benchmarks** teach format and strategy only. Never copy another channel's scripts, wording, visuals, audio, mascot or topic list.

## Working locally (same commands on the runner)
- Scaffold: `python scripts/new_reel.py <id>_<slug> "<title>" "<CATEGORY>"`.
- Audio: `python scripts/make_reel_audio.py reels/<folder>`. Render: `python scripts/render_job.py start reels/<folder>`, then `wait`.
- HyperFrames is pinned: `npx --yes hyperframes@0.8.149 <check|snapshot|render>`.
- Lints: `python scripts/validate_queue.py`, `python scripts/lint_script.py`, `python scripts/lint_visuals.py reels/<folder>`. Gate: `python scripts/ci_verify_reel.py <id>`.
