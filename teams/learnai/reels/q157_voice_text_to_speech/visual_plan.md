# Visual plan: q157 Voice assistant, how text becomes speech

Idea in one line: a voice bot that waits for the whole audio file stays silent; text becomes sound in three stages, and a good bot streams, is tested on its own names and tells users the voice is AI.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | bot 6 s silent; interview question; answer in three parts | From frame 0 a phone-call card with a flat sound line and a counter running 0.0 to 6.0 s in red; the question card TEXT to VOICE? lands; then the card clears and three big rows land: 3 STAGES, FAST START, RIGHT NAMES | 6 s SILENCE, NO SOUND, INTERVIEW QUESTION, YOUR ANSWER | custom cards + count |
| B | 120 words, 48 s, whole file first, 6 s wait | EXAMPLE pill; reply card with text lines; a cyan 48 s speech bar wipes in; a second row where a red wait block draws first and then the green play bar; a big red counter reaches 6.0 s | EXAMPLE, BOT REPLY, SPEECH 48 s, WHOLE FILE FIRST, SILENT WAIT | custom bars + count |
| C | tokens, spectrogram, vocoder, waveform | Input line Hello Asha, order ready; three stacked stage cards: sentence cut into token tiles, a gold heat grid filling column by column (spectrogram), a green waveform wiping in after a VOCODER chip | TOKENS, SPECTROGRAM, WAVEFORM, MODEL, VOCODER | custom DOM/SVG |
| D | stream in chunks, letter reader, 0.8 s against 6 s, 5.2 s saved | Two lanes of the same reply on one scale: whole file with a red 6.0 s block, streamed with a thin 0.8 s block and 12 green chunks landing one by one; a reader sheet whose first line lights up while the next lines are drawn; 5.2 s SAVED chip | STREAM = CHUNKS, WHOLE FILE, STREAMED, 6.0 s, 0.8 s, 5.2 s SAVED | custom bars |
| E | test names, numbers, Hindi-English | EXAMPLE test lines as four cards; clean English gets a green SOUNDS OK tag, the name and the number get red STUMBLES tags | TEST LINES, NAME, NUMBER, CLEAN ENGLISH | custom cards |
| F | consent, AI voice, interview answer | Speaker figure with an arrow into a CLONE box and a green CONSENT stamp; an AI VOICE card; then they clear and a five-row answer card lands: tokens, spectrogram, vocoder, stream, test | VOICE CLONE, CONSENT, AI VOICE, INTERVIEW ANSWER | custom cards |
| G | comment question, follow | Three option cards DELAY, WRONG NAME, ROBOTIC VOICE land on their words, then COMMENT KARO and + FOLLOW pills | BIGGEST PROBLEM? | custom cards |
