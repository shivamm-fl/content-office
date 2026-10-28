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

## 2026-10-17: generic track hook types (our numbers, approved by the owner)
- 2026-10-17: Generic track (n=9, median skip 75.3%, avg watch 6.0 s) trails interview (n=18, 63.4%, 10 s). Generic reels now test two hook types side by side: surprising_fact and misconception_question (an interview-framed common belief, as in e09: 1536 views, 13 shares). Retire one only by the 3-reel, 10-point rule.

## Owner corrections (recorded automatically)
- 2026-10-18 (e103): Reels about a skill, a repo or a tool end with the ask: follow karo, comment karo <KEYWORD>, and the skill or link comes straight to your DM.
- 2026-10-18 (e103, q103): Keep pauses short: no long gap between parts or scenes, and never hold a scene after its line has ended.
- 2026-10-18 (e104): The script comes first: research how reels like this are scripted and write a good one, show it to the owner when they ask to see it, and do not let fact-checking crowd out the quality of the writing (claims are still verified).
- 2026-10-18 (r104, e103): The reel must answer the question it asks by its end (the first line need not). A script that asks one thing and explains another is wrong. Owner: "pura reel toh at the end wo sawal ka jawab de hi deni chahiye" and "Tere sawal ka jawab tune kaha diya, bhai clarity rakh script mai, viewer ko samajh toh aaye, kuch value toh de".
- 2026-10-18 (r104, e103): Always assume the viewer has no context around the topic: say clearly what the reel is about and explain everything inside it. Owner: "jab bhi reel banao, ye samajh ke banao ki user ko uske aaspass ka koi context nhi, sab clearly batana hoga".
- 2026-10-18 (r104, e103): A reel of up to about 90 seconds is fine when clarity needs it. Owner: "reel 90s hogi chalega".
- 2026-10-20: Judge series (course) reels by the value they give, not by skip rate alone: read likes, saves, shares and follows together with watch time, and do not shorten or reshape a series day just to lower skip rate. Series days may stay lengthy when the teaching needs it. The owner considers a001 (172 s, high watch time, 9 shares) a success.
- 2026-10-20: When the owner gives wording, keep it exactly; do not add source-talk (such as "the guide says") or swap his terms for ones you prefer. If a fetched source uses a different term, tell the owner in the report and let the owner decide.
- 2026-10-20 (a003): When a script shows a chart, narrate it step by step like a teacher: say what the dots are, what the model draws, what the gap means and what each error number means, one idea per sentence, so a beginner follows without prior context.
- 2026-10-21 (q110): Before a script says "your answer should be", the interview question must already have been spoken in full, in the reel itself. A hook or a definition is not the question; say the question out loud once, then the answer.
- 2026-10-24: Every reel opens within the first 2 seconds with the question and bold on-screen text, with no intro, logo animation or greeting, and the visual changes every 3 to 5 seconds (token IDs, document cards, ranking animation or code highlight).
- 2026-10-27 (a009): A hook should start from a frustration the viewer already knows from using the tool (they explained the same thing many times and it repeats the same mistake), phrased in the viewer's own plain words, not a bare topic question like "did it learn from me?".
- 2026-10-28: Never add a forced analogy or filler that does not teach the topic; if the analogy does not map onto the idea, cut it. Length follows the topic: a small topic that can be taught clearly in 45 to 60 seconds must not be stretched to two minutes. Write natural spoken lines, keep the explanation clear, and do not open with a vague claim like "AI is not one thing" before showing what it means.
- 2026-10-28 (a010): In narration say the common English words "input" and "output", never the Hindi andar and bahar for them. In general use the plain words the audience already knows instead of harder Hindi (for example "measure karti", not "naapti"), because many viewers are not well educated.
