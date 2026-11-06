# Visual plan q143

Idea in one line: choose a Hub model by filtering (task, licence), reading the model card, and testing the shortlist on your own 20 messages; never by download count.

| Scene | Spoken (short) | Picture | Labels | Built with |
|---|---|---|---|---|
| A | Which model on the Hub? Hub = website of models. Answer: filter, read card, test. 3 steps | A HUB panel with a list of model rows scrolling endlessly from frame 0; four chips (TASK, LICENCE, CARD, TEST) land on their words, then 1 2 3 | HUB, EXAMPLE, TASK, LICENCE, MODEL CARD, TEST, 1 2 3 | custom rows + tween scroll, M.pill |
| B | Project: complaint or not. Most downloads looks easy, but a download count only says how many picked it up; maybe another task | Three message bubbles tagged COMPLAINT / NOT; below a model card with a full download bar that turns grey and gets a red TASK: IMAGE tag and a not-equal stamp | PROJECT, EXAMPLE, COMPLAINT, MOST DOWNLOADS, TASK: IMAGE | custom panel, bar |
| C | Step 1: filters task and licence. Wrong task cannot work, wrong licence cannot ship | One list of six model rows with task and licence tags: the task filter dims four rows, the licence filter reds one row and two stay gold | TASK, LICENCE, text-class, apache-2.0, mit, cc-by-nc-4.0 | custom rows, hl |
| D | Step 2: model card = README. Use, limits, data, evaluation. Pick 2 or 3 that fit the machine | A README card with four boxes (USE, LIMITS, DATA, EVAL) landing on their words, then two shortlisted model chips with FITS MACHINE | README.md, USE, LIMITS, DATA, EVAL, SHORTLIST | M.box, chips |
| E | Step 3: your 20 real messages with known answers on each shortlisted model. Card results are on their data. Most correct wins | A strip of 20 message tiles feeds two model panels; each fills 20 tiles green/red; scores 17/20 vs 13/20; the better one gets a gold WINNER ring | YOUR 20, MODEL A, MODEL B, 17/20, WINNER, THEIR DATA, YOUR DATA | custom tiles |
| F | Licence says only other: open the link and read | YAML card with license: other / name / link lines; arrow from the link line to a document card | license: other, THEIR RULES, READ IT | custom code card |
| G | Interview answer | Five stacked boxes lighting in order: DOWNLOADS (crossed out), FILTER, MODEL CARD, OWN TEST, PICK | boxes | M.box, M.arrow |
| H | Comment and follow | Comment card with CLASSIFICATION / CHATBOT / IMAGE and the follow pill | COMMENT KARO, + FOLLOW | custom |
