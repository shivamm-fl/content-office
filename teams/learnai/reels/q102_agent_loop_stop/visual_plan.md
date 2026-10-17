# Visual plan: q102 agent loop stop

Idea in one line:
A looping agent burns tokens forever; three guards stop it: a step cap, a real result from the environment each step, and a human checkpoint.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | Onit job post requires agent loops; agent loop mein phans jaye to kya karoge? | Part 1: Onit logo, real job post screenshot with the agent loops line boxed in gold, labels AGENT LOOPS and JOB REQUIREMENT; part 2: spinning THINK TOOL RESULT loop with a STEP counter and 1? 2? 3? pills | JOB REQUIREMENT, AGENT LOOPS, SOURCE, THINK, TOOL, RESULT | custom img + M.loop |
| B | Mistake: leave it to the model, tokens keep burning | A robot icon inside a dashed circular arrow with a big infinity mark, beside a token meter bar that fills from gold to red while a token counter races up; a NO LIMIT stamp lands | AGENT, TOKENS, NO LIMIT | custom SVG/DOM, M.icon, counter tween |
| C | Rule 1: max iterations, e.g. max 10 steps, then cut | Ten numbered step circles in two rows light one by one; after circle 10 a red stop sign lands and the loop arrow is cut by a slice line; EXAMPLE pill, then a dial labelled "TASK" with a ?; Anthropic source chip | 1 STOP CONDITION, MAX 10, EXAMPLE, ANTHROPIC | custom DOM, stop sign SVG |
| D | Rule 2: ground truth, real tool result each step | AGENT box on top, arrow down to an ENVIRONMENT card showing a real test output line "2 failed" in red, an arrow back up labelled TRUTH, and a progress bar in the agent box that moves only by the real result | 2 GROUND TRUTH, AGENT, ENVIRONMENT, TOOL RESULT | custom panels |
| E | Rule 3: human checkpoint, pause for feedback | Robot box, a striped barrier gate closes in front of the next step, a user icon beside it with APPROVE and STOP chips; a STUCK warn chip also routes into the gate | 3 HUMAN CHECKPOINT, PAUSE, APPROVE, STUCK | custom DOM, M.icon |
| F | Agents must learn to stop; comment 5, 10 or 20; follow | A big red stop sign over a small robot, then a COMMENT card whose pills 5 / 10 / 20 pop on their words, then the handle and a FOLLOW pill that presses on "follow" | STOP, COMMENT KARO, 5, 10, 20, FOLLOW | custom DOM, M.pill |
