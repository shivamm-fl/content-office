# Visual plan: a007 Tokens decide your bill (sound off: the same refund message cut into 10 tiles vs 42 tiles, the meter and the window fill by tokens, not words)

Idea in one line: AI is billed and limited in tokens (input and reply), and one sentence costs 10 tokens in English but 42 in Devanagari, so count tokens, not words.
The picture that explains it with the sound off: two receipts for the same message, the sentence cut into coloured tiles (10 vs 42), a price bar and a context-window square that fill by tiles, and a final checklist of three mistakes.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | Same message in Hindi, why 4x bill? | Two receipt cards side by side with the same refund chat bubble, ENGLISH total Rs 100 and HINDI total Rs 420 landing on "bill" and "4" with an x4 tag | ENGLISH, HINDI, EXAMPLE, x4 | custom glass, tiles |
| B | Bill comes from tokens not words; token = small piece the model reads | A muted WORDS pill crossed out in red, a TOKENS pill in gold, then three tiles of a short phrase read by a model icon | WORDS, TOKENS, TOKEN | custom pills, M.icon |
| C | Courier weighs the parcel, not the items; AI the same | Two parcels: one full of light items (1 KG), one single heavy item (4 KG) with prices; below ITEMS = WORDS and WEIGHT = TOKENS | ITEMS, WEIGHT, WORDS, TOKENS | custom SVG parcels |
| D | English sentence: 9 words, 10 tokens | Chat bubble with the sentence, ten coloured tiles drop under it word by word, a counter reaches 10 | 9 WORDS, 10 TOKENS | custom tiles |
| E | Hindi: 8 words, 42 tokens, 4x; this tokenizer only | Hindi bubble, 42 small tiles fill a grid, then two bars to scale 10 vs 42 with an x4 tag | 8 WORDS, 42 TOKENS, x4, THIS TOKENIZER | custom tiles, bars |
| F | Example price Rs 1 per 1,000 tokens | A stack of token tiles equals a gold coin, EXAMPLE and NOT REAL PRICE pills | 1,000 TOKENS, Rs 1, EXAMPLE | custom, M.icon coin |
| G | 10,000 messages a day: Rs 100 vs Rs 420; words look equal | Two horizontal bars to scale (100 vs 420) per day, then 9 WORDS = 8 WORDS equal-sign card with a red cross | 10,000 / DAY, Rs 100, Rs 420, LOOKS EQUAL | custom bars |
| H | Bill counts input and output tokens, rates differ | A receipt with an INPUT row of cyan tiles and an OUTPUT row of violet tiles, each with its own price bar of different length | INPUT, OUTPUT, RATE | custom glass, tiles |
| I | Context window holds prompt and reply, in tokens | A tall window square with a grid; cyan prompt cells fill, then violet reply cells fill the same window | CONTEXT WINDOW, PROMPT, REPLY | custom grid |
| J | 8,000-token window: 800 vs 190 messages | Two equal window squares, English filled with small cells, Devanagari with 4x bigger cells (scale true), big counts 800 and 190 | 8,000 TOKENS, 800, 190 | custom CSS grids |
| K | Each model's tokenizer differs, count in the same model | Same sentence cut two ways (10 pieces vs 7 pieces, EXAMPLE), then a model icon with a green check COUNT HERE | MODEL A, MODEL B, EXAMPLE, COUNT HERE | custom tiles, M.icon |
| L | Three mistakes | Three stacked cards with red crosses, each with its own mini picture: 9 WORDS not equal to 10 gold tiles, six solid prompt tiles beside six dashed empty reply tiles, two different cuts of the same text | COUNT WORDS, FORGET REPLY, SAME CUT? | custom cards, tiles, M.icon |
| M | Challenge 14 tokens x 10,000, comment; follow | Gold card 14 x 10,000 = ?, a comment card and a pressed +FOLLOW pill | CHALLENGE, COMMENT, + FOLLOW | custom, M.pill |
