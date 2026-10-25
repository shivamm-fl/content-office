# Visual plan: q117 Prompt vs context engineering

Idea in one line: the prompt is only the instruction words; the context is everything the model sees, and a refund answer is wrong until the order data is in the context.
The picture that explains it with the sound off: a small PROMPT card next to a big CONTEXT window of labelled cards. A support bot answers a refund question wrongly; a dial turned 10 times changes nothing; the answer turns right only when ORDER DATA and POLICY cards enter the window; old chat cards are thrown in a bin.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | Interviewer asks the difference | Hook "Prompt vs Context?" over two things: one small PROMPT card and one big CONTEXT window holding four small cards; each gets a ring on its spoken word | PROMPT, CONTEXT, RULES, DOCS, TOOLS, CHAT | custom + M.box |
| B | Your answer: words vs everything the model sees | The PROMPT card appears alone; then a big frame MODEL SEES grows around it and DOCS, TOOL RESULT, HISTORY, RULES cards fill in beside it; three step pills at the end | YOUR ANSWER, PROMPT, WORDS, MODEL SEES, 1 PROMPT, 2 CONTEXT, 3 TRIM | custom |
| C | Refund bot answers wrong, rewording x10 does not help | Customer bubble, INSTRUCTION card feeds the BOT, a wrong red answer bubble; a gear dial spins while a counter runs to x10 and the answer stays red; then an empty dashed ORDER DATA card with a question mark | EXAMPLE, INSTRUCTION, BOT, GUESS, REWORD, ORDER DATA, NO INFO | custom + M.box |
| D | Step 1: prompt = role and format | One PROMPT card with a ROLE row and a FORMAT row filling in, arrow into the bot, stamp WHAT TO DO | STEP 1, PROMPT, ROLE, FORMAT, WHAT TO DO | custom |
| E | Step 2: context = what the model sees | A CONTEXT window fills with five cards (RULES, ORDER DATA, POLICY, TOOL RESULT, LAST 2 MESSAGES); the same question below goes through and the answer card turns green | STEP 2, CONTEXT, five card labels, REFUND?, RIGHT | custom |
| F | Step 3: remove what does not help | Window with 3 kept cards and 3 grey OLD CHAT cards; a LIMIT line; old cards turn red and slide into a bin; kept cards turn green | STEP 3, CONTEXT WINDOW, LIMIT, OLD CHAT, KEEP | custom |
| G | Boundary: info is there, format is wrong | ORDER DATA card marked IN, answer card with ragged red lines; the FIX PROMPT pill and the lines become tidy green | BOUNDARY, ORDER DATA IN, WRONG FORMAT, FIX PROMPT | custom |
| H | Interview line in English | Three rows light one by one: PROMPT = WORDS, CONTEXT = EVERYTHING SEEN, NO INFO = REWORD does not fix | SAY THIS, PROMPT, CONTEXT, NO INFO | M.box |
| I | Comment prompt or context, follow | Question tag, two outline pills, a comment box whose options pop on spoken words, follow button presses | WRONG ANSWER?, PROMPT, CONTEXT, COMMENT, + FOLLOW | custom |
