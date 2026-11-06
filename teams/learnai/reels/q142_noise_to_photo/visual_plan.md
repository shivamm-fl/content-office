# Visual plan q142

Idea in one line: an image model starts from pure static and, over about 25 steps of "predict the noise, remove a bit", a picture appears; the prompt steers every step.

| Scene | Spoken (short) | Picture | Labels | Built with |
|---|---|---|---|---|
| A | You wrote a prompt, noise became a photo in 25 steps, how? | A prompt card "a cat on a sofa" feeds an arrow into a square of grey TV static; tags land on the spoken words | NOISE, 25 STEPS, ?, INTERVIEW QUESTION | custom frame of 100 static tiles over a cat drawing |
| B | Not stored photos; start from noise, remove a bit each step, 3 steps | Small static frame clears a little; three number pills; a shelf of six stored photos with a glue arrow to a dashed NEW PHOTO? tile and a red stamp | START, STORED PHOTOS, NO PHOTO YET, STATIC | custom frame, panel, M.arrow |
| C | Step 1: noise the size of the output | Static frame, an arrow down to a dashed frame of the same size; four gold quadrants show every part is built later | NOISE, SAME SIZE, OUTPUT SIZE, NO PHOTO INSIDE | custom frame, M.arrow |
| D | Step 2: loop 25 times, model predicts noise, scheduler removes a bit | One big frame clears gradually while a STEP n / 25 counter climbs; MODEL and SCHEDULER boxes with an arrow; fewer steps trade-off tags | STEP 1 / 25, MODEL, SCHEDULER, PREDICT NOISE, REMOVE A BIT | custom frame tween, M.box |
| E | Step 3: the prompt steers each step through embeddings | Prompt card, text encoder box, a row of example numbers, arrow into a frame that clears toward the cat; red stamp for no prompt | TEXT ENCODER, WORDS → NUMBERS, STEERS EVERY STEP | M.box, M.arrow, custom frame |
| F | Latent space, decoder, denoising is heaviest | A small coarse 4x4 tile square (latent) with tags, an arrow into a DECODER box and the full cat image below | LATENT SPACE, SMALL, 25× LOOP, HEAVIEST PART, DECODER | custom tiles, M.box |
| G | Interview answer | Five stacked boxes light in order: stored photos (crossed), noise, prompt, remove noise x steps, decoder to image | STORED PHOTOS, RANDOM NOISE, PROMPT, DECODER | M.box |
| H | Comment which image tool, follow | Comment card with TOOL NAME pill and the follow pill | COMMENT KARO, + FOLLOW | panel, M.pill |
