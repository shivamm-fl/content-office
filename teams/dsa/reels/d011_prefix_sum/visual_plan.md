# Visual plan: d011 Prefix sum (script: state/scripts/d011.txt)

Idea in one line: build a running-total row once; any range sum is prefix[right+1] − prefix[left].
One array row (3 1 4 1 5 9) and one prefix row (0 3 4 8 9 14 23, offset half a cell so a[i] sits between p[i] and p[i+1]) are reused in E to L; I is a flat bar picture of why the subtraction works.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | Labels | Built with |
|---|---|---|---|---|
| A | hook: range sum without a loop | Array row 3 1 4 1 5 9 with index numbers; a gold bracket lands over indices 2 to 4, a SUM = ? tile appears, then a red NO LOOP tile | RANGE, SUM = ?, NO LOOP | tiles + bracket |
| B | answer: prefix sum, running total, one subtraction | Array row on top, dashed prefix row below fills left to right with 0 3 4 8 9 14 23, then two prefix cells ring and a ONE SUBTRACTION tile appears | ARRAY, PREFIX, 1 SUBTRACTION | array/prefix rows |
| C | array, query 2..4, loop 4+1+5 = 10 | Array values appear on their digits, bracket over index 2 to 4, chip row 4 + 1 + 5 = 10 builds, green 1 QUERY OK tile | LOOP, 1 QUERY: OK | tiles + chips |
| D | 100,000 numbers, 100,000 queries, 10 arab | EXAMPLE pill; five full-width scan bars (Q1 to Q100,000) sweep one by one, a counter climbs to 10,000,000,000, bars repeat in red | 100,000 NUMBERS, 100,000 QUERIES, ADDITIONS, SAME ADDS AGAIN | bars + counter |
| E | step 1: prefix array, prefix of i, starts at 0 | STEP 1/2/3 chips (1 lit), array row, empty dashed prefix row, bracket over the first 3 cells, 0 lands in prefix[0] | STEP 1, prefix[i], FIRST i, EMPTY = 0 | rows + bracket |
| F | step 2: running total build, 23, O(n) | Prefix row fills 0 3 4 8 9 14 23 while the array cell just added gets a ring; last cell 23 rings green; BUILD O(n) tile | STEP 2, PREV + CURRENT, WHOLE SUM, BUILD O(n) | rows |
| G | step 3: formula | l and r markers over array cells 2 and 4, SUM(l..r) tile, then prefix[r+1] − prefix[l] builds token by token | STEP 3, l, r, SUM(l..r) | rows + tiles |
| H | example: 14 − 4 = 10 | Full array and prefix rows; prefix[5] = 14 and prefix[2] = 4 ring, drop into chip row 14 − 4 = 10, array cells 2 to 4 turn green, NO LOOP | prefix[5], prefix[2], NO LOOP | rows + chips |
| I | why it works | Six equal cells; first five turn cyan with bar prefix[5]=14, first two turn red with bar prefix[2]=4, the remaining three turn green with bar 10 | prefix[5]=14, prefix[2]=4, 10 | cells + bars |
| J | cost: O(1) query, O(n) space, 100,000 + 100,000 | QUERY O(1) and SPACE O(n) tiles; flow 14 4 − 10 (2 reads, 1 subtraction); true-scale bars: red 10,000,000,000 vs a sliver for 200,000 | QUERY O(1), SPACE O(n), LOOP, PREFIX | tiles + bars |
| K | limit: works for sum, not max | SUM panel with 14 − 4 = 10 and UNDO: YES; MAX panel with prefix-max row 3 3 4 4 5 9 and 9 − 4 = 5 against REAL MAX 9, NO UNDO | SUM, MAX, UNDO: YES, NO UNDO | panels + chips |
| L | recap, quiz 1..3, comment, follow | Two recap tiles, array and prefix rows with digits landing, bracket over cells 1 to 3 and SUM 1..3 = ?, comment bar, answer 9 − 3 = 6, FOLLOW pill | BUILD ONCE, 1 SUBTRACTION, QUIZ, 6 | rows + chips + pill |
