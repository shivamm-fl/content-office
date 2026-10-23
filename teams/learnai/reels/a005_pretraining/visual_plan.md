# Visual plan: Day 5, Pretraining (a005, @ai.learnvora), owner's locked script of 2026-10-23

Idea in one line:
Pretraining has no human labelers: the model hides the next word of raw text, guesses, and the text itself is the answer key; the loss falls as it reads (real toy run `state/runs/a005_pretrain_run.py`: 3.58, 3.09, 2.74, 2.37, 2.19).
The picture that explains it with the sound off: a pile of text feeds ChatGPT under a red LABELS ? tag; humans are crossed out and the text row is ringed as the answer key; the last word of "the dog sat on the rug" is hidden; a cycle guess, reveal, loss, update; the real loss line falling over 10, 20, 40, 53 words.

Look: clean-reel. Cyan = model and its words, gold = key value, green = right, red = wrong. Invented data carries an EXAMPLE pill.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | Interviewer asked: who put labels on the dataset when ChatGPT was pretrained? | Three text pages drop in under the hook from frame 0, an arrow carries them to a ChatGPT box, then a gold PRETRAINING pill and a red LABELS ? pill land | DATASET, CHATGPT, PRETRAINING, LABELS ? | custom pages, M.box, M.arrow |
| B | most say humans and get rejected; no human labeler; the text is the answer key | A person icon labelled HUMANS gets a red cross and a REJECTED pill, NO HUMAN LABELER; it fades and the sentence the dog sat on the rug appears on a page, ringed gold, with TEXT = ANSWER KEY | HUMANS, REJECTED, NO HUMAN LABELER, TEXT = ANSWER KEY | M.icon, custom chips |
| C | hide the next word of a sentence: the dog sat on the ...; let the model guess | The sentence chips with the last word covered by a gold question box; six equal guess bars rise under it | HIDE NEXT WORD, MODEL GUESSES | custom chips and bars |
| D | a toy model, a small corpus of 53 words and 12 unique words | A Python window shows four real lines of the invented text, then two stat cards count up to 53 and 12 | TOY MODEL, EXAMPLE, WORDS, UNIQUE | custom code window, M.count |
| E | weights start random; zero idea of language; equal probability over 12 words | A model box with a row of random weight numbers, RANDOM and ZERO IDEA pills, then twelve equal bars | WEIGHTS, RANDOM, ZERO IDEA, EQUAL: 1/12 EACH | M.box, custom bars |
| F | the error score, the loss, is 3.58 | A big card counts up to 3.58 with the label LOSS and a marker at the HIGH end of a low to high meter | LOSS, ERROR SCORE, LOW, HIGH | M.count, custom meter |
| G | the cycle: guess, real word revealed, loss calculated, weights updated | A four-node loop lights node by node | ONE CYCLE, GUESS, REVEAL, LOSS, UPDATE | M.loop |
| H | after 10, 20, 40 words loss is 3.09, 2.74, 2.37; after the whole text 2.19 | The real loss curve (54 points) draws segment by segment with a gold dot and number at 0, 10, 20, 40, 53 | WORDS READ, LOSS, LOSS FALLS, SETTLES | custom SVG chart |
| I | loss is never zero because several words are valid after one word | A the chip fans out arrows to cat, dog, mat, rug, all ticked green, a LOSS > 0 pill | LOSS > 0, SEVERAL VALID | custom chips, M.arrow |
| J | a real LLM has billions of transformer parameters, not a count table; same rule: predict, loss, adjust | A crossed COUNT TABLE beside a TRANSFORMER box, a BILLIONS OF PARAMETERS pill, then three stacked rule pills | COUNT TABLE, TRANSFORMER, PREDICT NEXT TOKEN, CALCULATE LOSS, ADJUST WEIGHTS | M.box, custom pills |
| K | at this stage the model only completes text, it is not a helpful assistant | PRETRAINED box, text chips continuing, a crossed Question? bubble, red NOT AN ASSISTANT | PRETRAINED, COMPLETES TEXT, NOT AN ASSISTANT | M.box, custom bubble |
| L | human labels come later in fine-tuning; who gave labels? comment HUMAN or KISI NE NAHI; follow | PRETRAINED arrow to FINE-TUNING with two Q to A cards and HUMAN LABELS, then a comment panel with two pills, a comment bar, 150 DAYS OF AI and a FOLLOW pill that presses | FINE-TUNING, HUMAN LABELS, WHO GAVE LABELS?, HUMAN, KISI NE NAHI, FOLLOW | M.box, M.pill |
