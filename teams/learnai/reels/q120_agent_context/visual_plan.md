# Visual plan: q120 Why each agent gets its own context

Idea in one line: each subagent reads in its own window and sends back a short note, so the lead's window stays small and the agents can run in parallel; the price is more tokens and agents that cannot see each other's decisions.
The picture that explains it with the sound off: one shared window stuffed with pages that buries the question (12000 words) versus three own windows whose short notes reach a small LEAD window (600), drawn to true scale.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | Agent read so much it forgot the question | Hook text over a window: a gold SAWAL card sits in the middle, twelve page cards land on top and bury it, border turns red | SAWAL ? | custom pages |
| B | Interviewer: why separate context per agent | Question card, three separate agent windows with their own pages and dashed walls between them | INTERVIEW QUESTION, WHY SEPARATE ?, AGENT 1-3, OWN CONTEXT | glass + pages |
| C | Answer: own window, small note to the lead | Small gold LEAD window on top, three agent windows below, three NOTE cards fly up into the lead; three step chips | LEAD, AGENT 1-3, NOTE, 1 OWN, 2 NOTE, 3 PARALLEL | custom |
| D | Everyone in one context: 12000 words, question lost | One window fills with 15 page cards (one gold "?"), counter runs to 12000, border turns red, the ? card shrinks and dims | EXAMPLE, ONE CONTEXT, 12000, WORDS, QUESTION LOST | custom + counter |
| E | Step 1: own window each, 3000 / 4000 / 5000 | Three stacked windows with true-scale bars (3:4:5) and numbers; borders turn green with a check | PRICING, REVIEWS, RIVALS, 3000, 4000, 5000, FOCUS | custom bars |
| F | Step 2: 200-word notes, lead sees 600 not 12000 | Three small agent windows, notes fly into LEAD window (600); below a full red 12000 bar struck out and a true-scale 44 px green sliver for 600 | AGENT 1-3, 200, LEAD, 600, BEFORE, NOW, 12000 | custom |
| G | Step 3: all three at once, wait = longest | Three rows whose bars grow together; a dashed line at the longest end | AGENT 1-3, WAIT = LONGEST | custom bars |
| H | Boundary: 15x tokens, agents cannot see each other | Bars CHAT 1x vs MULTI-AGENT 15x (true scale) with a coin; then two agent panels drawing a square and a circle, dashed wall, merged panel with a mismatch stamp, then ONE AGENT | CHAT, MULTI-AGENT, 15x, TOKENS = BILL, Anthropic data, CAN'T SEE EACH OTHER, MISMATCH, ONE AGENT | custom |
| I | Interview line in English | One picture: LEAD window, three agent windows with own pages, notes fly up (LEAD turns green, CLEAN), three parallel bars, coin and MORE TOKENS, red dashed walls CAN'T SEE EACH OTHER | LEAD, AGENT 1-3, NOTE, CLEAN, MORE TOKENS, CAN'T SEE EACH OTHER | custom |
| J | Comment one or many, follow | HOW MANY AGENTS? over a ONE window (one page) and a MANY window (three pages), comment box, follow button presses | HOW MANY AGENTS?, ONE, MANY, COMMENT, + FOLLOW | custom |
