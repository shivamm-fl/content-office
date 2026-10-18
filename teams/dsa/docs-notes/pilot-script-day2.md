# Pilot script, Day 2: Big-O, time complexity in plain words (draft for the owner, not wired into any queue)

Floor: Learnvora DSA (`dsa`) | day type: `concept` | working id: d002 | hook_type: `surprising_fact`, `hook_formula` cost_shock (a number we ran)
Built to `docs-notes/teaching-flow.md`. Length: **272 spoken words** (braces resolved, `lint_script.py` counting) = about **101 s at 2.7 w/s** and about **115 s at the 2.36 w/s that lint_script measured** (165 words = 70 s). If the owner's voice runs at the lint rate this is at the top of the 120 s limit, so the cut-first list in section 8 (16 words, about 7 s) is ready.
Roadmap Day 2 (P1 Foundations). Stand-alone: no "kal", no "part", no tease; the day is only a label on the cover and in the caption.

## 1. Hook (first line at most 10 words, up to 16 for interviewer_asked; spoken from frame 0)
- Chosen: `10 लाख names में एक नाम, 20 steps में कैसे?` (surprising_fact, cost_shock).
- Alternate 2: `Interviewer ने पूछा: 10 लाख sorted names में एक नाम कितने steps में ढूँढोगे?` (interviewer_asked, stopwatch_question; 11-word question).
- Alternate 3: `Big-O क्या होता है?` (direct_question, the plain search phrase; the answer follows in the next breath).

## 2. The script the owner reads (Roman Hinglish, one line per beat group)
1. "10 lakh names mein ek naam, 20 steps mein kaise? Jawab: sahi tareeka. Galat tareeke mein poore 10 lakh steps lagte hain. Is fark ka naam Big-O hai, aur ye teen steps mein samajh aata hai."
2. "Pehle galat tareeka. Ek step yaani ek naam check karna. Dono tareeke 10 names ki list par chalao: ek mein 10 steps, doosre mein 4. Ab list 10 lakh ki karo: 10 lakh steps banam 20."
3. "Seedha jawab: Big-O batata hai ki input n badhne par steps kitni tezi se badhte hain. n matlab list mein kitne names hain. Hum seconds nahi, steps ginte hain, kyunki steps machine se nahi badalte."
4. "Pehla step: Linear search, yaani pehle naam se aakhir tak, ek-ek check. Bure se bure haal mein saare n names, kyunki naam aakhir mein bhi ho sakta hai. Ise O(n) kehte hain."
5. "Doosra step: Binary search, sorted list par. Jaise dictionary mein shabd dhundhte ho: beech se kholo, aur aadhi list chhod do, kyunki list sorted hai. Lagbhag 20 baar aadha karo, to baat khatam. Ise O(log n) kehte hain, list double ho, to bas ek step aur."
6. "Teesra step: ginkar dekho. Maine Python mein chalaya: 10 lakh names par linear mein 10 lakh steps, binary mein 20. 20 lakh par 20 lakh, aur sirf 21."
7. "Par ek shart hai: binary search tabhi chalta hai jab list sorted ho. Python mein list par in lagao, to wo bhi O(n) hai."
8. "Yaad rakho: Big-O yaani n badhne par steps ki raftaar. Roz ek idea: follow karo. Ab tum batao: list 40 lakh names ki ho jaye, to binary search mein kitne steps lagenge? Comment mein likho." 

## 3. Narration source (Hindi in Devanagari, English in Roman; `|` clause, `||` thought, spoken numbers in braces)
```
A: @hook 10{ten} लाख names में एक नाम, | 20{twenty} steps में कैसे? || जवाब: सही तरीका। | गलत तरीके में पूरे 10{ten} लाख steps लगते हैं। || इस फ़र्क का नाम Big-O है, | और ये तीन steps में समझ आता है।
B: पहले गलत तरीका। || एक step यानी एक नाम check करना। || दोनों तरीके 10{ten} names की list पर चलाओ: | एक में 10{ten} steps, दूसरे में 4{four}। || अब list 10{ten} लाख की करो: | 10{ten} लाख steps बनाम 20{twenty}।
C: @emph सीधा जवाब: | Big-O बताता है कि input n बढ़ने पर steps कितनी तेज़ी से बढ़ते हैं। || n मतलब list में कितने names हैं। || हम seconds नहीं, steps गिनते हैं, | क्योंकि steps machine से नहीं बदलते।
D: पहला step: Linear search, | यानी पहले नाम से आख़िर तक, एक-एक check। || बुरे से बुरे हाल में सारे n names, | क्योंकि नाम आख़िर में भी हो सकता है। || इसे O(n) कहते हैं।
E: दूसरा step: Binary search, | sorted list पर। || जैसे dictionary में शब्द ढूँढते हो: | बीच से खोलो, और आधी list छोड़ दो, | क्योंकि list sorted है। || लगभग 20{twenty} बार आधा करो, तो बात ख़त्म। || इसे O(log n) कहते हैं, | list दुगनी हो, तो बस एक step और।
F: तीसरा step: गिनकर देखो। || मैंने Python में चलाया: | 10{ten} लाख names पर linear में 10{ten} लाख steps, | binary में 20{twenty}। || 20{twenty} लाख पर 20{twenty} लाख, | और सिर्फ़ 21{twenty-one}।
G: @emph पर एक शर्त है: | binary search तभी चलता है जब list sorted हो। || Python में list पर in लगाओ, तो वो भी O(n) है।
H: याद रखो: | Big-O यानी n बढ़ने पर steps की रफ़्तार। || रोज़ एक idea: follow करो। || अब तुम बताओ: | list 40{forty} लाख names की हो जाए, | तो binary search में कितने steps लगेंगे? | Comment में लिखो।
```

