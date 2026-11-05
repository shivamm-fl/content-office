# Visual plan q141

Idea in one line: a coding agent keeps light file paths and fetches just in time (notes up front, glob for paths, grep for lines) instead of stuffing the repo into the context.

| Scene | Spoken (short) | Picture | Labels | Built with |
|---|---|---|---|---|
| A | Claude Code reads a big repo? Not all of it. 3 steps | A repo panel of 35 file tiles under the hook; three tiles turn gold on "wahi files" while PATHS and LIGHT tags land | REPO, EXAMPLE, PATHS, LIGHT, 1 2 3 | custom tile grid |
| B | 5000 files, all pushed in the context window, answer is in 1 | Repo tile grid pours into a window of small tiles; the one needed tile turns gold and is buried; window turns red | REPO, 5000 FILES, CONTEXT WINDOW, auth.py, TOO MUCH | custom grids, M.arrow |
| C | Step 1: a short CLAUDE.md loaded up front | One small note card lands in a big empty window; three toy folder lines; free space shown | CLAUDE.md, SMALL, EVERY TASK, FREE SPACE | custom panel |
| D | Step 2: glob finds paths | A glob search bar over 8 path rows; three auth paths turn gold, rest dim | FILE PATHS, PATHS ONLY, CHEAP | custom rows |
| E | Step 3: grep finds the line | grep bar, auth.py code with line 13 highlighted, then only CLAUDE.md and auth.py sit in a small context | auth.py, 1 MATCH, CONTEXT | custom code card |
| F | Keep CLAUDE.md short | A short green card swells with red lines when the whole repo is written in | SHORT, SAME MISTAKE | custom card tween |
| G | Interview answer | Four stacked boxes light in order on the spoken words | CLAUDE.md, GLOB, GREP, OPEN FILE | M.box, M.arrow |
| H | Comment and follow | Comment card with HAAN / NAHI and the follow pill | COMMENT KARO, + FOLLOW | custom |
