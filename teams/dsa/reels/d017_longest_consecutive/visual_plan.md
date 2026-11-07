# Visual plan: d017 Longest Consecutive Sequence

Idea in one line: one number line (cells 0..5 and 99..101, 199..201) shows which numbers are in the set; a START flag lands only on cells whose left neighbour is empty, a ring walks right along a run, and the real Python code is highlighted in chunks beside the step.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | hook, problem, one two three four | red SORTED IT tile and green NEED O(n) tile, four touching cells 1 2 3 4 with a gold run bar and LENGTH = ? | SORTED IT, NEED O(n), LONGEST RUN, LENGTH = ? | custom tiles |
| B | given array, run of four, answer 4 | six array tiles; each value fills its cell on a number line (gaps stay dashed); cells 1 to 4 turn gold under a RUN bracket; ANSWER = 4 | GIVEN ARRAY, NUMBER LINE, RUN, ANSWER = 4 | custom tiles |
| C | sort then scan, n log n, need n | sorted row 1 2 3 4 100 200 with a gold ring scanning and RUN 1..4 counter; red total-time tile; green NEED O(n); row dims on "sorting chhodni" | SORTED, TOTAL O(n log n), NEED O(n), NO SORT | custom tiles |
| D | x+1 neighbour, hash set, walk from every number, 2 million | x and x+1 touching tiles, HASH SET with six chips, O(1) tile, then a red counter climbing to 2,000,000 under ARRAY 1 ... 2000 (EXAMPLE) | x, x+1, HASH SET, O(1) AVERAGE, LOOKUPS | custom + counter |
| E | start = x-1 not in set; four is middle | number line all filled; START flags on 1, 100, 200 when their left cell is empty; ring slides from 4 to 3; cells 2 3 4 dim and are labelled MIDDLE | START, x-1 NOT IN SET, LEFT IN SET, MIDDLE | custom tiles + ring |
| F | code walk-through | 10 code lines of the real solution; chunk highlight moves set, check, y = x, while, best, return; one big step tile names the chunk | SET, IS START?, WALK, BEST, RETURN | code block |
| G | dry run: 100, then 4 3 2 skip | number line, ring on 100; 99 and 101 empty rings; START flag; x, verdict and LEN tiles; ring hops 4, 3, 2 and cells dim with SKIP; 4-line code highlights | x = 100, START, LEN 1, SKIP | custom + code |
| H | dry run: 1 to 4, 200, best, real run | ring on 1, 0 empty, START, ring walks 2 3 4 and cells turn gold with LEN 1..4; ring on 200 LEN 1; BEST 4; REAL RUN; OUTPUT: 4 | x = 1, START, LEN 4, BEST 4, REAL RUN, OUTPUT: 4 | custom |
| I | cost: one start per run, 4 thousand vs 2 million | cells 1..4 gold with one START flag and a gold walk bar; EACH NUMBER 1 WALK, OTHERS 1 CHECK; true-scale bars: red 2,000,000 vs a 4 px sliver 4,000 (EXAMPLE) | START, ONE WALK, NO SKIP, WITH SKIP | custom |
| J | time O(n), space O(n), duplicates | TIME and SPACE tiles, SET with six chips, two 0 tiles merge into one 0 chip, ANSWER SAME | TIME O(n), SPACE O(n), SET, ONE ENTRY | custom |
| K | comment question, follow | ten array tiles of the quiz array, ANSWER = ? tile, comment box, FOLLOW pill | GIVEN ARRAY, ANSWER = ? | custom |
