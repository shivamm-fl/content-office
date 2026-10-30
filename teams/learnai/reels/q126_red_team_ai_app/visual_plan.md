# Visual plan: q126 how to red-team an AI app

Idea in one line: red-teaming is attacking your own AI app before users do, as a loop of list, attack, record, fix, rerun.
The picture that explains it with the sound off: a bad user hits a support bot whose guard only blocks one word; 3 friendly prompts pass, 3 of 6 attack prompts leak the hidden code; then the five-step loop.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with |
|---|---|---|---|---|
| A | Microsoft tests its AI by breaking it since 2018 | YOUR AI APP chat box, a red arrow from an ATTACK box hits it, MICROSOFT 2018 pill, Source label | MICROSOFT 2018, YOUR AI APP, ATTACK | M.box, M.arrow |
| B | interviewer asks how to red-team before release | Vertical pipeline BUILD, RED-TEAM ? (gold, the gap), RELEASE with arrows | INTERVIEW QUESTION, BUILD, RED-TEAM ?, RELEASE | M.box |
| C | answer: list, attack, rerun; three steps | Three cards 1 LIST cyan, 2 ATTACK red, 3 RERUN gold light on their words, 3 STEPS pill | 1 LIST, 2 ATTACK, 3 RERUN | cards |
| D | stub support bot, hidden code, guard blocks only secret; 3 friendly 0 leak; 6 attacks 3 leak | USER turns BAD USER, arrow into SUPPORT BOT holding HIDDEN PROMPT with Refund code and a GUARD BLOCKS secret; then a FRIENDLY card with 3 ticks LEAK 0/3 and an ATTACKS card of 6 rows where 3 flip red LEAK and 3 stay BLOCKED, LEAK 3/6 | EXAMPLE, SUPPORT BOT, HIDDEN PROMPT, GUARD, FRIENDLY, ATTACKS, LEAK | custom |
| E | step 1 list; hidden prompt leak and prompt injection; no list means blind spots | WHAT CAN GO WRONG card with two red rows; USER TEXT arrow into APP RULES stamped FORGOTTEN; NO LIST and BLIND SPOTS stamp | 1 LIST, USER TEXT, APP RULES, FORGOTTEN, BLIND SPOTS | custom |
| F | step 2 attack, record every output; Ignore and Repeat leak; guard waits for secret | Six-row PROMPT / OUTPUT log with REF-4821 in red for 3 rows and Sorry in green for 3; GUARD WAITS FOR secret; red bar and NOT IN THESE 3 stamp | 2 ATTACK, PROMPT, OUTPUT, GUARD | custom |
| G | step 3 fix, rerun the same list; a fix can break elsewhere | FIX box, arrow to SAME LIST card of six numbered tiles that turn green one by one, tile 5 turns red BREAKS HERE, ONLY RERUN SHOWS | 3 FIX + RERUN, SAME LIST, BREAKS HERE | custom |
| H | boundary: red-team is not measurement; 3 of 6 broke, not half the app | RED-TEAM FINDS HOLES not-equal MEASURE HOW OFTEN; EXAMPLE six tiles, three red; 3 OF 6, NOT HALF THE APP, REAL HOLES | BOUNDARY, RED-TEAM, MEASURE, 3 OF 6 | custom |
| I | say it in the interview | Five-node loop LIST, ATTACK, RECORD, FIX, RERUN lighting on the spoken words, one lap on rerun | SAY THIS, RED-TEAM, five node names | M.loop |
| J | first attack, leak or injection? comment; follow | FIRST ATTACK? with LEAK and INJECTION pills, COMMENT card, FOLLOW button presses | FIRST ATTACK?, COMMENT, FOLLOW | custom |

FIX 2026-10-30: pictures enlarged (labels 40 px and up); scene D counts shown as big tiles (3 friendly ticks, 6 attack tiles flipping to LEAK or BLOCKED) instead of small rows.
