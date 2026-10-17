# Visual plan: r102 context compaction (rules: docs-notes/diagram-first-visuals.md)

Idea in one line: Compaction summarises a chat that is nearing the window limit and starts a new window with only the summary; pruning drops redundant tool outputs; aggressive compaction can lose details.
Picture with sound off: a window fills to a LIMIT line, its rows fold into one gold summary card, and the card moves into a fresh empty window.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with |
|---|---|---|---|---|
| A | compaction kya hota hai; limit ke paas summary, nayi window | Frame 0: an empty WINDOW panel; chat rows stack until a red dashed LIMIT line, rows fold into one gold SUMMARY card, a second NEW WINDOW appears and the card slides into it | WINDOW, LIMIT, SUMMARY, NEW WINDOW | custom panels, rows, tweens |
| B | 3 steps; 30 messages; summarize: decisions, open bugs | Three step tabs on top (SUMMARIZE lights); a grid of 30 message squares shrinks and an arrow leads to a summary card holding DECISIONS and OPEN BUGS chips; EXAMPLE pill | 1 SUMMARIZE, 30 MESSAGES, DECISIONS, OPEN BUGS, EXAMPLE | custom grid, card, arrow |
| C | restart: new window gets only the summary | Old full window panel crossed out at top, arrow down to a mostly empty NEW WINDOW where only the gold summary card lands; free space visible | 2 RESTART, OLD, NEW WINDOW, SUMMARY | custom panels |
| D | prune: redundant tool outputs, recall drops as tokens grow | Window of chat rows and grey TOOL OUTPUT rows; tool rows marked REDUNDANT then removed and chat rows close the gap; beside it a line chart of recall falling as tokens rise (illustration) | 3 PRUNE, TOOL OUTPUT, REDUNDANT, TOKENS, RECALL | custom rows + M.plot |
| E | too aggressive compaction can lose context | A summary card with three rows; the subtle third row (retry limit) turns red, is struck through and stamped LOST; warning icon on top; EXAMPLE pill | SUMMARY, TOO TIGHT, LOST, EXAMPLE | custom card, M.icon, stamp |
| F | memory kept, not every detail; comment, follow | Two cards: MEMORY with green check, EVERY DETAIL with red cross; comment box with MESSAGES = ? pill; handle and + FOLLOW pill pressing on "follow" | MEMORY, EVERY DETAIL, COMMENT KARO, + FOLLOW | recipe 11 style |
