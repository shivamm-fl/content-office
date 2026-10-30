# Visual plan: d010 Recursion and the call stack (script: state/scripts/d010.txt)

Idea in one line: a recursive call keeps one frame on the call stack until it returns; no base case or too much depth ends in RecursionError.
One stack of six frames fact(5) to fact(0) is drawn in D, reused in E (names the parts) and F (pops as values return); G redraws it without a base case.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | Labels | Built with |
|---|---|---|---|---|
| A | hook: RecursionError | Six frames fact(n) stack up inside a CALL STACK panel, a dashed red LIMIT line, the top two frames turn red and OVERFLOW lands | LIMIT, OVERFLOW | custom frame tiles |
| B | calls itself on smaller input, base case | Chain f(5) down to f(0), each tile narrower with a ↓ n − 1 arrow between, the last tile f(0) turns green and a return 1 chip leaves it | SMALLER INPUT, NO MORE CALLS, return 1 | tiles |
| C | factorial code | Real fact code in big lines; the recursive line lights gold with a CALLS ITSELF tile, then the n == 0 lines light green with a STOPS, RETURNS 1 tile | CALLS ITSELF, STOPS | code lines + tiles |
| D | fact(5) makes 6 calls | Six dashed slots fill with frames fact(5) up to fact(0) one per spoken call, a CALLS counter counts to 6, fact(0) is ringed, the other five dim with a 5 WAITING counter | CALLS, WAITING | frame tiles + counter |
| E | call stack, frame, push, pop, depth 6 | The stack beside a zoomed frame card (fact(3), n = 3, ARGS + LOCALS); PUSH rings the top frame, POP lifts it off and back, DEPTH counter to 6 | PUSH, POP, DEPTH | frame tiles + counter |
| F | returns pop frames | fact(0) shows its return 1 and its frame slides off, then 1, 2, 6, 24 pop in turn while a RETURNED column builds, last chip 120 and an OUTPUT 120 stamp | RETURNED, OUTPUT 120 | frame tiles + chips |
| G | no base case | The code with the n == 0 line crossed out, frames fact(5) down to fact(-2) pile up past the dashed LIMIT line, red stamp RecursionError | LIMIT, RecursionError | code lines + frame tiles |
| H | limit about 1000, total(10000), loop | Two columns: RECURSION frames pile past a red LIMIT 1,000 line, 10,000 DEEP, RecursionError tile; LOOP column with one 1 FRAME tile and 50,005,000 | LIMIT, 1 FRAME | tiles |
| I | two ingredients, depth n, loop | BASE CASE and SMALLER tiles; a tall stack of frames with a bracket n FRAMES beside a single frame 1 FRAME; VERY DEEP then LOOP | DEPTH n, LOOP | tiles |
| J | quiz fact(3), comment, follow | A stack of six empty ? slots with the bottom fact(3) filled, MAX FRAMES? tile, comment box, FOLLOW pill | QUIZ, COMMENT KARO | tiles + pill |
