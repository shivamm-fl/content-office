# Visual plan: a008 Raw model vs chat model (sound off: a question box that keeps writing more questions, then the three steps that teach the same model to answer)

Idea in one line: a raw model only continues text, so a question gets more questions; a chat model is the same engine tuned on question-answer examples, human picks and a USER/ASSISTANT template.
The picture that explains it with the sound off: a worksheet that continues itself with more questions; three numbered steps (Q to A example cards, one answer picked by a person, a template with an empty ASSISTANT slot that gets filled); then one engine with two tuned versions.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | Asked a question, AI wrote more questions | A question card with three more question lines appearing under it like a worksheet continuing itself | YOU, AI WROTE | custom cards |
| B | Friend writes next quiz question instead of answering | Your bubble, a ghost answer bubble crossed out, a quiz paper filling with Q2 and Q3, then a RAW MODEL box | YOU, QUIZ PAPER, READ MOST, RAW MODEL | custom bubbles, M.box |
| C | Raw model continues text; learned from internet text; pretraining | RAW MODEL box, a text-so-far strip with a cursor and a NEXT WORD tile, a row of document icons labelled INTERNET TEXT, a PRETRAINING pill | TEXT SO FAR, NEXT WORD, INTERNET TEXT, PRETRAINING | M.box, M.icon, custom strip |
| D | Quiz sheets in training text; the likely next text is more questions | Prompt card, two bars (MORE QUESTIONS long, ANSWER short), then the model output box with two new questions, EXAMPLE pill, NEVER TAUGHT stamp | PROMPT, MORE QUESTIONS, ANSWER, EXAMPLE, NEVER TAUGHT | custom bars, cards |
| E | Step 1 instruction tuning: Q to A examples | Three step circles (1 lit), a base model box, three rows of question tile to answer tile, ring on the pattern | 1 2 3, BASE MODEL, EXAMPLE, Q > A LIKELY | custom rows |
| F | Step 2 human feedback; 1.3B tuned beats 175B raw | One question, three answer cards, a person icon picks one (green check, others dim) and an arrow feeds the model; then to-scale bars: a sliver 1.3B tuned and a full 175B raw bar with PREFERRED tag; PARAMETERS = NUMBERS | PICKED, 1.3B TUNED, 175B RAW, PREFERRED | custom, M.icon |
| G | Step 3 chat template with roles | A panel with SYSTEM, USER, ASSISTANT rows; the ASSISTANT slot is empty then filled with an answer; without the marker a red row continues the user message | ALL TEXT, SYSTEM, USER, ASSISTANT, NO MARKER | custom panel |
| H | Chat model is not a separate machine: same base | One base engine box with two arrows to INSTRUCT and ZEPHYR, TRAINED ON CHATS tag, STILL NEXT WORD and ANSWER LIKELY pills | BASE MODEL, INSTRUCT, ZEPHYR, TRAINED ON CHATS | M.box, M.arrow |
| I | Pick Instruct or chat for Q and A | Two model name cards, base dim, Instruct with a green ring and check, Q&A chat pill | EXAMPLE, Q&A | M.box, M.icon |
| J | Challenge: Good morning to a base model; comment; follow | Base model card with Good morning in and a big question mark out, comment card, pressed +FOLLOW | CHALLENGE, COMMENT, + FOLLOW | custom, M.pill |
