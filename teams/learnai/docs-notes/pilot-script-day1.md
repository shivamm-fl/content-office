# Pilot script, Day 1: How a model learns (technical version, draft for the owner, not wired into any queue)

Floor: LearnAI (`learnai`, @ai.learnvora) | day type: `demo` | working id: a001 | hook_type: `direct_question`
Roadmap Day 1 (S1). The ladder opens here: the four old opening days were dropped on the owner's word (2026-10-19). Built to `docs-notes/teaching-flow.md`, with the owner's rules of 2026-10-19 (`.claude/skills/hinglish-script`): human voice (no source-talk, checked with the `no-ai-slop` and `humanizer` skills), numbers follow the word after them, formulas in English words, and **every technical term is explained at its first use or is not said**.
Length: **258 spoken words**; a real Swara run of exactly this text gave **119.0 s** (scene voice A 11.1, B 14.3, C 7.6, D 9.8, E 33.4, F 10.2, G 11.1, H 15.6). The gate limit is 120 s, so there is 1 s of room: the cut-first list in section 7 is ready. `lint_script.py` of this floor prints VERDICT OK with 3 WARN: the old "no aaj hum" rule (the owner asked for this opening), the hook question longer than 10 words (same reason), and a stale 60 to 100 s window.
Stand-alone: no "kal", no "part", no tease. Terms (all explained in the reel): parameter and weight, label, forward pass, loss function and MSE, gradient, gradient descent, learning rate, iteration, converge, divergence, training loop.

## 1. Opening and hook
- Chosen (owner wording): `150 Days of AI Mastery ke Day 1 mein, aaj hum dekhenge: model kaise seekhta hai?`, then the basketball line as the plain answer: throw, see how far you missed, fix.
- Header on every screen: `150 DAYS OF AI · DAY 1` (owner, 2026-10-19). The series name spoken is "150 Days of AI Mastery" (the owner typed "for"; the header keeps "150 Days of AI": the owner can pick one name).

## 2. The script the owner reads (Roman Hinglish, numbers as they are spoken)
1. "150 Days of AI Mastery ke Day one mein, aaj hum dekhenge: model kaise seekhta hai? Jaise tumne basketball seekhi thi: phenko, dekho kitna chuke, sudharo."
2. "Ek input x, yaani study hours, aur ek label y, yaani marks. Ek ghante par do, do par chaar, teen par chhah. Model mein ek hi parameter hai: weight w. Prediction equals w times x."
3. "Pehla step: forward pass, yaani prediction nikalo. w ko zero initialize kiya, to har prediction zero aaya."
4. "Doosra step: loss function. MSE, yaani mean squared error: prediction aur label ke gap ka square, phir average. Loss eighteen point six seven."
5. "Teesra step: gradient descent, yaani gradient ki ulti taraf chalna. Gradient batata hai, w badalne par loss kis direction mein, kitna badlega. Gradient minus eighteen point six seven. Negative hai, isliye w badhao. w equals w minus learning rate times gradient. Learning rate yaani kadam ka size, point one. Ek update, yaani ek iteration: w one point eight seven, loss point zero eight. Four iterations mein w converge hua, yaani do par tik gaya, loss lagbhag zero."
6. "Ab learning rate badlo: point five. Pehli iteration mein loss atharah se seedha do sau ikyavan. w har baar target ke paar nikal raha hai: ye divergence hai."
7. "Model mein arbon parameters hote hain. LLM mein bhi yahi chalta hai: loss batata hai, agla word kitna galat guess hua. Model ke andar answers nahin, trained weights hote hain."
8. "Yahi training loop hai: forward pass, loss, gradient, update, phir repeat. Ab tum batao: marks agar teen, chhah, nau hote, to w kis value par converge hota? Comment mein likho, aise AI ideas ke liye follow karo."

Numbers (owner rule: the word AFTER a number decides its language): Hindi before a Hindi word ("ek ghante", "do par", "do sau ikyavan", "teen, chhah, nau hote"), English before an English word ("four iterations") and for readings ("loss 18.67", "gradient -18.67", "0.1", "1.87", "0.08", "0.5"); the formulas are English words.
Removed on purpose after the owner's check (2026-10-19): cross-entropy and backpropagation (not explained in the reel, so not said), "update rule" as a spoken label, the second analogy sentence. The basketball picture stays as the one human anchor.

