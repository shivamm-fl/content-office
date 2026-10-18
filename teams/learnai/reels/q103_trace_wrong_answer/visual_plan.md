# Visual plan: q103 trace a wrong answer

Idea in one line:
A trace is the whole path of one request; each step is a span with a name, start and end, nested under a parent, so the bad step shows red.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | Interviewer asked: chatbot gave a wrong answer, how will you know why? Answer is 3 steps | A support chat on screen from frame 0: user asks about a refund, the bot reply flips from a tick to a red cross; a WHY? chip lands, then 1? 2? 3? pills | WHY?, 1 ?, 2 ?, 3 ? | custom chat panel (recipe 1) |
| B | Mistake: only the final answer is seen; the fault could be retrieval, prompt or tool | The red wrong reply card on top with an eye icon (SEEN), an arrow down to three dashed cards RETRIEVE, PROMPT, TOOL each with a red question mark that you cannot see inside | WHAT YOU SEE, HIDDEN, RETRIEVE, PROMPT, TOOL | custom panels, M.icon |
| C | Step 1, trace: the whole path of one request (OpenTelemetry) | A courier tracking page: a vertical rail with five stops (request, retrieve, prompt, tool, answer) that light one by one down the rail; EXAMPLE pill; source chip | 1 TRACE, EXAMPLE, OPENTELEMETRY, five stop names | custom DOM rail |
| D | Step 2, span: name, start, end, attributes; the retrieve span turns red | One wide bar named retrieve with START and END ticks, below it a span card whose four rows (name, start, end, attrs) fill on their words; the bar, the attrs row go red and a WRONG DOC stamp lands | 2 SPAN, START, END, SPAN, EXAMPLE, WRONG DOC | custom panel, stamp |
| E | Step 3, hierarchy: parent span ID links child to parent | A waterfall: a full-width REQUEST root bar, four child bars (retrieve red, prompt, tool, answer) staggered in time on separate rows, joined to the root by a dashed rail; PARENT ID chip on the rail | 3 HIERARCHY, REQUEST, PARENT ID, retrieve, prompt, tool, answer | custom DOM waterfall |
| F | Look at the whole path; comment which span first; follow | Three big icon tiles (document, chat, gear) labelled RETRIEVE, PROMPT, TOOL with a question mark, then the COMMENT card with the three pills popping on their words, then the FOLLOW pill pressing | FULL PATH, RETRIEVE, PROMPT, TOOL, COMMENT KARO, FOLLOW | custom DOM, M.icon, M.pill |
