# Investigating a failure (root cause, with evidence)

Goal: say what broke, why, and what change stops it from coming back. Not "it failed", not a guess.

## 1. Pin down the symptom
What did the owner see, on which floor, at what time (their clock is IST, the logs are UTC)? Which reel, run or conversation? Ask only if you cannot find it yourself.

## 2. Collect, in this order (stop when the chain is clear)
1. `ops_overview`: the anomalies it lists, the runs around that time, proposals waiting.
2. `ops_runs <team>` and `ops_thread <team> <thread>` (use `tools=1` when you need the tool calls): what was asked, what the agent answered, when each run started, ended and why (status, error).
3. `ops_log <gh_run> grep=...`: the workflow's own log. Useful lines: `claimed`, `turn finished` (steps and cost, teammates still working), `ending session: <why>`, `resuming the previous session` / `previous session not available`, `##[error]`, the save job's JSON (commit, files, proposal_branch, note).
4. `ops_transcript <team> <run>`: what the session actually read, ran and wrote. Read the last 60 lines first (`tail=60`), then the part that matters.
5. The repo: `git log --format='%h %ad %s' --date=format:'%d %H:%M' -- <path>` and `git blame`; compare each stage of a file (`git show <commit>:<path>`); list `git branch -r` for `proposal/*` branches, which hold files that were NOT saved to main.

## 3. Build the timeline
One line per event with the time, the source (run id / commit / log line) and what it shows. Look for gaps (no turn finished for N minutes), overlaps (two sessions on the same files), and the first moment the state went wrong.

## 4. Root cause
Ask "why" until the answer is something you can change (code, a rule, a prompt, a missing check). Typical families here:
- **Session lifecycle**: a session ended or was cancelled while its files were unsaved; a new session started before the old save finished; a message arrived while the bridge was closing; a hung turn with a teammate still "working".
- **Files that never met**: one session's files are invisible to another until its session closes; the save step sent files to a proposal branch because main moved.
- **Wording drift**: an agent reformatted, added to or replaced the owner's own text; a rework started from an older draft.
- **Cost leaks**: paid voice or renders repeated because a build was cancelled or ran on the wrong text.
- **Reviewer flakes**: a reviewer returned nothing (usage limit, login, crash).
Then ask: where else does the same flaw live (other floors, other paths)? Fix the class, not the instance.

## 5. Write it down
- Add an entry to `state/incidents.md`: date, symptom, timeline in 5 to 10 lines, root cause (proved / inferred), the fix and where it is (proposal branch), status. No secrets, no chat transcripts.
- Open a proposal for the fix (`prompts/proposal-template.md`). Say clearly what is proved and what is not.
