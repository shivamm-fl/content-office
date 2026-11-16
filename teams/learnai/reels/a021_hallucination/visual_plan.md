# Visual plan: a021 Hallucination: Why a Fluent Answer Can Be False

Idea in one line: a model picks the likeliest next word and no step checks facts, so a smooth made-up answer (name, page count) can come out; three habits reduce it, none removes it.
One next-word card (name, bar of true relative length, percent) carries the cause (scenes C, D); a three-step strip (1 way out, 2 your docs, 3 ask 5 times) carries the fixes (E, F, G). Toy numbers from `state/runs/a021_hallucination_run.py`, marked EXAMPLE. Gold = key, cyan = neutral, green = fine, red = problem.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | AI gave 312 pages for a fake book; this is hallucination | Invented book cover tile from frame 0, red stamp "does not exist", then a chat: question tile, confident answer tile "312 pages, Ramesh", red ring and tag | THE TIN LANTERN, DOES NOT EXIST, EXAMPLE, HALLUCINATION | custom tiles |
| B | Model picks the likely next word; no step checks facts | A blank slot after "was written by"; a PICK box fills it with Ramesh; a FACT CHECK box below is greyed and crossed | NEXT WORD, PICKS LIKELY, FACT CHECK | custom boxes |
| C | Each name gets a score: 32, 21, 19, 14, 12, and I don't know 2 | Six rows of a card; bars grow to true relative length on each spoken percent | EXAMPLE, SCORE | next-word card |
| D | Top is likeliest not true; guessing gets marks, silence none | Same card with Ramesh ringed and "likely not true" chip; I don't know row red; two score tiles: guess earns marks, silence none | LIKELY ≠ TRUE, GUESS, NO MARKS | card, tiles |
| E | Fix 1: give it a way out | Strip of three steps with 1 lit; a rule tile "Say: I don't know"; the answer tile "I don't know" green, the guess ghost red | WAY OUT, YOUR DOCS, ASK 5x | strip, tiles |
| F | Fix 2: your documents, a quote for each claim, drop the rest | Strip 2 lit; a document card; claim A with a green quote chip, claim B with red no-quote chip that fades and is struck; check pill | YOUR DOCS, QUOTE, NO QUOTE, REMOVED | strip, cards |
| G | Fix 3: ask five times; three different names = unsure | Strip 3 lit; five numbered answer tiles Anita, Ramesh, Vikram, Ramesh, Vikram coloured per name; red tag 3 NAMES, NOT SURE | ASK 5x, 3 NAMES, NOT SURE | tiles |
| H | Fixes reduce, not remove; check date, money, name yourself | Risk bar shrinks to a sliver but stays, tag NOT ZERO; three tiles DATE, MONEY, NAME get green check ticks | REDUCED, NOT ZERO, DATE, MONEY, NAME, YOU CHECK | bar, tiles |
| I | Comment, follow | Fake confident chat lines, comment bar, handle with FOLLOW | COMMENT, FOLLOW | cards |
