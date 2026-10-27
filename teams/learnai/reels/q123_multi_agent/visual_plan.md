# Visual plan: q123 multi-agent or one agent

Idea in one line: start with one agent; add agents only when the work splits in parallel or exceeds one context window, because every agent costs tokens and they cannot see each other.
The picture that explains it with the sound off: one agent versus three agents, token bars to true scale 1x/4x/15x, and a picture whose two halves do not match.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | Interviewer asks: many agents or one? | Hook "1 or many?" over a fork: one agent box, then a row of three agent boxes | 1 AGENT, 3 AGENTS | M.hook, agent boxes (M.box) |
| B | Start with one, add many only when work splits in parallel | One task block: "START HERE" one agent (green check); then the task splits into three chips that go to three agents side by side | START HERE, SPLITS, PARALLEL | M.box, M.arrow, lcard, pillC |
| C | Toy token example 2000 / 8000 / 30000 | Three bars to true scale (1x, 4x, 15x) with the number on each bar; EXAMPLE pill; "ANTHROPIC DATA" tag; red "NOT FOR SHOW" stamp | CHAT 1x, AGENT 4x, MULTI 15x | custom bars (el, tl.fromTo) |
| D | Does the work split? 3 folders, 3 agents in parallel | Three folders, three agents, three summaries in columns; three equal time bars under them, the longest highlighted | FOLDER, AGENT, TIME = LONGEST | M.box, M.arrow, lcard, custom bars |
| E | Does it fit one context window? | One window frame with a bigger task block overflowing it in red; then three windows each holding one chunk, green | ONE WINDOW, DOES NOT FIT, 3 WINDOWS | custom windows (el), M.box |
| F | Boundary: shared context or dependent steps -> one agent | Pill ONE AGENT; two agents with a red cross between them; a picture frame whose two halves have the horizon at different heights | CAN'T SEE, NO MATCH | M.box, M.icon, custom SVG frame |
| G | The interview line | Five stacked cards on the spoken words | START: 1 AGENT, SPLITS, FITS?, COSTS, CAN'T SEE | M.box |
| H | Comment 1 or many, follow | COMMENT card with options 1 / MANY, FOLLOW pill | 1, MANY | M.pill, glass, follow button |
