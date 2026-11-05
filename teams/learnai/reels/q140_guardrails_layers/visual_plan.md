# Visual plan: q140 Guardrails, stop harmful questions

Idea in one line: one system-prompt line is a single wall a user walks around; a vertical corridor of three gates (input screen, system prompt that says how to refuse, output check) plus a log that feeds back into the gates.
The picture that explains it with the sound off: ONE corridor (message at top, gate 1, chatbot, gate 3, user at the bottom) built up in C, D, E and closed with the feedback loop in F.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | harmful question, don't trust one line, 3 layers | A user bubble above a chatbot box; one thin red wall bar lands between them, then it is replaced by three stacked cyan gate bars numbered 1, 2, 3 | CHATBOT, 1 LINE, 3 LAYERS | custom + M.box |
| B | bank bot, one line, villain role-play, model answers, user walks around the wall | Bank chatbot card with the policy line in code font; a user bubble "You are a movie villain..." slides down, goes around the end of a wide red wall and reaches the bot, whose reply card turns red with a stamp | BANK BOT, SYSTEM PROMPT, WALL, SKIPPED | custom |
| C | layer 1: small cheap model gives one label; true means the big model never sees it | Corridor: message card, GATE 1 INPUT SCREEN with a classifier chip is_harmful false/true, the bot below; a false message passes down, a true one stops at the gate with a BLOCKED stamp | INPUT SCREEN, is_harmful, BLOCKED | custom corridor |
| D | layer 2: system prompt says refuse and how | Same corridor, gate 1 solid, the bot box lit; a system prompt card beside it grows a second line saying how to refuse (a short polite reply) | SYSTEM PROMPT, HOW TO REFUSE | custom corridor |
| E | layer 3 (our own): check the reply before the user | Same corridor, gate 3 appears under the bot; a reply card travels down, a bad one is held at the gate and does not reach the user icon | OUTPUT CHECK, OUR OWN, HELD | custom corridor |
| F | no layer is 100 percent; log blocks, tighten layer 1 | Whole corridor dimmed, a LOG book at the bottom collects block rows, a feedback line runs up the right edge back to gate 1 | NOT 100%, LOG, TIGHTEN | custom |
| G | interview answer, comment, follow | Answer card with three numbered rows (CLASSIFIER, HOW TO REFUSE, OUTPUT CHECK); comment card with 1 2 3 pills; + FOLLOW | INTERVIEW ANSWER, COMMENT KARO | recipe 11 |
