# Series style: 150 Days of DSA (owner decision 2026-10-18)

The owner runs a 150-day series on each Learnvora handle: one idea per day, Day 1 to Day 150, in the order of `roadmap/series-150.json`. This note is what is different from the LearnAI floor.

## The rules of the series
- **Stand-alone, with a counter.** Reels are shown at random, so the viewer may meet Day 87 first. Each reel names its problem and defines its terms inside itself. The day is a *label* (cover counter `DAY 087 / 150`, caption line "Day 87/150: ..."), never part of the story: no "yesterday", no "kal", no "next part", no tease. This relaxes LearnAI rule 2 for the series floors, by the owner's decision.
- **Id = day.** Day N is `d` + N in three digits. The roadmap is the plan; skipping a day needs the owner.
- **One idea, a picture first.** Visuals are diagrams that move (`docs-notes/diagram-first-visuals.md`); on-screen text is a label of one to three words. Code, when shown, is large (mono, at least 40 px), at most 8 lines, with the line being discussed highlighted.
- **Hinglish voice, English screen.** Narration in natural spoken Hinglish, English technical terms untouched; cover and labels in clean English.
- **Length** 30 to 90 seconds; the day type sets the shape.
- **Reference accounts teach format only** (CLAUDE.md rule 15). Never copy another account's slide copy, wording, mascot, colours or layout. The standard teaching order of the subject is not theirs; follow it.
- Problems are paraphrased from the original problem page (named in `sources`), never copied; solutions are written fresh. Every snippet shown is run first and the screen shows its real output. Python is the default language; the cost is always stated (time and space).

## The day types (`format` in the roadmap and the queue item)
| format | what the day is | arc (seconds are a guide) |
|---|---|---|
| `concept` | an idea that every later day uses (Big-O, recursion, binary search) | question 3 s, one-line answer, one picture of the mechanism 20 s, one number that makes it concrete 10 s, the line to remember 6 s |
| `structure` | how a data structure really works inside (array memory, hash map, heap) | the surprise about the structure 4 s, the picture of its memory 20 s, the cost table (access, search, insert) 12 s, when not to use it 8 s |
| `pattern` | a technique that solves a family of problems (two pointers, sliding window) | the problem it kills 4 s, the signal that tells you to use it 10 s, one tiny example 20 s, the template in 4 lines 12 s |
| `problem` | one interview problem | the problem in one breath (paraphrased) 6 s, the naive way and its cost 12 s, the insight 12 s, the clean code 15 s with the run's real output, complexity and one edge case 10 s |
| `recap` | a map of the last phase: which pattern for which signal | the confusion 4 s, the one-screen map 30 s, two examples 15 s |

## Caption
First line survives the "... more" cut: `Day N/150: <the question or payoff>`. One ask (comment a one-word answer), three hashtags (see packager), no Devanagari.

## Carousel companion (optional, later)
A day can also ship as a 1080x1350 carousel (cover with the same counter, 8 to 12 slides, last slide = the ask). The pipeline does not render carousels yet (`ig-carousel` writes the copy); the owner decides when to add it.

## Evidence so far (2026-10-18)
Source: `docs-notes/benchmark-2026-10-18.md`, a read-only study of other accounts (format only, rule 15). It is not our data: `state/learnings.md` still has no rule from our own numbers, so everything below is a default to test, and the owner decides.

- **Stake or question before the counter.** The first spoken line is the stake or the question (`.claude/skills/hook-writer`, "Openers seen in the niche"). The counter is a label: small on the cover under a headline of at most 8 words that states the viewer's benefit or stake (rule 6), and `Day N/150:` as the opening of the caption followed by the question or payoff. In the benchmark a counter with no hook drew little (6 to 32 likes on 3.7K followers).
- **Pattern-first teaching.** On a `problem` day the insight beat names the pattern and the signal that points to it in one line, then the idea ("this is a sliding window problem because ..."). A viewer who meets Day 87 first should leave with something reusable on the next problem. More pattern days and a recap at the end of each phase: `roadmap/PROPOSAL-rebalance.md` (the owner decides).
- **Reels must show on the grid.** In the benchmark 14 of 16 reels of the series reference sat only in the Reels tab, so its profile read as a carousel account. Owner step when posting: after the first post, check that the reel appears on the profile grid, not only in the Reels tab, and keep it that way.
- **Keyword call to action (a test, owner decision).** Two benchmark accounts ask for one comment keyword to get the solution; their reels drew 46 to 91 comments, against 0 comments on 22 of 23 carousels with a link-in-bio ask only. It raises comments; the study does not show it raises reach. It needs an automation that answers each comment or DM: the owner's own, owner-approved. Agents never post or reply (rules 9 and 10); they may write the keyword (one typeable word, no spaces) and a draft of the delivery text. Until the owner approves an automation, the caption keeps its one ask (a one-word comment answer). One ask only, never both.
- **Observed evening IST window.** Most benchmark reels went up between about 17:15 and 23:15 IST. This is observed, not proven causal: the series reference (the smallest active account) posts reels near 18:00, the same hour as the strong ones. The owner posts in the evening when it suits, and the time of each post is noted so the growth analyst can compare it with our own numbers.
- **What we deliberately do differently.** Reels first and on the grid (not carousels with hidden reels); Hinglish voice (not English only); a hook and one idea (not the day number as the headline); the clean navy and gold look (not another account's colours or mascot); one language, Python, with the cost stated (not five); three hashtags and no markdown symbols in the caption; no "Next: Day N+1" in the script. The roadmap's first block order (arrays and hashing, two pointers, sliding window, stack) is also the block order of the series reference's first 23 days, and a widely used one (the study's own knowledge, not a fetched page). Rule 15 forbids copying a topic order, so the owner decides whether to keep it; `roadmap/PROPOSAL-rebalance.md` lists the choice.
- **Stand-alone stays: no "Next: Day N+1" teaser.** The benchmark account ends carousels and reels with one, and its median reel views are still about a third of its followers (0.33x), so the study does not show the teaser helps. Owner decision, optional test: a "Next: Day N+1" line on the LAST SLIDE of the carousel only (the reel script stays stand-alone), logged as an experiment in `state/experiments.md`.

### Problem day arc, adjusted (replaces the `problem` row above once the owner agrees)
The study did not observe any reel length (the videos did not render), so it gives no evidence for a shorter reel and we do not shorten on its authority. The old arc already totals 55 s, inside a 35 to 60 s band, so the total stays about 55 s (the limits of Guardrail 5 stay). What changes is the order and the content of the beats, to put the stake first and the pattern before the idea:

| beat | seconds | content |
|---|---|---|
| stake or interviewer's question, which also states the problem | 6 | the hook is the problem in one breath, paraphrased |
| the naive way and its cost as ONE number | 10 | the number is computed or run |
| the pattern and its signal in one line, then the insight | 14 | pattern-first |
| the clean code with the run's real output | 14 | at most 8 lines, the discussed line highlighted |
| complexity, the one trap, the interviewer's follow-up, then the one ask | 11 | the ask sits in the last 3 s |

Reason: the stake and the question have to arrive inside the first 2 to 3 seconds, so the old "problem in one breath" beat becomes the hook rather than a separate step; the code and the trap are what a viewer learns from, so they keep their time. Test it: after 10 problem reels, compare a cut near 40 s with the 55 s version on our own skip rate and watch time (an experiment the owner approves). The `pattern` arc (46 s) is already pattern-first; keep it, and open it with the problem the pattern kills as a stake.
