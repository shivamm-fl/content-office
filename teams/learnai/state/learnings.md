# Learnings

Rules that proved themselves on our own numbers. The planner and the builder read this before they start. Add a rule only with the numbers that proved it (date, metric, value).

No rules yet. The first two weeks are a baseline.

## 2026-10-16: hook types are tested side by side (owner decision)
- Our own table (28 reels before 2026-10-15): "Interviewer ne poocha: <concept>?" median skip 69.7 % / avg watch 7.0 s (11 reels), other question 73.8 % / 6.2 s (9), statement or news fact 79.5 % / 4.2 s (7). The "Interviewer ne poocha" opener was our best type; the weak reels had a confusing question after it, not a bad opener.
- Rule: hook types per track (`hook_type`): course `direct_question`; interview rotates `relatable_stake`, `interviewer_asked`, `company_specific`; generic `surprising_fact`. A type is retired only with at least 3 reels of its own and a median skip rate at least 10 points worse than the other types of its track. Nothing that works is dropped because a newer type exists.
- The question after "Interviewer ne poocha" is one complete, self-contained sentence of 7 to 16 words (no fragment, no stacked question, no unexplained jargon); `scripts/lint_script.py` and `scripts/validate_queue.py` check it.
- Back-fill pending: reels posted before 2026-10-16 have no `hook_type`; classify them from their first spoken line before the first comparison. q12 to q14 (posted 2026-10-16) are `relatable_stake`.

## 2026-10-18: first-line shape (our numbers, Instagram, 47 reels)
- Reels posted 2026-10-15 or later (n=18, interview and course): median skip 59 %, avg watch 12 s, median views ~1.5k. Reels posted 2026-10-12 to 14 (n=25, short claim or statement first lines): median skip ~75 %, avg watch 6 s, median views ~250.
- Rule: the first line is a complete concrete question or a concrete scenario ("Interviewer ne poocha: <full sentence>" or "<thing went wrong>, kyun?"), not a short claim. Interviewer-asked (n=8, median skip ~58 %) and relatable_stake (n=8, ~61 %) are within 3 points: keep both.
- Hint, not a rule (n=3): first lines in Devanagari had 84 to 89 % skip (q01, r01, e02). Keep first lines in Roman Hinglish.
- Open: generic track has only 1 reel after 2026-10-15; keep testing before judging. Length (38 to 90 s) is confounded with the hook change.

## Owner corrections (recorded automatically)
- 2026-10-18 (r104): When a reel asks a question, it answers it in the first lines in plain words, and the script is clear enough that the viewer understands it and leaves with something of real value.
- 2026-10-18 (e103): Reels about a skill, a repo or a tool end with the ask: follow karo, comment karo <KEYWORD>, and the skill or link comes straight to your DM.
- 2026-10-18 (e103, q103): Keep pauses short: no long gap between parts or scenes, and never hold a scene after its line has ended.
- 2026-10-18 (e104): The script comes first: research how reels like this are scripted and write a good one, show it to the owner when they ask to see it, and do not let fact-checking crowd out the quality of the writing (claims are still verified).
