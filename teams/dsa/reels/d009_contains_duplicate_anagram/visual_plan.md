# Visual plan: d009 Contains Duplicate + Valid Anagram (owner-approved script, state/scripts/d009.txt)

Idea in one line: remember what you have already seen (a set of seen values, a count of each letter) instead of sorting or comparing pairs.
One list, 4 7 1 9 7 3, is reused from scene A to F; the anagram scenes reuse one count-bar chart for LISTEN/SILENT and RAT/CAR.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | Labels | Built with |
|---|---|---|---|---|
| A | hook: no sorting, one loop | Six cells with 4 7 1 9 7 3 under the hook, SORT tile gets a red cross, a green ONE LOOP tile with pointers lights | SORT O(n log n), ONE LOOP | custom tiles |
| B | the list, any value twice? | Cells appear on their numbers, both 7s ring red, an empty SEEN box { } fades in | ANY VALUE TWICE?, SEEN | custom tiles |
| C | brute force: 8 checks, 49,995,000 | Eight pair arcs draw under the cells with a counter to 8, the last arc is red; then EXAMPLE counter to 49,995,000 | PAIR CHECKS, O(n²) | SVG arcs + counter |
| D | the seen set, lookup O(1) | seen = set() tile, set box fills with 4, 7, 1; a second 7 chip is refused; 7 in seen? tile, LOOKUP O(1) avg | SET: EACH VALUE ONCE | tiles |
| E | the three steps | The real code card; the check line, the return True line and the add line light in order with badges 1 2 3 | CODE, 3 STEPS | code lines |
| F | dry run | Pointer walks the cells, SEEN chips 4 7 1 9 drop in, at the second 7 both 7s ring red, stamp TRUE, STEPS counter to 5, 0 PAIR CHECKS | REAL RUN, SEEN | tiles |
| G | complexity | TIME O(n), SPACE O(n); EXAMPLE true-scale bars: sort about 133,000 steps vs loop 10,000; worst case tile, AVERAGE CASE | EXAMPLE n = 10,000 | tiles + bars |
| H | Valid Anagram | LISTEN and SILENT letter tiles; gold lines connect each letter to its place in the other word | VALID ANAGRAM?, SAME LETTERS? | tiles + SVG |
| I | count map | Bar chart: LISTEN (cyan) and SILENT (gold) bars rise per letter e i l n s t, all equal, TRUE; second chart RAT vs CAR shows missing bars at c and t, FALSE | Counter(), TRUE, FALSE | custom bars |
| J | space 26 | 26 letter tiles, 26 FIXED, accented letters, SAME IDEA | 26 COUNTS | tiles |
| K | pattern | Two question tiles each arrow to a structure (SEEN BEFORE? to SET, HOW MANY TIMES? to COUNT MAP); red COMPARE ALL PAIRS AGAIN crossed out | PATTERN, REMEMBER IT | tiles |
| L | quiz + follow | List 3 8 3 with DUPLICATE ?, aab / abb with ANAGRAM ?, comment box, FOLLOW pill | COMMENT KARO | tiles + pill |
