# Day 1: How a model learns (the owner's script, final; AI floor, id a001)

Floor: LearnAI (`learnai`, @ai.learnvora) | day type: `demo` | id: a001 (track `series`, Day 1 of 150) | hook_type: `direct_question`
Status (2026-10-19): the owner approved the picture and script as a Swara preview (`a001_how_a_model_learns_preview.mp4`, 174 s) and asked for it in his own voice. The finished composition is in `reels/a001_how_a_model_learns/`, the queue entry in `state/queue.json` carries a `studio_note` for the studio session (voice only, no redesign), the caption is `social/a001_how_a_model_learns.hi.caption.txt`.
The owner's script came from his own edit of our pilot; it is kept word for word, only converted to the narration form (Hindi in Devanagari, English in Roman, `display{spoken}` for numbers and letters, `|` clause pause 0.3 s, `||` 0.6 s). Owner edits of 2026-10-19 in it: the opening is the plain question, a 0.6 s pause, then straight to the basketball answer (the detour "kya use har answer ratwaya jaata hai? Bilkul nahi!" is cut); after the one update (w 1.87, loss 0.083) the line "ab yahi 4 baar dohrao ... model sahi answer tak pahunch gaya: ise kehte hain converge" shows the convergence.

## Length
418 spoken words. Real Swara run: **174.0 s** (scene starts A 0.0, B 13.2, C 36.3, D 51.4, E 74.2, F 117.2, G 136.2, H 155.0). The owner's voice read 2.2 to 2.8 words per second on past reels, so the take can be 150 to 187 s: **if it passes 178 s the studio raises `pace` in spec.json from 1.26 toward 1.32 (at most 1.35) and never cuts words** (Instagram's reel limit is 3 minutes; the gate allows up to 180 s). Facebook Reels stop at 90 s, so this day is Instagram only (ai-course skips Facebook with a logged reason).
`lint_script.py`: VERDICT OK (0 FAIL); its WARN about "no cause word" is not a real gap.

## The script (narration source)
```
A: @hook AI model seekhta कैसे है? || जैसे तुमने basketball खेलना सीखा: | shot मारा, miss हुआ, | गलती समझी, फिर try किया। || AI भी कुछ ऐसे ही सीखता है, | बस maths के साथ।
B: मान लो, हम एक model को study hours से marks predict करना सिखा रहे हैं। || एक घंटा, 2{two} marks। | दो घंटे, 4{four} marks। | तीन घंटे, 6{six} marks। || Model का formula है: | prediction equals weight times input। || Input है study hours, | और weight है w{डब्ल्यू}। || हमारे model में सिर्फ़ एक weight है। | अब देखते हैं, ये सीखेगा कैसे।
C: सबसे पहले, weight को zero से initialize किया। || Model कहता है: | जितने भी hours पढ़ो, prediction zero! || Obviously, prediction गलत है। || ये पहला step है: | forward pass, यानी input से prediction निकालना।
D: अब model को कैसे पता चलेगा, कि कितनी गलती हुई? || यहाँ आता है loss function। || हम use करेंगे MSE, | यानी Mean Squared Error। || Prediction और actual marks का difference लो, | उसका square करो, | और सबका average निकालो। || हमारे model का initial loss है 18.67{eighteen-point-six-seven}। || Loss जितना कम, predictions उतनी accurate।
E: अब आता है main game: gradient descent। || Gradient बताता है कि weight बदलने से, | loss किस direction में और कितना change होगा। || हमारे case में gradient है -18.67{minus-eighteen-point-six-seven}। || Negative gradient? | मतलब weight बढ़ाने से loss कम होगा। || Update rule: | new weight equals old weight minus learning rate times gradient। || Learning rate है 0.1{point-one}। || एक update के बाद weight हो जाता है approximately 1.87{one-point-eight-seven}, | और loss गिरकर 0.083{point-zero-eight-three}! || सिर्फ़ एक step में, | model काफ़ी improve हो गया। || अब यही 4{चार} बार दोहराओ। | Weight 2{दो} पर पहुँच जाता है, | और हर prediction सही हो जाता है। || Model सही answer तक पहुँच गया: | इसे कहते हैं converge।
F: अब learning rate को 0.1{point-one} से बढ़ाकर 0.5{point-five} करते हैं। || पहले update के बाद weight 9.33{nine-point-three-three} तक पहुँच जाता है, | और loss 18.67{eighteen-point-six-seven} से बढ़कर लगभग 251{दो-सौ-इक्यावन} हो जाता है! || Model target को cross करके बहुत आगे निकल गया। || Learning rate बहुत high हो, | तो model diverge भी कर सकता है।
G: Real AI models में billions of parameters हो सकते हैं। || LLMs भी training के दौरान predictions करते हैं, | loss calculate करते हैं, | gradients से weights update करते हैं, | और ये process बार-बार repeat होता है। || Model के weights उसके learned patterns को encode करते हैं; | answers की कोई simple list नहीं होती।
H: तो याद रखो: | forward pass, loss, gradient, update, repeat! || अब तुम बताओ: | अगर marks होते 3{तीन}, 6{छह}, 9{नौ}, | तो हमारा model किस weight पर converge करता? || Comment करो, | और 150{one-hundred-fifty} Days of AI Mastery के next lesson के लिए follow कर लो!
```
Numbers follow the owner's rule (the word after a number decides its language): "ek ghanta, 2 marks" has "2" in English because "marks" is English; "4{चार} बार", "2{दो} पर", "3{तीन}, 6{छह}, 9{नौ}" are Hindi because a Hindi word follows; readings such as 18.67 and 0.083 stay English; the formulas are English words.
Left as the owner wrote them, to decide later: "learning rate" is not defined by the voice (the screen says LEARNING RATE = STEP SIZE); "weights uske learned patterns ko encode karte hain" is not explained; the last line says "next lesson ke liye follow kar lo" although a series reel never points at another day (rule 2); "model kaafi improve ho gaya" is vague. Say the word if you want any of them changed.

