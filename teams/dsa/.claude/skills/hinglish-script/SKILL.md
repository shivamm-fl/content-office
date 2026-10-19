---
name: hinglish-script
description: How to write the spoken script (script.txt / spec.json copy) of every Learnvora DSA reel (series reels), in the shape the owner approved on 2026-10-14. Read before writing or rewriting any script, hook or caption. Use when the owner says "script likh", "hook improve kar", "mast script", or hands over a topic.
---

# Hinglish reel script (owner standard, 2026-10-14)

Why: the owner's own script tool produced scripts that read like a senior engineer explaining to a junior; ours read like a docs summary ("model docs ke hisaab se..."). The owner will not hand over a script every time, so write them like this yourself. Read `docs-notes/series-style.md` and `docs-notes/teaching-flow.md` first, then `docs-notes/script-style-v3.md`. Never copy their wording; copy the shape.

## The shape (60 to 120 s; about 270 spoken words fill 110 s, see docs-notes/teaching-flow.md)
1. **Hook (0 to 10 s): follow `.claude/skills/hook-writer` and use the item's `hook_type` (owner decisions 2026-10-15 and 2026-10-16).** `direct_question` (course): the topic as a plain question ("Tool calling कैसे होती है?"), the direct answer in one sentence, a numbered promise, then teach it. `relatable_stake` (interview): the stake from frame 0 ("Chatbot ने customer को बोला, refund तीस दिन में मिलेगा।"), the contradiction by ~4 s ("Policy में लिखा है, सात दिन।"), the interview frame ("Interview में यही पूछा जाता है"), a numbered open loop ("इसकी तीन वजह हैं"). `interviewer_asked`: "Interviewer ने पूछा:" plus ONE clear, complete, self-contained question (at most 16 words, no fragment, no stacked question: the first second must be understood), then the trap and the open loop. `company_specific`: the company named only as far as a fetched `company_source` supports it. Every type keeps the open loop by ~10 s except `direct_question`, which promises what the viewer will learn.
2. **The weak baseline fails, shown (6 to 20 s).** The obvious approach, with its concrete failure (BM25 gives score zero; prompt-only JSON loses a bracket; brute force compares millions of vectors).
3. **The mechanism, with the real terms and the why (20 to 55 s).** Interview vocabulary untouched (constrained decoding, logits, tool_calls, stop_reason, nucleus sampling). One clause of cause per step ("kyunki ..."). Numbered steps when there is a flow: "Pehle step mein ... Doosre step mein ... Teesre step mein ...".
4. **One boundary or exception** a senior knows (when it does NOT hold, what to check).
5. **One-line insight**, then the comment + follow close (owner decision 2026-10-15): an easy comment question the viewer answers with a number or one word ("1, 2 ya 3, tumne kaun sa dekha?"), then a follow line with value ("Aise aur interview traps ke liye follow karo."); no "save kar lo" line. The insight can be said as a rule ("Yaad rakho: plan, execute, validate.").

## Spoken-format rules (the voice reads exactly what is written)
- Devanagari for Hindi words, Roman for English terms. Numbers are always spoken in English: write `270{two-hundred-seventy}`, `100{hundred}`, `top-5{top-five}` (display shows the digits, voice says English; one hyphenated word per brace, never a multi-word brace). Percent and years too.
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
