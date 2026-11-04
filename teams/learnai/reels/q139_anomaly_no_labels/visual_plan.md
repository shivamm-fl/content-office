# Visual plan: q139 Fraud Without Labels (anomaly detection)

Idea in one line: a dot plot of card charges where the red "flag line" moves: the average + standard-deviation line gets dragged out by the big charge and lets the second one slip under it; the median + MAD line stays hugging the normal charges and flags both.
The picture that explains it with the sound off: ONE axis (20 normal charges stacked near Rs 500, big charges far right) reused in B, C, F; bar rows reused in D and E (sorted charges, then distances).

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | no fraud labels, find far-from-normal = outlier, 3 steps | A card-charge ledger with a "?" in the FRAUD column on every row; six normal rows get a cyan bracket, the Rs 50,000 row turns red and flips ? to FLAG; then three step pills | FRAUD?, NORMAL, FLAG, OUTLIER, STEP 1/2/3 | custom (panel/el) |
| B | 20 normal near 500 + one 50,000; z-score, std; z 4.47 > 3 | Dot plot: 20 dots pile near Rs 500, one gold dot lands far right at Rs 50,000; mean and std chips pop; a "z = ?" arrow spans pile to dot; a line at z = 3 appears and the big dot turns red with FLAG | EXAMPLE, MEAN, STD, z = 4.47, z = 3, FLAG | custom strip() |
| C | second charge 40000 arrives; std inflates; z 2.75 under 3; hides | Same plot; a second dot lands at Rs 40,000; std chip swells 10541 to 12880 in red and the z = 3 line slides right past the new dot, which stays gold with z = 2.75 and a MASKED stamp | STD, z = 2.75, MASKED | custom strip() |
| D | median = middle of sorted charges, does not move | Sorted bars of 22 charges: 20 short equal bars, two clipped tall bars; the two middle bars glow gold, MEDIAN 506 chip green; a MEAN chip red drifts at 4549 | MEDIAN, MEAN | custom bars |
| E | MAD = median of distances from the median; does not swell | The same bars morph into distance bars (short for normals, clipped tall for the two big); a gold line at the median distance; chips MAD 12 (green) vs STD 12880 (red) | MAD, STD | custom bars |
| F | modified z, flag above 3.5; both caught, 0 of 20 normal | The strip again: old z line ghosted, a green line at 3.5 hugs the pile; both big dots turn red with FLAG; a green chip 0 of 20 FLAGGED | 3.5, FLAG, 0 / 20 | custom strip() |
| G | only amount; many features -> Isolation Forest; flag = human review | Three stacked boxes: AMOUNT ONLY, then AMOUNT/TIME/LOCATION chips into ISOLATION FOREST, then FLAG arrow to HUMAN REVIEW with a user icon | AMOUNT ONLY, ISOLATION FOREST, HUMAN REVIEW | M.box / M.arrow |
| H | interview line + comment + follow | An answer card with MEDIAN and MAD rows in green and AVG + STD struck in red; then COMMENT card with HAAN / NAHI and a + FOLLOW pill | INTERVIEW ANSWER, MEDIAN, MAD, COMMENT KARO | recipe 11 |
