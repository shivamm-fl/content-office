# Interview reels (q##): taught as a series (owner decision 2026-10-19)

Owner, 2026-10-19: from now LearnAI posts 3 reels a day, one series day (a###) and two interview reels (q##); the course (r##) and generic (e##) tracks are retired for now. The interview reels get the quality, the teaching, the flow and the explanations of the series days, and they are planned as a series (an ordered ladder, `roadmap/interview-series-draft.json`), not as random questions. **The hooks stay exactly as they are**: the types that run today (`relatable_stake`, `interviewer_asked`, `company_specific`) rotate as before and the daily experiment of the work day stays (hook-writer, CLAUDE.md rule 4). Nothing about hooks changes here.

## What was wrong (our own scripts, 2026-10-17 and 18)
`state/scripts/q101.txt`, `q102.txt`: 80 spoken words in Devanagari, about 140 words in Roman form, about 60 seconds. They read as a list of rules ("पहला rule ... दूसरा rule ...") with no example the viewer can follow, terms said but not explained (RAG, chunking, retrieval, prompt caching), source-talk in the voice ("Anthropic कहता है ..."), no WHY per step and no sentence the viewer can say in an interview. The owner's words of 2026-10-18: "viewer ko samajh toh aaye, kuch value toh de"; of 2026-10-19: "wo kitna achhe aur human tarike se sikhata hai, slowly flow wise detail mai".

## Length
The 60-second target of 2026-10-18 is retired for q: **90 to 120 seconds, about 230 to 300 spoken words** (2.4 to 2.7 words per second, a take of the owner's Flash voice at tempo 0.9 runs about 2.7). Clarity beats brevity, a reel is never padded to reach a length and never rushed to stay under one; the gate allows up to 180 s. A script that runs long is cut with its cut-first list, never sped up. (An owner decision may move this range: the owner's own words win.)

## The shape of one interview episode
Every episode has the same seven beats, so the series feels like one course taught by one person. Seconds are for about 110 s.
1. **Hook, 0 to 8 s** (unchanged). The type of the item: stake, "Interviewer ने पूछा: <one complete question>", or a company question. One idea, understood in the first second.
2. **The answer first, 8 to 18 s.** Straight after the hook, the way a person says it: "तुम्हारा जवाब होना चाहिए: <one sentence>। तीन बातें हैं, एक-एक करके देखते हैं।" No label like "सीधा जवाब", no definition and no rhetorical question in between (company rule 8, owner's correction of 2026-10-19). If the answer needs an analogy first, the analogy is the first teaching line.
3. **The obvious answer fails, shown, 18 to 38 s.** A concrete scenario with a real number: what happens when you do the tempting thing. Show the example first, name the thing after ("Weight zero था, prediction zero, obviously गलत। ये है forward pass"). One short human reaction is fine; a staged "बिल्कुल नहीं!" is not.
4. **The technique, 3 numbered steps, 38 to 80 s.** "पहला step, दूसरा step, तीसरा step". Each step grows out of the question the viewer is asking at that moment (a bridge, never a list), says WHY ("क्योंकि ..."), and after every number says what it means in one plain sentence. Each term is explained at its first use in one clause (term, "यानी", plain meaning); a term you cannot explain in the time you have is not said, and not put on screen either (hinglish-script, "Say a technical term only if the reel explains it").
5. **The boundary a senior knows, 80 to 98 s.** When the answer changes, with a number or the word "typically". One boundary, not three.
6. **Say it in the interview, 98 to 110 s.** The two-sentence answer in the candidate's own words. This is the value of the reel: the viewer can repeat it tomorrow. It is also the recap, so there is no second summary.
7. **Close, 110 to 120 s.** An easy comment question the viewer answers with one word or a number, then a follow line that says what the follower gets ("रोज़ एक नया interview सवाल, पूरे जवाब के साथ")। No pointer to another reel (stand-alone, CLAUDE.md rule 2), no "save kar lo".

## A script passes only if all of these are true
1. The reel answers the question its hook asks, and the answer is said by about 18 s and proved by the end.
2. A real example with real numbers: a run (code of at most 8 lines, its real output on screen) or a number from a page fetched in this session; an invented number says "मान लो" and carries the EXAMPLE pill. The numbers that appear on screen are in the queue entry with their source.
3. The tempting answer is shown first and fails with a number from the same example.
4. Every step has its WHY, every new term its one-clause explanation, every number its meaning sentence; no vague words ("काफ़ी", "बहुत") where the number exists.
5. One boundary, named at about 70 to 85 percent of the runtime.
6. The "say it in the interview" sentence exists and can be spoken in 10 seconds.
7. Stand-alone: someone who knows only the title can follow; no "kal", "part", "next", no pointer.
8. Voice rules of hinglish-script: no source-talk in the lines (the URLs live in the queue entry), the number-language rule (the next word decides), formulas in English words, no dashes, humanizer pass (no staged openers, no one-line closers, no triads for show).
9. Tests: cover the screen and listen (can a beginner repeat the answer in two sentences?); delete any beat (if it still works, that beat was filler); read it aloud once and split every sentence where you must breathe.

## Pictures
The same style as the series (clean-reel, `diagram-first-visuals.md`): draw the real artifact (the chat that answers wrong, the policy line, the database row, the prompt with its token count), one new object every 4 s, labels of 1 to 3 words, the spoken sentence never printed, the step kicker `STEP n/3` from step 1 on, the running example on screen to the end.

## Planning the series
- The ladder is `roadmap/interview-series-draft.json`: questions in a teaching order, grouped in arcs, each linked to a course unit, none repeating a question already published (ai-course q01 to q26) or built (q101 to q104). It is a draft until the owner approves it; the work day uses it in order, and anything the owner changes there wins.
- Each day the strategist takes the next two `todo` questions of the ladder, the researcher verifies every source and runs any code, and the entry goes to `state/queue.json` with the next office id (q105 and up), `unit`, `hook_type`, `trap` and `sources`. Hook types rotate as before (the one used least among the last six q##); the day's experiment may ride on one of the two.
- Facts, safety and the owner's final approval are unchanged.
