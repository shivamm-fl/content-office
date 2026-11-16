# Visual plan: q165 Long Video (whole video or sampled frames)

Idea in one line: do not send every frame; find the moment with the transcript, send thin frames, zoom with dense frames only on a short clip, and raise fps only for fast action.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels | Built with |
|---|---|---|---|---|
| A | one hour video, AI forgot the middle scene; answer in three parts | One-hour timeline strip with a gold scene block in the middle; below it a chat card where the AI answer misses that scene (red cross); then the card swaps for three stacked step chips on their spoken words | 1 HOUR VIDEO, AI ANSWER, TRANSCRIPT, SAMPLE FRAMES, ZOOM CLIP | custom HTML |
| B | find one over in a 5-hour cricket recording by commentary | A 5-hour bar cut into segments, a commentary line of text bars under it, a gold segment highlighted and opened below | 5 HR MATCH, COMMENTARY, OVER | custom |
| C | 108,000 frames x 66 tokens = 7,128,000 vs 1,000,000 limit | Chips 1 HOUR and 30 FPS, counters count up to 108,000 frames then 7,128,000 tokens, then true-scale bars: a short gold 1M window against a long red bar that overflows (7x) | 30 FPS, EXAMPLE, 1M WINDOW | custom, count-up |
| D | step 1: read the transcript, it is cheap and tells where the moment is | A transcript card with timestamped lines, one gold line; a thin line from its timestamp to a marker on the hour strip | TRANSCRIPT, CHEAP | custom |
| E | step 2: sample frames, 1 per second default, 1 per 5 s works; 720 frames | Two film strips: dense 1 per second and thin 1 per 5 s where every fifth tile turns gold; then big 720 frames and 47,520 tokens | 1 / SEC, 1 / 5 SEC | custom |
| F | step 3: 30 s clip at 5 fps = 150 frames, total 57,420 = 124x less | Hour strip with a window opening into a dense 30 s strip; then true-scale bars: 7,128,000 red full width against a 57,420 sliver, tag 124x smaller | 30 S CLIP, 5 FPS, 124x LESS | custom |
| G | fast action loses detail at 1 fps | Two panels: ball path with two dots at 1 fps (bat hit missed, red cross) and many dots at higher fps with the hit ringed gold | 1 FPS, MORE FPS, BAT HIT | SVG |
| H | interview answer, comment, follow | Three answer rows land on their words, then a comment card with two options and a follow pill that presses on follow | INTERVIEW ANSWER, SPEECH, ACTION, + FOLLOW | custom |
