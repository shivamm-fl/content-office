---
name: hook-writer
description: Write the first 10 seconds of every LearnAI reel (generic e##, course r##, interview q##) with the right HOOK TYPE for its track - direct question (course), relatable stake / "Interviewer ne poocha" / company-specific (interview, rotated), surprising fact (generic). Built on our own skip-rate data (2026-10-15) and the owner's corrections of 2026-10-16: never discard a hook type that works, test the types side by side, and the question after "Interviewer ne poocha" must be clear and self-contained. Use for every spoken_hook / hook_10s / hook_candidates in the queue, the first scene of every script, and whenever the owner says "hook", "strong hook", "pehle 10 sec", "log skip kar rahe", "hook A jaisa", "direct question hook", "company wala hook".
---

# Hook writer: the first 10 seconds (owner decisions 2026-10-15 and 2026-10-16)

Why: Instagram's skip rate (viewers gone in the first 3 s) on our 28 reels posted by 2026-10-15 was 59-90 %. Third-party trackers call under 30-40 % healthy and over 50 % a failing hook. Our viewers do not read: the first 1.5 s of SOUND and the first PICTURE decide.

| Our opener type (reels posted before 2026-10-15) | reels | median skip | median avg watch |
|---|---|---|---|
| "Interviewer ne poocha: <concept>?" | 11 | 69.7 % | 7.0 s |
| other question | 9 | 73.8 % | 6.2 s |
| statement / news fact | 7 | 79.5 % | 4.2 s |

Read the table honestly: the "Interviewer ne poocha" opener was our BEST type, not our worst (q03 59.4 % was our best single reel; the worst were the e02 / e03 news-fact openers, ~90 %). On 2026-10-15 we added the relatable-stake opener (benchmarks: winners opened on a wrong belief or a real Indian stake such as the IRCTC Tatkal race, flops on a concept or jargon: `docs-notes/laxmikant-benchmark.md`, `docs-notes/competitors/bytechai-2026-10-12.md`). On 2026-10-16 the owner corrected how we use that: **we do not discard an opener that works because a new one exists. Hook types are tested side by side and only retired on our own numbers.** The owner also named what was wrong with the weak "Interviewer ne poocha" reels: the QUESTION after it was confusing. Fix the question, keep the type (see "Question quality" below).

## The hook types (field `hook_type` in the queue item, spec.json and `state/phase5_status.json`)
| Track | Types | Rule |
|---|---|---|
| course r## | `direct_question` (default); `relatable_stake` for about one item in four | the viewer searches for these topics, so the topic as a plain question is the hook and the reel TEACHES it |
| interview q## | rotate `relatable_stake`, `interviewer_asked`, `company_specific` | take the type used least among the last six q## in `state/covered.json`; `company_specific` only with a fetched source |
| generic e## | `surprising_fact`, `misconception_question` (side by side, owner 2026-10-17) | one surprising verified fact that has the viewer in it (never a bare news statement); or a belief the viewer holds, asked as a question and corrected by the source |

### 1. `direct_question` (course)
Beat 1 (0-3 s): the topic as a plain question, at most 10 words, the thing a learner types into a search box: `AI agent क्या है?`, `Tool calling कैसे होती है?`, `Claude skills क्या हैं?`. Beat 2 (3-8 s): the direct answer in ONE plain sentence ("Seedha jawab: ..."), no jargon that is not defined. Beat 3 (8-10 s): a numbered promise of what the viewer will get ("teen cheezein, ek example ke saath"). Body: definition, one real example with numbers (EXAMPLE pill if invented), how it works in numbered steps with a cause per step, one boundary or exception, a one-line rule. Test of success: after the reel a beginner can explain the topic in two sentences. A concept-name opener is correct HERE (it is the question); it is a flop only when beginners have no reason to care about the topic, so pick topics people actually search for or hear about. (The examples below show the form only; every fact comes from a fetched source.)

### 2. `relatable_stake` (interview, sometimes course)
The 4-beat shape the owner approved on 2026-10-15 ("Hook A"), 25-35 spoken words:
1. **Stake, 0-2.5 s.** A concrete moment in plain words, spoken from frame 0. Someone did X, the result was Y. Numbers make it real (EXAMPLE pill if invented). No jargon, no preamble.
2. **Contradiction, by ~4 s.** Why Y is wrong or surprising.
3. **Frame, ~4-7 s.** Name it: the trap or the interview ("Interview mein yahi poocha jaata hai"); the jargon word may appear here, after the viewer is hooked.
4. **Open loop, by ~10 s.** A count and a promise ("Aur iski teen wajah hain"), then the body delivers 1/3, 2/3, 3/3 (numbered chips on screen).
The owner's test (2026-10-16): the viewer has SEEN this happen but does not know the reason ("tumne ek message bheja aur usage ka bada hissa chala gaya", "do AI ke answers teesre AI ko dikhaye, order badla, winner badla", "AI ne tumhara calendar khol liya"). The reason is the payoff.

### 3. `interviewer_asked` (interview)
`Interviewer ने पूछा: <one clear question>?` as the first words, then within 4 s the stake or the trap ("sabse zyada log yahan galat bolte hain") and the numbered open loop by ~10 s. The on-screen `INTERVIEW QUESTION` chip is up from frame 0. This is the type that gave us our best retention before 2026-10-15; keep it in the mix, with a question that passes the test below.

### 4. `company_specific` (interview)
`<Company> के AI interview में ये पूछा गया: <one clear question>?` (Zomato, Google, Swiggy, Flipkart, and so on). The question part follows the same "Question quality" rules.
- **Source rule (CLAUDE.md rule 1 applies fully):** the claim "company X asks / asked this" needs a page you fetched in the session: a published interview experience, the company's engineering blog or talk, a job post that lists the skill. Record `company` and `company_source` in the queue item. The hook says exactly what that page supports ("Ek Google AI interview experience me ye sawal aaya", "Zomato ke AI engineer job post me ye skill likhi hai") and nothing more: not "always asked", not "the official question".
- **No source, no company claim.** Without a source write it as an example ("Maan lo ek food-delivery company ka AI interview hai") with an EXAMPLE pill, or use another type. Never invent that a named company asked something; never name a real interviewer or candidate; no logos.
- **Research step (planner):** WebSearch for `<company> AI engineer interview questions` and for the company's own engineering posts, WebFetch the best 2-3 pages, pick a question whose answer is checkable against a technical source (docs or paper), and note both URLs.

### 5. `surprising_fact` (generic)
The surprising verified fact first, with the viewer in it ("tumhara phone ...", "ek AI ne ..."), then why it matters to a learner; never "breaking", never a bare news statement.

## Question quality (every `interviewer_asked` and `company_specific` hook; owner 2026-10-16)
A confusing question after "Interviewer ने पूछा:" lost the viewer in the first second. Write the question so that it passes ALL of these:
1. **One question, one sentence, 7 to 16 words**, in the natural Hinglish a person would speak. No "and" that stacks two questions (`MCP क्या है, और हर tool के लिए अलग integration क्यों नहीं?` is two questions).
2. **A complete sentence, never a fragment.** `PDF का chunk कितना बड़ा?` is a fragment; the viewer has to guess what is asked.
3. **Self-contained.** A beginner understands what is asked without knowing the topic name. Use words they already know (ChatGPT, PDF, chatbot, app); a technical word is allowed only when it is explained in the same sentence or the situation makes it obvious.
4. **Names the situation or the tension, not just the concept.** `Embedding क्या होती है?` is a concept name; `Phone "beach" लिखने पर बिना tag वाली photos भी कैसे ढूँढ लेता है?` is a question.
5. **The reel answers exactly this question** inside itself, and the closing question for the comment is a different, easy one (1, 2 or 3).
6. **The test:** read it to someone who does not know AI. If they cannot repeat what is being asked, rewrite it.
Weak -> strong: `PDF का chunk कितना बड़ा?` -> `ChatGPT को लंबा PDF दो, तो वो बीच की बातें क्यों भूल जाता है?` / `LLM function call कैसे करता है?` -> `LLM तो सिर्फ़ text बनाता है, फिर वो असली function कैसे चला लेता है?` / `MCP क्या है और function calling से कैसे अलग?` -> `AI app में हर tool जोड़ने के लिए अलग integration क्यों नहीं लिखना पड़ता?`

## Finding the stake (for `relatable_stake`, and for the example in every type)
Ask: where does a normal Indian person, student or developer FEEL this concept break, cost money, cost time, or cost the job?
- Money: a refund promised wrongly, UPI charged twice, an EMI or bill miscalculated, a free plan that is not free, a coding assistant that ate the usage.
- Time / queues: Tatkal booking in the first second, a delivery ETA, an OTP that never came, a waiting-list number.
- Job: interview rejection for the obvious answer, a production bug at 2 AM, a manager asking "kaam hua?" when it did not.
- Daily apps (a brand, and its logo on screen, only as a fetched fact): gallery search that finds "beach" without tags, the keyboard guessing the next word, maps rerouting, a chatbot that sounds sure and is wrong, an AI that opened your calendar.
- Study: a 100-page PDF given to ChatGPT, notes before an exam, a coding test.
Use the queue's `everyday_anchor`. A real incident (a court case, an outage) is allowed only with a fetched source; otherwise say it as an example ("maan lo") with the EXAMPLE pill.

## Frame-0 picture (muted viewers decide on this)
- A recognisable object, not a sentence: a phone chat bubble with a wrong answer, a ✓ that flips to ✗, a ₹ amount, a crashed app screen, a database row in red, a ticket counter; for `direct_question` the topic drawn as one clear picture (an agent loop, a tool plugging in) under the question.
- It is on screen at frame 0 and moves (a bubble types in, a stamp lands). SFX `impact` at 0.05 s (already in the skeleton).
- At most one big label of 1-3 words. For q## items an `INTERVIEW QUESTION` chip is up from frame 0.

## Banned openers (each cost us views)
- A greeting, a teaser or a channel name ("aaj hum", "is video mein", "namaste dosto").
- A news fact with no viewer in it ("AI ne 20 mein se 15 game jeete").
- A concept name or jargon opener in an interview or generic reel with no question and no stake ("Embeddings sirf text ki hoti hain?", "Raw LLM ko sawal ka jawab dena nahi aata"). (A plain question about the topic is the `direct_question` hook of a course reel.)
- `Interviewer ने पूछा:` followed by a confusing, fragmentary or double question (see "Question quality"), or by a flat concept with no stake or trap within ~4 s.
- Slow builds.

## Examples
`relatable_stake`, RAG (interview):
```
"A": "@hook Chatbot ने customer को बोला, | refund 30{thirty} दिन में मिलेगा। || Policy में लिखा है, | 7{seven} दिन। || @emph Document उसके पास था, | फिर भी जवाब ग़लत। || Interview में यही पूछा जाता है, | और इसकी 3{three} वजह हैं।"
```
Picture: a chat bubble "Refund in 30 days ✓" types in, the policy line "7 DAYS" highlights, the ✓ flips to ✗; chip INTERVIEW QUESTION.

`relatable_stake`, calendar / MCP (q14, the viewer saw it, not the reason):
```
"A": "@hook तुमने AI को बोला, आज का schedule बताओ, | और उसने तुम्हारा Calendar खोलकर check कर लिया। || पर AI तो सिर्फ़ text लिखता है, | Calendar तक पहुँचा कैसे? || @emph Interview में यही पूछा जाता है: MCP क्या है, | जवाब 3{three} steps में।"
```

`interviewer_asked` (a clear, complete, single question):
```
"A": "@hook Interviewer ने पूछा: | ChatGPT को लंबा PDF दो, | तो वो बीच की बातें क्यों भूल जाता है? || ज़्यादातर लोग यहाँ गलत जवाब देते हैं, | और इसकी 3{three} वजह हैं।"
```

`direct_question` (form only; facts come from sources):
```
"A": "@hook Tool calling कैसे होती है? || सीधा जवाब: | model खुद function नहीं चलाता, | वो बस बताता है कि कौन सा function, किन arguments के साथ। || तीन steps में समझाता हूँ, | एक example के साथ।"
```

`company_specific` (only with a fetched `company_source`):
```
"A": "@hook <Company> के एक AI interview experience में | ये सवाल आया: | <one clear question>? || ज़्यादातर candidates पहला जवाब ग़लत देते हैं, | और इसकी 3{three} वजह हैं।"
```

## Before you save
1. Write three candidates (`hook_candidates` in the queue), each a different hook type or stake; pick the one whose first 2.5 s works with the sound alone AND whose frame-0 picture works on mute. For `interviewer_asked` and `company_specific` run the Question quality test on the question.
2. Set `hook_type` in the queue item and in spec.json, then `python3 scripts/lint_script.py reels/<folder>/spec.json` (checks the form of the chosen type, the question length, contradiction early, open loop by ~10 s, plus the script checks).
3. The caption's first line repeats the hook in Roman Hinglish (it is what `hookscore.py` scores in the gate; the scorer is English-calibrated, so use it as a guide).

## Measure (this decides which types stay)
After 72 h read `reels_skip_rate` and `avg_watch_s` in `state/insights.json` and group by `hook_type`. A type is retired only when it has at least three reels AND its median skip rate is at least 10 points worse than the other types of the same track. A type that beats our 59 % best over at least three reels goes into `state/learnings.md` with the numbers. Never drop a type because a new one exists. Where available, post a second hook of the same reel as a Trial Reel (non-followers only) and keep the winner.
