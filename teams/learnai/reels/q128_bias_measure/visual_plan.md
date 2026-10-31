# Visual plan: q128 measuring bias with paired prompts

Idea in one line: you cannot see bias in a few answers; send 200 pairs that differ only in the name, count the rate per group and count the pairs where the decision flips.
The picture that explains it with the sound off: one grid of 200 pair-tiles (top half name A, bottom half name B) that fills green per group, then dims to leave only the 16 flipped pairs.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | same resume, other name, bot rejects one | Two identical resume cards side by side with only the name line coloured differently; a green stamp lands on one and a red stamp on the other | NAME A, NAME B, SAME, SHORTLIST, REJECT | custom resume cards + stamps |
| B | interview question; bias = decision changes with the name; not by eye; three steps | Name A and name B chips feed one model box whose two outputs differ; NOT BY EYE tag, then three step chips appear | NAME A, NAME B, MODEL, SHORTLIST, REJECT, NOT BY EYE, 1 PAIRS, 2 RATES, 3 FLIPS | M.box + M.arrow + chips |
| C | invented screening bot; five pairs by eye, one differs; chance or name? | A bot box with two outcomes above five pair rows of ticks, one row differing and ringed, tags NAME OR CHANCE and TOO FEW | EXAMPLE, RESUME BOT, PAIR 1-5, TOO FEW | M.box + custom rows |
| D | step 1: 200 pairs, identical resume, only the name differs | A 20 by 10 grid of pair tiles appears, gold top halves for name A and cyan bottom halves for name B | 200 PAIRS, NAME A, NAME B, ONLY NAME DIFFERS | custom pair grid |
| E | step 2: A 90 of 200 = 45 %, B 74 = 37 %, gap 8 points | The same grid turns green per group, then two true-scale bars grow and a dashed box marks the gap | COUNT, A 45 %, B 37 %, GAP 8 PTS | pair grid + bars |
| F | step 3: pairs flipped by the name alone, 16; fix and rerun | The grid dims except 16 ringed flip tiles, a counter runs to 16, then FIX arrow RERUN | 0 to 16 FLIPS, SAME RESUME, FIX, RERUN | pair grid + counter + M.box |
| G | the test only catches what you changed | Three attribute rows: NAME tested green, AGE and CITY not tested red, then both turn to new pairs | ONLY WHAT CHANGED, NAME, AGE, CITY, NOT TESTED, + NEW PAIRS | custom rows |
| H | what to say in the interview | Four big rows each with a small drawing: three grey boxes crossed out, one gold and one cyan card, a block of many tiles, two bars; they land on the spoken words | SAY THIS, FEW OUTPUTS, 1 ATTRIBUTE, MANY RUNS, RATES + FLIPS | custom rows + mini drawings |
| I | which attribute first; comment; follow | Question tag, a COMMENT card with NAME, AGE, CITY chips, FOLLOW button presses | WHICH FIRST?, COMMENT, FOLLOW | custom |