## 3. Narration source (Hindi in Devanagari, English in Roman; `|` clause, `||` thought, `display{spoken}` for every number and for single letters)
```
A: @hook 150{one-hundred-fifty} Days of AI Mastery के Day 1{one} में, | आज हम देखेंगे: model कैसे सीखता है? || जैसे तुमने बास्केटबॉल सीखी थी: | फेंको, देखो कितना चूके, सुधारो।
B: एक input x{एक्स}, यानी study hours, | और एक label y{वाई}, यानी marks। || 1{एक} घंटे पर 2{दो}, | 2{दो} पर 4{चार}, | 3{तीन} पर 6{छह}। || model में एक ही parameter है: | weight w{डब्ल्यू}। || prediction equals w{डब्ल्यू} times x{एक्स}।
C: पहला step: forward pass, | यानी prediction निकालो। || w{डब्ल्यू} को 0{zero} initialize किया, | तो हर prediction 0{ज़ीरो} आया।
D: दूसरा step: loss function। || MSE, यानी mean squared error: | prediction और label के gap का square, फिर average। || loss 18.67{eighteen-point-six-seven}।
E: तीसरा step: gradient descent, | यानी gradient की उल्टी तरफ़ चलना। || gradient बताता है, | w बदलने पर loss किस direction में, कितना बदलेगा। || gradient -18.67{minus-eighteen-point-six-seven}। | Negative है, इसलिए w{डब्ल्यू} बढ़ाओ। || w{डब्ल्यू} equals w{डब्ल्यू} minus learning rate times gradient। || learning rate यानी कदम का size, | 0.1{point-one}। || एक update, यानी एक iteration: | w{डब्ल्यू} हुआ 1.87{one-point-eight-seven}, | loss 0.08{point-zero-eight}। || 4{four} iterations में w{डब्ल्यू} converge हुआ, | यानी 2{दो} पर टिक गया, | loss लगभग zero।
F: अब learning rate बदलो: 0.5{point-five}। || पहली iteration में loss 18{अठारह} से सीधा 251{दो-सौ-इक्यावन}। || w{डब्ल्यू} हर बार target के पार निकल रहा है: | ये divergence है।
G: model में अरबों parameters होते हैं। | LLM में भी यही चलता है: || loss बताता है, | अगला word कितना गलत guess हुआ। || model के अंदर answers नहीं, | trained weights होते हैं।
H: यही training loop है: | forward pass, loss, gradient, update, फिर repeat। || अब तुम बताओ: | marks अगर 3{तीन}, 6{छह}, 9{नौ} होते, | तो w{डब्ल्यू} किस value पर converge होता? | Comment में लिखो, | ऐसे AI ideas के लिए follow करो।
```

## 4. Beat table (real Swara timings)
| # | seconds | says | the picture that moves | on-screen label (1 to 3 words) |
|---|---|---|---|---|
| A | 0 to 11.7 | series opening, the question, the basketball answer | a model icon beside a hoop and a ball; the three marks THROW / MISS / FIX land one by one; a DAY 1 to DAY 150 progress bar | HOW MODELS LEARN |
| B | 11.7 to 26.6 | input x, label y, the cards, one parameter w, prediction = w times x | cards x=1,y=2 / x=2,y=4 / x=3,y=6 land on the spoken pairs (EXAMPLE pill); the dial w; the formula chip | INPUT x / LABEL y / PARAMETER w |
| C | 26.6 to 34.7 | step 1, forward pass, w = 0, every prediction 0 | STEP 1/3 FORWARD PASS; dial at 0; predictions 0, 0, 0 against the red labels | FORWARD PASS |
| D | 34.7 to 45.1 | step 2, loss function, MSE, loss 18.67 | gap bars per card, squared, averaged into the gauge; the formula small | STEP 2/3 LOSS FUNCTION / MSE |
| E | 45.1 to 79.1 | step 3, gradient descent: gradient, its sign, the update rule, learning rate, one iteration, four iterations, converged | loss curve with a dot sliding against the gradient arrow; GRADIENT -18.67 and NEGATIVE -> INCREASE w; the update rule chip; LEARNING RATE = STEP SIZE 0.1; ONE UPDATE = ONE ITERATION; the real table (iteration, w, loss, gradient) lighting row by row; CONVERGED | GRADIENT DESCENT / LEARNING RATE / CONVERGED |
| F | 79.1 to 89.9 | learning rate 0.5, loss 18 to 251, divergence | the same table with 0.5; the dot zig-zags off the curve; a small ball over the backboard | DIVERGENCE |
| G | 89.9 to 101.6 | billions of parameters; the same loop in an LLM; loss = how wrong the next word was; weights, not answers | field of dials; the strip "the cat sat on the" with a wrong guess marked as loss; the shelf of answers crossed out | BILLIONS OF PARAMETERS / WEIGHTS, NOT ANSWERS |
| H | 101.6 to 119.0 | the training loop named, the check question | the closed loop FORWARD PASS -> LOSS -> GRADIENT -> UPDATE -> REPEAT; the question card (answer not shown); the handle card | TRAINING LOOP / CHECK YOURSELF |
Look: clean-reel (flat navy and gold, red only for wrong, no glow or flicker), the `STEP n/3` kicker starts at C. Sound cues are in `spec.json` (25, tied to the clause numbers of the narration).

