# Visual plan: d020 Rotate Array

Idea in one line: one row of 7 cells (1 to 7); the slice builds a second row and leaves the caller's row NOT CHANGED; three reverses (all, first 3, last 4) carry 5,6,7 to the front with swap arcs, no second row.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | Labels | Built with |
|---|---|---|---|---|
| A | slice likha, array nahi badla; problem | Row 1..7, last three cells turn amber on "k elements", result row 5 6 7 1 2 3 4 fills below, SAME ARRAY tile | GIVEN ARRAY, k = 3, RESULT, SAME ARRAY | custom rows + lt tiles |
| B | Given array, k = 3, result | Input row, k tile, result row filling cell by cell, amber cells follow to the front | LAST 3 TO FRONT, EXAMPLE | row7v |
| C | slice line builds new list | One code line lit piece by piece, second NEW LIST row appears, the name tag nums hops from old row to new row, then caller row stamped NOT CHANGED | NEW LIST, nums, NOT CHANGED | code(), hop |
| D | one step at a time = k x n; new list O(n) | Four stacked rows (start, +1, +2, +3) each fully shifted, 3 x 7 = 21 counter, a copy row of 7 amber cells with SPACE O(n) | STEP, k x n MOVES, O(n) SPACE | row builder |
| E | observation: reverse all, then parts | Row 1..7, reverse all gives 7..1 with amber cells in front but backwards, brackets over first 3 and last 4, third row 5 6 7 1 2 3 4 | REVERSE ALL, BACKWARDS, ORDER FIXED | row builder |
| F | three steps | Three cards: k mod n, whole-array bar, two bars split 3 : 4 | k % n, WHOLE ARRAY, FIRST k, LAST n-k | cards |
| G | dry run | One row of 7 swap-tiles changing three times, nested swap arcs under the row for each reverse, bar above the reversed part, ANSWER tile | REVERSE ALL, FIRST 3, LAST 4, ANSWER | swap, arcs |
| H | code | 11-line code listing lit by spoken step, call and OUTPUT tiles | OUTPUT | code() |
| I | swaps and complexity | Final row, 3+1+2=6 swaps counter, TIME O(n); 7 copy cells vs 0 in-place cells; SPACE O(1) | SWAPS, TIME O(n), SPACE O(1) | tiles |
| J | k mod n | k=3 > n=2, 3 % 2 = 1; without mod the two-cell row gets a dashed third cell INDEX 2 and IndexError | k % n, INDEX 2 | tiles, ghost |
| K | comment + follow | Four cells -1 -100 3 99, k tile, RESULT ? tile, comment box and follow pill | GIVEN ARRAY, RESULT ? | row, pill |
