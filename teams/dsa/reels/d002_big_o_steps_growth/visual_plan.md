# Visual plan: d002 Big-O, steps ka growth

Idea in one line: Big-O is how the number of STEPS grows when the data doubles: one by one doubles, halving adds one, every-pair quadruples.
The picture that explains it with the sound off: the same name list, doubled, with a step counter beside each method (1,000,000 to 2,000,000 against 20 to 21), then a grid that quadruples when its side doubles.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | 10 lakh names: one method 10 lakh steps, other only 20 | Two side-by-side cards of name tiles: left a magnifier and a red counter climbing to 1,000,000, right a green 20 landing | ONE BY ONE, HALVING, STEPS | custom (panels, tiles, counters), M.icon |
| B | Contacts, one by one, worst case; double the contacts, checks double | One card of name tiles with a red STEPS counter climbing to 1,000,000; the list grows a second column of gold tiles and the counter doubles to 2,000,000 with a x2 stamp | 10 LAKH, 20 LAKH, STEPS, x2, EXAMPLE | custom (tiles, tween counter, stamp) |
| C | Sorted list, open in the middle, drop a half; 20 vs 21 | Two sorted columns of eight tiles; the middle tile lights, the lower half fades in one and the upper half in the other; a Python run card prints the real counts 1000000 20 and 2000000 21 and a +1 chip lands | SORTED, MIDDLE, PYTHON RUN, +1 | custom (tiles, dim, run card) |
| D | Big-O: O(n) doubles, O(log n) one extra step, O(n squared) four times | Three stacked cards: a bar that doubles in length, a row of 20 squares gaining one gold square, a 4x4 grid next to an 8x8 grid (four times the cells) with the real pair counts 499500 and 1999000 | BIG-O, O(n), O(log n), O(n²), x2, +1, x4 | custom (bars, squares, grids) |
| E | Interview: 10 names both fast, lakhs show the gap | Two stacked cards: 10 NAMES with two short bars (10 and 4 steps), then 10 LAKH NAMES with a full red bar 1,000,000 against a thin green sliver 20, true scale | 10 NAMES, 10 LAKH NAMES, 1,000,000, 20 | custom (bars without track) |
| F | Check: 40 lakh names, how many steps? comment, follow | A COMMENT card with 10 LAKH = 20 on top and 40 LAKH = ? large over an empty comment bar, then a + FOLLOW pill that presses on "follow" | COMMENT KARO, 40 LAKH = ?, + FOLLOW | recipe 11 |

Facts: all counts are from qa/d002/run_output.txt (worst case, target last, counts not seconds). No time in seconds on screen. 40 lakh names = 22 steps (caption only).
