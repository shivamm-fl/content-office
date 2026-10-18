# Proposal 2026-10-18: ai.learnvora and 150 Days of AI

Status: section 1 is DONE (the owner renamed the account on 2026-10-18); the rest is for the owner's decision. Section 2 was rewritten on 2026-10-18 after the owner decided that the Day series replaces the generic `e` track. Nothing in `teams/learnai` was changed for this except three new files: `brand/avatar-learnvora.png`, this proposal, and `roadmap/series-150-draft.json` (the draft ladder; it is wired into no script).

## 1. Rename ig.learnai to ai.learnvora: DONE by the owner on 2026-10-18

The owner renamed the Instagram account himself, on Instagram, on 2026-10-18: `@ig.learnai` is now `@ai.learnvora`. Every new video, caption and cover uses `@ai.learnvora`. What the repos changed for it (done 2026-10-18):
- `team.json`: instagram handle `@ai.learnvora`. The team keeps the slug `learnai`: the slug is the Durable Object name, the release tag `office-learnai-<item>` and the key the publishing repo uses (`publishRepo` in `apps/api/src/github.ts` tests `team === "learnai"`). Renaming the slug would break all three, so it stays.
- `CLAUDE.md` line 3, the cover template handle text in `brand/covers/_template/index.html`, the reel kit (`reels/_kit/motion.js`) and the follow lines of the built reels. The series cover template (section 2.6) must carry `@ai.learnvora`.
- The profile photo: `brand/avatar-learnvora.png` is the new Learnvora "v" tile in gold. The old Bit avatar stays in `brand/avatar.png` until the owner decides what happens to the mascot (Bit can stay inside reels and covers; the family look on the grid comes from the counter and the colours). On 2026-10-18 the live profile still shows the Bit photo.
- The publishing repo (ai-course, private): its per-team config and captions carry the new handle. Instagram keeps the same account id on a username change, so the id-based token and `IG_USER_ID` keep working. The one place that compared the username (the DM bot skips the account's own comments by username) was changed to the new one. The owner checks one post after the rename.
- Covers and end cards that were rendered before the rename still show `@ig.learnai` in their PNG or MP4: their editable sources and captions now say the new handle, but the pictures need one re-render each before the reel is posted (list: `rename-rerender-list.md`, written 2026-10-18). Covers built from now on are correct.

Note to check: on 2026-10-18 (after the rename) the live profile `ai.learnvora` still shows the blue verified tick, name "Shivam Mishra", 45 posts and 343 followers (before the rename it showed the tick, 45 posts and 342 followers). The old link instagram.com/ig.learnai/ answers "page not available". A verified badge can be tied to the name and username, so look at the profile again in a few days and confirm the tick is still there; Meta's verified-account help page was not read here.

## 2. 150 Days of AI (owner decision 2026-10-18: it replaces the generic `e` track)

### 2.1 What is decided and what is copied
- The series replaces the generic track (`e`, "what's new in AI"). The course track (`r`) and the interview track (`q`) stay.
- One idea a day, Day 1 to Day 150, shown as `DAY NNN / 150` on the cover and `Day N/150:` at the start of the caption. The day is a label; the script never refers to another day.
- Pattern to copy: `teams/dsa` (its `CLAUDE.md` "The series" paragraph and rules 2, 6, 7, `roadmap/series-150.json`, `docs-notes/series-style.md`, `scripts/validate_queue.py`, `scripts/render_cover.py --day`, `brand/covers/_template`). System Design uses the same pattern with prefix `s`.
- The sibling floors have no publishing repo. LearnAI has one (ai-course), with a slot poster. That is what makes this floor harder than the other two: most of the risk below comes from the poster and the Calendar, not from the reels.

### 2.2 Id scheme: recommended `a001` to `a150`, the id number is the day

| Scheme | Day 7 is | For | Against |
|---|---|---|---|
| **A. prefix `a`, id = day (recommended)** | `a007` | Same as the sibling floors (`d###`, `s###`; `a` for AI). The id is the day, so no lookup and no off-by-N bug: the Calendar, the studio threads and the release tag `office-learnai-a007` all say the day. Passes every id check that exists today (`^[a-z]\d{2,4}$` in `calendar.ts`, `office.ts`, `index.ts`, `studio.mjs`, `pick_best.py`, `office-studio.yml`). Sorts numerically in the Calendar. No clash with ai-course ids `e01..e18`, `r01..r17`, `q01..q26`, `x08..x10` (to be confirmed in the private repo, 2.8 question 8). | `calendar.ts`, its tests, `team.json`, the validators and the poster in ai-course must learn the prefix. Day 1 to 9 must be written `a001` to `a009` (a one-digit id fails all those regexes). |
| B. prefix `e` kept, id = day | `e007` | No change to the regexes, `TRACKS`, the poster. | Day 101 to 104 would be `e101` to `e104`: the four built reels, their folders, covers, `phase5_status` entries, release `office-learnai-e101` and ai-course's `ig-e101`. Also `e001` and ai-course's `e01` have the same number, so the Calendar (`idNum`) would sort legacy ai-course reels into the series. Rejected. |
| C. prefix `e` kept, ids continue 105, 106 ... with a `day` field | `e111` | Zero change in `calendar.ts`, poster, regexes. | The id is not the day: Day 40 is `e144`, every reader of an id must look up `day`, the Calendar and the studio show `e144`. The prefix `e` then means nothing. Only a fallback if the poster in ai-course cannot be changed at all. |
| D. prefix `r`, ids from 105 with a `day` field (the old option A) | `r111` | No new track. | Mixes the series with the course pool and the poster order, id is not the day, and the owner chose a separate track. Rejected. |
| E. prefix `s` | `s007` | Looks natural ("series"). | `s` belongs to System Design. Same repo, same regexes, same Calendar code: do not share a letter. |
| F. longer prefix `ai007` | `ai007` | Readable. | A letter followed by digits is assumed everywhere (the workflow input check, `studio.mjs`, `/media/:team/:item`, `pick_best.py`). Rejected. |

Track id in `team.json`: `series`, prefix `a`, name "150 Days of AI". `state/config.json` `id_start`: `series: 1` (the office ids of course and interview keep starting at 101).

### 2.3 What happens to `e101` to `e104` and to the `e` entries

State today (`state/phase5_status.json`): `e101`, `e102`, `e103`, `e104` are all `built`, `published: false`, `qa_passed: false`: finished reels that wait for the owner (prompt caching, fail-closed hooks, anatomy of a skill, cc-stretch). None is posted.
- **The reels.** The owner approves and posts them, or drops them, before the first series cover goes out. They stay as they are: no renumbering and no conversion into `a###`. The id is the key of the release `office-learnai-e101`, the folder `reels/e101_*`, the cover, the `phase5_status` entry and ai-course's `ig-e101`; a conversion would need the studio to rebuild each one. Their topics have a home in the ladder as new builds: prompt caching is Day 35, agent skills Day 81, fail-closed permissions Day 92, cost Day 118.
- **After the change `e` is a retired prefix**, not an unknown one: `calendar.ts` keeps a small legacy map so `e101` still reads as "generic" (label) and never as "other". It has no cell and no slot. `Post now` keeps working for any id (it does not look at tracks); `Put on a slot` refuses it with the "only series, course and interview reels" message. That is the right behaviour for a retired track; if the owner wants to put a leftover `e` reel on a slot, the simple answer is to post it before the cutover.
- **`state/queue.json`.** `e101` to `e104` are still listed there as `planned` although they are built. Remove them (the work day's housekeeping step does it) before the validators lose the `generic` track, otherwise `validate_queue.py` prints `unknown track 'generic'` and the work day, which must not finish before it prints ok, is stuck.
- **`state/covered.json`.** The 22 `generic` entries (`e01` to `e18` from ai-course, `e101` to `e104`) stay as history: the 60-day memory keeps working and the validators do not read this file. Two fixes: `e102` says `planned` but is built (sync from `phase5_status`), and `e18` (`planned`, never built) becomes `rejected` with the reason "generic track replaced by the series (owner 2026-10-18)".
- **`state/phase5_status.json`.** Keep the entries as they are (`track: "generic"`). `next_to_build.py --track generic` simply stops being used.
- **Other files that treat the generic track as live** (each is an edit in 2.7, step 8): `state/experiments.md` (the running "skill/repo/tool reels end with the comment-keyword ask" experiment names e103 and later e reels: close it or re-scope it to a series day type), `state/proposals/2026-10-17-misconception-question.md` (about the generic track's hook types; `validate_queue.py` already accepts `misconception_question`, so re-scope it to the series or withdraw it), the hook-writer table row for generic, CLAUDE.md rule 14 and the researcher agent's description.

### 2.4 How the `e` slot of the Calendar maps to the series

Today every slot (09:00, 13:00, 17:00) has three cells in the order generic, course, interview. `calendar.ts` mirrors the slot poster of ai-course (`scripts/post_plan.py`): one released reel per track and slot, the lowest id first, consumed across the slots.

Mapping: the first cell of each slot (generic, `e`) becomes the series cell (track `series`, prefix `a`), still first in the order. The course and interview cells do not change.

Two things must not be copied from the generic track, because a series is not a stream of news:
1. **Cadence.** With the poster rules as they are, a released series pool fills the series cell in all three slots: Day 1, 2 and 3 go out on one morning and a buffer of 150 reels is gone in 50 days. The series needs its own slot rule: one reel a day, in one chosen slot (`track_slots: {"series": ["09:00"]}` in the posting config, mirrored in the poster). Which slot is the owner's call; by our own numbers it should be the slot where course reels do best (`insights.json` has the posting time and the 72 hour plays), because it is the same audience. With no data, 09:00 keeps the day's number first.
2. **Order.** "Lowest id first" is not enough for a counter: if Day 5 is held back (changes requested) and Day 6 is released, Day 6 goes out first and the counter on the grid jumps backwards. The series pool must offer one id only: the lowest day not posted yet, and only if it is released. Otherwise the cell is empty ("Day 5 is not ready") and nothing takes its place; the course and interview cells are not affected.

Spec for `calendar.ts` (and identically for the poster, otherwise the Calendar shows "auto" cells the poster does not post):
- `PostingConfig.track_slots?: Record<string, string[]>`; a track without an entry fills every slot as today.
- Series pool = next unposted day if released, else empty.
- `refusePublish` for a series reel: only its slot ("The series goes out once a day, at 09:00"), at most one series reel per date in `post_schedule`, and Day N is refused while Day N-1 is neither posted nor planned on an earlier slot. `Post now` obeys the same order check.
- The ready list and slot cells may show `Day 7/150` instead of `a007` (nice to have).

Side effect worth knowing: `TRACKS` in `calendar.ts` is one constant for all floors, so the dsa and systemdesign Calendars show generic, course and interview cells that mean nothing to them. Passing the team's own track list into `buildCalendar` (from `team.json`) would fix that and make `team.json` the single source for the cell order. Optional; the constant is enough for LearnAI.

### 2.5 How the series and the course track relate

The course track is already a one-concept-per-reel ladder: `r01` to `r14` are posted or built (units A to C), `r101` to `r104` are built (D and E), `r15` to `r17` are planned, and each is a direct "what is X" question. A series that also teaches "the next concept" would repeat it. Three models:

| Model | What it means | Verdict |
|---|---|---|
| **M1. Spine and depth (recommended)** | The series teaches the idea in one picture (what it is, why it matters, one demo or one myth), 30 to 60 seconds, vendor-neutral. The course reel teaches the working version of a unit (steps, a worked example, the trade-off). The interview reel asks the question that tests it. Learn, then build, then prove. Data link only: the `unit` field. The same unit is never on both tracks within 7 days. | Recommended: two tracks that do two jobs, nothing to unlearn, `r` stays as the owner decided. |
| M2. Fold | The series replaces the course reels (it already covers all 65 units); `r` stops after the built ones. | Cleanest for a viewer, but it reverses "the course track stays". Keep it as the fallback: after 30 days compare series and course medians (views, saves, follows) in `insights.json`; if course reels trail the series on the same units, freeze `r`. |
| M3. Parallel | Both walk the same units at the same level. | Rejected: duplicates, and CLAUDE.md rule 12 (nothing from the last 60 days comes back) would stall the series. |

Honest cost of M1: the course and interview reels already taught many of these ideas at concept level, so part of the series re-treads ground that was just posted. The draft ladder marks 50 of the 150 days with a `note` naming the reel ("r03 says this in words; show the guesses and their odds"); the densest are S1 (6 of 10 days) and S3 (7 of 12). Rule 12 for series days should be read for the angle, not the concept: a different format and picture, never the same script. If the owner prefers no repeat at all, M2 is the answer, not a cleverer reorder (a ladder has to start at Day 1).

The draft ladder, `roadmap/series-150-draft.json`:
- 150 days, 14 phases (S1 to S14), days numbered 1 to 150 in the schema of the dsa file (`about`, `rules`, `phases[].days[]` with `day`, `title`, `format`, `status`, `reels`), plus two optional hints: `unit` (the unit of `ai-engineer.json`) and `note` (the existing reel that teaches the same idea).
- Every one of the 65 units of `ai-engineer.json` appears at least once (checked by script). The other 85 days are second angles of big units and new ground: neural network basics, parameters, scale, hallucination, knowledge cutoff, reasoning models, hybrid search, reranking, grounding, RAG at scale, skills, planning, least privilege, benchmarks, jailbreaks, retries and fallbacks, quantization, choosing and self-hosting a model, fine-tuning, LoRA, preference tuning, distillation, and a closing phase on how an AI engineer works (reading a paper, judging a model release, Hindi and Hinglish in LLMs, designing a RAG chatbot, a first project).
- Order is by what a learner needs next, not the order of roadmap.sh: tokens, then how an LLM generates, then sampling, then prompts, context, embeddings, RAG, tools and MCP, agents, evals, safety, production, multimodal, adapting models.
- Formats: concept 47, pattern 36, structure 24, demo 13, myth-bust 12, trade-off 11, recap 7 (Days 24, 47, 70, 82, 95, 105, 150). The six formats allowed plus one proposed addition, `trade-off` ("X vs Y, which one when"), which the System Design floor already uses; the validators must list it.
- Only topic names are used as a checklist; titles are our own wording and nothing from roadmap.sh text is copied.
- The generic track's evergreen part survives as days (Day 145 reading a paper, Day 146 judging a model release); its "what is new" part is gone by decision.

### 2.6 The cover: Bit or the family look

Recommendation: the series cover is the family look the brand board shows for ai.learnvora: pill `AI`, headline of at most 8 words with the key words in gold, `DAY NNN / 150` with a progress bar, the handle, no mascot. Bit stays inside the reels and on the course and interview covers, unchanged. Why: the climbing counter is the point of the series, the counter and Bit compete for the same space, and the brand board already shows this layout to the owner.

How:
- New `brand/covers/_template_series/` copied from `teams/dsa/brand/covers/_template`, accent changed to gold `#F2B544`, handle text as one constant. The current `_template` (Bit) is not touched.
- `scripts/render_cover.py`: port `--day` and `--of` from the dsa script but keep `--day` optional (the dsa version has `required=True`: copied verbatim it breaks every `r` and `q` cover). With `--day` it uses `_template_series`, without it `_template` as today.
- The 3:4 grid: the profile grid shows the centre 1440 px of a 1920 px cover (y 240 to 1680). The current cover starts its pill at y 190, above that crop; the dsa template keeps everything between y 260 and 1660. The course and interview covers could move to the family layout (no counter) later for a uniform grid: an owner decision, not part of this change.
- Alternative: Bit next to a smaller counter. It needs a new layout and a design pass, and nothing in our numbers says it grows the handle. Not recommended before there is data.
- A grid note, not a promise: with exactly one series, one course and one interview reel a day in the order 09:00 series, 13:00 course, 17:00 interview, each column of the profile grid is one track and the counter climbs down the right column. One missed day shifts the columns.

### 2.7 In-repo changes, in order

Legend: [data] state and roadmap files, [code] normal commit to main, deploy with the Worker; [proposal] rules, prompts, agents, skills, scripts: the owner approves (an agent's edit lands on a `proposal/` branch).

0. **Before anything**: the owner decisions in section 3 and at least questions 1 to 4 of 2.8 (the Calendar mirrors the poster, so the poster decides what is possible).
1. [data] **Close the generic track in state.** The owner approves, posts or drops `e101` to `e104`. Remove them from `state/queue.json`. In `state/covered.json` sync `e102` to built and mark `e18` rejected. This must come before step 4.
2. [data] **Adopt the ladder.** After the owner's edits, `roadmap/series-150-draft.json` becomes `roadmap/series-150.json` (keep or drop the `unit` and `note` hints). Add a paragraph to `roadmap/README.md` (series vs course; `ai-engineer.json` stays the course's units).
3. [code, deploys with the Worker] **`teams/learnai/team.json`**: replace the generic track by `{ "id": "series", "prefix": "a", "name": "150 Days of AI" }` in first position; course and interview stay; tagline "..., 150 days, one idea a day"; `pace` stays 6 (the work day message says "2 per track") unless the owner decides otherwise. `apps/api/src/teams.ts` bundles this file at deploy and the runner reads it from the checkout: merge and deploy together, or the office and the validators disagree on the tracks for a while.
   **`state/config.json`**: `id_start` becomes `{ "series": 1, "course": 101, "interview": 101 }`; add `series_days: 150` and `formats` (concept, structure, pattern, demo, myth-bust, trade-off, recap, plus finding, question, explainer for the other tracks); rewrite `id_note`; `youtube_tracks` stays `["course","interview"]` until the owner decides about the series.
4. [proposal] **Scripts.**
   - `scripts/validate_queue.py`: read `PREFIX` from `team.json` and `FORMATS` from the config (as dsa does); run the day checks only for items of track `series` (the dsa version checks every item, so the `r` and `q` items would fail "day must be a whole number"); check that the id number equals `day`; keep the `ID_START` check.
   - `scripts/next_to_build.py`: `PREFIX` from `team.json`, sorted ids (as dsa); for `series` take only the lowest day not started, never a gap.
   - `scripts/render_cover.py`: as in 2.6.
   - Checked and unchanged: `ci_verify_reel.py`, `lint_script.py`, `make_reel_audio.py`, `render_*`, `qa.py`, `visual_review.py` (identical to dsa, none of them reads tracks), `new_reel.py` (only a default chip text).
5. [proposal] **Cover template**: `brand/covers/_template_series/` and the cover README (2.6).
6. [code] **`runner/bridge/studio.mjs`**: the `render_cover` tool has no day parameter; it runs `render_cover.py <folder> <pill> <headline>`. Add an optional `day` (integer 1 to 150) and `of`, pass `--day` only when given, update the tool description. Without it a series cover cannot be built in the studio. Note: this is already broken for `teams/dsa` and `teams/systemdesign`, whose `render_cover.py` requires `--day` and whose `prompts/studio.md` tells the agent to call the tool without it. One fix serves all three floors. Test: `node --test runner/bridge`.
7. [code] **API and web.**
   - `apps/api/src/calendar.ts`: `TRACKS` = series `a`, course `r`, interview `q` (this order is the cell order and the fill order); a legacy map for `e` (label only); `track_slots` and the series pool and order rules of 2.4; the "Only e, r and q reels can be put on a slot" message built from `TRACKS`; the top-of-file comment. The id regexes already accept `a001`.
   - `apps/api/src/calendar.test.mjs`: the fixtures use `e101`, `e102`, `e150` and assert `["generic", "e101", "auto"]` cells and the `e150` ready entries: rewrite them with `a001`, `a002`, `a150`. New tests: the series fills one slot only; the series offers the next day only (`a003` released, `a002` not: empty cell); `a003` refused for a slot while `a002` is unposted; a second series reel on one date refused; an `e` id gets no cell, `Post now` works and `Put on a slot` is refused; `a1` is a bad id; the `empty_slots` count (2 + 3 x 6 today) is recomputed.
   - `apps/web/src/components/Calendar.tsx`: `SHORT` gets `series: "Day series"`; `generic` stays for the retired label.
   - `company/office-protocol.md` line 35 ("ids start at 101 per track (e101, r101, q101)") and the Calendar paragraph of the root `README.md`.
   - Unchanged (checked): `apps/api/src/github.ts` (`publishRepo` tests the slug `learnai`, which stays), `office.ts` (item regexes accept `a001`; the track of a rebuild comes from the queue item, so keep `track` in the item brief of `e` reels if the owner asks for changes on them), `index.ts`, `.github/workflows/office-run.yml` and `office-studio.yml` (the `^[a-z][0-9]{2,4}$` input check accepts `a001`; the release is `office-learnai-a001`), `runner/scripts/*` (`pick_best.py` regex accepts it, `report_final.py` is track-blind), `packages/protocol` (tracks are plain strings).
   - Tests: `pnpm -r test`, `node --test apps/api/src/calendar.test.mjs`, `node --test runner/bridge`, `python scripts/validate_queue.py`. Deploy the Worker only after ai-course's poster knows the prefix `a` and the slot rule.
8. [proposal] **Rules, prompts, agents, skills, notes.**
   - `CLAUDE.md`: line 3 (series sentence, handle at the rename); the track table (the generic row becomes `series`, course says "the next unit of the AI engineer roadmap, taught the working way"); rule 2 (counter, series only); rule 4 (hook types per track: series rotates the least used of the last six among `direct_question`, `surprising_fact`, `misconception_question`, `relatable_stake`); rule 5 (series 30 to 90 s); rule 6 (series cover, see 2.6; Bit stays on `r` and `q`); rule 7 (`Day N/150:` first line, three hashtags with `#150DaysOfAI`); rule 12 (read for the angle on series days); rule 14 replaced; "Where things live" (`roadmap/series-150.json`, `docs-notes/series-style.md`). Draft wording below.
   - `prompts/work-day.md` (pick the next series days in order, never skip, Day N+1 is not planned before Day N), `prompts/plan-reels.md` (its title and first paragraph still describe the 05:00 and 06:30 schedule and the 09:00/13:00/17:00 auto-post: stale; replace the generic bullet and the "Ids" paragraph; Step 3 fields `day`, `phase`, `unit`, the format list, `length_target_s` 30 to 90 for the series; the course bullet gets the 7-day rule), `prompts/build-reel.md` (the `TRACK=` list, the pills, the cover command with `--day N`, the generic bullet replaced by a series bullet), `prompts/studio.md` (the `render_cover` row gets `day=<N>`), `prompts/daily-sync.md` (check for track names).
   - `docs-notes/series-style.md` (new; port of the dsa note with the AI day types and arcs, the caption rule, a line on how series and course differ), `docs-notes/reel-style-v2.md` line 8.
   - Agents: `strategist.md` (the "Generic:" line), `researcher.md` (its description says "new tools and repos for the generic track"), `producer.md` ("Office ids start at 101 per track": series ids are the day), `packager.md` (the `Day N/150:` caption, hashtags), `scriptwriter.md` (beats per day type).
   - Skills: `hook-writer` (the generic row), `hinglish-script` and `clean-reel` (descriptions name `e##`), `ig-caption` (the "Day 87/150: " prefix uses 12 of the 125 visible characters), `india-ai-viral` (its owner rejection "series numbers on covers of one-off content" still holds: the counter is for the series only).
   - `state/experiments.md` and `state/proposals/2026-10-17-misconception-question.md`: close or re-scope (2.3).
9. **Dry run before the first public Day.** In ai-course set `posting_paused: true`. Build `a001` in the studio (cover with `--day 1`, caption `Day 1/150: ...`), approve it, put it on its slot from the Calendar, and check: the release `ig-a001` exists, the poster's log or dry run takes the id, the Calendar cell says what the poster will do, the track and `youtube_tracks` are right. Then resume posting.

Draft wording for the owner to approve (CLAUDE.md):
- Table row: `| series | a001, a002 ... (the id number is the day) | 150 Days of AI: one idea a day, Day 1 to Day 150, in the order of roadmap/series-150.json. The idea in one picture; the course track goes deeper. |`
- Rule 2: "**Stand-alone.** One idea per reel. Define every term inside the reel. Never write "Part N", "next video" or a series tease. Series reels (a###) carry a day counter (`DAY 087 / 150` on the cover, `Day 87/150:` at the start of the caption): the day is a label, never part of the story. A series script never says "yesterday", "kal" or "pichhle video" and never points at another day or at a course reel."
- Rule 14: "**Series (owner, 2026-10-18).** 150 Days of AI replaces the generic track. One idea a day in the order of `roadmap/series-150.json` (day types in `docs-notes/series-style.md`): the idea in one picture, vendor-neutral, a vendor or tool only as the example the concept needs, checked against its official docs. Evergreen: no news, no "what's new". An idea a course or interview reel already taught gets a new angle (another format and picture), never a repeat; rule 12 is read for the angle on series days. Never promise a literal 10x from AI: the honest framing comes from primary sources (for example METR's 2025 study found experienced developers 19 % slower while they felt faster). A day is skipped only with the owner."

### 2.8 What the owner must check in the private publishing repo (ai-course)

Not visible from this repo. Each answer decides a step above.

Slot poster (`scripts/post_plan.py`) and `post-reel`:
1. Are the track prefixes `e`, `r`, `q` hard-coded or read from the config? What happens to a released item whose id starts with `a`: posted, ignored without a message, or an error? Does it take the track from the `track` field of `phase5_status` or from the prefix?
2. Where would a new track go in the order of a slot (generic, course, interview today)? Can the order come from the config?
3. Can a track be limited to some slots, or to one post a day? If not, it must get that (`track_slots`): without it the series posts three Days a day.
4. Does it take the lowest id first, and can it be told never to post Day N+1 before Day N? What does it do when the lowest id is not released: skip to the next or hold?
5. How does it treat a day with no released series reel, and a reel released late (`slot_late_min` 150)?

Config and the hand-over (`state/config.json`, `office-handover.yml`):
6. The keys the Calendar reads: `slots_ist`, `posts_per_slot`, `posting_window_ist`, `slot_late_min`, `posting_paused`, `post_schedule`. Is `youtube_tracks` a list of track ids or of prefixes? Should the series go to YouTube Shorts (the channel LearnAI) and to Facebook, or Instagram only like the sibling floors?
7. `office-handover.yml`: does it check `item` against a prefix list or a digit count? Which `track` does it write into `phase5_status` for the released item? Does `post_schedule` keep an id with an unknown prefix? Does it create the tag `ig-<item>` for any prefix?
8. Does anything already use the prefix `a` (ids, `ig-a*` tags, state files)?
9. Do its own gate or insights code group by track names or check the pill texts and the handle on covers (the "WHAT'S NEW IN AI" pill, `@ai.learnvora`; it was `@ig.learnai` before 2026-10-18)? The scoreboard by track and format needs the new track.

Schedules and numbers:
10. Which scheduled workflows are still active in ai-course (planner, builder, poster)? Any that still plan or build `e##` must be switched off for the generic track, otherwise `e19` and later keep appearing in the pools (`e18` is `planned` in its `covered.json`).
11. Which slot do reels do best in (post time against the 72 hour plays)? That is the series slot.
12. Meta and the rename: which app and token the Instagram login belongs to, whether the username is stored in the config, and that the Facebook page (`Learnai.ai`) and the YouTube channel (`LearnAI`) keep their names.

### 2.9 Where it breaks if done carelessly (most dangerous first)

1. **Poster and Calendar drift.** Change the Calendar only, and it shows "auto" cells for reels the poster never posts (silent), or the poster posts three Days a day and out of order. The poster rule and `calendar.ts` change together, and the dry run (step 9) is not optional.
2. **Poster ignores or mislabels the prefix `a`.** A released series reel could sit in the release forever, or be recorded under the wrong track.
3. **`render_cover` plumbing.** The studio tool cannot pass `--day`, and the dsa script requires it: copy the dsa script as it is and every `r` and `q` cover fails; leave the tool as it is and no series cover can be built.
4. **Validators.** Copy the dsa `validate_queue.py` as it is and the day check fails every `r` and `q` item; drop `generic` before the four `e` items leave `queue.json` and the work day cannot finish.
5. **`team.json` read in two places** (Worker bundle at deploy, runner at run): a half-merged state makes the office and the validators disagree about the tracks.
6. **Id mistakes.** Keeping `e` collides with `e101` to `e104` and with ai-course's `e01` (same number); `a7` instead of `a007` fails every regex.
7. **Rule 12 stalls the series.** Days that repeat a published concept are refused as duplicates, and "never skip a day" makes the planner stop. The angle reading of rule 12 must be approved with the rest.
8. **Covers and end cards rendered before the rename** still show `@ig.learnai` (section 1): re-render them before they are posted.
9. **`pace` and the cadence**: `pace 6` over three tracks is 2 series reels per work day, while one goes out a day. The buffer grows by one day per work day; that is fine, but the work day prompt should say how many series days to make (section 3, question 8).

## 3. What the owner decides
1. The rename is done (2026-10-18). Remaining: re-render the waiting covers and end cards that still show `@ig.learnai` before posting (recommended), or post them as they are?
2. Ids `a001` to `a150`, the id number is the day (recommended), or the fallback `e105+` with a `day` field?
3. The series slot: one reel a day, in which slot; and the order rule (Day N+1 never before Day N). Both need a change in ai-course's poster.
4. `e101` to `e104`: post, drop, or hold? Recommended: decide each before Day 1; none is converted.
5. How series and course relate: M1 spine and depth (recommended), M2 fold, or M3 (rejected).
6. Cover: family look without Bit (recommended), or Bit plus a smaller counter. And later: should the course and interview covers move to the family layout?
7. Platforms for the series: Instagram only (as the sibling floors), or Facebook and YouTube Shorts too?
8. The ladder: approve `roadmap/series-150-draft.json` or mark changes; the date of Day 1; how many series days one work day makes (now 2 of 6).
9. Someone with access to ai-course answers section 2.8 (questions 1 to 5 first).
