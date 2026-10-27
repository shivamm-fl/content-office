# Visual plan: a009 Training vs inference

Idea in one line: training changes the numbers (w, b) step by step; inference only runs the locked numbers on new input.
Picture: a chat first, then a real toy run (5 dots, a line nudged until the gaps vanish), a padlock closing on w and b, and inputs dropped into the locked box.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | ChatGPT se sawaal, kya seekha? Student padhta, exam hall | Chat window with the typed question and a reply from frame 0; a gold "learned from me?" chip flips to a green "already learned"; below, a STUDY card then an EXAM HALL card with TRAINING and INFERENCE tags | YOU, LEARNED FROM ME?, ALREADY LEARNED, STUDY, EXAM HALL, TRAINING, INFERENCE | custom bubbles + M.icon |
| B | Toy model, 5 points on y = 2x + 1, w and b, loss | Chart with 5 gold dots, dashed target line, flat model line at zero, red gap segments from dots to the line (the loss), w and b tiles, a loss bar | EXAMPLE, WEIGHTS, w, b, LOSS | custom SVG chart |
| C | Step 1, 10, 500: loss 15.84, 0.03, 0.0000 | Same chart: the model line swings up to the dots with the real run values (w 1.0, 2.10, 2.0039), gaps shrink, the loss bar shrinks to a sliver, w and b tiles count, line turns green | STEP 1, STEP 10, STEP 500, LOSS, 500 STEPS | custom SVG chart + state tween |
| D | Lock the weights; x=10 gives 21.0; x=100 gives 201.4 | Padlock closes on the w and b tiles in a TRAINED MODEL panel; input chip goes through a times-w-plus-b box to an answer chip, twice; tiles get a green ring: unchanged | LOCKED, x = 10, 21.0, x = 100, 201.4, INFERENCE, SAME | custom + M.icon |
| E | Training slow, costly, once; inference cheap, many | A long gold time bar (once) against a swarm of small answer chips (many); then a user message goes into the locked box, the weights stay SAME, a red cross on LEARNS? | TRAINING, ONCE, SLOW, COSTLY, INFERENCE, CHEAP, SAME, LEARNS? | custom |
| F | Real models have billions of weights; retraining is separate | Two dots (toy) against a big grid of dots (real model); then TRAIN to ANSWER row and a dashed second row NEW DATA to TRAIN AGAIN tagged SEPARATE JOB | TOY, EXAMPLE, BILLIONS, TRAIN, ANSWER, NEW DATA, TRAIN AGAIN, SEPARATE JOB | custom + M.box |
| G | Remember; challenge x=50; comment; follow | Two small cards (TRAINING w changes, INFERENCE w locked), then the challenge x = 50 into the box with ? and w?; comment card and FOLLOW pill | TRAINING, INFERENCE, CHALLENGE, x = 50, COMMENT, + FOLLOW | custom |
