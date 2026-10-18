# Visual plan: r103 RAG kya hai

Idea in one line: RAG fetches the few right pages from your documents and puts them into the prompt, so the model answers from them.
The picture that explains it with the sound off: a shelf of handbook pages, three pages light up and slide into the prompt box next to the question, the model then answers from those pages.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | RAG kya hai? Right pages nikalta hai, 3 steps | A shelf of 18 page cards appears under the hook; three pages turn gold and drop toward a robot box, then 1 2 3 pills | HANDBOOK PAGES, AI, 1 2 3 | custom panel + page grid, M.box, M.pill |
| B | 200-page handbook, refund question, model never saw it, guesses | A handbook with a 200 PAGES tag on top, a chat below with the question bubble and a red dashed guess bubble, a NOT SEEN stamp | 200 PAGES, EXAMPLE, GUESS, NOT SEEN | custom doc + chat bubbles + stamp |
| C | RAG: pull info from knowledge base, add to prompt | A database box sends three gold cards down; they land inside a prompt panel beside the question row | KNOWLEDGE BASE, PROMPT, QUESTION | M.box, M.arrow, panel, tween cards |
| D | 1 chunking and embeddings | Four chunk cards on the left each pair with a row of numbers (vector) on the right, drawn row by row | 1 CHUNKS, VECTOR, EXAMPLE | custom rows, M.pill |
| E | 2 retrieval, similar chunks, top-3 | A meaning map: question star in the middle, three chunks close and linked in gold, others far and dim, ring and TOP-3 pill | QUESTION, TOP-3, EXAMPLE | M.map, link, ring |
| F | 3 generation, 3 chunks into prompt, answer from pages | Prompt panel with question plus three page rows, arrow down to the model robot, arrow down to a green answer card stamped FROM THESE PAGES | PROMPT, MODEL, ANSWER | panel, M.box, M.arrow, stamp |
| G | wrong chunks, wrong answer; retrieve, add, generate | Top: three red wrong pages feed an answer card that flips to a red cross. Bottom: three boxes RETRIEVE, ADD, GENERATE light on their words | WRONG PAGES, RETRIEVE, ADD, GENERATE | custom + M.box |
| H | comment where you saw RAG, follow | Comment card with three option pills (CHATBOT, PDF, SEARCH) popping on their words, handle and FOLLOW pill pressing | COMMENT KARO, CHATBOT, PDF, SEARCH | recipe 11 |
