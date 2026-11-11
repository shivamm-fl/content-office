# Visual plan: d021 Set Matrix Zeroes

Idea in one line: one 3x4 matrix of tiles carries the whole reel. Scanning and zeroing at once wipes it (new zeros look real); two extra arrays cost m+n cells; the first row and first column become the markers, two flags remember their original state; a dry run swaps tiles to the answer.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | Labels | Built with |
|---|---|---|---|---|
| A | hook: extra array ke bina? | 3x4 grid from frame 0, the two zero cells light their row and column strips amber, a red "EXTRA ARRAY ?" tile | EXTRA ARRAY ? | grid tiles, tint |
| B | problem + given matrix | Grid; zero rows/columns tint amber on "row", "column"; SAME MATRIX tile; cells light one by one as the values are read | ROW TO 0, COLUMN TO 0, IN PLACE | grid, lt tiles |
| C | scan and zero at once cascades | Ring scans, row 0 and column 0 and 3 turn 0, the 3 at (1,0) is a "WAS 3" new zero ringed red, rows 1 and 2 turn red zeros, WIPED stamp | WAS 3, LOOKS REAL, WIPED | grid with swap tiles |
| D | note first: two arrays O(m+n) | Grid, ROWS array (3 cells) and COLS array (4 cells) fill T/F from the zero cells, 3+4 = 7 cells tag | ROWS, COLS, SPACE O(m + n) | tiles |
| E | markers live inside the matrix | EXAMPLE grid with one interior zero; row 1 cell and column 2 cell become 0 marks; top row and left column tinted as marker strips; pass 1 code lit | COLUMN MARKERS, ROW MARKERS | grid, bar, code |
| F | real zeros in first row/col: two flags | Real grid with header strips, the real zeros ringed "REAL / MARKER?", two flag tiles first_row, first_col, code lines for the two flags | REAL OR MARKER?, first_row, first_col | grid, code |
| G | dry run | Flags turn True; no new marker; (0,3) marker zeroes the 2 and 5; flags zero first row and column; result cells lit in reading order | first_row, first_col, NO NEW MARKER, RESULT | grid with swap tiles |
| H | time O(mn), space O(1) | Full accepted code, passes lit on their words; TIME and SPACE tags | TIME O(m x n), SPACE O(1) | code |
| I | comment + follow | 3x3 grid with centre 0, small RESULT grid of ?, comment box, follow pill | GIVEN MATRIX, RESULT ? | grid, pill |
