# LearnAI: reel playbook v4 and tools (only the ai.learnvora floor)

This proposal saves what made the five reels you approved on 7 Nov 2026 (t01 distillation, t06 weight-space programming, q144 input vs output, q145 reasoning bill, a018 temperature), so the learnai agents build the next reels the same way. No other floor changes.

**What changes for the learnai agents**
- `teams/learnai/docs-notes/reel-playbook-v4.md` is the new style guide:
  - reels run 45 to 70 s and follow one of the five retention templates;
  - the hook is the punch line itself;
  - examples are current and interview questions are real;
  - the visuals change every 1.5 to 3 s and use real screenshots of the source;
  - covers and captions follow the reel type;
  - finished reels are delivered to Saved reels.
- `prompts/build-reel.md` now tells the builder to read the playbook first; where it conflicts with the older notes, the playbook wins.

**New tools (inside `teams/learnai`)**
- `reels/_kit/fx.css` and `fx.js`: helpers for hand-built visuals. `new_reel.py` now copies them into every new reel.
- `scripts/wrap_reel.py` turns your scenes and timeline into the reel page.
- `scripts/snap_sheet.py` makes a stills sheet to check before rendering.
- `scripts/save_library_items.py` saves finished reels to the Office's Saved reels with hash checks. It never posts.

**Repo level (one file)**
- `.github/workflows/render-branch.yml` renders the reels listed in `render.json` on GitHub runners. It runs only when a `render/...` branch is pushed and never touches the office runs.

**Reference builds**
The five approved reels, without audio, with their covers and captions. These reels are already in Saved reels; merging this does not post or re-deliver anything.

Note: `state/queue.json` still lists a018 as planned. Do not start a018 from the office, or it will build a second version.
