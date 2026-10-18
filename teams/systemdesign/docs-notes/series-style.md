# Series style: 150 Days of System Design (owner decision 2026-10-18)

The owner runs a 150-day series on each Learnvora handle: one idea per day, Day 1 to Day 150, in the order of `roadmap/series-150.json`. This note is what is different from the LearnAI floor.

## The rules of the series
- **Stand-alone, with a counter.** Reels are shown at random, so the viewer may meet Day 87 first. Each reel names its problem and defines its terms inside itself. The day is a *label* (cover counter `DAY 087 / 150`, caption line "Day 87/150: ..."), never part of the story: no "yesterday", no "kal", no "next part", no tease. This relaxes LearnAI rule 2 for the series floors, by the owner's decision.
- **Id = day.** Day N is `s` + N in three digits. The roadmap is the plan; skipping a day needs the owner.
- **One idea, a picture first.** Visuals are diagrams that move (`docs-notes/diagram-first-visuals.md`); on-screen text is a label of one to three words. Code, when shown, is large (mono, at least 40 px), at most 8 lines, with the line being discussed highlighted.
- **Hinglish voice, English screen.** Narration in natural spoken Hinglish, English technical terms untouched; cover and labels in clean English.
- **Length** 30 to 120 seconds; teaching days (every day that explains a mechanism) run 90 to 120 (owner, 2026-10-18), clarity beats brevity, and the day type sets the shape. How a teaching day is built (beat sheet, detail checklist, pacing, when to split a day): `docs-notes/teaching-flow.md`.
- **Reference accounts teach format only** (CLAUDE.md rule 15). Never copy another account's slide copy, wording, mascot, colours or layout. The standard teaching order of the subject is not theirs; follow it.
- A real company's design is told only as far as its own engineering post says (named on screen as `Source: <site>`). Anything else is "a typical design", labelled. Numbers (QPS, storage, latency) are either from a fetched page or marked EXAMPLE with the arithmetic shown.

## The day types (`format` in the roadmap and the queue item)
| format | what the day is | arc of a teaching day, 90 to 120 s (seconds are a guide; every arc ends on a check-yourself question) |
|---|---|---|
| `concept` | an idea every design uses (latency vs throughput, CAP, consistency) | hook and promise 10 s, the naive way crossed out, with its number 14 s, answer, definition and analogy 12 s, the mechanism in 3 to 5 steps on one running example 44 s, the catch or misconception 12 s, what it changes for you 6 s, recap, check and follow 12 s (110 s) |
| `component` | one building block (load balancer, cache, queue, CDN, database index) | what breaks without it, with a number 12 s, where it sits between the boxes (diagram built box by box) 20 s, how it works, one request traced in 3 to 5 steps 40 s, the knob that matters 10 s, the catch: when it hurts 14 s, recap and check 10 s (106 s) |
| `pattern` | a recurring design move (sharding, replication, fan-out, rate limiting) | the problem at scale, with a number 12 s, the naive move crossed out 12 s, the move in 3 to 5 steps 44 s, what it costs 10 s, the one failure to watch (the catch) 14 s, recap and check 12 s (104 s) |
| `trade-off` | two options and when each wins (SQL vs NoSQL, push vs pull) | the tempting wrong answer, crossed out 10 s, option A on the running numbers 24 s, option B on the same numbers 24 s, the axis that decides 16 s, the rule of thumb and when each wins 14 s, check and follow 12 s (100 s) |
| `case-study` | a known system, designed in steps (URL shortener, chat, news feed) | requirements with numbers 14 s, the first naive design crossed out, where it breaks 14 s, the bottleneck proved by arithmetic 14 s, the fixes in 3 to 5 steps 40 s, the trade-off you accept 14 s, recap and check 12 s (108 s) |
| `recap` | a map of the last phase | the confusion 6 s, the one-screen map 50 s, two examples 28 s, check 12 s (96 s) |

## Caption
First line survives the "... more" cut: `Day N/150: <the question or payoff>`. One ask (comment a one-word answer), three hashtags (see packager), no Devanagari.

## Carousel companion (optional, later)
A day can also ship as a 1080x1350 carousel (cover with the same counter, 8 to 12 slides, last slide = the ask). The pipeline does not render carousels yet (`ig-carousel` writes the copy); the owner decides when to add it.

## Evidence so far (2026-10-18)
From the benchmark of nine public accounts (`docs-notes/benchmark-2026-10-18.md`; numbers as read that day, small samples). These are practical consequences to try, not proven rules; our own numbers replace them (`state/learnings.md`).
- **The ask is not the lever.** Views stayed flat per account and likes followed views whatever the caption asked, so the work is the hook and the watch-through. The caption keeps its one ask, but a reel is not judged by its comments.
- **Stake before counter.** The first two seconds carry the stake or the question, with its picture already drawn. `DAY 087 / 150` is a small chip on the cover and a line in the caption: never the first thing seen as text, never spoken. The opener shapes are in `.claude/skills/hook-writer`.
- **One honest trade-off beat per design day.** Component, pattern, trade-off and case-study days each carry exactly one "catch" beat (what it costs, or when not to use it) in the arc above: one spoken sentence with its picture, worded "typically" or "one common design". Technical viewers argue about the catch, so we say it first. Concept and recap days may skip it.
- **A term-decoded beat for beginners.** The first time a technical term appears, say it in English and decode it in about five plain words with a picture; at most three new terms per reel; never a chain of acronyms in one sentence. Decode the term, do not replace it (`script-style-v3.md`).
- **Flat, consistent diagrams.** The same role gets the same shape in the same place every day (client, server, database, cache, queue), one new box or arrow per beat, calm and flat (`clean-reel`). A steady diagram look is open ground among the nine accounts read, and one account's viewers asked how its animated diagrams were made.
- **A per-phase cheat sheet as an optional carousel.** The recap day of a phase (Days 12, 26, 40, 54, 65, 80, 91, 103, 116, 128, 138, 150) can ship as one saveable map: an "X vs Y" or "N things" layout with a small corner mark. A saveable image is a reason to keep the post, instead of per-reel PDFs behind a comment keyword. The pipeline does not render carousels yet; the owner decides if and when.
- **Stand-alone stays.** The research's close beat ends on a "Day N+1" teaser; not adopted (rule 1 of this note). A reel closes on the one line to remember.
- **One reel a day.** Five a day on a cold account did not lift the baseline; do not add reels to chase reach.

**Owner decision, not a rule: a weekly rhythm.** The research proposed a rhythm inside every phase: concept days Monday to Thursday, a teardown of an everyday app on Friday, an interview-question day on Saturday, a recap on Sunday. For: named columns coincided with the biggest spikes of the one account that runs them, and it would put app and interview hooks into every week. Against: that is one confounded account; it changes the day order or adds days (a roadmap proposal); a real app's teardown may only say what the company's own post says (CLAUDE.md rule 11), so it would mostly be a generic case study with an app-flavoured hook; and it needs `teardown` and `interview` in `state/config.json` formats plus arcs in the table above. Option A: keep the roadmap order, treat "Interview ka Sawaal" as a hook shape (`interviewer_asked`) and the phase recap as the saveable. Option B: adopt the rhythm with a reordered roadmap and two new formats. Suggestion: A for the first 30 days, then decide on our numbers. The owner decides.
