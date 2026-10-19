# Visual plan: d001 What is DSA

Idea in one line: DSA = a data structure (how data is kept) + an algorithm (the steps on it); good steps stay fast when the data is huge: 1,000,000 one by one vs about 20 by halving.
The picture that explains it with the sound off: one contact list, first scanned name by name (counter climbs, red stamp), then kept sorted and halved (counter stops at 20, green), true-scale bars from the real run.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | Interviewer asks: 10 lakh names, find one in 20 steps | Hook text over a contacts card with name tiles; a magnifier lands, a DSA chip pops, a red counter climbs to 1,000,000 then a green 20 appears | 10 LAKH NAMES, 20 STEPS?, DSA | custom (panel, tiles, counter), M.icon, M.pill |
| B | Wrong way: look at every contact, last one = 10 lakh steps | Contacts card; the magnifier hops tile by tile down the list while a STEPS counter runs to 1,000,000; a red stamp lands on the last name | ONE BY ONE, STEPS, 1,000,000 STEPS, EXAMPLE | custom (tiles, tween counter, stamp) |
| C | Two things: data structure, algorithm | Two big cards: a sorted name grid tagged DATA STRUCTURE, below it three numbered step boxes joined by arrows tagged ALGORITHM; each pops on its word | DATA STRUCTURE, ALGORITHM, A → Z SORTED | custom (panel, tiles, arrows) |
| D | Step 1: keep names sorted A to Z | Seven shuffled name tiles slide into A to Z order; A and Z markers on the sides; an EARLIER / LATER pair of arrows appears | SORTED A-Z, DATA STRUCTURE, EARLIER, LATER | custom (tiles with y tween) |
| E | Step 2: open in the middle, drop half | Eight sorted tiles with the target tile in violet; the middle tile is picked, a dictionary icon beside; the lower half fades away | MIDDLE, ALGORITHM, BINARY SEARCH | custom (tiles, dim), M.icon, M.pill |
| F | Step 3 repeat; real Python run: 1,000,000 vs 20 | A run card printing `1000000 20 True`; below it a red full-width bar for one by one and a green sliver for halving, drawn to true scale | PYTHON RUN, ONE BY ONE, HALVING, 1,000,000, 20 | custom (card, bars without track) |
| G | Needs sorted; our own reasoning; Amazon prep page | A sorted row with a check beside a shuffled row; then a reasoning card with a growing row of tiles; then an Amazon prep-page doc card with a Source label | NEEDS SORTED, OUR REASONING, Source: amazon.jobs | custom (panels), M.icon, M.pill |
| H | Recap + comment: 40 lakh names | Two recap cards (data structure, algorithm), a COMMENT card with 40 LAKH = ? over an empty comment bar, and a + FOLLOW pill that presses on "follow" | COMMENT KARO, 40 LAKH = ?, + FOLLOW | recipe 11 |

Facts: the run printed `1000000 20 True` (qa/d001/run_output.txt, worst case target last, counts not seconds). 40 lakh names = 22 steps, for the caption only.