## 4. Beat table (seconds at 2.7 w/s from the word count of each beat)
| # | seconds | says | the picture that moves | on-screen label (1 to 3 words) |
|---|---|---|---|---|
| 1 |    0 to   13 (36 w) | Hook: 1 name in 10 lakh in 20 steps? The wrong way takes 10 lakh. Big-O named, 3 steps promised | A long row of 10 lakh name cards fades right; a magnifier; two counters land: 20 (gold) and 10,00,000 (red) | 10 LAKH NAMES / 20 STEPS |
| 2 |   13 to   23 (25 w) | Wrong way first. A step = one name checked. Both ways on 10 names: 10 steps vs 4 | 10 cards. Pointer A hops card by card (counter 10); pointer B jumps to the middle (counter 4) | STEP = CHECK / 10 vs 4 |
| 3 |   23 to   27 (11 w) | Same race on 10 lakh names: 10 lakh vs 20, so the small test lied | The row stretches to 10 lakh; counters turn 10,00,000 (red) and 20 (green) | 10 LAKH STEPS / 20 STEPS |
| 4 |   27 to   40 (35 w) | Answer: Big-O = how fast steps grow as n grows; n = names; count steps, not seconds | A graph: x = n, y = steps; a stopwatch icon is crossed out, a step counter replaces it | BIG-O / N = NAMES / STEPS NOT SECONDS |
| 5 |   40 to   51 (32 w) | Step 1, linear search: worst case all n names; called O(n) | The pointer walks the full row, the counter climbs to n; tag O(n); linear() as 6 lines of code, the counter line lit | STEP 1/3 / LINEAR O(n) |
| 6 |   51 to   69 (46 w) | Step 2, binary search on a sorted list: dictionary opened in the middle, half dropped, about 20 halvings, O(log n), double the list = 1 more step | A dictionary icon opens at the middle and turns into the row; the left half greys out; counter 10 lakh to 5 lakh to 2.5 lakh; tag O(log n) | STEP 2/3 / BINARY O(log n) / SORTED |
| 7 |   69 to   79 (28 w) | Step 3, count it: the real run for 10 lakh and 20 lakh names | The real printed table slides in: n, linear, binary; the 10 lakh and 20 lakh rows are lit | STEP 3/3 / REAL RUN |
| 8 |   79 to   88 (24 w) | Catch: binary search needs a sorted list. Consequence: Python's `x in list` is O(n) | A shuffled row with a red cross over binary; one code line `x in names` tagged O(n), 10 lakh steps | NEEDS SORTED / in = O(n) |
| 9 |   88 to   93 (15 w) | One-line recap, then the follow line | Two lines on one chart: O(n) straight up, O(log n) almost flat; recap card | REMEMBER |
| 10 |   93 to  101 (20 w) | Check yourself: 40 lakh names, how many steps for binary search? | Question card, 2 s hold with the 10 lakh row dimmed behind it; the answer is not shown | CHECK YOURSELF / 40 LAKH? |
Total 101 s at 2.7 w/s. The `STEP n/3` kicker appears only when step 1 starts, never in the first 10 s. Look: clean-reel (flat navy and gold, one new object per beat, the running example stays on screen). Labels are English or Roman Hinglish, never the spoken sentence.

