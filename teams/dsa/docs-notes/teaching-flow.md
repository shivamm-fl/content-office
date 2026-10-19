# Teaching flow: how a day is taught (owner decision 2026-10-18)

Owner, in Hinglish: "wo kitna achhe aur human tarike se sikhata hai, slowly flow wise detail mai ... 2 min lambi reel bhi chalegi, lekin jo sikha rahe wo proper sikhne hona chahiye." So every teaching day TEACHES: 90 to 120 s, clarity beats brevity. This note is the craft. Day types: `docs-notes/series-style.md`. Spoken format: `.claude/skills/hinglish-script`; hooks: `hook-writer`; a worked proof: `pilot-script-day2.md`; the frame-by-frame study: `benchmark-teaching-observed.md`. Format and craft only (CLAUDE.md rule 15): nothing of another account's scripts, wording, examples, visuals or topic list is used here.

## Evidence: what was and was not observed (2026-10-18)
- Tags: [seen] pages and captions I read; [frames] frames of 6 reels watched by a second agent (`benchmark-teaching-observed.md`: no audio, and no caption or subtitle track exists); [owner] the owner's description; [design] ours, untested.
- [seen] The profile (28 posts, 7,472 followers), its Reels tab (16 reels over about 5 days in four series chips, LLM Concepts, LLM Interview, System Design Concepts, System Design Interview, plus two one-off reels), 5 teaching-reel pages with full captions (each lists the steps in order), and 3 public written tutorials by the same creator (structure only). Older notes: `laxmikant-benchmark.md` of 2026-10-14 (private ai-course repo).
- [frames] The 6 reels (5 LLM Concepts, 1 LLM Interview) run 124 to 163 s, median 146 s, none under 120 s; 10 to 14 s of each is the close (recap, a comment question, a logo card); something new is on screen every 3.5 to 5 s (30 to 40 headline changes); every screen is a small kicker above a headline of 2 to 7 words and the spoken sentence is never printed. Our cap stays 120 s (owner: about 2 minutes is fine); the owner decides if it ever moves, and the cut-first list of each pilot is the tool to stay inside.
- [seen] Views: the 6 LLM Concepts reels sit at 3.2k to 10.5k (likes 1.4 to 2.8 percent of views on the 4 I opened); the non-series reels on the same profile (a train-ticket booking reel and two one-off reels) reached 69k to 175k. Teaching depth is steady, not viral: it is how people learn, the hook still decides reach.
- NOT observed: voice, tone, speaking speed, pauses, how much of each headline is read aloud, the spoken hook words, whether the voice says a step count that the screen does not. Nothing below claims any of these; where this note speaks of pace it is our own plan.

