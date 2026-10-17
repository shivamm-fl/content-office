# Visual plan: e101 prompt caching (rules: docs-notes/diagram-first-visuals.md)

Idea in one line: Prompt caching reuses the already-processed prompt, so the answer stays identical; it only changes cost, and Claude Code (terminal) compacts a very long idle chat before the 1-hour cache expires.
Picture with sound off: two identical answer bubbles joined by "=", a prompt block stamped PROCESSED kept in a box with a clock, price bars, and a long chat shrinking to a short card before the clock runs out.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with |
|---|---|---|---|---|
| A | caching se jawab badalta hai? nahi | Frame 0: two identical answer bubbles ("Paris is the capital.") side by side, an equals sign between them; a "?" over the sign flips to a green check on "nahi"; EXAMPLE pill | NO CACHE, WITH CACHE, SAME | custom panels (recipe 1 style) |
| B | docs: no effect on output; reuses processed prompt | A long prompt block (lines of text) passes through a PROCESSING gear box once, gets a PROCESSED stamp and moves into a CACHE box; a second request reuses it (arrow from the box) while the output bubble stays identical | PROMPT, PROCESSED, CACHE, SAME OUTPUT | custom boxes + arrows |
| C | price: read 0.1x, 5-min write 1.25x | True-scale bars: base input 1.0, 5-min write 1.25 (taller), cache read 0.1 (a sliver); numbers count on spoken words; small note "most models" | BASE 1x, WRITE 1.25x, READ 0.1x | M.bars-like plain bars, custom |
| D | terminal, 200K chat, 54 min idle, compact before 1h cache expires | A clock ring (1 hour) with a hand moving to ~54 min; a tall 200K token stack shrinks into a short card at 54 min before the cache box closes at 60; label TERMINAL; EXAMPLE number pill | 200K TOKENS, 54 MIN, COMPACT, 1 HOUR | M.stack + custom clock |
| E | cost changes, not the answer | Callback: the two equal bubbles at top, a price tag changing underneath; calm gold ring on the bubbles | SAME ANSWER, LOWER COST | custom |
| F | comment: 5 min or 1 hour? follow | COMMENT card with two options 5 MIN / 1 HOUR popping on their words, then handle and + FOLLOW pill pressing on "follow" | COMMENT KARO, 5 MIN, 1 HOUR | recipe 11 |
