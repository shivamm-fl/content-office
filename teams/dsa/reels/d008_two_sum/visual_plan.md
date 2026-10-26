# Visual plan: d008 Two Sum (rules: docs-notes/diagram-first-visuals.md)

Idea in one line: for each number, ask "is my partner (target minus me) already in the notebook?"; a hash map answers in one step, so one pass replaces checking every pair.
The picture that explains it with the sound off: one row of five cells (5 1 12 3 8) with a target chip 11 that stays the same in every scene; first a web of 10 arcs between all pairs with a climbing counter, then a walking pointer and a two-column "seen" table that fills one row per step until 8 finds 3.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | hook: two numbers that add to 11 | Row of five cells 5 1 12 3 8 on a panel from frame 0; a "? + ? = 11" strip appears on "kaise" | PAIR THAT ADDS TO 11, LIST, ? + ? = 11 | custom tiles |
| B | list, target, answer, index | Cells appear on their numbers; TARGET 11 chip; cells 3 and 8 ring green; index numbers 0-4 under cells; answer [3, 4] | TARGET 11, INDEX, ANSWER | custom tiles |
| C | check every pair, 10 checks, 5 crore | Ten arcs drawn one by one between all pairs under the row, counter climbs to 10; below, a red counter runs to 49,995,000 with an EXAMPLE pill and a TOO SLOW stamp | CHECKS, 10,000 NUMBERS, PAIR CHECKS | custom SVG arcs + counter |
| D | partner = target minus number; hash map | Cell 8 rings gold, formula card 11 - 8 = 3, cell 3 rings green, "3 SEEN?" question; then a KEY / VALUE table with one row 3 -> 3 lighting up as INSTANT | PARTNER, 11 - 8 = 3, SEEN?, KEY, VALUE, INSTANT | custom tiles |
| E | complement lookup pattern, signal | Four boxes in a vertical flow: ITEM x, PARTNER = T - x, SEEN BEFORE?, HASH MAP, arrows lighting in order | PATTERN, ITEM, SEEN BEFORE?, HASH MAP | M.box-like tiles |
| F | four steps of the code | The real seven-line code; the active step's lines get a gold band, finished steps go grey; step badges 1-4 | CODE, 4 STEPS | custom code lines |
| G | real run on 5 1 12 3 8 | Pointer walks under the cells; seen table gains rows 5, 1, 12, 3; at 8 the card 11 - 8 = 3 lights row 3, a bracket joins cells 3 and 8; STEPS counter reaches 5 | REAL RUN, KEY, INDEX, STEPS, [3, 4] | custom tiles + SVG bracket |
| H | O(1) lookup, O(n) time and space | Three rows: LOOKUP O(1), TIME O(n) with a true-scale pair of bars (49,995,000 vs a sliver of 10,000), SPACE O(n) with a hash map box filling with tiles | LOOKUP, TIME, SPACE, ALL PAIRS, ONE PASS | custom bars + tiles |
| I | the trap: look first, then store | LOOK then STORE flow; list [3, 3] target 6, seen row 3 -> 0 found by second 3, bracket, answer [0, 1]; below a red STORE FIRST panel where the 3 finds itself | 1 LOOK, 2 STORE, TARGET 6, STORE FIRST, ITSELF, WRONG | custom tiles |
| J | quiz [2, 7, 11, 15] target 26, comment, follow | Four cells with indexes, TARGET 26 chip, "INDEX ?, ?"; comment box; FOLLOW pill presses on "follow" | TARGET 26, COMMENT KARO, + FOLLOW | custom + pill |
