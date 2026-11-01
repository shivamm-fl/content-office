# Cover template (interview series v1)

The cover of every interview reel (q105 and up), owner decision 2026-10-20: the same look as a series day, because the interview reels are a series too, but the series has no end, so there is a **count and nothing else** (no total, no progress bar). No mascot.

- Layout: a filled gold pill with the category (AI ENGINEER INTERVIEW), a centred headline whose key words are gold, the label QUESTION with the question number in large gold digits, the handle.
- `python scripts/render_cover.py q105_slug "AI ENGINEER INTERVIEW" "Temperature, Top-K, Top-P: <em>what is the difference?</em>"` takes the number from the folder name: the series is counted from its first reel under the ladder, so q105 is question 001, q106 is 002 (the id minus 104; owner 2026-10-20). q101 to q104 are older and keep the old cover. A variant of a reel (`q107_slug_b`, a trial test of question 001) shows the number of the question it repeats: add `--count 1`.
- Headline: at most 8 English words, the question or the topic. Clean English only: no Hindi, no emoji.
- Everything that matters is between y 260 and y 1660, because the profile grid shows the centre 3:4 of a reel cover.
- The font file (Space Grotesk) is inside this folder in `fonts/`, because HyperFrames does not follow `../` paths. Colours come from `brand/tokens.css`.
