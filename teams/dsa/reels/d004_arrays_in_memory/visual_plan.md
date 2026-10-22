# Visual plan: d004 Arrays: memory mein kaise rakhe jaate hain

Idea in one line: an array is one unbroken block of equal-size boxes, so element i is found with one calculation (start + i x size); inserting in the middle makes every element after it move (about 5 lakh in a 10 lakh array).
The picture that explains it with the sound off: a row of equal memory boxes with a pointer that jumps straight to the last box, a distance bar from START growing +0, +4, +8, then a second row where boxes slide one place right and a counter climbs to 500,000.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | 10 lakh-th element, one step? | A MEMORY panel of boxes 0, 1, 2 ... 999,999; a gold pointer jumps straight to the last box while a red magnifier crawls and is crossed out | ELEMENT #10 LAKH, ONE STEP?, MEMORY, 1 STEP | custom (panel, tiles, pointer, icons) |
| B | Boxes one after another, no gap, equal size, memory | Twelve touching number boxes fill the MEMORY panel one by one, each ringed gold for equal size, with a chip icon below | EXAMPLE, MEMORY, NO GAP, EQUAL SIZE, DATA LIVES HERE | custom (tiles, pills, icon) |
| C | Cinema hall: count to seat 40, do not ask at every seat | A SCREEN bar above seats 1, 2, 3 ... 40; red question marks over seats 1-3 then they turn green as counted; a green arrow arcs to seat 40 where a person icon sits | CINEMA HALL, SCREEN, ?, COUNT NOT SEARCH | custom (tiles, arrow, icon) |
| D | Scattered = 10 lakh steps; array: every box has address and index | Top ARRAY panel with box row gaining gold address markers and index numbers; bottom SCATTERED panel lights, red rings crawl across scattered boxes with a counter to 1,000,000, then it dims | ARRAY, ADDRESS, INDEX, SCATTERED | custom (panels, ring crawl, counter) |
| E | Three steps: start known, index x size, add to start | An ARRAY strip with a START marker over box 0; below a card of rows: START known, SIZE 4 BYTES (EXAMPLE), 3 x 4 = 12, then START + 12 replaces it and box 3 turns green | STEP 1/3, STEP 2/3, STEP 3/3, START, SIZE, ADDRESS | custom (tiles, rows, kickers) |
| F | Formula; index 0 +0, 1 +4, 2 +8; one multiply, one add | Gold formula card; three boxes with gold bars of growing length from a START line (+0, +4, +8 bytes); chips for one multiply and one add; stamp ONE CALCULATION | ADDRESS =, DISTANCE FROM START, 1 MULTIPLY, 1 ADD | custom (bars, pills, stamp) |
| G | Cinema: new person in the middle, the rest shift; same in array, 5 lakh move | Two rows of 7 slots: CINEMA seats then ARRAY boxes; a NEW tile drops into slot 3 and the three boxes behind slide one slot right; a red counter climbs to 500,000 | CINEMA, ARRAY, NEW, 10 LAKH ELEMENTS, ELEMENTS MOVE | custom (slots, slide, counter) |
| H | Read = 1 step, insert grows; same reason | Three cards: READ with green 1 STEP, INSERT with a red bar filling, SAME REASON with six touching boxes ringed gold and NO GAP / EQUAL SIZE | READ, 1 STEP, INSERT IN MIDDLE, GROWS WITH SIZE, SAME REASON | custom (cards, bar, tiles) |
| I | Check: 20 lakh array insert? comment, follow | Two cards: 10 LAKH shows 500,000 MOVE, 20 LAKH shows a red ?; then COMMENT card with empty bar and FOLLOW pill that presses | COMMENT KARO, + FOLLOW | recipe 11 |

Facts: 4 bytes is an example size; no real addresses or seconds on screen. 5 lakh moves for a 10 lakh array (insert in the middle) from the researcher's run (500000 for 1000000 items).
