# Visual plan: d012 Pivot Index (script: state/scripts/d012.txt)

Idea in one line: keep a running LEFT sum; RIGHT = TOTAL − LEFT − CURRENT; the first index where LEFT = RIGHT is the pivot.
One array row (1 7 3 6 5 6) is reused from A to I; cells are tinted by role (cyan = left part, violet = current, amber = right part) so the three values below it always read as parts of that row.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | Labels | Built with |
|---|---|---|---|---|
| A | hook: Pivot Index, left vs right sum | Array row 1 7 3 6 5 6; a cyan bracket over the first three cells and an amber bracket over the last two, cell 3 ringed, then an equals-question tile | LEFT, RIGHT, LEFT = RIGHT ? | tiles + brackets |
| B | definition, index 3, 11 and 11 | Same row; cells flash on their digits, brackets split left and right of cell 3, sum chips 1+7+3 = 11 and 5+6 = 11 land, cell 3 turns green with 11 = 11 | LEFT, RIGHT, 11 = 11 | tiles + brackets |
| C | brute force, 10 billion reads, O(n²) | Three mini rows (i=1,2,3) each coloured left/current/right as if re-summed from scratch, a counter climbs to 10,000,000,000 with an EXAMPLE pill, then all the left cells turn red | BRUTE FORCE, READS, O(n²), LEFT SUM AGAIN | mini rows + counter |
| D | step 1: total once = 28 | STEP chips (1 lit), array row; a violet ring sweeps each cell while a big counter climbs 0 to 28 | STEP 1, TOTAL, ONE PASS | row + counter |
| E | step 2: walk, left starts at 0 | A rectangle walks across the row once and returns to cell 0; a LEFT SUM tile shows 0 and turns green | STEP 2, LEFT SUM, NOTHING COUNTED YET | row + walker |
| F | step 3: right = total − left − current | Formula chips build token by token; a to-scale bar of TOTAL = 28 splits into LEFT 11, CUR 6, RIGHT 11 | STEP 3, TOTAL = 28, LEFT, CUR, RIGHT | chips + bar |
| G | index 0: 28 − 0 − 1 = 27, not equal | Row with cell 0 current, LEFT 0 / CURRENT 1 / RIGHT 27 tiles, calc chips, red NOT EQUAL, then LEFT becomes 1 | LEFT, CURRENT, RIGHT, NOT EQUAL | state view |
| H | index 1: 20, index 2: 17, left 11 | Same view; current ring moves to cell 2, RIGHT swaps 20 to 17, LEFT 1 to 8 to 11, NOT EQUAL | same | state view |
| I | index 3: 28 − 11 − 6 = 11, equal | Same view; calc chips land, cell 3 turns green, LEFT = RIGHT tile, ANSWER 3 | LEFT = RIGHT, ANSWER: 3 | state view |
| J | edge cases [1,2,3] and [2,1,−1] | Top: row 1 2 3, NO MATCH, RETURN −1. Bottom: row 2 1 −1, LEFT: EMPTY becomes LEFT = 0, chips 1 + −1 = 0, ANSWER 0 | NO MATCH, RETURN −1, LEFT = 0, ANSWER: 0 | two small rows |
| K | several pivots, leftmost, return at first match | EXAMPLE row 0 0 0 with all three cells green PIVOT, LEFTMOST under cell 0, others dim, RETURN AT FIRST MATCH | PIVOT, LEFTMOST, RETURN AT FIRST MATCH | row + tiles |
| L | cost: O(n), O(1), 10 billion vs 2 lakh | Row with a bar sweeping once under it, ONE PASS O(n), TOTAL and LEFT SUM tiles, EXTRA SPACE O(1), true-scale bars: full red 10,000,000,000 vs a sliver for 200,000 | ONE PASS: O(n), EXTRA SPACE: O(1), EXAMPLE | tiles + bars |
| M | recap formula, quiz [1,2,3,3], comment, answer 2, follow | Formula chips, row 1 2 3 3, PIVOT INDEX = ? tile, comment bar, answer 2 green with chips 1 + 2 = 3 and 3, FOLLOW pill | PIVOT INDEX = ?, ANSWER: 2, + FOLLOW | row + chips + pill |
