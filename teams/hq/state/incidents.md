# Incidents

One dated entry per incident: what happened, root cause (proved or inferred), the fix, status. No secrets, no conversations. Newest first.

## 2026-10-23: systemdesign runs failed (producer desk run_mvkzz3rf3JK1Lg0, studio s005 run_mvl0yc4gaxRwCrY)

**Symptom**: the work day's desk run ended "failure" after 2 minutes; the s005 studio run was marked "runner did not start" after 30 minutes.

**Root causes (proved from the GitHub logs)**: (1) desk: `bridge failed: OIDC token request failed: 503`, GitHub's token service had a transient error and the bridge did not retry. (2) studio: `The action 'Studio tools' has timed out after 20 minutes`; `runner/scripts/studio_tools.sh` had no time limit on apt, pip and `npm install -g`, so the job never reached the bridge and the office declared the run dead. **Inferred, not proved**: which of the three installs hung (the log has no timestamps per step).

**Fix**: proposal: OIDC request retried up to 5 times on 5xx/429/network; each install in studio_tools.sh limited and retried once. The queued re-run of s005 (run_mvl222nuxGhJwmo) is separate and was not touched.

**Status**: proposed, not merged.

## 2026-10-20: a003, q108, q109 built wrong (LearnAI work day)

**Symptom**: the work day's three reels were built from texts the owner had not approved, built twice or three times (paid voice and renders wasted), and a003's rework came back on the scriptwriter's old script.

**Timeline (UTC)**: the Producer session started 13:29; no turn finished after 13:35 while one teammate stayed "working" and three owner messages stayed unanswered; the owner ended it at about 13:52 and a new session started at once, 2 minutes before the old session's files were saved (13:54), so it found no scripts and asked the owner to paste them again. It then reformatted the owner's text with additions ("Platform" for "System", a source line in q108) and sent all three to the studio. The owner cancelled those builds at 14:22. A task card sent a desk session (without studio tools) to "correct" the scripts from files that existed only in the Producer's session; it wrote stale reel drafts, and its save landed on main two seconds after the Producer's correct scripts. The studio's second a003 build then found its own reel files "changed on main" and `save_work.py` sent them to `proposal/run_mvgs5mbaW46OzSM`, where nobody looked. The owner's request for two scene changes ran a rework that started from main's stale reel files and the scriptwriter's draft.

**Root causes (proved from logs and git)**:
1. A new session can start before the previous session's save has finished; sessions then see different repositories.
2. A desk session could write a reel's files, and the save step moved the studio's real files to a proposal branch instead of main when they conflicted, without telling anyone.
3. The owner's edited text at an approval lived only in that session; the next session's briefing kept the label "Approved with my edits" and dropped the text.
4. Hand-over by file path between sessions (a task card that said "use the files, they are correct") cannot work; only text travels.
5. Nothing locked the owner's own script: a Producer reformatted it with additions and the REVISE rule told the studio to have the scriptwriter rewrite it.
6. The independent reviewers sometimes return no JSON; the log did not say why and there was one retry.
**Not proved**: why the first Producer session stopped finishing turns (its transcript was never saved because the run was cancelled).

**Fixes** (proposal branches / commits): the office waits for the previous session's save (up to 6 minutes) before a new session in the same conversation starts; edited approvals are in the briefing and saved at once to `state/approved_scripts/`; `save_work.py` merges line by line, keeps desk sessions out of reel files, lets the studio's files win, and reports every file kept off main to the owner; a stalled desk is detected (notice at 6 minutes, restart at 15); the gate fails a reel whose narration differs from a locked script (`script_locked` in the queue); the REVISE rule patches a locked script instead of rewriting it; reviewers retry three times and log why they failed.

**Status**: the fixes were written and shipped by the owner's coding assistant on 2026-10-23 (not by HQ: HQ did not exist yet), with tests: `runner/scripts/test_save_scopes.py`, `test_script_lock.py`, `apps/api/src/{save_gate,stall,history,health}.test.mjs`. q108 and q109 were put back on the owner's own scripts and locked. a003 was left as it is on the owner's order: its files on main are a mix (the owner's narration inside `script.txt` of the 2nd build was replaced by the rework's scriptwriter version; the studio's good 2nd-build files wait on `proposal/run_mvgs5mbaW46OzSM`). Eleven old `proposal/*` branches are still open; most are stale and should be rejected in the Proposals tab, except the two above that hold the owner's script work (the owner decides).
