# Teaching flow: how a day is taught (owner decision 2026-10-18)

Owner, in Hinglish: "wo kitna achhe aur human tarike se sikhata hai, slowly flow wise detail mai ... 2 min lambi reel bhi chalegi, lekin jo sikha rahe wo proper sikhne hona chahiye." So every teaching day TEACHES: 90 to 120 s, clarity beats brevity. This note is the craft. Day types: `docs-notes/series-style.md`. Spoken format: `.claude/skills/hinglish-script`; hooks: `hook-writer`; a worked proof: `pilot-script-day2.md`. Format and craft only (CLAUDE.md rule 15): nothing of another account's scripts, wording, examples, visuals or topic list is used here.

## Evidence: what I could and could not observe (2026-10-18)
- Tags: [seen] observed on the benchmark account's public pages; [owner] the owner's description; [design] ours, untested.
- Seen: the profile (28 posts, 7,472 followers), its Reels tab (16 reels over about 5 days in four series chips, LLM Concepts, LLM Interview, System Design Concepts, System Design Interview, plus two one-off reels), 5 teaching-reel pages with their full captions, the first frame of one, and 3 public written tutorials by the same creator (structure only). Older notes: `laxmikant-benchmark.md` of 2026-10-14 (private ai-course repo).
- Numbers: the 6 LLM Concepts reels sit at 3.2k to 10.5k views (likes 1.4 to 2.8 percent of views on the 4 I opened); the non-series reels on the same profile (a train-ticket booking reel and two one-off reels) reached 69k to 175k. Teaching depth is steady, not viral: it is how people learn, the hook still decides reach.
- NOT observed: the reels do not play in the headless browser (a poster frame with a play button; clicks did nothing). I did not hear or see any teaching: no voice, pace, pauses, spoken hook, on-screen timing or reel length. The creator's YouTube pages gave only the channel name and no transcript was found. The spoken flow below is inferred from the captions (each lists the steps in order), the written tutorials and the owner's description.

## a. Principles of slow, flow-wise teaching (in the order the viewer hears them)
1. First 10 s: the question and the promise. The floor's hook (first line at most 10 words), one line of answer, then "तीन steps में समझाता हूँ।" [seen: every caption opens on a situation and one question and names the step count; hook rules stay]
2. One running example, on screen from frame 0, real numbers, until the last second. e.g. 10 lakh sorted names, steps counted by a run (20 for binary search). Run it or source it; invented numbers wear an EXAMPLE pill. [seen: the first frame holds the example input; captions reuse one example]
3. The naive way first, failing with one number from that example. e.g. test on 10 names (10 steps vs 4), then on 10 lakh (10 lakh vs 20): the small test lied. [seen: a caption shows two naive tries failing before the fix; also script-style-v3 rule 11]
4. Then the build in numbered steps: one idea and one WHY ("क्योंकि ...") per step, each step's output feeding the next. Say "पहला step ... दूसरा step ... तीसरा step". [seen: a caption is a 4-step chain of causes; owner: "flow wise"]
5. Terms and analogy: say the English term, decode it in at most 5 words, put ONE analogy exactly where the abstract word first appears, then return to the numbers (the analogy explains, the numbers prove). e.g. binary search = opening a dictionary in the middle. At most 3 new terms. [seen: two terms, one plain pair of nouns each; design: the analogy slot]
6. The picture changes only when the idea changes: one new object per step, earlier objects dimmed, the running example never leaves. [design, from diagram-first-visuals.md]
7. Misconception or catch, once, after the mechanism: the viewer's belief, the truth in one line, the number that breaks it. e.g. binary search needs a sorted list; Big-O counts steps, not seconds. [seen: "catch" and "common confusion" paragraphs in three captions]
8. What it changes for the viewer, one line in his currency. e.g. `x in list` in Python is O(n): the same 10 lakh steps. [seen: money, speed and memory in two captions]
9. Close: one-line recap, then ONE check-yourself question that is answered by changing one number of the running example. e.g. the list becomes 40 lakh names: how many steps for binary search? (22). The answer goes in the caption under the "... more" cut. [seen: a one-line recap before the ask; design: the answerable check]
10. No tease, no pointer to another reel (stand-alone, rule 2). [seen: they end by pointing to a sibling reel; we do not]
11. Human voice: second person ("तुम"), spoken connectors (अब देखो, सोचो, यहीं), first person only when true ("मैंने Python में चलाया"), no hype. [owner: "human tarike"; not heard, so my design]

