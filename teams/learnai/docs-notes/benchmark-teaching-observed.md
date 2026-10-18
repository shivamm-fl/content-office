# Benchmark teaching, observed on screen (2026-10-18)

Format and craft only (CLAUDE.md rule 15). Nothing of the benchmark account's wording, examples, numbers, visuals or topics is copied here; reels are named R1 to R6 on purpose. No video, audio or transcript was saved. Tags: [seen] frames I looked at; [count] measured from frames; [not seen] not observable without sound.

## What I could and could not observe, and how
- Plugin browser (logged in, Chrome 155): an H.264+AAC test file I made played there (clock advanced), and it reports H.264, VP9, Opus and MSE as supported. So the codec is NOT why the reels stayed on one frame. The reel page, the /embed/ page and the reels viewer showed one frame, pixel-identical in two screenshots 77 s apart; one click on the video changed nothing. The player has only a mute button (no CC). Cause inside Instagram's player in that browser: not isolated.
- Python Playwright + installed Google Chrome, fresh logged-out profile, never logged in: after closing the sign-up popup with its X, the video buffered and played (720x1280, length read from the player). I paused it, jumped to every whole second and took element screenshots (frames only, in memory; contact sheets deleted after reading). 6 reels, 1 page load each, about 13 Instagram loads in total.
- Captions: no text track in any of the 6 reels, no CC control, and NO burned-in subtitles on screen [seen]. So no spoken words, no words per minute, no pauses [not seen]. I did not touch the audio.
- Seen per reel: all 1-s frames diffed (full-frame jumps), every 3rd second read as a contact sheet (a change shorter than 3 s can be missed; for R6 only 4 of 7 sheets were read, so its counts are estimates).

## Per-reel table (R1 to R5 are LLM Concepts, R6 is an LLM Interview reel)
| R | Day, kind | Length | Full-frame jumps | Headline changes | First 10 s on screen | Steps | Analogy picture | Catch at | Close |
|---|---|---|---|---|---|---|---|---|---|
| R1 | D002 basics | 124 s | 10 | 14 title screens, a row or object added every ~3 s | 5-word question, typed example, 3-box flow; two wrong ways get a red cross at 9 and 12 s | numbered 1-2-3 only for "why care" (64-93 s) | none | 75% | recap 7 s, pointer 5 s, comment 7 s, logo 2 s |
| R2 | D004 cost | 163 s | 35 | about 40 (one per 4 s) | two counters running, no words until 9 s | STEP 1-4 (39-102 s, 39%) | coins, animal icons | 72% | recap 12 s, pointer, comment, logo (13 s) |
| R3 | D003 two look-alike numbers | 149 s | 23 | about 30 | one huge number from frame 0, no words until 9 s | named sections, not numbered | two icons at 6 s (dictionary, page) | 70% | recap 11 s, pointer, comment with chat box (14 s) |
| R4 | D001 how X is built, flat | 142 s | 17 | about 38 (one per 3.7 s) | 5-word question, example, flow with real IDs; hand-written rules crossed out at 12 s | STEP 1-5 (21-87 s, 46%) | none | 74% | recap, pointer 7 s, comment, logo (13 s) |
| R5 | same script as R4, 3D | 142 s | 29 | same as R4 | same text over a 3D workshop from frame 0 | same | physical machine | 74% | same |
| R6 | LLM Interview 001 | 154 s | 20 | about 40 (est.) | 5-word headline, one example cut three ways, "weak answer" at 12-18 s | one section per method, no numbers | none | trap at 77% | next-episode pointer, comment, logo (10 s) |
- Views on the grid when I looked: R1 12k (newest), R2 7.3k, R3 3.2k, R4 5.6k, R5 7.1k. R4 and R5 are one script in two looks; the 3D one has more views but was posted a day earlier, so no proof either way.

## Other things seen [seen]
- Every screen is: a small kicker label (series chip, then a section word, then "STEP n" or similar) above a headline of 2 to 7 words; the biggest text block is one 10-word definition card. The spoken sentence is never printed.
- Headlines are plain English; Hindi shows mainly as sample data inside diagrams (one Devanagari label seen, in R4). Brand card for 2 to 3 s at the end: logo, site, "follow" line.
- R2 shows a source page inside a browser-window frame with its address for about 20 s before the mechanism (a proof-first card). R4 and R5 use hand-writing on a note; the cost beat uses 3 tabs (bill, speed, context).
- All 6 reels sit at 124 to 163 s (median 146 s); none is under 120 s.

## What I would change or confirm in teaching-flow.md
1. Evidence block (line 9): CHANGE. Say the reels do play (logged-out Chrome via Playwright), then list what is still unseen: voice, pace, pauses, spoken hook. Add the new facts: 124 to 163 s, 10 to 14 s of each reel is close (pointer, comment question, logo card). CONFIRM our 120 s cap is shorter than his; the owner decides if it moves.
2. a.1 first 10 s: CHANGE. His first 10 s show a headline of at most 5 words (or no words for 6 to 9 s over a number), the running object already on screen, and the wrong way or the contrast by 12 s. No step count is on screen in the first 10 s of any reel; "STEP n" appears as a kicker only when step 1 starts. Keep our spoken promise and add the on-screen kicker "STEP 1/3" from step 1.
3. a.2 running example: CONFIRM with a note. R4 uses 3 examples in 142 s and still reads as one flow because the same objects (tiles, rows, bars) come back. Our one-example rule is safer for 108 s; allow a second example only inside the catch beat.
4. a.3 naive way first: CHANGE the picture, keep our number. He shows it in 4 of 6 reels within 9 to 18 s as a crossed-out object with a red cross (two wrong ways, a hand-written rule, a weak answer) before any number. Add "red cross object, then the right way" to the beat.
5. a.4 and section b mechanism: CHANGE. Numbered kicker above 2 to 5 changing headlines per step; 4 and 5 steps in the two step reels, steps = 39 to 46% of the runtime. Ours is 3 steps = 33%. Raise the mechanism share to about 40% (40 to 45 s of 108) and allow a 4th step only if each step stays at or under 10 s.
6. a.6 and d.4 cadence: CHANGE. Something new on screen (headline, row, object) every 3.5 to 5 s, 30 to 40 headline changes per reel; the longest still headline was 10 to 17 s and only while rows kept arriving every 3 s. Replace "sub-beat at most 12 s" with "new object every 4 s, nothing still for more than 8 s".
7. a.5 terms and analogy: CONFIRM, with additions. He introduces 4 to 6 terms per reel, each defined by a 2 to 3 word chip on the object, not a sentence; an analogy picture exists in 2 of 5 concept reels (two icons at 6 s, a machine from 0 s). Keep our 3-term limit; define by chip; put the analogy inside the first 10 s when there is one. Also note: no subtitles in any reel, so our word-by-word captions are our own clean-reel choice.
8. a.7, a.9, a.10 and e: CONFIRM. The catch sits at 70 to 75% of the runtime in all 5 concept reels (R4 and R5 are one script); R6's trap at 77% (our beat sheet: 70 to 81%). All 6 end recap (6 to 12 s), open comment question (a guess or opinion, shown in a chat box or bubble in 4), brand card; all 4 concept scripts point to the interview series first. We differ on purpose: stand-alone, answerable check, no pointer.

## Still unobserved (a transcript or the owner's ears would settle it)
Voice and tone, speaking speed, pauses between sentences, how much of each headline the voice actually reads, the spoken hook words, whether a spoken analogy exists where no picture shows one, and whether the narration says the step count that the screen does not.
