# Visual plan: a012 Parameters: what 7B and 70B actually mean

Idea in one line:
A parameter is one learned number; 7B means 7 billion of them; the model file is that list, so file size = numbers x bytes; more numbers = more capacity but more memory, and not always better.
The picture that explains it with the sound off: a download list with two files (7B, 70B) whose number counters run to 7 and 70 billion; one number-cell with a dial; true-scale bars of 14 GB vs 140 GB that shrink at 4-bit; 7 vs 70 cells; ends on a quiz. Byte sizes are our arithmetic (EXAMPLE).

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | download page shows 7B and 70B, what differs; B is billion; 7 and 70 billion numbers = parameters | A download list with two file rows 7B and 70B, each with a strip of number cells; a B = BILLION pill; each row's counter runs up to 7,000,000,000 and 70,000,000,000; a gold ring and PARAMETERS pill | 7B, 70B, B = BILLION, PARAMETERS | custom DOM, counter tween |
| B | parameter is one learned number: weight or bias; training learns them; a tiny net had 9, here billions | One big number cell 0.31 ringed; a dial beside it turns (weight) and a fixed cell +2 (bias); then a Google 21-parameter example network shrinks and a dense grid of cells fills the lower half | PARAMETER, WEIGHT, BIAS, 9, BILLIONS | custom DOM, SVG lines, grid background |
| C | file is only a list of numbers, 2 bytes each, 7B x 2 = 14 GB, 70B = 140 GB | File card with a row of number cells each tagged 2 B; calc card 7B x 2 B = 14 GB; two true-scale bars, 14 GB short and 140 GB ten times longer | EXAMPLE, 2 BYTES, 14 GB, 140 GB, WEIGHTS ONLY | custom |
| D | 70B does not just run on a laptop; shrink each number to 4-bit half byte; 3.5 GB and 35 GB | Same two bars; a cell tag changes from 2 BYTES to HALF BYTE and both bars shrink to a quarter, labels 3.5 GB and 35 GB | HEAVY, 4-BIT, HALF BYTE, 3.5 GB, 35 GB | custom, same bars |
| E | more parameters = more room to learn = capacity; not always better; 7B fast and cheap, less memory | Two cards: 7B with 7 cells, 70B with 70 cells; CAPACITY pill; then 7B gets FAST and CHEAP green pills, 70B a MORE MEMORY red pill and a NOT ALWAYS stamp | CAPACITY, FAST, CHEAP, MORE MEMORY, NOT ALWAYS | custom |
| F | difference: 7B fewer numbers small file; 70B ten times numbers, ten times file | Two rows of equal blocks: one block for 7B, ten blocks for 70B, a 10x pill between, same colours as the bars | 7B, 70B, 10x | custom |
| G | quiz: 1 byte each, how many GB for 7B? comment, follow | A 7B block with a 1 BYTE cell leads via an arrow to a big ? GB box in a comment card; a comment bar; a FOLLOW pill that presses | COMMENT, 1 BYTE, ? GB, + FOLLOW | recipe 11 |
