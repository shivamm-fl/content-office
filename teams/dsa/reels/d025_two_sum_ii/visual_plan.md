# Visual plan: d025 Two Sum II

Idea in one line: one sorted row of six cells (1, 4, 6, 9, 13, 17) with positions 1..6 under it carries the reel. A hash map of entries is shown and banned, a stack of halving bars shows binary search per element, then L and R tags walk in from both ends and drop one index per step until positions 3 and 5 light up.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | Labels | Built with |
|---|---|---|---|---|
| A | Two Sum II, pair without extra space | the sorted row with positions 1..6 from frame 0, a dashed slot where a red NO HASH MAP chip lands, then a green O(1) SPACE chip | NO HASH MAP, O(1) SPACE | cells, idx1, chips |
| B | the problem, one-indexed, O(1) space, the given row | the six cells light as the numbers are read, position labels turn green on one-indexed, five chips light in order | ? + ? = TARGET, POSITIONS, COUNT FROM 1, TARGET 19 | cells, idx1, lt |
| C | hash map banned, 999 entries | the row above a HASH MAP box with six dashed slots that fill with value to position entries, a NOT ALLOWED stamp, a counter climbing to 999 | NOT ALLOWED, ENTRIES, O(n) SPACE | panel, ghost, chip, counter |
| D | binary search per number | row with the first cell marked i, a NEED = 19 - 1 = 18 tile, the right part tinted, a halving ladder 5, 2, 1 LEFT, five rows of mini ladders for n numbers, a counter to 8,977 | O(1) SPACE, O(n log n), PROBES | cells, bars, counter |
| E | sorted, so two pointers | row, ascending bars under it for sortedness, L and R tags land on the ends, sum and two rule chips, red arcs from the first cell to all others, L hops and the first cell greys out | SUM = L + R, 1 INDEX / STEP | cells, tags, arcs |
| F | dry run on 1,4,6,9,13,17 | tags hop inward on each verdict, the passed cell greys, four sum cards swap, the found cells turn green, a 0-based chip turns into ANSWER [3, 5] | TOO SMALL, TOO BIG, FOUND | stepUI, swap, tags |
| G | code | the real function, active line lit as spoken, L and R tags on the found cells, s and result tiles | code | code(), tags |
| H | 999 steps, O(1) space | two fills close in from both ends of a track while a counter reaches 999, time chip, l r s tiles, space chip | TIME O(n), SPACE O(1) | bar, counter, tiles |
| I | trap: forgot +1, unsorted input | a swap tile +1 to [3, 5] then NO +1 to [2, 4] in red, then an unsorted row with L and R hopping to NONE, a green 1 + 9 = 10 chip, counter to 3,230 | UNSORTED, NONE, OF 5,000 | cells, tags, counter |
| J | interview line | the row with hopping tags and five chips lit as spoken | SORTED, TIME O(n), SPACE O(1) | cells, lt |
| K | comment, follow | three cells 2, 3, 4 with positions, TARGET 6, a RESULT = ? tile, comment box, follow pill presses | RESULT = ? | cells, pill |
