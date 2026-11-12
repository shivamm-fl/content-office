# Visual plan: d022 Merge Sorted Array

Idea in one line: two rows of cells (nums2 above, nums1 with three empty slots at its end) carry the whole reel. Writing from the front destroys an unread 3; shifting on every insert costs 10,000 moves; filling from the back with pointers i, j, k never overwrites an unread value.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | Labels | Built with |
|---|---|---|---|---|
| A | hook: extra space ke bina? | nums2 row above nums1 row from frame 0, the empty tail cells dim grey, a red extra-space question tile | EMPTY TAIL, EXTRA SPACE ? | row helper, chip |
| B | problem + given arrays | both rows light cell by cell as the values are read, tail tinted green as free slots, m and n tags | FREE SLOTS, m = 3, n = 3, IN PLACE | row, lt tiles |
| C | front merge overwrites | a write ring hops to nums1 index two, the 3 turns into a red 2, then the row ends as 1 2 2 2 5 6 | WRITE FROM FRONT, LOST 3 | row with swap tiles, ring |
| D | shift each insert O(m n) | a 2 drops into nums1, the 3 shifts right with arrows, a counter climbs to 10,000 | SHIFT RIGHT EACH TIME, SHIFTS | row, counter |
| E | fill from back with i j k | tail tinted green, pointer tags i j k land on the right ends, setup code line lit | FILL FROM HERE, k AHEAD OF i | row, ptag, code |
| F | dry run | four steps: the larger cell drops into k, tags hop left, a compare tile changes each step, loop code lit, result lit cell by cell | 3 vs 6, RESULT | row, ptag, swap, code |
| G | why loop stops | nums2 dims to empty, first two cells of nums1 ringed as already placed, full accepted code with the while line lit | NUMS2 EMPTY, REST SORTED | row, code |
| H | time and space | ring sweeps the six cells right to left, TIME tag, three pointer tiles, SPACE tag | TIME O(m + n), SPACE O(1) | row, ring, tiles |
| I | comment + follow | the second example in both rows, six red question cells, comment box, follow pill | RESULT ? | row, pill |
