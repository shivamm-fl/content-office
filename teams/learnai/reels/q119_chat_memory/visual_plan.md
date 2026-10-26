# Visual plan: q119 Chatbot memory design

Idea in one line: the model forgets every call, so the app builds memory: recent turns resent (short-term) plus a few chosen facts kept outside the chat and put back when relevant, so the request stays small.
The picture that explains it with the sound off: a REQUEST bar that grows with every resent turn (25 to 750 words, true scale) versus a flat 55-word request made of the last 2 turns plus one retrieved fact card from a FACTS shelf.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | Interviewer asks how to design chatbot memory | Hook "Chatbot memory?" over a chat: user says name Asha, bot greets, a TOMORROW divider, user asks dinner, bot answers with a red question mark | MY NAME IS ASHA, NEXT DAY, DINNER?, FORGOT | custom chat |
| B | Answer: choose what to remember, 3 steps | REQUEST box in the middle; RECENT TURNS card feeds it from above, a FACTS shelf (database) feeds it from below with a return arrow; three step pills land on "teen" | CHOOSE, RECENT, FACTS, REQUEST, 1 SHORT, 2 LONG, 3 RETRIEVE | custom + M.box + M.arrow |
| C | Model is stateless, every call starts fresh | Two separate call cards with a dashed wall: call 1 says the name, call 2 asks it back and gets a red "?"; stamp STATELESS; then a gold APP box taking over memory | CALL 1, CALL 2, STATELESS, YOUR APP, MEMORY | custom |
| D | Resend everything: 25 words at turn 1, 750 at turn 30 | Inside a CONTEXT WINDOW outline two true-scale bars: a 25-word sliver and a 750-word full bar, counter runs 25 to 750, outline turns red | EXAMPLE, TURN 1, TURN 30, 25, 750, BILL, WINDOW FULL | custom bars |
| E | Step 1: last 2 turns only | Column of five turn cards; the older three dim and grey, the last two get a gold bracket and flow into a 50-word bar | STEP 1, SHORT-TERM, TURN 28 to 30, LAST 2, 50 WORDS | custom |
| F | Step 2: chosen facts stored outside chat | Database shelf panel; three fact cards land on their words; a THANKS card slides into a red bin; a 5 WORDS tag | STEP 2, LONG-TERM, OUTSIDE CHAT, NAME, VEGETARIAN, HINDI, THANKS, 5 WORDS | custom |
| G | Step 3: retrieve the relevant card; 55 words flat | Dinner question; the VEGETARIAN card turns green and travels into a REQUEST box next to LAST 2 TURNS; then two true-scale bars at turn 30: 750 red vs 55 green | STEP 3, RETRIEVE, DINNER?, REQUEST, 55, 750 | custom |
| H | Boundary: short chat can send all | A small window with 5 turn cards, half empty, green tick; below, a long chat and a TOMORROW pill pointing at the facts shelf | SHORT CHAT, SEND ALL, LONG CHAT, TOMORROW, MEMORY | custom |
| I | Interview line in English | Four rows light one by one | STATELESS, RECENT TURNS, STORE FACTS, RETRIEVE = FLAT | M.box |
| J | Comment name or language, follow | Question tag, two outline pills, comment box whose options pop on words, follow button presses | FIRST FACT?, NAME, LANGUAGE, COMMENT, + FOLLOW | custom |
