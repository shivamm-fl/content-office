---
name: hook-writer
description: Write the first 10 seconds of every Learnvora System Design reel with the right hook type for the day - direct question, interviewer asked, relatable stake, surprising fact, company specific. Use for every spoken_hook / hook_10s / hook_candidates in the queue, the first scene of every script, and whenever the owner says "hook", "pehle 10 sec", "log skip kar rahe".
---

# Hook writer (Learnvora System Design)

The first spoken line gives the question or the payoff within two seconds, in at most 10 words (20 for `interviewer_asked` and `company_specific`, whose question may run to 16). Never a greeting, never "aaj hum seekhenge", never a concept name with no question and no stake.

## Types (`hook_type` in the queue item; `scripts/validate_queue.py` and `scripts/lint_script.py` check them)
| type | form | use it for |
|---|---|---|
| `direct_question` | the topic as a plain question a learner searches for, then the direct answer | concept, structure, component days |
| `interviewer_asked` | `Interviewer ने पूछा: <ONE complete, self-contained question of 7 to 16 words ending in ?>` | problem, pattern, trade-off days |
| `relatable_stake` | the concrete stake first (someone did X, the result was Y), the interview frame in the third beat | any day with a real-life consequence |
| `surprising_fact` | the surprising fact with the viewer in it, true and sourced | myth-bust and case-study days |
| `company_specific` | `<Company> के interview में ये पूछा गया: <question>`; needs `company` and `company_source` (a page you fetched) | only with a fetched page; otherwise use another type or label it an example |

Example (system design): Interviewer ने पूछा: एक साथ एक करोड़ users आएँ तो सर्वर कैसे संभालोगे?

## Question quality (for `interviewer_asked` and `company_specific`)
One complete sentence, understandable with no context, no fragment, no stacked question, no unexplained jargon. If you cannot say it aloud in one breath, shorten it.

## Rules
- Test the types side by side. Retire one only with at least 3 reels of its own and a median skip rate at least 10 points worse than the others (our numbers in `state/learnings.md`). Nothing that works is dropped because a newer type exists.
- Carried-over hypothesis from LearnAI (AI audience): the `Interviewer ने पूछा:` opener had the best median skip rate there. Test it here, do not assume it.
- The hook is on screen from frame 0 with its picture already drawn under it; it works on mute.
- Roman Hinglish for on-screen text; the narration source keeps Devanagari for Hindi words (`.claude/skills/hinglish-script`). The day counter is on the cover and in the caption, never in the spoken hook.
- Score the Roman form with `python .claude/skills/ig-reel/hookscore.py --hook "<roman hook>"`; a DEALBREAKER means rewrite.

## Openers seen in the niche (format only)
Source: `docs-notes/benchmark-2026-10-18.md` (nine public accounts read on 2026-10-18, numbers as read then). These are shapes seen on one to three accounts each, so they are hypotheses to test side by side under the Rules above, not winners. The example lines are our own wording; never reuse another account's line, topic or order. Each shape maps to one existing type above, so `scripts/validate_queue.py` and `scripts/lint_script.py` apply unchanged (word limits, the `interviewer_asked` opener, `company` and `company_source`).

| Shape seen | `hook_type` | Our form (narration source) | Gate |
|---|---|---|---|
| Everyday moment, "how is that even possible?" | `direct_question` | WhatsApp message तुरंत कैसे पहुँच जाता है? | The answer in the next two seconds is stated as "typically"; no claim about one company's internals without a fetched page. |
| Shared pain, "they all fail together" | `relatable_stake` | Payment अटका, पैसे कट गए, order नहीं बना. | Stake first, no interview preamble. Describe the pain; name a real outage only with a fetched report. |
| Weird hypothetical, "will it?" | `direct_question` | अगर 10 करोड़ एक साथ refresh करें, तो क्या होगा? | Label it a thought experiment. If the answer is a real event it needs a fetched source (then `surprising_fact` fits better). |
| Two concepts that sound alike, one-line verdict | `interviewer_asked` | Interviewer ने पूछा: Cache और CDN में असली फ़र्क क्या है? | Trade-off and component days. One complete question of 7 to 16 words; the verdict is the next line, not in the hook. |
| Hard-number stake | `relatable_stake` | 10 लाख tap, एक seat: किसे मिलेगी? | The number is EXAMPLE (on screen, arithmetic shown later) or comes from a fetched page. |
| Incident post-mortem with a date and a source | `company_specific` | <Company> का <date> का outage: official report में असली वजह क्या थी? | Only after the company's own post-mortem is fetched: fill `company` and `company_source`, say no more than the page says, `Source: <site>` on screen. `lint_script.py` only warns that the line has no "interview" phrase; expected for this shape. Roadmap Day 112 is the gated day. |
| Benchmark-versus | `surprising_fact` | Same machine पर <A> बनाम <B>: <N>x का फ़र्क निकला | <N> comes from a run made in this session and shown on screen with its real output (CLAUDE.md rule 1), or from a fetched benchmark. Never invent it. |

How to use them:
- Pick by the day's `format`, not by novelty: shapes 1 and 3 for concept and component days, 4 for trade-off days, 2 and 5 for case-study days, 6 and 7 only when the source or the run exists. Record the shape in `hook_formula` so the growth analyst can compare shapes later.
- Concrete beats abstract: name an app, an event or a number in the first line. The weakest reel in the study had a long abstract sentence ("reverse-engineer X from the outside") as its title; a topic name alone is never a hook.
- Not adopted: a recurring named character (a mascot device, and our cover rule says no mascot), version or launch news, interview humour as a hook, and the day counter or a "tomorrow" tease in the spoken line.
- `hookscore.py` reads English words, so Hinglish lines score WEAK on stakes even when the hook is fine; the examples above raise no DEALBREAKER. Use the score to catch greetings and throat-clearing, not to rank two decent hooks.

**Value first (owner, 2026-10-19).** A hook may be tuned on our numbers, but it never replaces or delays the teaching: say the question, then go straight to the answer. No detour line (rhetorical question, staged "nahi!") between them.
