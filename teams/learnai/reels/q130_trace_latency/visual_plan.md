# Visual plan: q130 where did the 20 seconds go (tracing)

Idea in one line: a total of 20 s hides where the time went; cut the request into spans on one trace, sort them, fix the biggest share, and remember parallel spans do not add up.
Picture: one waterfall of span bars (a courier tracking page for a request) that is cut, tagged, sorted and read.

| Scene | Spoken (short) | The picture | Labels | Built with |
|---|---|---|---|---|
| A | Chatbot answers in 20 s, where did time go? | Chat bubbles, a clock card counting 0.0 to 20.0 s from frame 0, one grey bar with a question mark | WHERE? | custom bubbles + counter |
| B | Answer: trace, fix biggest part first, three steps | The grey bar cuts into 6 coloured segments, the biggest turns gold, three step cards land | TRACE, BIGGEST, FIX FIRST, 1 SPAN, 2 TRACE ID, 3 SORT | custom segments + cards |
| C | App steps, total 20 s, LLM is only 36 % | Five rows (search, rerank, LLM, order API, LLM) fill with bars, total tag, LLM rows go cyan, two stat cards 7.2 s and 12.8 s | EXAMPLE, TOTAL 20.0 s, LLM SLOW?, 7.2 s, 12.8 s | custom waterfall |
| D | Step 1, span = start and end, end minus start | Six bars land, rerank row ringed with START and END, 7.0 - 0.8 = 6.2 s, every bar gets its duration, API + retry ringed | START 0.8, END 7.0, 6 SPANS, ORDER API | custom waterfall |
| E | Step 2, trace id on all spans, thousands of requests | Same rows each get a violet a91f chip, a bracket says ONE TRACE, two grey strips with other ids below | TRACE ID: a91f, ONE TRACE, x 1000s | custom waterfall |
| F | Step 3, sort by time, rerank 31 %, API 29 % | Five bars re-order by length, percent tags land, rerank turns gold, LLM rows dim | 31 %, 29 %, FIX FIRST | custom sorted bars |
| G | Parallel spans do not add up | Two bars start together (3 s and 2 s), red 3 + 2 = 5 s struck, green bracket TOTAL 3 s, ring on the longest | AT THE SAME TIME, TOTAL 3 s, LONGEST PATH | custom bars |
| H | Say it in the interview | Three cards light on their words | STEP = SPAN, ONE TRACE ID, BIGGEST FIRST | M.box |
| I | Comment which part is slowest, follow | Comment card with LLM SEARCH TOOL chips, follow pill presses | SLOWEST PART?, COMMENT, + FOLLOW | custom |
