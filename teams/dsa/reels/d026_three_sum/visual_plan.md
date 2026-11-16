# Visual plan: d026 3Sum

Idea in one line: one sorted row of six cells (-4, -1, -1, 0, 1, 2) carries the reel. A fixed-index tag i, and L and R tags hop by the sum versus zero; the two equal -1 cells share one tint so the repeated triplet, the skipped i and the skipped l/r are all seen on the same row.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | Labels | Built with |
|---|---|---|---|---|
| A | interviewer: 3Sum without duplicate triplets | the raw row from frame 0, cells -1,0,1 tint green and a result chip [-1, 0, 1] lands; the other -1,0,1 cells tint amber and the same chip lands again in red with DUPLICATE | DUPLICATE | cells, chips |
| B | problem, given array, two answers | the six raw cells light as read, three rule chips, then the two answer chips land one by one | 3 NUMBERS, SUM = 0, ONCE EACH | cells, lt |
| C | brute force, 166 million | the row with three indices stepping through triples (cells tint), an i/j/k tile, then a counter to 166,167,000 and a cubed chip | n = 1000, TRIPLES, O(n³) | cells, swap, counter |
| D | Two Sum II on the rest | the raw cells swap into sorted order on SORT, tiles stack up, then i, L and R tags land on cells 0, 1 and 5 | TWO SUM II, FIX ONE x, SORT FIRST | swap, tags |
| E | sum rules, save on zero | sorted row lit as read, i, L, R tags on cells 1, 2, 5, three rule chips, the sum -1-1+2=0 turns the three cells green, result chip, L and R hop inward | SUM < 0, SUM > 0, SUM = 0 | cells, tags |
| F | duplicates, skip i, skip l and r | the two -1 cells share an amber tint; the i tag on cell 1 lands a result, then on cell 2 the same triplet lands again and a TWICE stamp appears; the rule chip strikes cell 2 and dims the repeat; counters 600 versus 1 for 50 zeros | TWICE, SKIP i, SKIP l, SKIP r, NO SKIP | cells, tags, strike, counter |
| G | dry run | the i, L, R tags hop through i=0 (four negative sums), i=1 (two hits turn cells green, results stack), i=2 (strike, skip), i=3 (sum 3) with sum and verdict tiles | HIT, SKIP, NOTHING | tags, swap |
| H | code | the real code in three chunks, active line lit as spoken; a stage chip changes above it | SORT, FIX i, MOVE l r, SAVE, SKIP | code() |
| I | O(n²), O(1) space | five rows each with two fills closing in (n steps per i), time chip, i l r s tiles, space chip, sort stack chip | n STEPS, O(n²), O(1), O(log n) | bar, lt |
| J | interview line | the row with i, L, R tags and four numbered chips lit as spoken | SORT, FIX i, TWO POINTERS, SKIP | cells, lt |
| K | comment: four zeros | four zero cells, a comment box, then the answer chip [0, 0, 0] and 1 TRIPLET | RESULT = ? | cells, swap |
