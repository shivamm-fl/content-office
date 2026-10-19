# Day 2: Train, validation and test (the owner approved the finished reel; AI floor, id a002)

Floor: LearnAI (`learnai`, @ai.learnvora) | day type: `structure` | id: a002 (track `series`, Day 2 of 150) | hook_type: `direct_question`
Status (2026-10-19): the owner watched the finished reel (video, voice, cover) and approved it ("achha bana hai"). The composition is in `reels/a002_train_validation_test/`, the voice is the owner's own on ElevenLabs **Flash v2.5 at `owner_tempo` 0.9** (his decision of the same day: Flash from now on for new reels, the same tempo), the cover is `brand/covers/a002_train_validation_test.png`, the caption and YouTube text are in `social/`. The queue entry carries a `studio_note`: the studio only delivers it (the runner restores the video and the voice from `office-learnai-a002-archive`), nothing is rebuilt. This file replaces the earlier Day 2 draft, which was about the roles of an AI engineer (those four opening days were removed from the roadmap on 2026-10-19).
The owner's one edit of the draft: "mota pattern" became "pattern" in scene D.

## Length
394 spoken words (braces dropped, `lint_script.py` counting). Real run: **146.0 s** (scene starts A 0.0, B 18.7, C 47.5, D 73.9, E 94.9, F 109.8, G 123.2, H 132.5). 56 phrases, 2,053 characters sent to ElevenLabs once (about $0.08 at Flash prices); every phrase is cached, so a new tempo or a re-render costs nothing. `lint_script.py`: VERDICT OK (0 FAIL); its WARN about the weak-baseline word is a word match, the length WARN is about 171 s at the lint's 2.3 words per second (the real reel is 146 s).

## The script (narration source)
```
A: @hook Train, validation और test data अलग क्यों रखते हैं? || जैसे तुम exam की तैयारी करते हो: | textbook के questions से practice, | mock test से अपनी कमज़ोरी की जाँच, | और final exam में ऐसे questions, जो तुमने पहले कभी नहीं देखे। || AI model भी data को ऐसे ही 3{तीन} हिस्सों में बाँटकर सीखता है।
B: मान लो हमारे पास 1,000{one-thousand} emails हैं, | हर email पर लिखा है: spam है या नहीं। || इन्हें हम 3{three} piles में बाँटते हैं। || पहला: training data, 700{seven-hundred} emails। | model इन्हीं से सीखता है, textbook की तरह। || दूसरा: validation data, 150{one-hundred-fifty} emails। | इन पर हम जाँचते हैं कि model कहाँ कमज़ोर है, mock test की तरह। || तीसरा: test data, 150{one-hundred-fifty} emails। | ये final exam है, | इसे सबसे आखिर में, सिर्फ़ एक बार खोलते हैं।
C: अब मैंने ऐसा ही एक छोटा नकली data बनाकर, | दो models चलाए। || पहला model training data को रट लेता है। || Training पर उसका accuracy निकला 100{hundred} percent। | Accuracy यानी सौ में से कितनी बार model सही निकला। || पर validation data पर, | जो उसने पहले कभी नहीं देखा, | accuracy गिरकर 72{seventy-two} percent रह गई। || मतलब उसने सीखा नहीं, सिर्फ़ रट लिया था। | इसीलिए training का score भरोसे लायक नहीं होता।
D: दूसरा model रटता नहीं, | सिर्फ़ pattern पकड़ता है। || Training पर उसका accuracy 82{eighty-two} percent है, | और validation पर भी 82{eighty-two} percent। || दोनों बराबर, | यानी ये model नए data पर भी टिकता है। || यही validation का काम है: | दो models में से कौन सा चुनना है, ये validation के score से तय होता है। | इसलिए हमने दूसरा चुना।
E: अब final exam, यानी test data। || ये 150{one-hundred-fifty} emails न training में थे, न validation में। || Test पर accuracy आई 79{seventy-nine} percent। || नए data पर यही number मिलने की उम्मीद रखो, | training वाला 100{hundred} percent नहीं।
F: @emph अगर test का score देखकर तुमने model बदल दिया, | और test पर फिर जाँचा, | तो test अब test नहीं रहा, | वो भी एक validation बन गया। || जैसे paper पहले देखकर तैयारी करना: | marks अच्छे आएँगे, पर असली नहीं होंगे।
G: तो याद रखो: | training से model सीखता है, | validation से हम model चुनते हैं, | और test से सिर्फ़ एक बार जाँचते हैं, कि वो नए data पर कितना चलेगा।
H: अब तुम बताओ: | test का score देखकर model बदल दो, | तो क्या test score पर भरोसा कर सकते हो? | हाँ या नहीं, comment में लिखो। || और रोज़ एक नया AI idea समझने के लिए, | follow कर लो।
```
Numbers follow the owner's rule (the word after a number decides its language): `3{तीन} हिस्सों`, `3{three} piles`, `700 emails`, `72 percent` are English before English words. The 1,000 emails and the 700, 150, 150 split are the story (EXAMPLE pill on screen); scene C says the data is fake ("नकली data"). The 70/15/15 split is the one the Google ML Crash Course calls a much better split than 80/20; the script no longer says so, the picture shows the true proportions.
Beats: the answer to the question in the hook is the whole reel (three piles, three jobs), the analogy is the first teaching line (no filler after the hook), the failure of the naive way comes in scene C (a memorising model scores 100 and drops to 72), the catch is scene F (peeking turns the test into a validation), the recap is G, the check question H (answer: nahi, in the caption).

