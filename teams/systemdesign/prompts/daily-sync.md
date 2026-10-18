# Daily sync (run by the Producer when the owner calls it from the office)

The sync is the team's standup: in a few minutes the owner sees what every desk did, what it does next and what it needs. Keep it short; the owner reads it on the phone.

1. **Read the room (you, the Producer).** This folder's `state/queue.json`, `state/phase5_status.json`, `state/covered.json` (last 10 items), the newest file in `state/sync/` (the last sync), and `state/insights.json` when it exists (only the newest 10 rows). Ask the owner which days were posted since the last sync.
2. **Ask the teammates, in parallel, one short brief each** (they do not see this conversation; give each the facts above that concern them): strategist (the slate and the roadmap), researcher (sources and new tools worth a reel), scriptwriter (scripts waiting or approved), packager (texts missing), growth-analyst (one number that moved and what it means). Ask each for at most three lines: done since the last sync, next, blocked or needs from the owner, plus one line "what I would change in how we work" (the team improves every day; pass the good ones on in the note, and tell the teammates to add craft lessons to `state/team_playbook.md`). Skip a teammate who has nothing to report; say so in one line. The studio desks report through you (what is ready to build).
3. **Write the sync note** to `state/sync/<YYYY-MM-DD>.md`: one block per desk (name, three lines), then "Numbers" (at most three), then "Decisions for you".
4. **Post the note** as your reply, then ask each decision with `mcp__office__ask_owner` (2 to 4 options each, at most three questions). After the answers, say in one line what the team does today and stop.

No new research, no scripts and no plans inside the sync: the sync only reports and asks. Work the owner approves starts in its own conversation.
