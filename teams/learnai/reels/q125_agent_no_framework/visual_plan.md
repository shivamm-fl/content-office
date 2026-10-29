# Visual plan: q125 agent without a framework (the three things you write yourself)

Idea in one line: an agent without a framework is a loop, a tool table and a stop rule, about 10 lines of code you can read.
The picture that explains it with the sound off: a locked FRAMEWORK box opens and the real 10 lines of code come out; the same code card comes back three times with the loop, the tool table and the stop rule lit in their own colours (cyan, gold, red).

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | framework installed, loop not understood | Big locked FRAMEWORK box under the hook text, a red question mark pops over it when the loop is named | FRAMEWORK, LOOP ? | custom glass + lock icon |
| B | interviewer asks: no framework, what do you need | INTERVIEW QUESTION pill, the FRAMEWORK box dims with a red NO FRAMEWORK stamp, three empty dashed slots with ? pop in | INTERVIEW QUESTION, NO FRAMEWORK, ? | custom |
| C | answer: loop, tool table, stop rule | The three slots fill in with colour cards: 1 LOOP cyan, 2 TOOL TABLE gold, 3 STOP RULE red, then a ONE BY ONE pill | 1 LOOP, 2 TOOL TABLE, 3 STOP RULE | cards |
| D | agent = model + tools; the framework box is not needed; stub run, 10 lines | MODEL box and arrow to TOOLS gear (AGENT pill); a FRAMEWORK box with NEEDED? that fades open; EXAMPLE and STUB MODEL pills, the real 10-line code card, a question bubble, turn 1 CALL get_weather then 31 C, clear and turn 2 FINISH rows with code lines lighting on the words; 10 LINES stamp | AGENT, MODEL, TOOLS, NEEDED?, EXAMPLE, STUB MODEL, TURN 1, TURN 2, 10 LINES | custom code card + rows |
| E | step 1, the loop | Cyan cycle MODEL, TOOL, RESULT spins once, chips NEED TOOL / DONE, the code card with the loop lines lit | 1 LOOP, MODEL, TOOL, RESULT, NEED TOOL, DONE | M.loop + code card |
| F | step 2, tool table; model only asks a name, your code runs it | MODEL box emits a get_weather chip, a gold TOOL TABLE with name to function row, YOUR CODE box RUNS IT, TEXT ONLY stamp on the model, code card with the table line lit | 2 TOOL TABLE, MODEL, get_weather, YOUR CODE, TEXT ONLY | custom + code card |
| G | step 3, stop rule; final answer or max 5 turns; without it never ends | Three bands of turn tiles: a green FINAL ANSWER tile on turn 2, five tiles with a red STOP on 5, a red infinity arrow NO STOP, the code card with stop lines lit | 3 STOP RULE, FINAL ANSWER, MAX 5, 1 TURN = 1 CALL, NO STOP | tiles + code card |
| H | what to say in the interview | Six stacked boxes light on their words: CALL MODEL, RUN TOOL, FEED BACK, STOP RULE, DIRECT API FIRST (source Anthropic), FRAMEWORK LATER | SAY THIS, the six boxes, SOURCE: ANTHROPIC | M.box |
| I | who wrote your loop; comment; follow | Question tag WHO WROTE IT?, YOU and FRAMEWORK pills, a COMMENT card with SELF and FRAMEWORK, FOLLOW button presses | WHO WROTE IT?, YOU, FRAMEWORK, COMMENT, FOLLOW | custom |