## Pictures (a002 composition, header `150 DAYS OF AI · DAY 2`, cyan = train, gold = validation, green = test, red = a miss)
A hook with the three exam cards under it from frame 0 (textbook, mock test, final exam) then AI MODEL with three arrows to TRAIN, VALIDATION, TEST. B a 40 x 25 grid of 1,000 dots cut into 28, 6 and 6 columns (true 70, 15, 15 percent) with their labels and a lock on the test block. C two 10 x 10 grids of 100 emails: all green with 100 percent, then 72 green and 28 red with the counter falling from 100 to 72, a red cross on the 100. D the second model's two grids (82 and 82, an equals sign), then the validation scores 72 against 82 and a ring and a check on model 2. E the locked 150-dot pile opens, never-seen chips, the counter to 79 percent, EXPECT THIS. F the loop test score, change model, test again, the green pile turning gold (NOW IT IS VALIDATION), then the paper seen first. G three job cards and NEW DATA. H the check question (test score, change model, trust it, YES and NO), the comment bar and the handle card with FOLLOW. 30 sound cues in `spec.json`.

## Caption (ig-caption linter: all PASS)
See `social/a002_train_validation_test.hi.caption.txt` (starts `Day 2/150:`, the answer to the check question is in it).

## What was run (real output) and sources
Python 3.12, numpy 1.26: 1,000 points in two overlapping clouds (label 0 or 1, centres at plus and minus 0.6), split 700, 150, 150 by a seeded shuffle. Model 1 copies the label of the closest training point (k = 1). Model 2 averages the labels of the k nearest training points; k is picked among 1, 5, 15, 51, 151 by the validation accuracy. The test pile is looked at once.
```
seed 36   k=1: train 1.000  validation 0.720  test 0.713  |  picked k=151: train 0.816  validation 0.820  test 0.793
median of 200 seeds   k=1: 1.000, 0.727, 0.723  |  validation-picked: 0.808, 0.813, 0.793   (k=1 was never picked)
```
The reel uses seed 36 (rounded: 100, 72 | 82, 82, 79); it is the seed closest to the median of the 200. The code (run as is, it prints the median over 200 seeds and the five seeds closest to it):
```python
import numpy as np, json, sys
def run(seed, sep=0.6):
    rng = np.random.default_rng(seed); n = 1000
    y = rng.integers(0, 2, n)
    X = rng.normal(0, 1, (n, 2)) + np.where(y[:, None] == 1, sep, -sep)
    idx = rng.permutation(n); tr, va, te = idx[:700], idx[700:850], idx[850:]
    d = lambda Q: ((Q[:, None, :] - X[tr][None, :, :]) ** 2).sum(-1)
    order = {name: np.argsort(d(X[ids]), axis=1) for name, ids in (("tr", tr), ("va", va), ("te", te))}
    ids = {"tr": tr, "va": va, "te": te}
    def acc(name, k):
        nn = order[name][:, :k]; pred = (y[tr][nn].mean(1) > 0.5).astype(int); return float((pred == y[ids[name]]).mean())
    return {k: (acc("tr", k), acc("va", k), acc("te", k)) for k in (1, 5, 15, 51, 151)}
res = {s: run(s) for s in range(200)}
def pick(r): return max(r, key=lambda k: r[k][1])
rows = []
for s, r in res.items():
    b = pick(r); rows.append((s, r[1][0], r[1][1], r[1][2], b, r[b][0], r[b][1], r[b][2]))
a = np.array([[x[1], x[2], x[3], x[5], x[6], x[7]] for x in rows])
print("median over 200 seeds: k=1 train %.3f val %.3f test %.3f | validation-picked train %.3f val %.3f test %.3f" % tuple(np.median(a, axis=0)))
print("picked k counts:", {k: sum(1 for x in rows if x[4] == k) for k in (1, 5, 15, 51, 151)})
med = np.median(a, axis=0)
best = sorted(rows, key=lambda x: sum(abs(np.array([x[1], x[2], x[3], x[5], x[6], x[7]]) - med)))[:5]
for x in best: print("seed %d  k=1: train %.3f val %.3f test %.3f | picked k=%d: train %.3f val %.3f test %.3f" % x)
```
Sources (fetched 2026-10-19): https://developers.google.com/machine-learning/crash-course/overfitting/dividing-datasets (training set the model learns from, validation set for the initial testing while developing, test set to double-check; using the same test set again and again makes the model fit its peculiarities), https://scikit-learn.org/stable/modules/cross_validation.html (a model that only repeats the labels it has seen scores perfectly and fails on new data; tuning on the test set lets knowledge of it leak into the model, so a validation set is held out). Nothing is quoted in the voice.
