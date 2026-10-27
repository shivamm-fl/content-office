# Visual plan: q122 tool schema (how the model picks a tool)

Idea in one line: the model picks a tool only from the text you wrote (name, description, parameters), so write that text to be clear and distinct.
The picture that explains it with the sound off: a refund question lands on the wrong tool card, then the cards are rewritten with a name, a DOES / USE WHEN / NOT FOR description and an enum, and the pick becomes right.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | refund asked, product search ran; the fault is your text | Chat bubble about a refund, an arrow down to a product_search card that turns red with a WRONG TOOL stamp, then a gold YOUR TEXT card | Refund kab milega?, product_search, WRONG TOOL, YOUR TEXT | chat + lcard + stamp |
| B | interviewer's question; schema = name, description, parameters | MODEL box reads down into a TOOL SCHEMA card; its three rows NAME, DESCRIPTION, PARAMETERS light gold one by one | MODEL, TOOL SCHEMA, NAME, DESCRIPTION, PARAMETERS, READS | custom cards + M.arrow |
| C | the model picks only from what you wrote; three things | Flow diagram: gold TEXT YOU WROTE card, an arrow into the MODEL box, an arrow to a green TOOL PICKED card with a check icon; three numbered pills drop in below | TEXT YOU WROTE, MODEL, TOOL PICKED, three numbered pills | cards + arrows |
| D | search and lookup both "gets data"; a coin-flip choice | Two identical cards; a user bubble on top; a gold pointer wavers between the cards, a coin appears, pointer lands on the wrong one with a stamp | EXAMPLE, search · gets data, lookup · gets data, WRONG PICK | lcard + moving pointer + M.icon |
| E | name, description: does, use when, not for; 3 to 4 sentences | Green name card orders_get_status; a card with three coloured rows (DOES, USE WHEN, NOT FOR) that appear on the words; a manual icon and a 3-4 SENTENCES chip | orders_get_status, DOES, USE WHEN, NOT FOR, THE MANUAL, 3-4 SENTENCES | custom |
| F | parameters: user vs user_id, enum of allowed values | Red "user" card with NAME? ID? fades while green user_id replaces it; an ENUM panel with three green chips, a dashed "lost?" chip bounces off with REJECTED | user, user_id, status · ENUM, shipped, refunded, pending, REJECTED | custom chips |
| G | fewer tools: more tools, more similar names | Twenty small tiles fill in, SIMILAR NAMES in red, an UNDER 20 stamp, then most tiles fade to a short list; a small source label | SIMILAR NAMES, UNDER 20, SOURCE: OPENAI DOCS | custom tiles |
| H | boundary: test on real questions | Three result rows: question then the tool picked with a tick; the third row is a red cross and a FIX THE TEXT stamp | EXAMPLE, refund A17?, red shoes?, FIX THE TEXT | glass rows + stamp |
| I | say this in the interview | Five stacked rows light up on their words | MODEL READS TEXT, DISTINCT NAMES, WHEN / WHEN NOT, ENUMS FOR FIXED, FEW TOOLS | M.box |
| J | how many tools: 5, 10 or 20; follow | Pills 5 10 20, a COMMENT card with the numbers, FOLLOW button presses | HOW MANY TOOLS?, COMMENT, FOLLOW | custom |
