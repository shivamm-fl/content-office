# Teaching flow: how a day is taught (owner decision 2026-10-18)

Owner, in Hinglish: "wo kitna achhe aur human tarike se sikhata hai, slowly flow wise detail mai ... 2 min lambi reel bhi chalegi, lekin jo sikha rahe wo proper sikhne hona chahiye." So every teaching day TEACHES: 90 to 120 s, clarity beats brevity. This note is the craft. Day types: `roadmap/series-150-draft.json` (day types in its `rules`; there is no `series-style.md` for this floor yet). Spoken format: `.claude/skills/hinglish-script`; hooks: `hook-writer`; a worked proof: `pilot-script-day2.md`. Format and craft only (CLAUDE.md rule 16): nothing of another account's scripts, wording, examples, visuals or topic list is used here.

## Evidence: what I could and could not observe (2026-10-18)
- Tags: [seen] observed on the benchmark account's public pages; [owner] the owner's description; [design] ours, untested.
- Seen: the profile (28 posts, 7,472 followers), its Reels tab (16 reels over about 5 days in four series chips, LLM Concepts, LLM Interview, System Design Concepts, System Design Interview, plus two one-off reels), 5 teaching-reel pages with their full captions, the first frame of one, and 3 public written tutorials by the same creator (structure only). Older notes: `laxmikant-benchmark.md` of 2026-10-14 (private ai-course repo).
- Numbers: the 6 LLM Concepts reels sit at 3.2k to 10.5k views (likes 1.4 to 2.8 percent of views on the 4 I opened); the non-series reels on the same profile (a train-ticket booking reel and two one-off reels) reached 69k to 175k. Teaching depth is steady, not viral: it is how people learn, the hook still decides reach.
- NOT observed: the reels do not play in the headless browser (a poster frame with a play button; clicks did nothing). I did not hear or see any teaching: no voice, pace, pauses, spoken hook, on-screen timing or reel length. The creator's YouTube pages gave only the channel name and no transcript was found. The spoken flow below is inferred from the captions (each lists the steps in order), the written tutorials and the owner's description.

## a. Principles of slow, flow-wise teaching (in the order the viewer hears them)
1. First 10 s: the question and the promise. The floor's hook (first line at most 10 words), one line of answer, then "तीन steps में समझाता हूँ।" [seen: every caption opens on a situation and one question and names the step count; hook rules stay]
2. One running example, on screen from frame 0, real numbers, until the last second. e.g. 10,000 support tickets of a food app (EXAMPLE) handed to three roles. Run it or source it; invented numbers wear an EXAMPLE pill. [seen: the first frame holds the example input; captions reuse one example]
3. The naive way first, failing with one number from that example. e.g. "same thing, different name": one pile of tickets gives a chart, a model service and a chatbot. [seen: a caption shows two naive tries failing before the fix; also script-style-v3 rule 11]
4. Then the build in numbered steps: one idea and one WHY ("क्योंकि ...") per step, each step's output feeding the next. Say "पहला step ... दूसरा step ... तीसरा step". [seen: a caption is a 4-step chain of causes; owner: "flow wise"]
5. Terms and analogy: say the English term, decode it in at most 5 words, put ONE analogy exactly where the abstract word first appears, then return to the numbers (the analogy explains, the numbers prove). e.g. API = the door to a ready-made model; production = in front of real users. At most 3 new terms. [seen: two terms, one plain pair of nouns each; design: the analogy slot]
6. The picture changes only when the idea changes: one new object per step, earlier objects dimmed, the running example never leaves. [design, from diagram-first-visuals.md]
7. Misconception or catch, once, after the mechanism: the viewer's belief, the truth in one line, the number that breaks it. e.g. a source says an AI engineer may also fine-tune: read the work, not the title. [seen: "catch" and "common confusion" paragraphs in three captions]
8. What it changes for the viewer, one line in his currency. e.g. read a job post for what is produced: an insight, a running model or a product. [seen: money, speed and memory in two captions]
9. Close: one-line recap, then ONE check-yourself question that is answered by changing one number of the running example. e.g. who reads 10,000 tickets to find the top complaint? (the data scientist). The answer goes in the caption under the "... more" cut. [seen: a one-line recap before the ask; design: the answerable check]
10. No tease, no pointer to another reel (stand-alone, rule 2). [seen: they end by pointing to a sibling reel; we do not]
11. Human voice: second person ("तुम"), spoken connectors (अब देखो, सोचो, यहीं), first person only when true ("मैंने Python में चलाया"), no hype. [owner: "human tarike"; not heard, so my design]

