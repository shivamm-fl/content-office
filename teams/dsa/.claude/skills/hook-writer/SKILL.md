---
name: hook-writer
description: Write the first 10 seconds of every Learnvora DSA reel with the right hook type for the day - direct question, interviewer asked, relatable stake, surprising fact, company specific. Use for every spoken_hook / hook_10s / hook_candidates in the queue, the first scene of every script, and whenever the owner says "hook", "pehle 10 sec", "log skip kar rahe".
---

# Hook writer (Learnvora DSA)

The first spoken line gives the question or the payoff within two seconds, in at most 10 words (20 for `interviewer_asked` and `company_specific`, whose question may run to 16). Never a greeting, never "aaj hum seekhenge", never a concept name with no question and no stake.

## Types (`hook_type` in the queue item; `scripts/validate_queue.py` and `scripts/lint_script.py` check them)
| type | form | use it for |
|---|---|---|
| `direct_question` | the topic as a plain question a learner searches for, then the direct answer | concept, structure, component days |
| `interviewer_asked` | `Interviewer ने पूछा: <ONE complete, self-contained question of 7 to 16 words ending in ?>` | problem, pattern, trade-off days |
| `relatable_stake` | the concrete stake first (someone did X, the result was Y), the interview frame in the third beat | any day with a real-life consequence |
| `surprising_fact` | the surprising fact with the viewer in it, true and sourced | myth-bust and case-study days |
| `company_specific` | `<Company> के interview में ये पूछा गया: <question>`; needs `company` and `company_source` (a page you fetched) | only with a fetched page; otherwise use another type or label it an example |

Example (DSA): Interviewer ने पूछा: sorted array में element कैसे ढूँढोगे, log n में?

## Question quality (for `interviewer_asked` and `company_specific`)
One complete sentence, understandable with no context, no fragment, no stacked question, no unexplained jargon. If you cannot say it aloud in one breath, shorten it.

## Rules
- Test the types side by side. Retire one only with at least 3 reels of its own and a median skip rate at least 10 points worse than the others (our numbers in `state/learnings.md`). Nothing that works is dropped because a newer type exists.
- Carried-over hypothesis from LearnAI (AI audience): the `Interviewer ने पूछा:` opener had the best median skip rate there. Test it here, do not assume it.
- The hook is on screen from frame 0 with its picture already drawn under it; it works on mute.
- Roman Hinglish for on-screen text; the narration source keeps Devanagari for Hindi words (`.claude/skills/hinglish-script`). The day counter is on the cover and in the caption, never in the spoken hook.
- Score the Roman form with `python .claude/skills/ig-reel/hookscore.py --hook "<roman hook>"`; a DEALBREAKER means rewrite.

## Openers seen in the niche (format only)
From `docs-notes/benchmark-2026-10-18.md`, a read-only study of other DSA accounts (rule 15: format only, never their words). The formulas are paraphrased from captions and on-screen text; the videos did not render, so no spoken hook was heard and none of this is proven on our numbers. Write ours fresh from the day's topic. A formula is not a new type: put its name in the item's `hook_formula`, keep `hook_type` one of the five above, and `scripts/validate_queue.py` and `scripts/lint_script.py` apply unchanged (word limits, the `Interviewer ने पूछा:` form, `company_source`).

| formula (`hook_formula`) | `hook_type` | form | example shape (own wording, DSA, Hinglish) |
|---|---|---|---|
| `cost_shock` | `surprising_fact` | a number the viewer can feel, computed or run by us, with the viewer's data size in it | 1 लाख numbers पर brute force: 5 अरब steps. |
| `marked_hard` | `surprising_fact` | the scary label shrunk to one idea; the level is read from the fetched problem page | Hard लिखा है, पर idea सिर्फ़ एक line का. |
| `wrong_way_first` | `relatable_stake` | the tempting wrong way the viewer has used, then its failure; the fix comes last | हर substring check किया? लंबी string पर code अटक जाएगा. |
| `stopwatch_question` | `interviewer_asked` | `Interviewer ने पूछा:` plus one complete question with a limit in it; a question card and a stopwatch are on screen from frame 0, the answer lands by about 10 s | Interviewer ने पूछा: 10 लाख numbers में duplicate एक second में कैसे ढूँढोगे? |
| `scale_scenario` | `direct_question` | a real-product scenario at scale as a plain question, then the direct answer | 10 लाख users एक साथ search करें तो क्या टूटेगा? |
| `is_x_dead` | `direct_question` | a topical "is X dead?" question, used only when a page we fetched answers it | क्या AI के बाद DSA interviews मर गए? |

Notes:
- Counted as spoken words: five examples fit the 10-word limit; the stopwatch example is 13 words (its question is 10, inside 7 to 16, under the limit of 20). All six were checked against the validator rules; the hook scorer is calibrated on English and rates Hinglish lines low, so use it only to catch a DEALBREAKER.
- Facts still need a fetched page (rule 1): `cost_shock` steps are arithmetic we run (seconds need a run and an EXAMPLE pill); `marked_hard` needs the problem page; `is_x_dead` needs a source for the answer, and a claim about one company's hiring is `company_specific` with its `company_source`, never a guess.
- The day counter stays out of the spoken hook (it is a label; the benchmark counter alone drew little). The keyword call to action belongs in the closing and the caption, never in the hook.
- Considered, not added: the insider confession (it needs a credible named person, we are faceless) and the career-stress micro-story (it fits a concept day such as Day 1; use `relatable_stake` there only if the stake is concrete and true).
- Test the formulas side by side like the types (Rules above); record each result in `state/experiments.md`.

**Value first (owner, 2026-10-19).** A hook may be tuned on our numbers, but it never replaces or delays the teaching: say the question, then go straight to the answer. No detour line (rhetorical question, staged "nahi!") between them.
