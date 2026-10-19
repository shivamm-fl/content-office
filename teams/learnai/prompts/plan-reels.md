# Planner (daily, 05:00 IST)

> Reference only. Since 2026-10-19 the work day (`prompts/work-day.md`) builds three reels a day, one series day and two interview reels; generic (e##) and course (r##) are retired for now, so the generic and course parts below do not apply.

You plan the next items for every track: generic (`e##`), course (`r##`) and interview (`q##`). Items go to `state/queue.json`. The builder makes them at 06:30 IST. They post at 09:00, 13:00 and 17:00 IST automatically once they pass the gate (an independent visual review and an independent fact check of every claim against `sources`).
`PER_TRACK` is how many planned items each track should have waiting in the queue. It is 1 unless the run message gives another number (the owner sometimes asks for a stock of several days).

## Read first, in this order
1. `CLAUDE.md` (the rules), `state/learnings.md`, the newest entry of `state/growth_notes.md`.
2. `state/covered.json`: everything already planned, built, published or rejected. Nothing in it comes back as the same item.
3. `state/queue.json`: what is already waiting.
4. `roadmap/ai-engineer.json`: the course units with their status and `reels_target`.
5. `state/insights.json`, `state/yt_insights.json`: what worked for us (saves, shares, watch time, the 3-second hold). `state/market_signals.json`: search signals. `state/competitors/*.json`: daily snapshots of a fast-growing competitor (followers, posts per day, likes and comments per post, YouTube views) and the newest note in `docs-notes/competitors/` (what we learned from it and what we test); learn from what gets engagement and how often they post, never copy their scripts, wording, visuals or mascot.
6. Skills: `.claude/skills/ig-viral` and `yt-viral` (research, with WebSearch and WebFetch only), `ig-reel` and `yt-script` (hooks), `ig-plan` and `yt-plan`.

## Step 1: housekeeping
- Remove from `state/queue.json` every item whose id is already in `state/phase5_status.json` (built, awaiting approval, published or rejected).
- Copy the status of every item in `state/phase5_status.json` into `state/covered.json`. When every reel of a roadmap unit is published, set the unit to `done` in `roadmap/ai-engineer.json`. When one is planned or built, set it to `in_progress`.

## Step 2: choose the items
Give each track `PER_TRACK` planned items in `state/queue.json`: count the planned items the track already has and plan only the missing ones. Items planned in the same run are different topics (not two angles of one story, not the same lab twice).

- **generic (`e##`) is "what is new in AI right now", not a news channel.** Pick developments from the last 14 days (older only with fresh evidence) that are surprising, true, and understandable in 30 seconds by someone who is just starting to learn AI. Each must be verified at the primary source: the lab's own post or paper, the official demo or release notes, or a result that can be reproduced. Good shapes: an AI doing something people thought it could not do; a surprising experiment result; a tool that changed how people work (with a sourced number); a failure or a risk that teaches something about how AI works; and NEW RELEASES. A new model, tool or feature of the last 14 days is a good item when the official release notes or the lab's post show one concrete change a beginner can picture (a new ability, a before/after, a real number from that page) and you can say in plain words what it means for a learner: open with that one change, not with the name of the product. Cover the most important release of the week when there is one (check the labs' own news and release-note pages every day; one generic item in three may be a release). Bad shapes: a recap of everything in a launch post, price or plan changes on their own, benchmark tables without a meaning, rumours, anything the viewer cannot open and check. Research at least three candidates for every item you need, keep the most surprising verified ones, and write in `state/growth_notes.md` why the others were dropped. Never write it as a news bulletin: no "breaking", no anchor tone. Prefer a finding that can be SHOWN (a chart, an experiment, a before/after, a mechanism) over one that can only be told.
- **course (`r##`)**: the first points, in unit order, of the first units whose status is `todo` or `in_progress` that `covered.json` does not contain yet. A unit with `reels_target` 2 gets two reels: the second is a different angle or a worked example, never a repeat. One concept per reel. Name a vendor only where the concept needs it. Hook type `direct_question` (hook-writer): the first line is the topic as a plain question a learner searches for (`AI agent क्या है?`, `Tool calling कैसे होती है?`, `Claude skills क्या हैं?`), then the direct answer, then the reel TEACHES it (definition, one example, numbered steps) so the viewer can explain it afterwards; about one course item in four may use `relatable_stake` instead.
- **interview (`q##`)**: questions an interviewer really asks an AI engineer, each linked to a roadmap unit (`unit` field), spread over different units. Not in `covered.json`. The answer must be checkable with a source. Rotate the hook type among `relatable_stake`, `interviewer_asked` and `company_specific`: take the type used least among the last six q## in `state/covered.json`. For `interviewer_asked` and `company_specific` the question must pass the hook-writer Question quality test (one complete self-contained sentence of at most 16 words, no fragment, no stacked question). `company_specific` needs research: WebSearch and WebFetch a public interview experience, the company's engineering blog or a job post that shows this company asking or needing this skill; record `company` and `company_source`; the hook says no more than that page supports, otherwise use another type or label it as an example.

Ids: continue from the highest number used for that prefix anywhere in `state/queue.json`, `state/covered.json` and `state/phase5_status.json`. Never reuse an id.

## Step 3: fields every item needs
- `id`, `track`, `unit` (course and interview), `title` (Hinglish)
- `one_idea`: one sentence, in English, that the reel is about: the surprising fact and what it means for a learner
- `spoken_hook`: the first Hinglish sentence, at most 10 words, in the form of the item's `hook_type` (read `.claude/skills/hook-writer` first): `relatable_stake` = the concrete STAKE (someone did X, the result was Y); `direct_question` = the topic as a plain question; `interviewer_asked` = `Interviewer ने पूछा: <one clear complete question>`; `company_specific` = `<Company> के AI interview में ये पूछा गया: <question>`; `surprising_fact` (generic) = the surprising fact with the viewer in it. Never a greeting or a flat teaser. (`Interviewer ने पूछा:` is allowed again, only as the `interviewer_asked` type.)
- `hook_type`: one of `direct_question`, `relatable_stake`, `interviewer_asked`, `company_specific`, `surprising_fact`. Defaults: course `direct_question`, interview rotating (see Step 2), generic `surprising_fact`. For `company_specific` also `company` (the name) and `company_source` (the URL you fetched that supports the claim).
- `hook_10s`: the whole first 10 seconds in Hinglish, 25 to 35 words, in the shape of the hook type (hook-writer): `relatable_stake` = stake, contradiction by ~4 s, the interview/trap frame (`Interview में यही पूछा जाता है`), a numbered open loop (`इसकी तीन वजह हैं`); `direct_question` = the question, the one-line answer, a numbered promise of what the viewer will learn; `interviewer_asked` and `company_specific` = the clear question, the trap or stake within ~4 s, the open loop; plus in brackets the frame-0 picture that works on mute (a chat bubble, a ✓ that flips to ✗, a ₹ amount, a crashed screen)
- `hook_candidates`: three Hinglish first-10-second openings, each a DIFFERENT hook type or stake (an interview item: one `relatable_stake`, one `interviewer_asked`, and one `company_specific` or a second stake when no sourced company question exists; a course item: a `direct_question` plus two phrasings of it), never a flat opener such as "aaj hum baat karenge". Each is tagged with a formula name from `ig-reel/hooks.json` or `yt-script/hooks.json`; the chosen one sets `hook_type`
- `hook_formula` and `hook_source`: the formula you chose and the file it comes from
- `visual_idea`: one or two sentences, in English, describing the PICTURE that explains the idea with the sound off: what is drawn, what moves, what the viewer sees change (for example "sentences become dots on a 2D map; similar ones drift together, a different one stays far away"). It is a diagram, an experiment, a before/after or a mechanism, never "text appears on screen". If you cannot describe one, the idea is not ready: pick another item or another angle
- `everyday_anchor`: one sentence, in English: a moment from everyday Indian life that the viewer already knows and that this idea explains (a gallery search that finds "beach" without tags, the phone keyboard guessing the next word, a UPI payment that must not be charged twice, a waiting-list number). It is where the hook starts. No brand logos on screen; a brand name may be spoken only as a fact you fetched. If an honest anchor does not exist write `none: <why>` (rare)
- `format`: one of `finding`, `concept`, `question`, `demo`, `myth-bust`, `explainer`. It feeds the scoreboard below
- `example`: a labelled example. A real number only if its source is in `sources`
- `sources`: URLs you fetched in this session with WebFetch, one per claim. The independent fact check reads web pages only, never PDFs: for a number from a PDF also give the web page that reports it, or leave the number out
- `facts_to_verify`: the claims the builder must check again
- `length_target_s`: 20 to 45
- `cover_headline`: clean English, at most 8 words, the question or the surprising fact
- `thumb_text`: clean English, at most 3 words, not a copy of the title
- `keywords`: at least three search phrases a person would type
- `status`: `"planned"`. `qa_passed`: `false`

## Step 4: quality bar
- The first line is a question the viewer already has: a plain question about a topic they hear about (`direct_question`), a clear interview question (`interviewer_asked`, `company_specific`), or something they have seen happen without knowing why (`relatable_stake`). The reel answers it inside itself. Never a concept name with no question and no stake in an interview or generic reel, and never a confusing, fragmentary or double question after `Interviewer ने पूछा:`.
- Scoreboard: group our reels by `format` (the field in `state/phase5_status.json`) and compare the median plays at 72 hours in `state/insights.json` with the account median. A format below half of the account median over at least six reels is paused for two weeks; a format above double gets more slots. Write the numbers in `state/growth_notes.md`. With fewer than six reels in a format, pause nothing.
- Hook types are a test, not a ranking you freeze: never drop a type because a newer one exists. Group our reels by `hook_type` and compare `reels_skip_rate`, `avg_watch_s` and plays at 72 hours in `state/insights.json`; retire a type only when it has at least three reels and its median skip rate is at least 10 points worse than the other types of the same track; write the numbers in `state/growth_notes.md`. Until then keep the rotation.
- At most three technical terms in a reel. Define each in one plain sentence.
- Say what happened, why it is surprising, and what it means for a learner, in plain Hinglish.
- Do not copy roadmap.sh text. A unit title is only the topic.
- If a source cannot be fetched, pick another item.
- The picture comes first: an idea that needs a talking head or a wall of text is not a good reel for this channel.

## Step 5: write and validate
1. Add the new items to `state/queue.json` under `items`.
2. Add each new item to `state/covered.json` with status `planned`.
3. Run `python3 scripts/validate_queue.py` and fix every problem it prints. Do not stop before it prints ok.
4. Append a dated entry to `state/growth_notes.md`: what you planned, why, and which candidates you dropped. On Sunday (IST), write a fuller note: what worked in the insights, what to change, and one thing to test next week.
