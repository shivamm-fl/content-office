# Visual plan: d016 Top K Frequent Elements

Idea in one line: the array row feeds a count table, the count becomes a bucket index (1..10), a ring walks the buckets from 10 down and picks values until k=2; the real Python code sits next to the matching step.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | hook, given array, k=2 | ten coloured cells of the array light up on their spoken digits; K = 2 tile and NO SORT tile | TOP K FREQUENT, GIVEN ARRAY, K = 2, NO SORT | custom tiles |
| B | counts, answer four and one | array row above four count bars (x4, x3, x2, x1); the top two ring green, the others dim | COUNT = FREQUENCY, ANSWER UNIQUE, ORDER: ANY | custom tiles |
| C | O(n^2) scan, hash map then sort | a ring sweeps the array three times (rescans), O(n²) red; then COUNTS → SORT → PAIRS flow and O(n log n) | SCAN ALL PER VALUE, O(n²), O(n log n), FOLLOW-UP | custom tiles |
| D | bottleneck: sort orders everything | four sorted count rows tinted red as ordered, then only the first two turn green; counter climbs to 1,700,000 steps (EXAMPLE) | SORT ORDERS ALL, WE NEED: TOP K, STEPS | custom |
| E | min heap, counts only 1..n | two heap slots, O(n log k); a ruler of possible counts 1…n | MIN HEAP SIZE K, POSSIBLE COUNTS, ONLY 1 … n | custom |
| F | count as index, walk n to 1, stop at k | ten empty buckets 1..10 appear, bucket c rings, a ring walks right to left | COUNT = INDEX, BUCKET c = COUNT c, WALK n → 1, STOP AT K | custom |
| G | dry run: counts and buckets | four count tiles; value chips fly into bucket 4, 3, 2, 1; code lines for counting and filling highlight | COUNTS, BUCKETS | custom + code block |
| H | the walk from 10 down | ring walks bucket 10→5 (EMPTY), lands on 4 then 3; chips move to the output slots; return at length k; loop code highlights | EMPTY, OUTPUT, K = 2, LEN = K → RETURN | custom + code block |
| I | actual Python solution + output | full 13 line source, chunks highlighted COUNT, BUCKETS, FILL, WALK, STOP AT K; real output [4, 1] | OUTPUT: [4, 1], REAL RUN | code block |
| J | same count, same bucket | one bucket holds two chips (EXAMPLE), ORDER: ANY, ANSWER UNIQUE | BUCKET 3, ORDER: ANY, NOT NEEDED | custom |
| K | time O(n), space O(n) | three stages each O(n), then TIME and SPACE tiles | COUNT, BUCKETS, WALK, TIME O(n), SPACE O(n) | custom |
| L | comment question, follow | array [1,1,1,2,2,3], K = 1, six buckets with ?, comment box, FOLLOW pill | WHICH FIRST? | custom |
