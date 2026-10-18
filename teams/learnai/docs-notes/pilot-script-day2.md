# Pilot script, Day 2: AI engineer, ML engineer, data scientist: who does what (draft for the owner, not wired into any queue)

Floor: LearnAI, to become ai.learnvora (`learnai`) | day type: `trade-off` | working id: a002 (the prefix `a` is a pending proposal) | hook_type: `interviewer_asked`
Built to `docs-notes/teaching-flow.md`. Length: **272 spoken words** (braces resolved, `lint_script.py` counting) = about **101 s at 2.7 w/s** and about **115 s at the 2.36 w/s that lint_script measured** (165 words = 70 s). If the owner's voice runs at the lint rate this is at the top of the 120 s limit, so the cut-first list in section 8 (21 words, about 9 s) is ready.
Draft roadmap Day 2 (S1 Start here). Stand-alone: no "kal", no "part", no tease, no pointer to another reel. The food app, the 10,000 tickets and the 4,000 are EXAMPLE numbers. It follows the `trade-off` sheet of teaching-flow with three options instead of two (the three roles are the three steps).

## 1. Hook (first line at most 10 words, up to 16 for interviewer_asked; spoken from frame 0)
- Chosen: `Interviewer ने पूछा: data scientist, ML engineer, AI engineer, तीनों में फ़र्क क्या है?` (interviewer_asked).
- Alternate 2: `AI engineer और ML engineer में फ़र्क क्या है?` (direct_question, 9 words).
- Alternate 3: `10,000 tickets, एक boss: AI से कुछ बनाओ। किसे बुलाओगे?` (relatable_stake; the numbers are EXAMPLE).

## 2. The script the owner reads (Roman Hinglish, one line per beat group)
1. "Interviewer ne poocha: data scientist, ML engineer, AI engineer, teeno mein fark kya hai? Ek aasaan jawab hai: teeno ek hi hain, bas naam alag. Ye galat hai, teen steps mein dikhata hoon."
2. "Maan lo ek food app ko har mahine 10,000 support tickets milte hain. Teeno us par kaam karenge, par teen alag cheezein banakar denge: ek chart, ek model service, aur ek chatbot."
3. "Pehla, data scientist. Input: data, yaani wahi 10,000 tickets. Output: insight. Jaise 4,000 tickets ek hi sawal pooch rahe hain: order kahan hai? Kyunki kuch banane se pehle, dikkat pehchanni padti hai. BLS ke mutabik, ye data se insight nikalte hain."
4. "Doosra, ML engineer. Input: ek model, yaani data se seekha hua program. Inka kaam use production mein chalana hai, yaani asli users ke saamne. Google Cloud ke role mein deploy, monitor, retrain sab hai, kyunki model banakar chhoda nahi jaata."
5. "Teesra, AI engineer. Latent Space ke essay ke mutabik, ye model train nahi karte. Bana-banaya model, API yaani darwaze se bulate hain. Input: wahi model aur order ka data. Output: chatbot jo bataye, order kahan hai."
6. "Par lakeerein dhundhli hain: usi essay ke mutabik, AI engineer kabhi-kabhi model ko apne data se thoda aur sikha bhi sakta hai. Isliye title nahi, kaam padho: insight banana hai, model chalana hai, ya product banana hai?"
7. "Yaad rakho: data scientist insight deta hai, ML engineer model ko production mein chalata hai, AI engineer bane-banaye model par product banata hai. Roz ek idea: follow karo. Ab tum batao: tickets padhkar pata karna ki sabse zyada shikayat kis cheez ki hai, ye teeno mein se kiska kaam hai? Comment mein likho." 

