# Visual plan: q121 agent loop (think, act, observe)

Idea in one line: an agent is a loop where the model asks for a tool call, the app runs it, the result goes back, until done or a turn limit stops it.
The picture that explains it with the sound off: a MODEL box and a YOUR APP box with a call card going down and a result card coming back up, then the same three steps turning as a ring with a TURN counter and a STOP sign at turn 5.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | Interviewer asks: agent loop? | Ring of three pills (THINK, ACT, OBSERVE) drawn under the hook, a white dot runs once round it | THINK, ACT, OBSERVE | M.loop + hook |
| B | the answer: model asks, app runs, result back, repeat | MODEL box on top, YOUR APP box below; a TOOL CALL arrow goes down, a RESULT arrow comes back up on the other side; DONE pill at the end | MODEL, YOUR APP, TOOL CALL, RESULT, DONE | custom boxes + M.arrow |
| C | one call, no database, wrong guess | USER chat bubble goes into MODEL; a crossed-out database icon beside it; answer bubble with a guess turns red; stamp 1 CALL, WRONG | ORDER A17?, GUESS, 1 CALL | chat bubbles + M.icon cross |
| D | step 1 think | Goal card WHERE IS A17? drops into a big THINK box; a thought line "need status" appears; step strip with THINK lit | THINK, GOAL, EXAMPLE | glass cards + step strip |
| E | step 2 act: model only asks, app runs | Code card lookup_order('A17') leaves MODEL, a red cross shows MODEL cannot run it, the card lands in YOUR APP, which runs the TOOL (database) and a result card comes back | ACT, MODEL, YOUR APP, TOOL | custom boxes + moving cards |
| F | step 3 observe, final answer, 2 calls 1 run | Result card slides into MODEL, the answer bubble "Shipped 2 days ago" turns green, two big tiles: 2 MODEL CALLS and 1 TOOL RUN | OBSERVE, 2 CALLS, 1 TOOL RUN | cards + count tiles |
| G | loop repeats if needed | Ring of three pills turns twice; TURN 1, TURN 2, TURN 3 counter in the middle | TURN 1, TURN 2 | M.loop spin |
| H | turn limit 5, no limit = bill grows | Row of five turn tiles fills, a STOP octagon lands on 5; then extra red tiles 6, 7, 8 run on and a coin with BILL up appears | LIMIT 5, STOP, BILL | custom tiles + octagon |
| I | say this | Five stacked rows light up on their words: THINKS, ASKS FOR TOOL, APP RUNS IT, RESULT BACK, STOPS | five 2-3 word rows | M.box |
| J | comment 5, 10 or 20, follow | Pills 5 10 20, a COMMENT card with the three numbers, FOLLOW button presses | TURNS?, COMMENT, FOLLOW | custom |
