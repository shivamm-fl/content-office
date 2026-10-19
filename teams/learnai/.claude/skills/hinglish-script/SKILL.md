---
name: hinglish-script
description: How to write the spoken script (script.txt / spec.json copy) of every LearnAI reel (generic e##, course r##, interview q##), in the shape the owner approved on 2026-10-14. Read before writing or rewriting any script, hook or caption. Use when the owner says "script likh", "hook improve kar", "mast script", or hands over a topic.
---

# Hinglish reel script (owner standard, 2026-10-14)

Why: the owner's own script tool produced scripts that read like a senior engineer explaining to a junior; ours read like a docs summary ("model docs ke hisaab se..."). The owner will not hand over a script every time, so write them like this yourself. Reference scripts: `docs-notes/script-references.md` (read it first, then `docs-notes/script-style-v3.md`). Never copy their wording; copy the shape.

## The shape (60 to 90 s, 130 to 190 spoken words)
Interview reels (q##) are no longer written to this older shape: use `docs-notes/interview-teaching-flow.md` (seven beats, 90 to 120 s, about 230 to 300 words, owner 2026-10-19). The hook rules below stay as they are for every reel.
1. **Hook (0 to 10 s): follow `.claude/skills/hook-writer` and use the item's `hook_type` (owner decisions 2026-10-15 and 2026-10-16).** `direct_question` (course): the topic as a plain question ("Tool calling कैसे होती है?"), the direct answer in one sentence, a numbered promise, then teach it. `relatable_stake` (interview): the stake from frame 0 ("Chatbot ने customer को बोला, refund तीस दिन में मिलेगा।"), the contradiction by ~4 s ("Policy में लिखा है, सात दिन।"), the interview frame ("Interview में यही पूछा जाता है"), a numbered open loop ("इसकी तीन वजह हैं"). `interviewer_asked`: "Interviewer ने पूछा:" plus ONE clear, complete, self-contained question (at most 16 words, no fragment, no stacked question: the first second must be understood), then the trap and the open loop. `company_specific`: the company named only as far as a fetched `company_source` supports it. Every type keeps the open loop by ~10 s except `direct_question`, which promises what the viewer will learn.
2. **The weak baseline fails, shown (6 to 20 s).** The obvious approach, with its concrete failure (BM25 gives score zero; prompt-only JSON loses a bracket; brute force compares millions of vectors).
3. **The mechanism, with the real terms and the why (20 to 55 s).** Interview vocabulary untouched (constrained decoding, logits, tool_calls, stop_reason, nucleus sampling). One clause of cause per step ("kyunki ..."). Numbered steps when there is a flow: "Pehle step mein ... Doosre step mein ... Teesre step mein ...".
4. **One boundary or exception** a senior knows (when it does NOT hold, what to check).
5. **One-line insight**, then the comment + follow close (owner decision 2026-10-15): an easy comment question the viewer answers with a number or one word ("1, 2 ya 3, tumne kaun sa dekha?"), then a follow line with value ("Aise aur interview traps ke liye follow karo."); no "save kar lo" line. The insight can be said as a rule ("Yaad rakho: plan, execute, validate.").

## Spoken-format rules (the voice reads exactly what is written)
- Devanagari for Hindi words, Roman for English terms. Numbers are spoken in the language of the word that FOLLOWS them (owner, 2026-10-19). Before a Hindi word the number is Hindi: `1{एक} घंटे`, `3{तीन} तरीके`, `10{दस} लाख`, `0{ज़ीरो} रखा`. Before an English word it is English: `3{three} steps`, `20{twenty} comparisons`. Never `three तरीके` or `तीन steps`. A decimal, a percent, a year or a reading after an English noun (`loss 18.67{eighteen-point-six-seven}`) stays English. Calculations and formulas are spoken in English words (`marks equals w{डब्ल्यू} times hours`), never half Hindi. The display shows the digits, the brace holds the spoken form; one hyphenated word per brace, never a multi-word brace. The step markers (पहला / दूसरा / तीसरा step) stay Hindi.
- `|` between clauses, `||` between thoughts, `@hook` on the first phrase, `@emph` on the trap/insight line. Pace 1.26 (clean-reel). About 2 words per second including pauses.
- Never write the TEXT/visual direction as spoken lines; the on-screen hook is a separate short label.
- Acronyms the voice mangles: `JSON{जेसन}`.

## Facts (rule 1 still applies, shorter version)
Every number and claim comes from a page fetched in the session (primary source first, then at least one independent source or search for criticism). Name the source in the line when it matters ("Anthropic के docs के मुताबिक"). Invented examples are said as examples ("मान लो"), and get an EXAMPLE pill. If the owner says "claims chhod", keep them as written.

## Anti-patterns (what the owner rejected)
- Opening on a teaser ("tumne alag words likhe..."), or on a concept name in an interview/generic reel with no question and no stake (a plain topic question is right for a course `direct_question` hook).
- A confusing question after "Interviewer ने पूछा:": a fragment ("PDF का chunk कितना बड़ा?"), a stacked double question, or an unexplained jargon word. Rewrite it as one complete sentence a beginner can repeat.
- Answer as a docs recital with no weak baseline and no why.
- No example with numbers; a list that is not numbered; the insight missing.
- "Save kar lo" as the only close; a share line with no question.
- Hedging endings ("साफ़ नहीं है"), vague words ("काफ़ी", "बहुत") instead of the concrete thing.

## Before you save
Run `python3 scripts/lint_script.py reels/<folder>/spec.json`. It checks the hook, numbered steps, closing question, spoken numbers and length. Fix every FAIL; WARN is judgement.

## Humanising pass (owner, 2026-10-19): the script must sound like a person, never like a summary
"Docs ye bolte hain, wo bolta hai" and a lecture full of AI phrasing is what the owner rejected as slop. Before you save, run `.claude/skills/no-ai-slop` and `.claude/skills/humanizer` on the spoken lines. They are written for English prose; apply the same patterns to Hinglish: not-X-but-Y and "log sochte hain... nahi" set-ups, staged openers ("ek baat aur", "sach ye hai"), one-line closers and mic-drop kickers, triads for show, dramatic fragments, stock praise words, a summary that repeats the reel. Facts stay exactly as checked.
- **No source-talk in the lines.** The script never says "docs ke mutabik", "paper kehta hai", "research batati hai" or names a page. The fetched URLs live in the queue entry and the notes, not in the voice. Say the fact like someone who knows it. A product or company name is fine when the reel is about it.
- Talk to one person ("tum"), use what you really did ("maine code chalaya"), pick one picture the viewer already knows (a basketball throw, a phone contact list) and come back to it, keep a short human reaction where one belongs ("bilkul bekaar guess"). No dashes.
- Keep the owner's closing rule (one comment question, one follow line) and the lint rules: the humanising pass changes the voice, not the facts, the steps or the numbers.

- **Say a technical term only if the reel explains it (owner, 2026-10-19).** The audience is people becoming AI engineers, so use the real words (forward pass, loss function, gradient, learning rate, converge). But each one is explained at its first use in one clause: the term, "यानी", the plain meaning ("learning rate यानी कदम का size"). A term you cannot explain in the time you have is not said: say the plain thing instead, and never put it on screen either. The owner caught "cross-entropy" in a reel that never explained it.

## Flow and continuity (owner, 2026-10-19: he pointed at a script whose flow he liked)
The reference is a Day 1 script the owner got back from ChatGPT and called continuous, flowing, clear and not vague. What it does, and what every script here must do:
- **Each beat grows out of the one before it, usually with a question the viewer is already asking.** "Ab model ko kaise pata chalega ki kitni galti hui? Yahan aata hai loss function." / "Negative gradient? Matlab weight badhane se loss kam hoga." Never drop the next thing in with no bridge ("Gradient minus 18.67. Negative hai, isliye w badhao." with nothing before it reads as a list, not a lesson).
- **Show the example first, name it after.** "Weight zero tha, prediction zero, obviously galat. Ye pehla step hai: forward pass." The viewer has already seen the thing when the term arrives.
- **After every number, say what it means in one plain sentence** ("loss jitna kam, predictions utni accurate"). A number with no meaning attached is vague.
- **Failure right after success, in one plain line** ("Model target ko cross karke bahut aage nikal gaya"), then the term (diverge).
- **No vague words.** "kaafi improve ho gaya" is replaced by the numbers (loss 18.67 se 0.083). "Patterns encode karte hain" is replaced by something the reel has shown.
- Short sentences that talk to one person, a light human aside ("obviously"), but never a staged "Bilkul nahi!" or a dash used as a drumroll.
- The owner's reference script still broke our own limits (about 400 words, unexplained learning rate and converge, a "next lesson" pointer): copy its flow, not those.

- **No filler between the hook and the first teaching line** (owner, 2026-10-19). On Day 1 he cut "kya use har answer ratwaya jaata hai? Bilkul nahi!" between "AI model seekhta kaise hai?" and "jaise tumne basketball khelna seekha...". That cut line was not an answer and not a needed step, it was khachra. The basketball line stays: it is the first teaching line (an analogy), not a direct answer, and an analogy or the first step is a good way to start. So: after the hook question the very next line teaches (an analogy, an example or the first step). Never fill the gap with a rhetorical question, a staged "nahi!" or a warm-up ("socho..."). Do not replace a good analogy with a bare definition either.
