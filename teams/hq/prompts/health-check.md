# Health check ("check the company")

Run when the owner asks. It never runs on its own and changes nothing: it reports.

1. `ops_overview`. For every floor read: the anomalies (stalled, failed, save pending too long, old questions, long runs), the last runs (status, error, cost), pending questions for the owner, usage limit state.
2. **Proposals**: how many are waiting, how old, whether main moved under them (`ops_proposals`). A proposal older than two days is either stale (reject it) or forgotten (remind the owner).
3. **Files that did not reach main**: `git branch -r` for `proposal/*` with content paths (`reels/`, `state/scripts`, `social/`). Those are results that were kept off main; tell the owner which.
4. **Sample one or two failures** of the last day (`ops_log` with `grep` for `##\[error\]|ending session|Waiting`) and say the cause in one line each.
5. **Cost**: runs whose session cost was high for the result, a studio build that was cancelled and rebuilt, the same paid voice made twice.
6. **Stuck work**: a reel whose last run failed twice, a work day that never finished, a build thread with no final card.

Report: a short list, worst first, each with the evidence (run id) and a recommendation (fix now / watch / ignore). End with the one thing the owner should do first. If something needs a code or rule change, open a proposal for it. Do not "fix" things that are the owner's decisions.
