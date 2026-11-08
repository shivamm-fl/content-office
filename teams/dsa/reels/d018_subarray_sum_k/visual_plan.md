# Visual plan: d018 Subarray Sum Equals K

Idea in one line: one array row [3, 4, -3, 2, 1, 1] carries the whole reel; a prefix strip, a seen-map of prefix counts, and a lookup ring show why s - k found earlier means a subarray ends here; the real Python code is highlighted in chunks.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | interviewer question, what a subarray is | array row of six cells under the hook, gold bracket on 4 -3 2 with SUM = k, HOW MANY? and NEGATIVES OK tiles | SUM = k, HOW MANY?, CONTINUOUS PART | tiles + bracket |
| B | given array, k = 3, three subarrays | array lights cell by cell; k = 3 tile; three strip rows each lighting the cells of one matching subarray; ANSWER = 3 | GIVEN ARRAY, k = 3, ANSWER = 3 | tiles |
| C | brute force, 200 million | staircase of 21 squares (every start, end pair) lighting up; n = 20,000 and a red counter climbing to 200,010,000 (EXAMPLE) | ALL PAIRS, n = 20,000, SUBARRAYS | tiles + counter |
| D | sliding window fails with negatives | window bracket on cell 3 (sum 3 ok), grows to 3,4 (red, sum 7), shrinks and drops both cells; -3 turns red; WINDOW: 1 vs TRUE: 3 | SLIDING WINDOW, SUM = 7 > k, WINDOW: 1, TRUE: 3 | tiles + bracket |
| E | prefix sum, difference, s - k | array row over a seven-cell prefix row 0 3 7 4 6 7 8 filling in; bracket on 4 -3 2 and rings on P[1] and P[4]; 6 - 3 = 3; s and s - k tiles | PREFIX, P[j] - P[i], s - k = 3 | tiles + rings |
| F | hash map of counts, seed 0 -> 1 | two-column table PREFIX / COUNT; row 7 counts 1 then 2; row 0 -> 1 lights as the seed | PREFIX, COUNT, SEEN TWICE, +1 SUBARRAY EACH | tiles |
| G | dry run x = 3, 4, -3 | array row with a hopping ring; s, s - k and result tiles change; six dashed seen slots fill with 0:1, 3:1, 7:1, 4:1; ANS counter; two code lines highlight | s = 3, FOUND x1, NOT FOUND, ANS = 1 | custom dry-run builder |
| H | dry run x = 2, 1, 1 | same picture continued: gold brackets on 4 -3 2 and 2 1, 7:1 becomes 7:2, ANS reaches 3 | s - k = 3, FOUND x1, ANSWER = 3 | custom dry-run builder |
| I | code | eight real lines highlighted in chunks (seed, running sum, lookup, insert, query then insert); step tile; k = 0 COUNTS ITSELF warning | SEED MAP, LOOKUP FIRST, COUNTS ITSELF | code block |
| J | real run, time, space | four example rows with the real results 3 2 2 3; TIME O(n) with a one-pass bar over six cells; SPACE O(n) with seven different prefix chips (WORST CASE) | REAL RUN, TIME O(n), SPACE O(n), 1 PASS | tiles |
| K | comment question, follow | array 1 -1 0, k = 0, ANSWER = ?, comment box, FOLLOW pill | GIVEN ARRAY, k = 0, ANSWER = ? | tiles |