## 5. Caption (ig-caption linter: READY, 771 characters, 3 hashtags, 1 ask)
```
Day 1/150: Model kaise seekhta hai? Ek chhote example se, asli numbers ke saath.

Setup: input x = study hours, label y = marks. 1 ghante par 2, 2 par 4, 3 par 6. Model mein ek hi parameter hai, weight w, aur prediction = w x x.

Forward pass: w = 0 se shuru, to har prediction 0.
Loss function (MSE): loss = 18.67.
Gradient descent: gradient = -18.67, negative hai, to w badhao. Update: w = w - learning rate x gradient. Learning rate 0.1 par ek iteration mein w = 1.87, loss = 0.08. 4 iterations mein w = 2 par converge.
Learning rate 0.5 kar do, to pehli iteration mein loss 18.67 se 251 par jata hai aur w diverge karta rehta hai.

Check yourself: marks 3, 6, 9 hote, to w kis value par converge hota? Comment mein likho.

Jawab: 3.

#AI #MachineLearning #150DaysOfAI
```

## 6. What was run, and where the facts come from (notes for the team and the reviewers; none of this is spoken)
Python 3.12, plain loops, no libraries. Real output (`gradient` is the derivative of the mean squared error with respect to w):
```
lr 0.1: it0 w 0.0 loss 18.667 grad -18.667 | it1 w 1.867 loss 0.083 grad -1.244 | it2 w 1.991 loss 0.0 grad -0.083 | it3 w 1.999 loss 0.0 grad -0.006 | it4 w 2.0 loss 0.0 grad -0.0
lr 0.5: it0 w 0.0 loss 18.667 grad -18.667 | it1 w 9.333 loss 250.963 grad 68.444 | it2 w -24.889 loss 3374.058 grad -250.963 | it3 w 100.593 loss 45362.33 grad 920.198 | it4 w -359.506 loss 609871.327 grad -3374.058
marks 3, 6, 9 with lr 0.1: w 0.0, 2.8, 2.987, 2.999, 3.0 (the answer of the check question is 3)
```
Update check: w = 0 - 0.1 x (-18.667) = 1.867. Sources (fetched with WebFetch on 2026-10-19), used only to make sure the lines are true:
- https://en.wikipedia.org/wiki/Gradient_descent (steps against the gradient with a step size, also called the learning rate; too large leads to overshoot and divergence)
- https://en.wikipedia.org/wiki/Loss_function (squared error loss: large errors count more)
- https://en.wikipedia.org/wiki/Large_language_model (GPT models are first pretrained to predict the next word; the largest models have more than 100 billion parameters)
- https://arxiv.org/abs/2005.14165 (GPT-3: 175 billion parameters; the reel says only "arbon")
- https://en.wikipedia.org/wiki/Backpropagation and https://en.wikipedia.org/wiki/Cross-entropy were read for the next days of the ladder; they are NOT used here (not explained in this reel, so not said).

## 7. Checks
- `lint_script.py` VERDICT OK, 0 FAIL, 3 WARN (see the header). Shape: `demo` sheet, 3 numbered steps with the kicker from C, a picture change about every 4 s (E has about eight in 34 s), a check question with its answer in the caption.
- Term audit (owner, 2026-10-19): every term above is explained in one clause at first use: parameter = weight, label = marks, forward pass = work out the prediction, MSE = squared gap averaged, gradient = how loss changes with w and which way, gradient descent = walk against the gradient, learning rate = step size, iteration = one update, converge = settle at 2, divergence = overshooting again and again, training loop = the five-word loop of scene H.
- Humanising pass (`no-ai-slop`, `humanizer`): no not-X-but-Y, no staged contrast, no dashes, no source-talk, the recap is the loop itself.
- Voice: the owner's own voice by default, Swara when it is not available; the 119.0 s above is a Swara run.
- Cut first if the take runs past 119 s: "loss lagbhag zero" (3 words), then "Comment mein likho," (3 words, only if the question card carries it), then "aise AI ideas ke liye follow karo" shortened to "follow karo".
- Unsure: (1) scene E is 33 s and carries six ideas (gradient, sign, update rule, learning rate, iteration, convergence): the teaching-flow limit is 3 new terms, and a split into two days (E1 gradient and its sign, E2 learning rate and convergence) is the safe option if the owner finds it too dense. (2) "arbon parameters" is true for the largest models (more than 100 billion) and said as a plain size.
