# Visual plan: d008 Two Sum, owner's technical script (2026-10-26)

Idea in one line: for each x compute complement = target - x and look it up in a hash map of numbers already seen; one pass replaces checking every pair.
The picture: O(n²) to O(n) from frame 0, then one array row (5 1 12 3 8) with target 11 reused in every scene; a pair-arc web for brute force; the code revealed in three pieces; a dry run where the complement, a NOT IN MAP mark and the seen table update per element.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | Labels | Built with |
|---|---|---|---|---|
| A | O(n²) to O(n) with a hash map | Red BRUTE FORCE O(n²) tile, arrow, green ONE PASS O(n) tile, HASH MAP tile lights | TWO SUM, O(n²) → O(n) | custom tiles |
| B | array, target, indices, no reuse | Cells appear on their numbers, TARGET 11, indices 3 and 4 ring green, 3 + 8 = 11, NO REUSE stamp | ARRAY, TARGET 11, INDICES | custom tiles |
| C | brute force, 10 pairs, O(n²), 10,000 elements | Ten arcs between all pairs with a counter to 10, O(n²) in red, EXAMPLE counter to 49,995,000, SKIP PAIRS? | PAIRS, O(n²), PAIR CHECKS | SVG arcs + counter |
| D | complement = target - x, hash map, O(1) | Cell 8 rings, 11 − 8 = 3, cell 3 rings, 3 SEEN?, HASH MAP with KEY and VALUE row, LOOKUP O(1) avg | COMPLEMENT, KEY, VALUE | custom tiles |
| E | pattern: required value, hash map | Four boxes in a vertical flow lighting in order, ending TWO SUM: COMPLEMENT | PATTERN, REQUIRED VALUE? | tiles |
| F | three operations | Code appears in three pieces: complement line, lookup lines, insertion line, each with a gold band and a badge | CODE, 3 OPERATIONS | code lines |
| G | dry run on 5 1 12 3 8 | Pointer walks, per step 11 − x = c and NOT IN MAP, seen table gains rows, at 8 row 3 lights, bracket and [3, 4], STEPS counter | DRY RUN, KEY, INDEX, STEPS | tiles + SVG |
| H | complexity and worst case | BRUTE O(n²), HASH MAP O(n), O(n) space tiles, true-scale bars (EXAMPLE), WORST LOOKUP O(n) and NO STRICT O(n) | TIME, SPACE | tiles + bars |
| I | edge case [3, 3], target 6 | 3 not in map yet, store 3 → 0, second 3 finds it, [0, 1], 1 LOOK then 2 STORE, red STORE FIRST panel | TARGET 6, SEEN, SAME ELEMENT | tiles |
| J | quiz and follow | Array 2 7 11 15, TARGET 26, INDICES ? , ?, comment box, FOLLOW pill | COMMENT KARO | tiles + pill |
