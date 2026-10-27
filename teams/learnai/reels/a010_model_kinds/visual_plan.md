# Visual plan: a010 The kinds of AI model

Idea in one line: a model's kind is decided by what goes IN (gold) and what comes OUT (green); one machine per kind, then an app that joins them.
Picture: every kind is the same machine (IN chip, arrow, MODEL box, arrow, OUT chip); only the chips change, so the viewer sees "kind = in + out".

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | Asked for a photo, got only text; it was a text model; kind = input and output | A chat panel from frame 0: user bubble with a camera icon asks for a photo, a reply bubble of plain text lines comes back; a red PHOTO? cross on the reply; below, a small machine IN, MODEL, OUT lights up | PHOTO?, TEXT ONLY, IN, MODEL, OUT | custom bubbles + M.icon |
| B | Mixer and toaster both use electricity, but a mixer cannot toast bread; 4 kinds | Three drawn appliances (mixer, toaster, pot) on one power line with a bolt; a bread slice goes to the mixer and a red cross lands; then the appliances give way to a 2x2 grid of four kind boxes with their icons | ELECTRICITY, MIXER, TOASTER, TEXT, IMAGE, AUDIO, EMBEDDING | custom SVG + M.box |
| C | Text model: text in, text out | Vertical machine: gold chip with a typed prompt, arrow, cyan TEXT MODEL box, arrow, green chip with a written reply; a dot travels the arrows | IN, TEXT MODEL, OUT | custom + M.box + M.arrow |
| D | Image model: prompt in, picture out | Same machine: the gold chip holds a written prompt, the green output is a drawn picture frame (sun, hills) that fades in | IN, IMAGE MODEL, OUT | custom + M.box |
| E | Audio model runs both ways | Two stacked machines: sound wave bars in, transcript lines out (SPEECH RECOGNITION tag); then written line in, speaker with waves out | SPEECH RECOGNITION, TEXT TO SPEECH, IN, OUT | custom SVG + M.box |
| F | Embedding: text to a list of numbers measuring meaning; refund note vs "paise vaapas" | Machine with the word in and a row of numbers out; then a meaning map: the REFUND note and the PAISE VAAPAS search land close, WEATHER far; a red 0 WORDS SHARED chip, a green CLOSE link | EMBEDDING MODEL, NUMBERS, 0 WORDS SHARED, CLOSE, EXAMPLE | custom + M.map |
| G | text-embedding-3-small gives 1,536 numbers (vendor figure) | A sentence chip goes into a box named after the model; a long number row appears and a big counter runs to 1,536; a VENDOR FIGURE pill | 1 SENTENCE, 1,536, VENDOR FIGURE | custom + count tween |
| H | App: user writes, embedding finds the note, text model answers | A vertical flow: user query, EMBEDDING MODEL, REFUND NOTE card, TEXT MODEL, answer bubble; a dot runs down it | PAISE VAAPAS, EMBEDDING, NOTE, TEXT MODEL, ANSWER | custom + M.box + M.arrow |
| I | Chatbot that gives a photo calls an image model behind it | CHAT APP box on top, an arrow labelled CALLS down to an IMAGE MODEL box, a picture frame comes back up; then CHAT ALONE with a red cross and the picture frame dashed | CHAT APP, CALLS, IMAGE MODEL, CHAT ALONE | custom + M.box |
| J | Kind = what goes in and comes out | Four compact rows (text, image, audio, embedding): gold input icon, arrow, cyan kind box, green output icon; gold chips pulse on "andar", green on "bahar" | TEXT, IMAGE, AUDIO, EMBEDDING | custom + M.icon |
| K | Voice note to text: which model? comment; follow | A mic icon (voice note) into a box with a big ?, a transcript doc out; a comment field; the FOLLOW pill presses | VOICE NOTE, ?, TEXT, COMMENT, + FOLLOW | custom |
