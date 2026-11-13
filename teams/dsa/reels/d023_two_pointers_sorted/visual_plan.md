# Visual plan: d023 Two pointers on a sorted array

Idea in one line: one row of cells 1 3 4 6 8 11 carries the reel. L and R tags sit at the two ends, a sum card shows a[l]+a[r] against TARGET 10, and every step greys one cell out for good, so the 15-pair grid is never visited. The last scene runs the same code on an unsorted row and it walks past the real pair.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | Labels | Built with |
|---|---|---|---|---|
| A | pair sum: 5 lakh nahi, 999 checks | the six-cell row with L and R tags from frame 0, a red 499,500 PAIRS chip gets struck through, a green 999 CHECKS chip lands under it | 499,500 PAIRS, 999 CHECKS | row, tags, chips |
| B | problem, brute force | row with two cells tinted as the pair; a triangle grid of all 15 pair-sum cells lights one by one; a counter climbs to 499,500 for n = 1000, then an O(n²) tag | TARGET, ALL PAIRS, n = 1000, O(n²) | row, pair grid, counter |
| C | signal: sorted + sum of two | the row gets a rising SORTED bar, then L lands on the left cell and R on the right cell on their spoken words | SORTED, L, R | row, tags |
| D | step 1: 1 + 11 = 12 | cells light as read, sum card 1 + 11 = 12 beside TARGET 10, TOO BIG; five arcs from every other cell to 11 turn red; 11 greys out and R hops left | TARGET 10, TOO BIG | row, arcs, sum cards, hop |
| E | steps 2 to 5 | same row, each step swaps the sum card, arcs from 1 to its partners turn red, discarded cells grey, the tags hop inward until 4 + 6 = 10 lights green and the index chips 2 and 3 light | TOO SMALL, TOO BIG, FOUND | row, arcs, sum cards |
| F | one index gone per step | the cells grey out one after another (11, 1, 8, 3) and the 15-pair grid fades away | 1 INDEX / STEP, PAIRS SKIPPED | row, pair grid |
| G | the code | the accepted function with the active line lit as it is spoken, the row above with L and R tags and a sum tile | code | code(), tags |
| H | 999 iterations, O(n), O(1) | a struck 499,500 next to a 999 counter climbing; TIME O(n) tag; three variable tiles l, r, s and SPACE O(1) | 999 STEPS, TIME O(n), SPACE O(1) | counter, tiles |
| I | trap: unsorted | row 5 1 4 9; the tags walk to the middle and meet, stamp NONE; cells 1 and 9 ring green with a MISSED chip; counter to 827 of 5,000; SORT FIRST and HASH MAP chips | UNSORTED, NONE, 827 / 5,000 | row, tags, counter |
| J | rule, comment, follow | two rule tiles (TOO SMALL L →, TOO BIG ← R), then the quiz row 2 3 7 9 12 with TARGET 16, two ? tiles that turn into 2 and 3, comment box, follow pill | TARGET 16, ? | row, tiles, pill |
