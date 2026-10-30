# Visual plan: q127 golden dataset (variety beats count)

Idea in one line: a golden dataset is a fixed list of inputs with the answer you expect; a list of 20 alike cases stays green after a prompt change, a list of 20 varied cases drops to 13/20.
The picture that explains it with the sound off: two 20-cell test sheets, one all alike (20/20 green), one in five kinds where red cells appear in the Hinglish and partial-refund columns (13/20).

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | interviewer: how do you build a golden dataset | A TEST LIST card from frame 0 with four input rows and their expected answers, ticks landing on each row under the hook text | INPUT, EXPECTED | custom list card |
| B | fixed list of inputs with expected answers; variety over count; three steps | The list card header and three rows land on the words input and answer, three coloured kind chips appear, then VARIETY > COUNT and 3 STEPS | INPUT, EXPECTED, TYPICAL, EDGE, ADVERSARIAL, 3 STEPS | custom card + chips |
| C | evaluation = rescore after a prompt change; invented refund bot | Vertical flow NEW PROMPT to BOT to SCORE ON LIST with arrows, then an EXAMPLE pill and REFUND BOT tag | EVALUATION, NEW PROMPT, BOT, SCORE, EXAMPLE | M.box + M.arrow |
| D | 20 alike cases 20/20; 20 varied 13/20; Hinglish 4 and partial 3 break | Two sheets of 20 cells: the alike sheet turns all green (20/20); the varied sheet in five columns flips to 13 green and 7 red, rings on the Hinglish and partial columns with -4 and -3, a BLIND SPOT stamp on the alike sheet | EXAMPLE, ALIKE, VARIED, 20/20, 13/20, HINGLISH, PARTIAL, -4, -3, BLIND SPOT | custom cell sheets |
| E | step 1 typical cases from real users | REAL USERS box emits three message bubbles that are copied into a TEST LIST card, tag LIKE TRAFFIC | 1 TYPICAL, REAL USERS, TEST LIST, LIKE TRAFFIC | box + bubbles + list |
| F | step 2 edge and adversarial; bot fails here first | Two panels: EDGE with a misspelt and a partial-refund message, ADVERSARIAL with an angry message; arrow to BOT which turns red with BREAKS HERE | EDGE, ADVERSARIAL, BOT, BREAKS HERE | panels + chips |
| G | step 3 production failure becomes a test | A user message and the bot's wrong reply (red cross) drop into the TEST LIST with the correct answer (green), tag BUG becomes TEST | 3 PRODUCTION, WRONG, + NEW, BUG, TEST | bubbles + list row |
| H | how many examples: no official number; 20 was ours; start small, grow | A big ? becomes 20 with an OUR EXAMPLE pill; a small row of tiles grows with a violet NEW KIND tile and a second row | NO OFFICIAL NUMBER, 20, OUR EXAMPLE, START SMALL, NEW KIND, GROW | custom tiles |
| I | what to say in the interview | Six stacked boxes light on their spoken words | SAY THIS, FIXED LIST, TYPICAL, EDGE, ADVERSARIAL, FROM PRODUCTION, VARIETY > COUNT | M.box |
| J | how many cases in your list; comment; follow | Question tag, a COMMENT card with number chips, FOLLOW button presses | HOW MANY?, COMMENT, FOLLOW | custom |
