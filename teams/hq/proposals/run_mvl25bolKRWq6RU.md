# Two transient GitHub failures no longer kill a run

**Problem**: systemdesign desk run_mvkzz3rf3JK1Lg0 died on an OIDC 503; studio run_mvl0yc4gaxRwCrY (s005) hung 20 min in "Studio tools" (untimed apt/pip/npm installs).
**Change**: `runner/bridge/bridge.mjs` retries the OIDC token request (5x, on 5xx/429/network); `runner/scripts/studio_tools.sh` gives apt, pip and npm install a time limit and one retry.
**Tested**: `bash -n`, `node --check` only. Not run on a real runner.
**Auditor**: not run (ask for it before merging if you want).
**Needs you**: Approve and merge; no Deploy needed, the runner reads these from main.
**Not proved**: which install hung.
