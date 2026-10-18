# Visual plan (r104, revised)

Idea in one line:
The model sees only the desk (context window); a new chat is an empty desk; notes written to a notebook outside the desk come back onto it.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with |
|---|---|---|---|---|
| A | Model sees only what is in its window; new chat has nothing; fix: notes outside | Desk fills with paper slips, then a NEW CHAT label arrives, the slips vanish and an EMPTY stamp lands; an arrow then leads to a notebook outside the desk and three numbered pills close the hook | DESK = WINDOW, NEW CHAT, EMPTY, NOTEBOOK, 1 ? 2 ? 3 ? | custom panel/slips + M.box + M.arrow |
| B | Context window definition; example Python, pytest, new session gone | Session 1 panel gets two note rows landing on their words, an arrow down to an empty Session 2 panel with dashed red rows and a GONE stamp | EXAMPLE, SESSION 1, SESSION 2, GONE | custom panels, rows, stamp |
| C | Write notes, look at memory folder, pull notes back | The desk chip moves into the notebook (desk clears), a ring marks the notebook, then the chip returns to the desk | 1 WRITE, 2 LOOK, 3 PULL | panels, chips, arrows |
| D | Memory tool: /memories, model asks, your app runs it | Chain MODEL, YOUR APP, /memories with a command card beside the first arrow and a dashed YOUR SIDE frame | MEMORY TOOL, YOUR SIDE, CLIENT-SIDE, Source: Anthropic docs | M.box, M.arrow, frame |
| E | Value: write preferences, decisions, progress; keep notes organized, not everything | A NOTES.TXT panel where three green check rows land on their words and a fourth dashed red EVERYTHING row is crossed out | PREFERENCES, DECISIONS, PROGRESS, EVERYTHING | custom panel and rows |
| F | Window is desk, memory is notebook; comment and follow | Two boxes pop on their words, then the comment card and a follow pill that presses | DESK = WINDOW, NOTEBOOK = MEMORY, COMMENT KARO, + FOLLOW | M.box, panel, M.pill |

FIX notes: A adds a dashed OLD CHAT card with a red cross that appears on the desk when the old chat is gone, and one "3 STEPS" pill; D shows the Anthropic memory tool label from the start; E gives each note kind its own icon (user, check, clock, cross); F keeps the comment card visible from the first second, aligned with the desk and notebook cards.
