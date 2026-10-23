# Visual plan: d005 Strings: array jaisi, par badal nahi sakte

Idea in one line: a string is a row of lettered boxes read by index like an array, but in Python it is immutable, so a change builds a new string, and building a long string with + copies the growing string every time (model 500500 copies for 1000 letters) while one join copies each letter once.
The picture that explains it with the sound off: boxes h e l l o with indexes, a pencil blocked by a red cross, a NEW row j e l l o beside the old row, a staircase of growing copies against one single row.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with |
|---|---|---|---|---|
| A | Changing one letter gave an error | A STRING panel of five touching boxes h e l l o with index 0-4 below; a pencil swings at box 0 and a red cross blocks it with an ERROR pill | CHANGE ONE LETTER, ERROR?, STRING, ERROR | custom (tiles, pencil, cross) |
| B | s[0] = j fails with TypeError; index starts at 0 | Boxes h e l l o with index numbers; a code card shows s = "hello", s[0] = "j", then the real red TypeError line from our run | INDEX, CODE, REAL OUTPUT | custom (tiles, code card) |
| C | Reading by index is easy like array, changing is not: immutable | Pointer jumps to box 0 (h) and box 4 (o) in green; then the pencil on box 0 is crossed, lock icon, pills | READ OK, ARRAY-LIKE, CHANGE NO, IMMUTABLE, PYTHON | custom (tiles, pointer, lock) |
| D | Need jello: build a new string, old hello stays | OLD row h e l l o on top stays; a NEW row below gets a gold j then e l l o tiles slide down copied from the old row | OLD, NEW, j + ello | custom (two rows, copy slide) |
| E | Wedding card typo: reprint whole new card; string same | Left card with a red typo and cross dims; a new green card appears beside it; below, hello row beside a new jello row | TYPO, NEW CARD, 1 LETTER = NEW STRING | custom (cards, rows) |
| F | + in a loop copies the whole string every time: 1, 2 ... 1000 | Staircase of bars growing from 1 letter to 1000, each labelled with its copy size; EXAMPLE pill | EXAMPLE, COPY 1, COPY 2, COPY 1000 | custom (bars) |
| G | Sum is n(n+1)/2: 500500 for 1000, 500 billion for 10 lakh; a model | A red triangle (the staircase summed) with a counter climbing to 500,500; formula card; second counter to 500,000,500,000 | n x (n+1) / 2, MODEL, NOT REAL TIME, 10 LAKH LETTERS | custom (triangle, counters) |
| H | Join: list, join once, each letter copied once | Three stacked step cards: letters dropping into a LIST, one JOIN arrow, one single row filling with a 1 per letter | STEP 1/3, LIST, JOIN ONCE, EACH LETTER x1 | custom (cards, tiles) |
| I | 500500 to 1000; Python only | Two bars to true scale: a full red 500,500 and a tiny green sliver 1,000; PYTHON ONLY stamp | + IN LOOP, JOIN, PYTHON ONLY | custom (bars, stamp) |
| J | Check: 2000 letters with +? comment, follow | 2000 LETTERS card with + loop and a red ? COPIES; COMMENT card; FOLLOW pill presses | 2000 LETTERS, ? COPIES, COMMENT KARO, + FOLLOW | recipe 11 |

Facts: Python docs say str is an immutable sequence and repeated concatenation is quadratic (fetched 2026-10-23). Counts are a model (n(n+1)/2); the TypeError line is the real output of our run (Python 3.12).