## Pictures (a001 composition, header `150 DAYS OF AI · DAY 1`, gold on navy)
A title alone for the question and the pause, then the ball and hoop with SHOT / MISS / UNDERSTAND / TRY AGAIN and "+ MATHS". B cards HOUR/MARKS and the formula chip. C forward pass. D loss function and MSE, gauge 18.67. E gradient descent: curve with a dot against the gradient arrow, GRADIENT -18.67, NEGATIVE -> INCREASE w, the update-rule chip, LEARNING RATE = STEP SIZE 0.1, one update (1.87, 0.083), four updates (the real table), cards 2, 4, 6 with ticks, CONVERGED. F learning rate 0.5 and DIVERGE. G billions of parameters, FORWARD -> LOSS -> GRADIENT -> UPDATE, no stored answers. H the loop, the check question (answer not shown), the handle card. Sound cues in spec.json (25).

## Caption (ig-caption linter: READY)
```
Day 1/150: AI model seekhta kaise hai?

Jaise tumne basketball khelna seekha: shot maara, miss hua, galti samjhi, phir try kiya. AI bhi kuch aise hi seekhta hai, bas maths ke saath.

Setup: study hours se marks predict karna. 1 ghante par 2, 2 par 4, 3 par 6. Model mein ek hi weight w, aur prediction = weight x input.

Forward pass: w = 0 se shuru, to har prediction 0.
Loss function (MSE): loss = 18.67.
Gradient descent: gradient = -18.67, negative hai, to w badhao. Learning rate 0.1 par ek update mein w = 1.87, loss = 0.083. 4 baar dohrao to w = 2 par converge, yaani model sahi answer tak pahunch gaya.
Learning rate 0.5 kar do, to loss 18.67 se 251 par chala jata hai aur model diverge karta hai.

Check yourself: marks 3, 6, 9 hote, to w kis value par converge hota? Comment mein likho.

Jawab: 3.

#AI #MachineLearning #150DaysOfAI
```

## What was run (real output) and sources
```
lr 0.1: it0 w 0.0 loss 18.667 grad -18.667 | it1 w 1.867 loss 0.083 grad -1.244 | it2 w 1.991 loss 0.0 grad -0.083 | it3 w 1.999 loss 0.0 grad -0.006 | it4 w 2.0 loss 0.0 grad -0.0
lr 0.5: it0 w 0.0 loss 18.667 grad -18.667 | it1 w 9.333 loss 250.963 grad 68.444 | it2 w -24.889 loss 3374.058 grad -250.963 | it3 w 100.593 loss 45362.33 grad 920.198 | it4 w -359.506 loss 609871.327 grad -3374.058
marks 3, 6, 9 with lr 0.1: w 0.0, 2.8, 2.987, 2.999, 3.0 (the answer of the check question is 3)
```
Sources (fetched 2026-10-19): https://en.wikipedia.org/wiki/Gradient_descent (steps against the gradient; the step size is the learning rate; too large overshoots and diverges), https://en.wikipedia.org/wiki/Loss_function (squared error loss), https://en.wikipedia.org/wiki/Large_language_model (pretrained to predict the next word; the largest models have more than 100 billion parameters), https://arxiv.org/abs/2005.14165 (GPT-3, 175 billion parameters). Nothing is quoted in the voice.