## b. Beat sheet for a teaching reel, 90 to 120 s (day types from the draft roadmap)
Words are a range: 2.3 w/s is what `scripts/lint_script.py` measured (165 words = 70 s), 2.7 w/s is the owner's planning figure at pace 1.3. Until our own voice is timed on a teaching reel, write to the LOW end of the total (255 to 275 words per reel); if a take runs past 115 s, cut words, never speed up.
- `concept` 108 s (248-292 w): hook and promise 10 s · naive way fails, with its number 16 s · answer, definition, analogy 14 s · mechanism in 3 steps 36 s · catch or misconception 12 s · what it changes for you 8 s · recap, check, follow 12 s.
- `structure` 104 s (239-281 w): surprise and promise 10 s · the whole picture, 3 to 4 parts named 14 s · each part, one step on the running input 36 s · how the parts connect, one input end to end 18 s · catch 14 s · recap, check 12 s.
- `pattern` 104 s (239-281 w): failure without it, a real prompt and output 14 s · the signal that says use it 10 s · the pattern in 3 steps 34 s · before and after on the same input 20 s · catch: the cost 14 s · recap, check 12 s.
- `demo` 104 s (239-281 w): what we watch: the input 8 s · run 1, real output 20 s · change one thing, run 2, real output 20 s · why it changed 26 s · catch 14 s · recap, check 16 s.
- `myth-bust` 100 s (230-270 w): the belief, as the viewer's own 10 s · why it feels true 12 s · the number or test that breaks it 24 s · the true mechanism in 2 to 3 steps 28 s · where the myth is partly right 14 s · check 12 s.
- `trade-off` 100 s (230-270 w): the tempting wrong answer 10 s · option A on the running example 24 s · option B on the same example 24 s · the axis that decides 16 s · rule of thumb, when each wins 14 s · check, follow 12 s.
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
Roadmap effect (a proposal, the roadmap file is NOT edited): a split day becomes two days with their own titles (N-1, N-2), so the series grows from 150 to 158 days with the 8 splits below, or the owner drops thin days to stay at 150. Cover counter, caption and ids follow the owner's choice. CLAUDE.md rule 5 (20 to 120 s) already allows these lengths; no change was made to it.

| Day | Title | Why it does not fit | Proposed split |
|---|---|---|---|
| 5 | How a model learns: guess, measure the error, adjust | three ideas: prediction, loss, update | 5a guess and measure the error; 5b adjust the weights |
| 13 | The transformer | embeddings, attention, feed-forward and stacking in one reel | 13a text to vectors to layers; 13b what one layer does |
| 14 | Attention | the scores and the weighted mix are two steps of thought | 14a the scores: who looks at whom; 14b mixing words by those scores |
| 65 | The whole RAG pipeline, end to end | index time and query time are two flows | 65a building the index; 65b answering one question |
| 79 | Building an MCP server, step by step | code, run and connect do not fit in 8 lines | 79a define a tool; 79b run it and connect a client |
| 94 | Coding agents: read, edit and test | a loop, tools and test feedback | 94a the read and edit loop; 94b run tests and recover |
| 131 | Image generation: from noise to picture | adding noise and removing it with a prompt | 131a how noise is added; 131b how it is removed, steered by text |
| 138 | LoRA | the small-update idea plus the memory arithmetic | 138a the idea of a small update; 138b why it saves memory, with numbers |
