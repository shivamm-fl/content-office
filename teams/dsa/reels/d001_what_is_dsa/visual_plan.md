# Visual plan: d001 What is DSA

Idea in one line: DSA = a data structure (how data is kept) + an algorithm (the steps on it); good steps stay fast when the data is huge: 1,000,000 one by one vs about 20 by halving.
The picture that explains it with the sound off: one long row of name tiles A to Z that is first scanned tile by tile (counter climbs, red cross) and then halved again and again (counter stops at 20, green).

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with |
|---|---|---|---|---|
| A | Interviewer asks: 10 lakh names, find one in 20 steps | Hook from frame 0: an interviewer speech bubble over a tall column of name tiles (a phone contacts list) and a step counter reading 20 beside a magnifier; on "DSA" a DSA chip lands on the column; the counter 1,000,000 vs 20 shown as two big numbers | INTERVIEW, 10 LAKH NAMES, 20 STEPS?, DSA | custom (M.box, M.pill, M.count) |
| B | Wrong way: look at every contact, last one = 10 lakh steps | Contacts list; a magnifier hops tile by tile down the list while the STEPS counter runs up to 1,000,000; on the last name a red cross and a stamp | ONE BY ONE, STEPS, 1,000,000 | custom (tiles, tween {u:0} counter) |
| C | Two things: data structure and algorithm | Split in two: top the sorted name column highlighted gold and tagged DATA STRUCTURE; below, a row of three small arrows (steps) tagged ALGORITHM; each chip pops on its spoken word | DATA STRUCTURE, ALGORITHM | M.box, M.pill, M.arrow |
| D | Step 1: keep names sorted A to Z | Shuffled tiles slide into A..Z order; a small A to Z arrow beside them; a lock-like check on SORTED | SORTED A-Z | custom (M.box tiles + slide) |
| E | Step 2: open in the middle, throw away half | A sorted row of tiles with a dictionary icon at the middle; the middle tile is checked, the half that cannot hold the name dims and drops; the remaining half shows again | MIDDLE, HALF GONE, BINARY SEARCH | custom (tiles, dim) |
| F | Step 3: repeat; Python run: 1,000,000 vs 20 | Two true-scale bars from the real run: 1000000 (full bar, red) and 20 (a sliver, green); the printed output card `1000000 20 True` | ONE BY ONE, HALVING, REAL RUN | M.bars-like custom (no track), M.count |
| G | Condition: sorted. Why interviews ask (our own reasoning). Amazon page | Sorted-needed: a shuffled row with a red cross beside the halving. Then a thought-bubble tagged OUR REASONING over a small data-grows-steps-hold chart; a small Source: amazon.jobs label | NEEDS SORTED, OUR REASONING, Source: amazon.jobs | custom, M.pill |
| H | Recap + comment: 40 lakh names, how many steps | Two recap chips (DATA STRUCTURE = row, ALGORITHM = steps); COMMENT card with a "40 LAKH = ?" prompt and an empty comment bar; handle and + FOLLOW pill that presses on "follow" | 40 LAKH = ?, COMMENT, + FOLLOW | recipe 11 |

Facts: the run printed `1000000 20 True` (qa/d001/run_output.txt, worst case target last, counts not seconds). 40 lakh names = 22 steps (also in that file), for the caption only.
