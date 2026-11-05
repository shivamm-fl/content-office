# Visual plan: a019 Top-k and Top-p: Trimming the Shortlist

Idea in one line: the model ranks next words by chance, then keeps a shortlist; top-k keeps a fixed count, top-p keeps words until their chances add up to p.
One ranked list card (rank badge, word, bar of true relative length, percent) returns in every scene so the viewer watches one object get trimmed two ways. Toy numbers from `state/runs/a019_topk_topp_run.py`, marked EXAMPLE / TOY NUMBERS. Gold = key value, cyan = neutral, green = kept, red = dropped or unneeded.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels (1-3 words each) | Built with |
|---|---|---|---|---|
| A | 6 options, AI kept only 3 | Under the hook a ranked list of six tea-time words with bars; the top three rank badges turn gold and the bottom three fade out, with a 6 to 3 tag | NEXT WORD, 6 → 3 | custom list card |
| B | Before choosing, AI makes a shortlist; two ways to trim it | A grid of 20 small word tiles; six light up gold and an arrow drops them into a SHORTLIST box; two tiles TOP-K and TOP-P land at the end | ALL WORDS, SHORTLIST, TOP-K, TOP-P | custom grid, tiles |
| C | The model gives each word a chance: biscuit 22, samosa 20, pakoda 18, others lower (toy numbers) | EXAMPLE pill, the sentence chip, then the ranked list with each bar growing on its spoken number | EXAMPLE, CHANCE, TOY NUMBERS | custom list card |
| D | Top-k 3: keep the top 3, drop the rest, pick from those | The same list; K = 3 tile, a gold cut line under rank 3, rows 4 to 6 fade and turn red, kept rows go green, a die tile PICK 1 | TOP-K, K = 3, PICK 1 | custom list card, die |
| E | Top-p 90 percent: add chances from the top until the total reaches 90 | The same list under a running-total meter with a gold marker at 90; each row turns green as it is added and the meter climbs 22, 42, 60, 75, 88, 100; STOP at the end | TOP-P, P = TOTAL CHANCE, STOP | custom list, meter |
| F | Sure model (Delhi 80, Dilli 10): top-p stops at 2, top-k 3 keeps India too | Sharp list with one tall bar; meter jumps to 80 then 90; rows 3 to 6 fade; then India row comes back with a red ring | SURE MODEL, TOP-P: 2 WORDS, TOP-K: 3 WORDS, NOT NEEDED | custom list, meter |
| G | Unsure model: top-p needs all 6, top-k 3 throws away 40 percent | Tea list with the meter climbing through all six rows to 100; then a cut after rank 3 and the meter drops to 60 with a red 40% LOST segment | UNSURE MODEL, KEEPS ALL 6, ALMOST EQUAL, 40% LOST | custom list, meter |
| H | Top-k count is fixed, top-p grows or shrinks with the model's confidence | Two cards with six outline slots per row: SURE MODEL fills 3 slots for top-k and 2 for top-p, UNSURE MODEL fills 3 and 6 | SURE MODEL, UNSURE MODEL, TOP-K, TOP-P | custom slot cards |
| I | Quiz: top-p 50 percent on the tea list, how many words? Comment, follow | Meter with a marker at 50 and no answer, the tea list below with KEPT = ?, then a COMMENT bar and the handle card with FOLLOW | CHECK YOURSELF, KEPT = ?, COMMENT, FOLLOW | custom list, meter |
