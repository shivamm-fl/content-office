# Visual plan: a010 The kinds of AI model (rebuild, no analogy)

Idea in one line: a model's kind is what goes IN (gold) and what comes OUT (green); one machine skeleton per kind, then an app that joins them.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | Asked for a photo, got only text; kind = in and out | Chat panel from frame 0: photo request, a reply of text lines with a red cross; a small IN, MODEL, OUT row lights up | TEXT ONLY, TEXT MODEL, IN, MODEL, OUT | custom bubbles + M.icon |
| B | Text model: text in, text out | Vertical machine: prompt chip, TEXT MODEL box, reply chip; a dot travels the arrows | IN, TEXT MODEL, OUT | custom + M.box + M.arrow |
| C | Image model: prompt in, picture out | Same machine; the output chip holds a drawn picture frame | IN, IMAGE MODEL, OUT | custom + M.box |
| D | Audio model both ways | Two rows: sound bars into AUDIO MODEL into transcript lines; then text lines into AUDIO MODEL into a speaker | SPEECH TO TEXT, TEXT TO SPEECH | custom SVG + M.box |
| E | Embedding: text to numbers measuring meaning; paise vaapas finds the refund note | Same machine with a number row out; then a meaning map: PAISE VAAPAS and REFUND NOTE close, WEATHER far, a red 0 WORDS SHARED, a green CLOSE link | EMBEDDING MODEL, MEANING, EXAMPLE, 0 WORDS SHARED, CLOSE | custom + M.map |
| F | App joins models; photo request calls the image model | APP box over three model boxes joined by lines; a photo request bubble; the text and embedding boxes dim, a CALLS arrow runs to IMAGE and a picture comes out | APP, TEXT, EMBEDDING, IMAGE, CALLS | custom + M.box + M.arrow |
| G | In and out is the kind; voice note question; comment, follow | IN, OUT and = KIND pills; mic chip into a big ? box into a TEXT chip; comment field; FOLLOW pill presses | IN, OUT, = KIND, VOICE NOTE, ?, TEXT, COMMENT, + FOLLOW | custom |
