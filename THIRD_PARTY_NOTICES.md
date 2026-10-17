# Third-party notices

## Instagram and YouTube agent skills (MIT)
The `ig-*` and `yt-*` skills in `teams/*/.claude/skills/` come from:
- https://github.com/Jakeschincariol/instagram-agent-skill (pinned commit d03c56b, 2026-09-13)
- https://github.com/Jakeschincariol/youtube-agent-skill (pinned commit a2feb21, 2026-09-16)

Copyright (c) 2026 Jake Schincariol, MIT License. The full license texts are in
`teams/learnai/.claude/skills/LICENSE-instagram-agent-skill` and `LICENSE-youtube-agent-skill`.
Local change: the skills' state folder (`~/.claude/instagram/`, `~/.claude/youtube/`) was replaced
by `social/ig/` and `social/yt/` inside the team folder.

## Fonts (SIL Open Font License 1.1)
`teams/*/brand/fonts/`: JetBrains Mono (JetBrains), Noto Sans Devanagari (Google), Space Grotesk (Florian Karsten).
The fonts are redistributed unmodified under the SIL Open Font License 1.1 (https://openfontlicense.org).

## HyperFrames skills
Installed at build time with `npx skills add heygen-com/hyperframes` (see `teams/*/skills-lock.json`); not stored in this repo.