## 5. Caption (ig-caption linter: READY)
```
Day 2/150: 10 lakh names mein ek naam sirf 20 steps mein kaise milta hai?

Big O notation, yaani time complexity, batati hai ki input n badhne par steps kitni tezi se badhte hain. Seconds nahi, steps gino.

10 lakh sorted names par maine Python mein dono tarike chalaye:
Linear search: 10 lakh steps, yaani O(n)
Binary search: 20 steps, yaani O(log n)
List double karo to binary search mein bas 1 step aur.

Check yourself: list 40 lakh names ki ho jaye, to binary search mein kitne steps lagenge? Comment mein jawab likho.

Jawab: 22 steps (list do baar double hui, har baar ek step aur).

#DSA #BigO #TimeComplexity
```
The part under the "... more" cut carries the answer, so the check-yourself question can be marked by the viewer.

## 6. Sources (all fetched with WebFetch on 2026-10-18)
- https://en.wikipedia.org/wiki/Big_O_notation (describes growth of run time as input grows; an upper bound; constant factors dropped; names constant, logarithmic, linear)
- https://en.wikipedia.org/wiki/Time_complexity (estimated by counting elementary operations; a function of input size; worst case commonly considered; logarithmic time, binary search)
- https://en.wikipedia.org/wiki/Linear_search (at most n comparisons; the worst case is a missing value or the last position; O(n))
- https://en.wikipedia.org/wiki/Binary_search_algorithm (works on sorted arrays; compares with the middle element and discards a half; worst case floor(log2 n)+1 loop iterations, O(log n))
- https://wiki.python.org/moin/TimeComplexity (CPython: `x in s` on a list is O(n))
- Our own run (below) for every count on screen. Names, sizes and the dictionary analogy are ours.

## 7. What was run (real output is what the script says)
Python 3.12, plain loops that count one comparison per step. The screen shows `linear` only (6 lines); `binary` is told by the picture:
```python
def linear(a, x):
    steps = 0
    for v in a:
        steps += 1
        if v == x: break
    return steps

def binary(a, x):
    lo, hi, steps = 0, len(a) - 1, 0
    while lo <= hi:
        steps += 1
        mid = (lo + hi) // 2
        if a[mid] == x: break
        if a[mid] < x: lo = mid + 1
        else: hi = mid - 1
    return steps
```
Output with `a = list(range(n))`, the target the last element, and "missing" a value above every element:
```
n=       10  linear(last)=       10  binary(last)=  4  binary(missing)=  4  floor(log2 n)+1=4
n=    1,000  linear(last)=    1,000  binary(last)= 10  binary(missing)= 10  floor(log2 n)+1=10
n=1,000,000  linear(last)=1,000,000  binary(last)= 20  binary(missing)= 20  floor(log2 n)+1=20
n=2,000,000  linear(last)=2,000,000  binary(last)= 21  binary(missing)= 21  floor(log2 n)+1=21
n=4,000,000  binary worst over sampled targets = 22  (the answer to the check question)
```
The binary counts also match the formula floor(log2 n)+1 from the Wikipedia page.

## 8. Checks
- `python -I scripts/lint_script.py` of this floor, on the narration above as a spec (hook_type set): **VERDICT OK**, 15 checks ok, 0 FAIL. WARN: none. The lint's own length check (about 2.3 w/s) puts it at about 118 s, inside its 55 to 120 s window (it was 60 to 100 s until the owner allowed 90 to 120 s teaching days).
- Shape against teaching-flow: the mechanism steps are 39 percent of the words (aim about 40), the catch starts at 78 percent (aim 70 to 80; the frames show 70 to 77), 3 numbered steps with the `STEP n/3` kicker starting at step 1, a new object about every 4 s in the beat table (nothing still for more than 8 s).
- Detail checklist (teaching-flow section c): terms defined: Big-O, O(n), O(log n) (3), plus n and sorted in plain words. Running example: 10 lakh sorted names, counts from a run. Naive way first: beats 2 and 3 (the 10-name test lies). WHY per step: steps 1 and 2 carry a "kyunki"; step 3 is the run itself. Catch: sorted list needed (beat 8). Consequence: `x in list` is O(n). Recap line and one check question (answer 22 is in the caption). Stand-alone: no "kal", "part", "next".
- Cut first if the take runs past 115 s: the follow line (5 words, or move it to the end card) and the Python `in` line (11 words).
- Unsure: (1) the hook is a question that carries a computed number, so I filed it as `surprising_fact` / `cost_shock`; the owner may prefer `direct_question` (alternate 3). (2) 2.7 vs 2.36 words per second, see the header: the real voice rate decides. (3) "hum seconds nahi steps ginte hain, kyunki steps machine se nahi badalte" is explanation, not a quoted fact; it follows the Time complexity page (counting elementary operations). (4) The Big-O page says "upper bound"; the script says "bure se bure haal" only for the two searches, as the Linear search page does.
