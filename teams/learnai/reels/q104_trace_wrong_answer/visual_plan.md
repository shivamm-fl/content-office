# Visual plan: q104 (rules: docs-notes/diagram-first-visuals.md)

Idea in one line:
A wrong answer comes out of a black box; a trace opens the box and shows each step's input, output, time and tokens, so the one bad step (search) turns red.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | Interviewer asks where the wrong answer came from; most people only look at the last answer | A question box on top, a dashed black box with question marks in the middle, a red wrong-answer box below; arrows join them, the answer box gets a ring, three numbered pills appear | QUESTION, WRONG ANSWER, ? ? ?, 1 2 3 | M.box, M.arrow, M.pill |
| B | Refund bot says 30 days; the log has only that answer; you keep editing the prompt | A chat with the bot bubble "Refund 30 din", a log card with one single line and three ghost rows with question marks, a prompt card whose version chips v1 v2 v3 get crossed one after another | EXAMPLE, CHAT, LOG, ???, PROMPT | custom (diagram: B) |
| C | Step one: one trace per request holds LLM calls, retrieval and tool executions | A big TRACE container holding three stacked boxes with icons (model, magnifier, gear) that pop in on their spoken words, plus a source label | TRACE, LLM CALL, RETRIEVAL, TOOL, Source: Langfuse docs | M.box, M.pill, custom (diagram: C) |
| D | Step two: input, output, timing, token usage per step, like courier tracking | One SEARCH step card with four rows (IN, OUT, TIME, TOKENS) filling with example values, and a courier tracking line with three dots under it | EXAMPLE, SEARCH, IN, OUT, TIME, TOKENS, PICKED UP, HUB, DELIVERED | custom (diagram: D) |
| E | Step three: open the trace, find the first wrong step; search brought an old page, so editing the prompt was useless | A vertical chain of four step boxes with times; the SEARCH box turns red, an old policy page card with an OLD stamp points at it, the PROMPT box below fades with a cross | EXAMPLE, QUESTION, SEARCH, MODEL, ANSWER, OLD PAGE, PROMPT | M.box, custom (diagram: E) |
| F | Record the whole path; comment which you check first | A zigzag route with five dots draws itself from question to answer, then a comment card with three option pills (SEARCH, PROMPT, TOOL) and a follow pill | FULL PATH, COMMENT KARO, SEARCH, PROMPT, TOOL, + FOLLOW | custom (diagram: F) |