## a. Principles of slow, flow-wise teaching (in the order the viewer meets them)
1. First 10 s. Spoken: the floor's hook (first line at most 10 words), one line of answer, then "तीन steps में समझाता हूँ।" On screen: a headline of at most 5 words (or a bare number with no words for up to 9 s), the running object already drawn, the wrong way or the contrast by 12 s; the kicker `STEP 1/3` appears only when step 1 starts. [frames: headline at most 5 words, no step count on screen in the first 10 s of any of the 6, contrast by 12 s; seen: 2 of 5 captions name the step count; the spoken promise is design]
2. One running example, real numbers, until the last second. e.g. 10 lakh sorted names, steps counted by a run (20 for binary search). Run it or source it; invented numbers wear an EXAMPLE pill. A second example only inside the catch beat. [frames: the same objects (rows, bars, tiles) come back through a reel, so even a reel with 3 examples in 142 s reads as one flow; ours is safer for about 110 s]
3. The naive way first: draw the wrong object and cross it out with a red cross, then give the number from the same example, then the right way. e.g. the 10-name test (10 steps vs 4, looks fine) crossed out, then 10 lakh (10 lakh vs 20). [frames: a crossed-out object (two wrong ways, a hand-written rule, a weak answer) in 4 of 6 reels within 9 to 18 s; seen: a caption shows two naive tries failing; the number is our addition, also script-style-v3 rule 11]
4. The build: 3 to 5 numbered steps, about 40 percent of the runtime (40 to 45 s of 110); one idea and one WHY ("क्योंकि ...") per step, each step's output feeding the next; a 4th or 5th step only if every step stays at or under 10 s. Kicker `STEP n/N` above 2 to 5 changing headlines per step. Say "पहला step ... दूसरा step ... तीसरा step". [frames: steps took 39 to 46 percent in the two reels with 4 and 5 numbered steps; seen: a caption is a 4-step chain of causes; owner: "flow wise"]
5. Terms and analogy: say the English term, put a 2 to 3 word chip on the object, decode it aloud in at most 5 words. At most 3 new terms (the benchmark introduces 4 to 6, each by a chip). The analogy picture goes where the abstract word first appears: inside the first 10 s when that word is the topic itself, else at the step that needs it; the analogy explains, the numbers prove. e.g. binary search = opening a dictionary in the middle. [frames: an analogy picture in 2 of 5 concept reels (two icons at 6 s; a machine from 0 s); seen: captions pair two terms with one plain noun each]
6. The screen: something new every 4 s (a headline, a row, an object), nothing still for more than 8 s. Every screen is a small kicker (series chip, section word, `STEP n/N`) above a label of 1 to 3 words, e.g. `BIG-O`, `STEP 2/3`, `BINARY O(log n)`; the spoken sentence is never printed. One new object per step, earlier objects dimmed, the running example stays. [frames: 30 to 40 headline changes per reel, the longest still headline 10 to 17 s and only while rows kept arriving every 3 s, spoken sentence never printed; design: the dimming]
7. Misconception or catch, once, at about 70 to 80 percent of the runtime: the viewer's belief, the truth in one line, the number that breaks it. e.g. binary search needs a sorted list; Big-O counts steps, not seconds. [frames: the catch at 70 to 75 percent in all 5 concept reels, a trap at 77 percent in the interview reel; seen: "catch" and "common confusion" paragraphs in three captions]
8. What it changes for the viewer, one line in his currency. e.g. `x in list` in Python is O(n): the same 10 lakh steps. [seen: money, speed and memory in two captions; frames: a cost beat shown as 3 tabs]
9. Close: a recap (6 to 12 s at most), then ONE check-yourself question that is answered by changing one number of the running example. e.g. the list becomes 40 lakh names: how many steps for binary search? (22). The answer goes in the caption under the "... more" cut. [frames: all 6 end with a recap of 6 to 12 s, an open comment question (a guess or an opinion, drawn as a chat box or bubble in 4), then a logo card of 2 to 3 s; the answerable check is design]
10. No tease, no pointer to another reel (stand-alone, rule 2). [frames: the 4 concept reels point to the interview series first, the interview reel to the next episode; we do not]
11. Human voice: second person ("तुम"), spoken connectors (अब देखो, सोचो, यहीं), first person only when true ("मैंने Python में चलाया"), no hype. [owner: "human tarike"; not heard by anyone, so my design]

## b. Beat sheet for a teaching reel, 90 to 120 s (day types from `series-style.md`)
Words are a range: 2.3 w/s is what `scripts/lint_script.py` measured (165 words = 70 s), 2.7 w/s is the owner's planning figure at pace 1.3. Until our own voice is timed on a teaching reel, write to the LOW end of the total (255 to 275 words per reel); if a take runs past 115 s, cut words, never speed up. The catch begins at 73 to 81 percent of the runtime in these sheets (benchmark frames: 70 to 77). The `STEP n/N` kicker starts with step 1.
- `concept` 110 s (253-297 w): hook and promise 10 s · naive way crossed out, with its number 14 s · answer, definition, analogy 12 s · mechanism, 3 to 5 steps 44 s · catch or misconception 12 s · what it changes for you 6 s · recap, check, follow 12 s.
- `structure` 106 s (244-286 w): surprise and promise 10 s · naive container crossed out, its cost 12 s · the memory picture, built box by box 20 s · how it works, 3 to 5 steps 30 s · cost table: access, search, insert 14 s · when not to use it, or the misconception 12 s · recap, check 8 s.
- `pattern` 106 s (244-286 w): the problem it kills, brute-force count 12 s · the signal that says use it 10 s · tiny example, 3 to 5 steps 40 s · the template in 4 lines, run, real output 22 s · the trap, when it fails 12 s · recap, check 10 s.
- `problem` 104 s (239-281 w): stake, problem in one breath (paraphrased) 10 s · naive way crossed out, its number (run) 14 s · pattern, signal, insight 18 s · code, at most 8 lines, discussed line lit, in 3 to 5 sub-steps 36 s · complexity with its number, the trap or edge case 16 s · check, follow 10 s.
- `recap` 96 s (221-259 w): the confusion 6 s · the one-screen map, 4 to 5 rows 50 s · two quick examples 28 s · check, follow 12 s.

