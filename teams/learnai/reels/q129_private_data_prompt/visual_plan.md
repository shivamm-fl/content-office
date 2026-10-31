# Visual plan: q129 private data in an LLM prompt

Idea in one line: do not send raw personal data; send less, mask the rest, check terms, keep raw text out of logs.
Picture: one invented support ticket (name, phone, email, issue) that goes toward a model box, and the same ticket is cut down, masked and logged safely.

| Scene | Spoken (short) | The picture | Labels | Built with |
|---|---|---|---|---|
| A | OpenAI API data se train nahi karta. Private data safe? | Ticket card with three personal rows turning red, arrow down to an OPENAI API box | SUPPORT TICKET, OPENAI API | custom ticket + M.box |
| B | Interview question; answer in one line | Same ticket, red NOT RAW stamp at the model, issue row green, personal rows amber | INTERVIEW QUESTION, NOT RAW, 3 STEPS | ticket + stamp |
| C | Train nahi = rakhta nahi nahi; logs 30 din | API box, green TRAINING: NO card, KEPT? turns ABUSE LOGS red, 30 tiles fill | TRAINING: NO, ABUSE LOGS, UP TO 30 DAYS, Source: OpenAI docs | M.box + 30 tiles |
| D | Invented ticket, task = complaint type | Ticket rows get PERSONAL tags on spoken words, task box below | EXAMPLE, PERSONAL, TASK: COMPLAINT TYPE | ticket |
| E | Step 1 minimise | Three personal rows slide out with NOT SENT, only the issue row goes to the model | 1 SEND LESS, NOT SENT, NOT SENT = NO LEAK | ticket + tweens |
| F | Step 2 mask | Phone and email become [PHONE] [EMAIL] chips, 2/3 counter, name flagged MISSED, Presidio box with NOT ALL | 2 MASK, PATTERN MATCH, 2 / 3 MASKED, MISSED, PRESIDIO TOOL, NOT ALL | ticket + chips |
| G | Step 3 terms and logs | Terms doc box, HOW MANY DAYS?, logs db with raw row greyed and masked row green | PROVIDER TERMS, YOUR LOGS, LOG = DATA STORE | M.box + rows |
| H | Not legal advice | Warning box over two boxes: law, contract | NOT LEGAL ADVICE, YOUR LAW, YOUR CONTRACT | M.box |
| I | Say this in interview | Five boxes light up on their spoken words | NO RAW BY DEFAULT ... NO RAW LOGS | M.box + glow ring |
| J | Comment + follow | Comment card with NAME PHONE EMAIL chips, follow pill presses | WHICH DATA?, COMMENT, + FOLLOW | custom |
