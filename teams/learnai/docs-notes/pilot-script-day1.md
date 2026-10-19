# Pilot script, Day 1: How a model learns (draft for the owner, not wired into any queue)

Floor: LearnAI (`learnai`, @ai.learnvora) | day type: `demo` | working id: a001 | hook_type: `direct_question`
Roadmap Day 1 (S1). The ladder now opens here: the four old opening days were dropped on the owner's word (2026-10-19). Built to `docs-notes/teaching-flow.md`; the voice and the humanising pass follow the owner's feedback of 2026-10-19: no source-talk in the lines ("docs kehte hain" is never spoken), no stock AI phrasing (checked with the `no-ai-slop` and `humanizer` skills, see section 7).
Length: **278 spoken words** (braces resolved) = about **114 s** at the **2.44 words per second measured on a real Swara run** (the d001 dsa reel: 268 words = 110.0 s). `lint_script.py` of this floor still assumes 2.3 w/s and an old 60 to 100 s window, so it prints a WARN (about 121 s); it reports VERDICT OK with no FAIL.
Stand-alone: no "kal", no "part", no tease. Three new terms only: weight, loss, learning rate.

## 1. Hook
- Chosen: `AI खुद सीखता कैसे है? उसी तरह, जैसे तुमने बास्केटबॉल सीखी थी।` (direct_question, 5 words, then the answer in one breath).
- Alternate: `Ek number, 4 steps, aur AI seekh gaya. Kaise?` (hookscore of its Roman form: 50.6 OK; the chosen one scores about 38, WEAK, because the scorer rewards numbers and stakes. I kept the plain question: it is the topic, in the viewer's words.)

## 2. The script the owner reads (Roman Hinglish)
1. "AI khud seekhta kaise hai? Usi tarah, jaise tumne basketball seekhi thi. Gend phenki, dekha kitna chuke, thoda sudhara, phir phenki. Ye teen steps hain. Chhote model par chalakar dikhata hoon."
2. "Model ko sirf itna seekhna hai: kitne ghante padho, to kitne marks. 1 ghante par 2, 2 ghante par 4, 3 ghante par 6. Model ke andar bas ek number hai, weight, yaani w. Marks barabar w guna ghante."
3. "Pehla step: phenko, yaani guess. w ko 0 rakha, to model har baar 0 bolega. 2 ki jagah 0, 6 ki jagah bhi 0."
4. "Doosra step: dekho kitna chuke. Har jawab ki galti nikalo, uska square lo, aur average kar lo. Ise loss kehte hain. Square isliye, kyunki badi galti zyada ginni jaani chahiye. Maine code chalaya: loss 18.67. Jitna kam, utna achha."
5. "Teesra step: sudharo. w ko usi taraf thoda sarkao, jidhar loss kam hota hai. Kitna sarkana hai, use learning rate kehte hain. Maine 0.1 rakha. Ek baar sudhara: w 1.87, loss 0.08. Chaar baar dohraya, to w theek 2, aur loss lagbhag zero."
6. "Ab jaldbaazi karke dekho: learning rate 0.5. Pehle step mein loss 18 se seedha 251, phir hazaaron mein. Model bigadta ja raha hai. Jaise gend itne zor se phenki, ki board ke paar chali gayi."
7. "Model ke andar answers nahi rakhe hote. Andar bas numbers hote hain, jo aise hi sudharte-sudharte set hue. LLM mein bhi yahi chalta hai. Bas wahan arbon numbers hain, aur guess agla word hota hai."
8. "Yahi chakkar training hai. Ab tum batao: marks agar 3, 6, 9 hote, to w aakhir mein kis number par rukta? Comment mein likho, aur aise AI ideas ke liye follow karo."

## 3. Narration source (Hindi in Devanagari, English in Roman; `|` clause, `||` thought, spoken numbers in braces)
```
A: @hook AI खुद सीखता कैसे है? | उसी तरह, जैसे तुमने बास्केटबॉल सीखी थी। || गेंद फेंकी, देखा कितना चूके, थोड़ा सुधारा, फिर फेंकी। || ये तीन steps हैं। | छोटे model पर चलाकर दिखाता हूँ।
B: model को सिर्फ़ इतना सीखना है: | कितने घंटे पढ़ो, तो कितने marks। || 1{one} घंटे पर 2{two}, | 2{two} घंटे पर 4{four}, | 3{three} घंटे पर 6{six}। || model के अंदर बस एक number है, | weight, यानी w। || marks बराबर w गुणा घंटे।
C: पहला step: फेंको, यानी guess। || w को 0{zero} रखा, | तो model हर बार 0{zero} बोलेगा। || 2{two} की जगह 0{zero}, | 6{six} की जगह भी 0{zero}।
D: दूसरा step: देखो कितना चूके। || हर जवाब की गलती निकालो, | उसका square लो, | और average कर लो। | इसे loss कहते हैं। || square इसलिए, | क्योंकि बड़ी गलती ज़्यादा गिनी जानी चाहिए। || मैंने code चलाया: | loss 18.67{eighteen-point-six-seven}। | जितना कम, उतना अच्छा।
E: तीसरा step: सुधारो। || w को उसी तरफ़ थोड़ा सरकाओ, | जिधर loss कम होता है। || कितना सरकाना है, | उसे learning rate कहते हैं। | मैंने 0.1{point-one} रखा। || एक बार सुधारा: | w 1.87{one-point-eight-seven}, | loss 0.08{point-zero-eight}। || चार बार दोहराया, | तो w ठीक 2{two}, | और loss लगभग zero।
F: अब जल्दबाज़ी करके देखो: | learning rate 0.5{point-five}। || पहले step में loss 18{eighteen} से सीधा 251{two-hundred-fifty-one}, | फिर हज़ारों में। || model बिगड़ता जा रहा है। | जैसे गेंद इतने ज़ोर से फेंकी, | कि बोर्ड के पार चली गई।
G: @emph model के अंदर answers नहीं रखे होते। | अंदर बस numbers होते हैं, | जो ऐसे ही सुधरते-सुधरते set हुए। || LLM में भी यही चलता है। | बस वहाँ अरबों numbers हैं, | और guess अगला word होता है।
H: यही चक्कर training है। || अब तुम बताओ: | marks अगर 3{three}, 6{six}, 9{nine} होते, | तो w आख़िर में किस number पर रुकता? | Comment में लिखो, | और ऐसे AI ideas के लिए follow करो।
```

## 4. Beat table (seconds at the measured 2.44 w/s)
| # | seconds | says | the picture that moves | on-screen label (1 to 3 words) |
|---|---|---|---|---|
| 1 | 0 to 13 (31 w) | the question, the basketball answer, three steps promised | a ball arcs and misses a hoop; three small marks land: throw, miss, fix. No step counter yet | HOW AI LEARNS |
| 2 | 13 to 29 (39 w) | the task: hours to marks, one number w | three cards 1 to 2, 2 to 4, 3 to 6 with the EXAMPLE pill; a dial w appears; the chip marks = w x hours | EXAMPLE / W = WEIGHT |
| 3 | 29 to 39 (24 w) | step 1, guess: w = 0, every answer 0 | dial at 0; the three guesses 0, 0, 0 stand next to the true 2, 4, 6 in red | STEP 1/3 / GUESS |
| 4 | 39 to 55 (39 w) | step 2, how far off: gap, square, average, loss 18.67 | a bar per card for the gap; bars square and merge into one gauge reading 18.67; the real printed line | STEP 2/3 / LOSS 18.67 |
| 5 | 55 to 72 (43 w) | step 3, nudge w, the learning rate 0.1, w 1.87, loss 0.08, four rounds to w 2 | the dial nudges toward the lower loss; the gauge falls; the real 5-line run slides in, rows lit one by one | STEP 3/3 / LEARNING RATE |
| 6 | 72 to 87 (35 w) | change one thing: rate 0.5, loss 18 to 251 to thousands, the overshooting ball | the same run with 0.5: the dial swings past 2 and back, the gauge climbs; a small ball flies over the backboard | RATE 0.5 / LOSS 251 |
| 7 | 87 to 101 (35 w) | no stored answers, only numbers; the same loop in an LLM, billions of numbers, next word | a shelf of answers crossed out; the dial multiplies into a field of dials; a "the cat sat on ..." strip with a guessed next word | NUMBERS, NOT ANSWERS |
| 8 | 101 to 114 (32 w) | the loop named training; the check question | the three marks join into a loop arrow; a question card: marks 3, 6, 9 gives w = ? (answer not shown) | TRAINING / CHECK YOURSELF |
Look: clean-reel (flat navy and gold, one new object per beat, the running example stays on screen, nothing still for more than 8 s). Labels are English, never the spoken sentence. The `STEP n/3` kicker appears only when step 1 starts.

## 5. Caption (ig-caption linter: READY, 704 characters, 3 hashtags, 1 ask)
```
Day 1/150: AI khud seekhta kaise hai?

Waise hi, jaise tum basketball seekhte ho: phenko, dekho kitna chuke, thoda sudharo, phir phenko. Maine ye ek chhote model par Python mein chalaya.

Model ko study hours se marks batane hain: 1 ghante par 2, 2 par 4, 3 par 6. Uske andar bas ek number hai, w (weight).
Guess: w = 0, to har jawab 0 aur loss 18.67.
Sudhaar: learning rate 0.1 par ek baar mein w 1.87, loss 0.08. Chaar baar mein w = 2.
Learning rate 0.5 kar do, to loss 18 se seedha 251 par jata hai. 0.001 rakho, to chaar steps baad bhi loss 17 ke aaspaas atka rehta hai.

Check yourself: marks 3, 6, 9 hote, to w kis number par rukta? Comment mein likho.

Jawab: 3.

#AI #MachineLearning #150DaysOfAI
```
The answer sits under the "... more" cut. The 0.001 run (too small a step) is in the caption only; it is the first line to cut or to add to the video if the owner wants it.

## 6. What was run, and where the facts come from (notes for the team and the reviewers; none of this is spoken)
Python 3.12, plain loops, no libraries. The screen shows these 8 lines and their output (`python run.py <learning rate> [marks]`):
```python
xs, ys = [1, 2, 3], [2, 4, 6]
w, lr = 0.0, 0.1
for step in range(5):
    preds = [w * x for x in xs]
    loss = sum((p - y) ** 2 for p, y in zip(preds, ys)) / 3
    print(step, round(w, 3), round(loss, 3))
    w -= lr * sum(2 * (p - y) * x for p, y, x in zip(preds, ys, xs)) / 3
```
```
lr 0.1:   0 0.0 18.667 | 1 1.867 0.083 | 2 1.991 0.0 | 3 1.999 0.0 | 4 2.0 0.0
lr 0.5:   0 0.0 18.667 | 1 9.333 250.963 | 2 -24.889 3374.058 | 3 100.593 45362.33 | 4 -359.506 609871.327
lr 0.001: 0 0.0 18.667 | 1 0.019 18.32 | 2 0.037 17.979 | 3 0.055 17.645 | 4 0.074 17.318
marks 3, 6, 9 with lr 0.1: ... | 4 3.0 0.0     (the answer of the check question is 3)
```
Sources (fetched with WebFetch on 2026-10-19), used only to make sure the lines are true:
- https://en.wikipedia.org/wiki/Gradient_descent (the update moves against the gradient with a step size, also called the learning rate; too small slows convergence, too large leads to overshoot and divergence; the stochastic variant is the basic algorithm for training most deep networks)
- https://en.wikipedia.org/wiki/Loss_function (a loss maps a prediction error to a number to minimise; squared error loss; squared loss is dominated by outliers, so large errors count more)
- https://en.wikipedia.org/wiki/Large_language_model (GPT models are first pretrained to predict the next word; most LLMs before fine-tuning are next-token predictors; the largest have more than 100 billion parameters)
- https://arxiv.org/abs/2005.14165 (GPT-3 has 175 billion parameters; the video says only "arbon numbers")
- https://github.com/openai/tiktoken was also read for the next days of the ladder (tokens); it is not used here.
The basketball picture, the marks example and the sentence "model ke andar answers nahi rakhe hote" (the weights are numbers set by training) are ours, as plain explanation.

## 7. Checks
- `lint_script.py` of this floor on the narration (hook_type set): VERDICT OK, 0 FAIL. One WARN: its stale length window (see the header).
- Shape against teaching-flow: `demo` beat sheet (input, run 1 real, change one thing, run 2 real, why, catch, recap and check), 3 numbered steps with the kicker from step 1, a new picture about every 4 to 5 s. Detail checklist: 3 terms (weight, loss, learning rate), one running example run for real, the failure shown with numbers (rate 0.5), a why in step 2 and step 3, the catch at 76 percent, the check question with its answer in the caption, stand-alone.
- Humanising pass with the two skills the owner named (github.com/petergyang/no-ai-slop, github.com/blader/humanizer), applied to the Hinglish lines: removed "ये सीख नहीं रहा, बिगड़ रहा है" (a not-X-but-Y) and "लोग सोचते हैं... नहीं।" (a staged contrast with a one-word reply); the recap shrank to one line; no dashes, no triads for show (the three steps are the real three), no "key point" announcements; first person only where true ("मैंने code चलाया"); no word of source-talk in any line. Kept on purpose: the one-line recap and the comment question, the owner's closing rule.
- Voice: the owner's own voice by default, Swara when it is not available. A local run of the same pipeline with Swara gave 2.44 w/s; a second timing run of this exact text failed on Edge TTS (HTTP 403 from the old host), so the 114 s is computed from the measured rate, not heard.
- Cut first if the take runs past 118 s: "Square isliye ..." (9 words), "phir hazaaron mein" (3), "Maine 0.1 rakha" (3).
- Unsure: (1) the hook scorer calls the chosen hook WEAK (about 38); the alternate scores 50.6 but makes a promise (4 steps) that the three-step frame does not match. (2) "arbon numbers" for an LLM is true for GPT-3 (175 billion) and the Wikipedia page; it is said as a plain size, not as a claim about every model.
