# Visual plan: a020 Repetition Penalty: Stop the Loop

Idea in one line: greedy always takes the top word, so the same word wins again and the text loops; a repetition penalty lowers the score of an already-used word until a fresh word wins.
One next-word card (word, bar of true relative length, percent) is reused in scenes C to G, so the viewer watches the chai bar shrink and peeni overtake as a dial goes 1.0, 1.2, 1.5. Toy numbers from `state/runs/a020_repetition_run.py`, marked TOY NUMBERS. Gold = key value, cyan = neutral, green = fine, red = problem.

| Scene | Spoken (short) | The picture | Labels | Built with |
|---|---|---|---|---|
| A | Chatbot wrote the same line 3 times | A chatbot window prints "Chai garam hai." three times, tag x3 | CHATBOT, x 3 | bubbles |
| B | Greedy takes the top word; same word wins, loop; fix = lower used word's score | Three stacked cards: GREEDY (bars, top gold), LOOP (chai to chai to chai), FIX (PENALTY to SCORE down) | GREEDY, LOOP, FIX, PENALTY | custom cards |
| C | Each next word gets a score (toy) | Four word rows; their bars grow to true relative length on 47, 26, 17, 10 | TOY NUMBERS, SCORE | next-word card |
| D | Greedy takes chai every time: loop | Card with chai ringed gold, row of chai to chai to chai below, red LOOP | LOOP | next-word card, tiles |
| E | Penalty is one number; 1.0 none, higher stricter | Dial card with marker sliding 1.0 to 1.5, chai tagged USED with a down arrow | PENALTY, USED, NO PENALTY, STRICTER | dial, card |
| F | 1.2: chai 35, peeni 31, chai still top | Dial to 1.2, bars tween, gold ring stays on chai | CHAI STILL TOP, LOOP GOES ON | dial, card |
| G | 1.5: peeni 36 wins | Dial to 1.5, bars tween, ring moves to peeni, sentence chip grows | NEW WORD WINS | dial, card |
| H | Our rule is a toy, not the library formula; start near 1.2 | Toy rule card, not-equal sign, library card; dial settles at 1.2 | OUR TOY RULE, LIBRARY FORMULA, START ≈ 1.2 | custom cards, dial |
| I | Too strong a penalty or an n-gram ban hurts New York | YORK bar crushed to a sliver; ngram=2 chip; New York ok once, second blocked | TOO STRONG, ONCE ONLY, BLOCKED | bars, tiles |
| J | Yes or no? Comment, follow | Three repeated chat lines, comment bar, handle card with FOLLOW | YES OR NO?, COMMENT, FOLLOW | cards |
