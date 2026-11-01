# Cover template (v2)

The starting point for every reel's cover. `scripts/new_reel.py` copies this folder to `brand/covers/<folder>/`; `scripts/render_cover.py` fills it and renders the image.

- Layout: a filled gold pill with the category only (no item number, owner decision 2026-10-16), a centred headline whose key words are gold, the LearnAI robot Bit (inline SVG, transparent) with a soft glow, the handle.
- `python scripts/render_cover.py <folder> "AI ENGINEER ROADMAP" "How Does an LLM <em>Write Answers?</em>"` sets `#pill` and `#headline`, snapshots the composition and saves `brand/covers/<folder>.png` (1080x1920). Wrap the one to three key words of the headline in `<em></em>`; without it the last words are gold.
- Headline: at most 8 English words, the topic or the question. Pill: the category in English only, no item number. Clean English only: no Hindi, no emoji, no other decoration. The robot is the only illustration.
- YouTube thumbnail: a 16:9 composition (1280x720) with at most three English words, saved as `brand/yt_thumbs/<folder>.jpg`.
- The font file (Space Grotesk) is inside this folder in `fonts/`, because HyperFrames does not follow `../` paths. Colours come from `brand/tokens.css`.
