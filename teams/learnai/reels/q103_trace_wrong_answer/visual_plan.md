# Visual plan: q103 trace a wrong answer (FIX round)

Idea in one line:
A traceable AI system records what, when and why; a tool such as Langfuse stores each step as a trace; spans nest by parent ID so the bad step shows red.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | Interviewer asked why a chatbot answered wrong; answer is 3 things | A support chat from frame 0, reply flips from tick to red cross, WHY? chip, then 1? 2? 3? pills | INTERVIEW QUESTION, WHY?, 1 ?, 2 ?, 3 ? | custom chat panel |
| B | Only the final answer is seen; retrieval, prompt, tool hide the cause | Wrong reply card with an eye, arrow down to three dashed hidden cards with red question marks, each turning gold on its word | WHAT YOU SEE, HIDDEN, RETRIEVE, PROMPT, TOOL | custom panels, M.icon |
| C | Solution, traceability: what, when, why | Robot AI SYSTEM box on top, three cards WHAT, WHEN, WHY present from the start whose example lines fill on their words and all turn green with a TRACEABLE stamp | 1 SOLUTION, TRACEABILITY, WHAT, WHEN, WHY, EXAMPLE | M.box, custom cards |
| D | Tool: Langfuse open source records LLM calls, retrieval, tools, timing, inputs, outputs | Langfuse logo, a ONE TRACE panel of three rows (LLM CALL, RETRIEVAL, TOOL) that light on their words and whose timing bars grow, then INPUTS and OUTPUTS chips | 2 TOOL, OPEN SOURCE, LLM CALL, RETRIEVAL, TOOL, INPUTS, OUTPUTS | custom rows, bars |
| E | Trace is the whole path; a span is one unit of work with name, start, end, attributes | A five-stop tracking rail lights down the path, then one wide retrieve bar and a span card whose rows brighten on their words; the bar and attrs go red with WRONG DOC | 3 TRACE & SPAN, OPENTELEMETRY, START, END, WRONG DOC, EXAMPLE | custom rail, card, stamp |
| F | Spans nest by parent span ID, so the hierarchy shows | A full-width REQUEST root bar, four child bars on staggered rows joined by a dashed parent rail, PARENT SPAN ID chip | HIERARCHY, PARENT SPAN ID | custom waterfall |
| G | Look at the whole path; comment; follow | Three icon tiles RETRIEVE, PROMPT, TOOL with question marks, then COMMENT card with pills, then FOLLOW | FULL PATH, COMMENT KARO, FOLLOW | custom DOM |
