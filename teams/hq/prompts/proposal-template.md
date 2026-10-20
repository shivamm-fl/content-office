# Proposal text: `teams/hq/proposals/<your run id>.md`

The first heading is the title the owner sees in the list. Keep the whole file under one phone screen and a half.

```
# <What changes, in plain words (under 70 characters)>

**Why**: the problem in two sentences, with the evidence (run id, file, log line).
**What changes**: 3 to 6 bullets, one line each, files in backticks.
**What the owner must do**: Approve and merge. Then Deploy (only when `apps/`, `packages/` or a `team.json` changed). Anything else (a setting, a secret): say it exactly.
**Risk and rollback**: what could go wrong, how to undo (revert the merge; for the app, deploy the previous commit).
**Tested**: what ran and passed (command names), what could not run and why.
**Auditor**: PASS or CONCERNS and the one-line summary of what it said.
**Not proved**: anything you inferred and did not verify.
```

Rules: no secrets, no pasted conversations, one concern per proposal, say "proposed" never "fixed".