## b. Beat sheet for a teaching reel, 90 to 120 s (day types from `series-style.md`)
Words are a range: 2.3 w/s is what `scripts/lint_script.py` measured (165 words = 70 s), 2.7 w/s is the owner's planning figure at pace 1.3. Until our own voice is timed on a teaching reel, write to the LOW end of the total (255 to 275 words per reel); if a take runs past 115 s, cut words, never speed up.
- `concept` 108 s (248-292 w): hook and promise 10 s · naive way fails, with its number 16 s · answer, definition, analogy 14 s · mechanism in 3 steps 36 s · catch or misconception 12 s · what it changes for you 8 s · recap, check, follow 12 s.
- `structure` 108 s (248-292 w): surprise and promise 10 s · the naive container and its cost 14 s · the memory picture, built box by box 24 s · how it works, 3 steps on the running numbers 24 s · cost table: access, search, insert, real counts 16 s · when not to use it, or the misconception 12 s · recap, check 8 s.
- `pattern` 106 s (244-286 w): the problem it kills, brute-force count 12 s · the signal that says use it 12 s · tiny example in 3 steps 36 s · the template in 4 lines, run, real output 24 s · the trap, when it fails 12 s · recap, check 10 s.
- `problem` 104 s (239-281 w): stake, problem in one breath (paraphrased) 10 s · naive way and its number, run 16 s · pattern, signal, insight 20 s · code, at most 8 lines, discussed line lit, real output 32 s · complexity with the number, the trap or edge case 16 s · check, follow 10 s.
- `recap` 96 s (221-259 w): the confusion 6 s · the one-screen map, 4 to 5 rows 50 s · two quick examples 28 s · check, follow 12 s.

## c. "Enough detail": a script passes only if all of these are true
1. Every term is defined at first use (English term, plain decode); at most 3 new terms; nothing left as "you know".
2. One running example with real numbers: a run (code at most 8 lines, its real output on screen) or a fetched source; invented numbers carry an EXAMPLE pill and the arithmetic.
3. The wrong or naive way is shown first and fails with a number from the same example.
4. Every step says WHY; the mechanism has at least 3 numbered steps (lint_script counts the markers).
5. One catch or misconception is named, with its source or the word "typically".
6. One line says what it changes for the viewer; one recap line; one check-yourself question with its answer in the caption.
7. Stand-alone: no "kal", "part", "next", no pointer to another reel; someone who knows only the title can follow.
8. Tests: cover the screen and listen (can a beginner repeat the idea in two sentences?); delete any beat (if it still works, that beat was filler); every claim has a fetched URL in the queue entry.

## d. Pacing rules for the narration
1. One idea per sentence, about 14 words or fewer; never two ideas joined by "और" or "जबकि".
2. Term, pause, decode: say the English term, `|`, then the decode in at most 5 words; reuse the same word every time, no synonyms.
3. `||` after every step; a number is spoken once and shown on screen at the same instant; at most 3 numbers in one sub-beat.
4. A sub-beat is at most 12 s of continuous speech and ends with a picture change or a new object (the 36 s mechanism beat is three sub-beats, one per step). Numbers are spoken in English (`10{ten} लाख`), as in hinglish-script.
5. Cut first: history, a second example, a third new term, a second analogy, every sentence the check question does not need, filler ("basically", "actually").
6. Read it aloud once: where you must breathe inside a sentence, split it. The Roman Hinglish form is what the owner reads on his phone.

## e. What we do differently from the benchmark account
- Stand-alone: no pointer to a sibling reel or series; they end on one [seen].
- The stake or question comes before the counter; their covers lead with a big day number [seen]; ours is a small chip.
- A check-yourself question the reel itself answers (answer in the caption); their closing ask is an opinion or a word [seen].
- Numbers are run or sourced and the EXAMPLE pill is on screen at the moment; they flag examples in the caption text [seen].
- Our clean flat navy and gold look, no 3D scenes, no copied layout or colours (clean-reel). Our caption: `Day N/150:` first line, 3 hashtags, one ask; theirs ran about 250 words and 11 tags [seen].
- Depth over count: 3 steps taught well in 90 to 120 s; their captions list up to 9 points, and how many the voice covers is unknown to me.

## f. When a topic cannot be taught properly in about 2 minutes
Split it into two stand-alone days (no "part 2" in any script; each title names its sub-idea) when ANY of these holds: more than 3 new terms are needed; the mechanism has more than 4 steps; two running examples are needed; the code is longer than 8 lines; the beat sheet is over 120 s after the cuts of section d; the check question needs the second half. Most days stay one day.
Roadmap effect (a proposal, the roadmap file is NOT edited): a split day becomes two days with their own titles (N-1, N-2), so the series grows from 150 to 158 days with the 8 splits below, or the owner drops thin days to stay at 150. Cover counter, caption and ids follow the owner's choice. `length_target_s` in the queue may be up to 120 (the validator allows 20 to 120).

| Day | Title | Why it does not fit | Proposed split |
|---|---|---|---|
| 10 | Recursion and the call stack | two ideas: self-call with a base case, and the stack picture | 10a base and recursive case; 10b the call stack growing and unwinding |
| 28 | Trapping Rain Water | two solutions (max-left/max-right arrays, then two pointers) | 28a water above one bar; 28b two pointers in O(1) space |
| 35 | Minimum Window Substring | hard: need/have counts plus an expand-shrink loop plus code | 35a need and have counts; 35b the expand-shrink loop |
| 44 | Largest Rectangle in Histogram | monotonic stack plus the width trick | 44a why a stack of rising bars; 44b pop and compute the width |
| 54 | Median of Two Sorted Arrays | hard: binary search on a partition, many edge cases | 54a what a median split means; 54b binary search on the cut |
| 65 | LRU Cache | two structures working together, then the code | 65a hash map plus doubly linked list; 65b get and put in code |
| 122 | Dijkstra | why greedy is safe, plus the heap, plus code | 122a why the closest node is final; 122b the heap version |
| 133 | Edit Distance | three moves and a 2D table to fill | 133a the three moves on a tiny pair; 133b filling the table |
