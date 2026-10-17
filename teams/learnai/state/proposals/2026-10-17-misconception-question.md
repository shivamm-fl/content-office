# Proposal: allow hook_type misconception_question (generic track)

Owner decision 2026-10-17: the generic track tests two hook types side by side, `surprising_fact` and `misconception_question` (an interview-framed common belief, as in e09, for example "Prompt caching se AI ka jawab badal jata hai?"). e101 uses it. Needs the owner's approval; nothing below has been applied.

## Change 1: scripts/validate_queue.py
- Line 11: add `"misconception_question"` to `HOOK_TYPES`.
- Add a check next to the `direct_question` one: `if ht == "misconception_question" and not re.search(r"(\?|？|क्या|कैसे|क्यों)", sh): problem "spoken_hook must state a common belief as a question"`. Keep the 10-word limit (it already falls under the default `max_words = 10`).
- The relatable_stake preamble check stays as is.

## Change 2: .claude/skills/hook-writer/SKILL.md
- Add the type under the generic track: `misconception_question` = a common belief about AI stated as a question, often interview-framed ("X karne se Y ho jata hai?"), answered inside the reel from a primary source (e09 temperature zero, e101 prompt caching). At most 10 words, plain Hinglish, the belief must be real and the correction must be sourced.
- Generic track rule: `surprising_fact` and `misconception_question` are tested side by side; retire one only with at least 3 reels of its own and a median skip rate 10 points worse than the other type (same rule as learnings.md of 2026-10-16).

## Also
- teams/learnai/CLAUDE.md rule 4 lists generic as `surprising_fact`; it should say "`surprising_fact` or `misconception_question`".
- Until approved, e101 fails validate_queue.py on hook_type (expected).
