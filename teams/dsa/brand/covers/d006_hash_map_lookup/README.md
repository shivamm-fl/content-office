# Cover template (series v1)

The starting point for every reel's cover. `scripts/new_reel.py` copies this folder to `brand/covers/<folder>/`; `scripts/render_cover.py` fills it and renders the image.

- Layout: a filled pill with the category only (DSA), a centred headline whose key words take the accent colour, the DAY NNN / 150 counter (smaller than the headline: the viewer's question comes first, the counter is the label) with a progress bar and the handle. No mascot.
- `python scripts/render_cover.py <folder> "DSA" "How Does <em>Binary Search Work?</em>" --day 47` sets `#pill`, `#headline`, `#daynum`, `#dayof` and `#fill`, snapshots the composition and saves `brand/covers/<folder>.png` (1080x1920). `--of` changes the 150.
- Headline: at most 8 English words, the topic or the question. Pill: the category in English only, no item number (the day is the counter). Clean English only: no Hindi, no emoji.
- Everything that matters is between y 260 and y 1660, because the profile grid shows the centre 3:4 of a reel cover.
- The font file (Space Grotesk) is inside this folder in `fonts/`, because HyperFrames does not follow `../` paths. Colours come from `brand/tokens.css`.