## c. "Enough detail": a script passes only if all of these are true
1. Every term is defined at first use (English term, chip, plain decode); at most 3 new terms; nothing left as "you know".
2. One running example with real numbers: a run (code at most 8 lines, its real output on screen) or a fetched source; invented numbers carry an EXAMPLE pill and the arithmetic.
3. The wrong or naive way is shown first, crossed out, and fails with a number from the same example.
4. Every step says WHY; the mechanism has 3 to 5 numbered steps (lint_script counts the markers) and takes about 40 percent of the runtime.
5. One catch or misconception is named at about 70 to 80 percent, with its source or the word "typically".
6. One line says what it changes for the viewer; one recap line; one check-yourself question with its answer in the caption.
7. Stand-alone: no "kal", "part", "next", no pointer to another reel; someone who knows only the title can follow.
8. Tests: cover the screen and listen (can a beginner repeat the idea in two sentences?); delete any beat (if it still works, that beat was filler); every claim has a fetched URL in the queue entry.

## d. Pacing rules for the narration
1. One idea per sentence, about 14 words or fewer; never two ideas joined by "और" or "जबकि".
2. Term, pause, decode: say the English term, `|`, then the decode in at most 5 words; reuse the same word every time, no synonyms.
3. `||` after every step; a number is spoken once and shown on screen at the same instant; at most 3 numbers in any 8 s.
4. A new object every 4 s and nothing still for more than 8 s: a stretch of speech with no new picture is split or cut. Numbers follow the word after them: Hindi before a Hindi word (`10{दस} लाख`), English before an English word (`20{twenty} steps`); formulas are spoken in English; see hinglish-script.
5. Cut first: history, a second example, a third new term, a second analogy, every sentence the check question does not need, filler ("basically", "actually").
6. Read it aloud once: where you must breathe inside a sentence, split it. The Roman Hinglish form is what the owner reads on his phone.

## e. What we do differently from the benchmark account
- Length: they run 124 to 163 s [frames]; our cap is 120 s, and a script that runs long is cut with its cut-first list, never sped up. The owner decides if the cap moves.
- Stand-alone: no pointer to a sibling reel or series; they point first [frames]. Stake or question before the counter; their covers lead with a big day number [seen]; ours is a small chip.
- The close: they end recap, open comment question, logo card [frames]; we end recap, an answerable check (answer in the caption), then a short handle card, no pointer.
- Numbers are run or sourced and the EXAMPLE pill is on screen at the moment; they flag examples in the caption text [seen].
- Screen text: their headlines run 2 to 7 words and one definition card about 10 words, with no subtitles in any reel [frames]; ours are 1 to 3 word labels (rule 14) plus our own word-by-word captions (clean-reel). Our flat navy and gold look, no 3D scenes, no copied layout or colours.
- Caption: `Day N/150:` first line, 3 hashtags, one ask; theirs ran about 250 words and 11 tags [seen]. Depth over count: 3 to 5 steps taught well; their captions list up to 9 points [seen].

## f. When a topic cannot be taught properly in about 2 minutes
Split it into two stand-alone days (no "part 2" in any script; each title names its sub-idea) when ANY of these holds: more than 3 new terms are needed; the mechanism needs more than 5 steps, or its steps cannot stay at or under 10 s each; two running examples are needed outside the catch; the code is longer than 8 lines; the beat sheet is over 120 s after the cuts of section d; the check question needs the second half. Most days stay one day.
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