## 3. Narration source (Hindi in Devanagari, English in Roman; `|` clause, `||` thought, spoken numbers in braces)
```
A: @hook Interviewer ने पूछा: | data scientist, ML engineer, AI engineer, | तीनों में फ़र्क क्या है? || एक आसान जवाब है: | तीनों एक ही हैं, बस नाम अलग। || ये गलत है, | तीन steps में दिखाता हूँ।
B: @emph मान लो एक food app को हर महीने 10,000{ten-thousand} support tickets मिलते हैं। || तीनों उस पर काम करेंगे, | पर तीन अलग चीज़ें बनाकर देंगे: | एक chart, एक model service, और एक chatbot।
C: पहला, data scientist। | Input: data, यानी वही 10,000{ten-thousand} tickets। || Output: insight। | जैसे 4,000{four-thousand} tickets एक ही सवाल पूछ रहे हैं: order कहाँ है? || क्योंकि कुछ बनाने से पहले, दिक्कत पहचाननी पड़ती है। || BLS{बी-एल-एस} के मुताबिक, ये data से insight निकालते हैं।
D: दूसरा, ML engineer। | Input: एक model, यानी data से सीखा हुआ program। || इनका काम उसे production में चलाना है, | यानी असली users के सामने। || Google Cloud के role में deploy, monitor, retrain सब है, | क्योंकि model बनाकर छोड़ा नहीं जाता।
E: तीसरा, AI engineer। | Latent Space के essay के मुताबिक, ये model train नहीं करते। || बना-बनाया model, API यानी दरवाज़े से बुलाते हैं। || Input: वही model और order का data। || Output: chatbot जो बताए, order कहाँ है।
F: @emph पर लकीरें धुँधली हैं: | उसी essay के मुताबिक, AI engineer कभी-कभी model को अपने data से थोड़ा और सिखा भी सकता है। || इसलिए title नहीं, काम पढ़ो: | insight बनाना है, model चलाना है, या product बनाना है?
G: याद रखो: | data scientist insight देता है, | ML engineer model को production में चलाता है, | AI engineer बने-बनाए model पर product बनाता है। || रोज़ एक idea: follow करो। || अब तुम बताओ: | tickets पढ़कर पता करना कि सबसे ज़्यादा शिकायत किस चीज़ की है, | ये तीनों में से किसका काम है? | Comment में लिखो।
```

## 4. Beat table (seconds at 2.7 w/s from the word count of each beat)
| # | seconds | says | the picture that moves | on-screen label (1 to 3 words) |
|---|---|---|---|---|
| 1 |    0 to   12 (33 w) | Interview question; the easy answer ("all the same") is called wrong; 3 steps promised | An INTERVIEW QUESTION chip; three role chips (data scientist, ML engineer, AI engineer) with an equals sign between them that gets crossed out | INTERVIEW QUESTION / 3 ROLES |
| 2 |   12 to   24 (32 w) | One example: 10,000 tickets a month; the three roles hand back three different things | A pile of 10,000 ticket cards (EXAMPLE pill); three arrows lead to a bar chart, a model box and a chat bubble | 10,000 TICKETS / EXAMPLE / 3 OUTPUTS |
| 3 |   24 to   39 (41 w) | Step 1, data scientist: input data, output an insight (4,000 tickets ask where the order is); why: find the problem first; source BLS | The ticket pile feeds a bar chart; the bar order kahan hai grows to 4,000 (EXAMPLE) and lights up; a source tag | STEP 1/3 / DATA SCIENTIST / OUTPUT: INSIGHT |
| 4 |   39 to   54 (40 w) | Step 2, ML engineer: input a model (learned from data); the job is running it in production, with deploy, monitor, retrain; source Google Cloud | A small model box moves onto a stage in front of user dots; three loop arrows (deploy, monitor, retrain) circle it; a source tag | STEP 2/3 / ML ENGINEER / OUTPUT: MODEL SERVICE |
| 5 |   54 to   67 (36 w) | Step 3, AI engineer: does not train a model; calls a ready-made one through an API; input model plus order data, output a chatbot; source Latent Space essay | A ready-made model box sits behind a door marked API; the order data goes in, a chat bubble comes out; a source tag | STEP 3/3 / AI ENGINEER / OUTPUT: PRODUCT |
| 6 |   67 to   81 (37 w) | Catch: the lines are fuzzy (an AI engineer may also fine-tune), so read the work, not the title | The three boxes overlap with dashed borders; the AI engineer box leans into the model box; three chips: insight, model, product | FUZZY LINES / READ THE WORK |
| 7 |   81 to   91 (28 w) | One-line recap, then the follow line | A 3-row card: insight, model in production, product on a ready-made model | REMEMBER |
| 8 |   91 to  101 (25 w) | Check yourself: who reads the tickets to find the top complaint? | Question card: ticket pile, a ? over the three role chips, 2 s hold; the answer is not shown | CHECK YOURSELF |
Total 101 s at 2.7 w/s. The `STEP n/3` kicker appears only when step 1 starts, never in the first 10 s. Look: clean-reel (flat navy and gold, one new object per beat, the running example stays on screen). Labels are English or Roman Hinglish, never the spoken sentence.

