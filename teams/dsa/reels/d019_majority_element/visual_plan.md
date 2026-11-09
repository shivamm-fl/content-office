# Visual plan: d019 Majority Element

Idea in one line: one array row [2, 2, 1, 1, 1, 2, 2] carries the reel; a CANDIDATE box and a COUNT box replace a hash map, unequal pairs cancel, a ring walks the row while the pair of boxes and a trace strip change, and the real Python code is highlighted in chunks.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | hook: two variables, no hash map; problem statement | array row under the hook, CANDIDATE and COUNT boxes with question marks, a small hash-map table crossed out by a red bar, a MORE THAN n/2 TIMES tile | CANDIDATE, COUNT, NO HASH MAP | tiles + custom cross bar |
| B | given array, seven elements, two appears four times | array lights cell by cell, n = 7 and 4 > 7 / 2 tiles, four green blocks of 2 against three red blocks of 1, ANSWER = 2 | GIVEN ARRAY, n = 7, ANSWER = 2 | tiles |
| C | hash map time and space, brute force 2.5 billion | hash map table of key and count rows filling with distinct elements, TIME O(n) and SPACE O(n) tiles, a red counter climbing to 2,500,000,000 (EXAMPLE) | HASH MAP, SPACE O(n), COMPARISONS | tiles + counter |
| D | unequal pairs cancel, majority outnumbers the rest | array row with red arcs joining unequal pairs, the paired cells fade, one 2 stays green; a MAJORITY 4 bar longer than an OTHERS 3 bar | CANCEL PAIRS, UNEQUAL PAIR, 1 COPY LEFT | tiles + custom arcs |
| E | candidate and count, three rules | CANDIDATE and COUNT boxes on top, three rule cards each with small tiles: count zero takes x, equal adds one, different subtracts one | STEP 1, STEP 2, STEP 3 | tiles |
| F | dry run, first four elements | array row with a hopping ring, op chips above cells, candidate and count boxes changing value, a trace strip filling 2,1 2,2 2,1 2,0 | DRY RUN, CANDIDATE, COUNT, TRACE | custom dry-run builder |
| G | dry run, last three elements, answer | same picture continued: candidate swaps to 1 then back to 2, count 1 0 1, trace strip complete, ANSWER = 2 | DRY RUN, ANSWER = 2 | custom dry-run builder |
| H | the code | eight real lines highlighted in chunks (init, loop, take candidate, vote, return), the call majority of the example array and the real output 2 | OUTPUT: 2 | code block |
| I | time and space | seven cells with a one-pass bar, TIME O(n), m and cnt tiles, EXTRA SPACE O(1), a long red hash map bar against a tiny green m, cnt sliver | TIME O(n), EXTRA SPACE O(1) | tiles + bars |
| J | guarantee needed, 1 2 3 returns 3 | NEEDS MORE THAN n/2 tile, array 1 2 3 with trace 1,1 1,0 3,1, ANY ELEMENT and RETURNS 3 in red | NO MAJORITY, ANY ELEMENT, RETURNS 3 | tiles |
| K | comment question, follow | array 3 1 3 2 3, CANDIDATE ? and COUNT ? tiles, comment box, FOLLOW pill | GIVEN ARRAY, CANDIDATE ?, COUNT ? | tiles |