## 5. Caption (ig-caption linter: READY)
```
Day 2/150: Data scientist, ML engineer aur AI engineer mein asli fark kya hai?

Teeno ka input ek hi ho sakta hai, par nateeja alag hota hai. Ek food app ke 10,000 support tickets ka example (example numbers, asli nahi):
Data scientist: data se insight, jaise 4,000 tickets ek hi sawal pooch rahe hain
ML engineer: model ko production mein chalana, deploy, monitor, retrain
AI engineer: bana-banaya model API se bulakar product banana, jaise chatbot

Lakeerein dhundhli hain, isliye job title nahi, kaam padho. AI engineer vs ML engineer ka fark samajhne ke liye yeh ek simple map hai.

Check yourself: 10,000 tickets padhkar pata karna ki sabse zyada shikayat kis cheez ki hai, yeh teeno mein se kiska kaam hai? Comment mein jawab likho.

Jawab: data scientist.

#AI #AIEngineer #MLEngineer
```
The part under the "... more" cut carries the answer, so the check-yourself question can be marked by the viewer.

## 6. Sources (all fetched with WebFetch on 2026-10-18)
- https://www.bls.gov/ooh/math/data-scientists.htm (data scientists use analytical tools and techniques to extract insights from data; they create, validate and test models)
- https://cloud.google.com/learn/certification/machine-learning-engineer (the ML engineer role: builds, evaluates, productionizes and optimizes AI solutions; training, retraining, deploying, tuning, monitoring)
- https://www.latent.space/p/ai-engineer (an essay that names the AI engineer: builds on existing models through APIs, can succeed without training a model, may still fine-tune; an opinion piece, so the script says "ke mutabik")
- The food app, 10,000 tickets and 4,000 are EXAMPLE numbers. Role titles overlap between companies; the script says so in the catch beat.

## 7. What was run (real output is what the script says)
No code on this day (nothing to run). All three role descriptions come from the fetched pages above; the ticket counts are invented and carry the EXAMPLE pill.

## 8. Checks
- `python -I scripts/lint_script.py` of this floor, on the narration above as a spec (hook_type set): **VERDICT OK**, 18 checks ok, 0 FAIL. WARN: length 60 to 100 s (about 2.3 words per second)  [272 words, about 118 s]. The WARN is the lint's length window.
- Shape against teaching-flow: the mechanism steps are 43 percent of the words (aim about 40), the catch starts at 67 percent (aim 70 to 80; the frames show 70 to 77), 3 numbered steps with the `STEP n/3` kicker starting at step 1, a new object about every 4 s in the beat table (nothing still for more than 8 s).
- Detail checklist (teaching-flow section c): terms defined: data scientist, ML engineer, AI engineer (3 roles), plus model, production and API each decoded in a few words. Running example: 10,000 tickets (EXAMPLE). Naive way first: beat 2 ("all the same" fails because the outputs differ). WHY per step: step 1 "kyunki kuch banane se pehle dikkat pehchanni padti hai", step 2 "kyunki model banakar chhoda nahi jaata", step 3 the essay's "train nahi karte". Catch: fuzzy lines (beat 6). Consequence: read the work, not the title. Recap and one check question (answer: the data scientist, in the caption). Stand-alone.
- Cut first if the take runs past 115 s: "kyunki kuch banane se pehle dikkat pehchanni padti hai" (9 words), "Input: wahi model aur order ka data" (7) and the follow line (5, end card instead).
- Unsure: (1) The "naive way fails" beat is weaker than on the other floors: it fails by showing three different outputs, not by a number; I judged an invented timeline (months vs days) would be a false claim. (2) The Latent Space essay is one influential opinion, not a standard; the script attributes it, and the owner may prefer a second source for the AI engineer role. (3) The `a` id prefix and the floor name `ai.learnvora` are the owner's pending proposal; the floor has no series-style.md yet.
