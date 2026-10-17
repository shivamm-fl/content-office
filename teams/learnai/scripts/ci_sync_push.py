"""CI: rebase the bot's commit onto origin/main and push it, resolving the one conflict two jobs can create.
The course and evergreen build jobs (and the poster) all edit state/phase5_status.json and state/PROGRESS.md; whoever pushes second used to die with a rebase
conflict AFTER a passed gate (r10 lost this way on 2026-10-09). Resolution: PROGRESS.md is an append-only log (keep upstream + our added lines); phase5_status.json
is merged per top-level key (upstream wins except for the keys our commit changed). Any other conflicting file = real conflict, exit 1.
Usage: python3 scripts/ci_sync_push.py"""
import difflib, json, subprocess, sys

def sh(*a, check=True, env=None):
    r = subprocess.run(a, capture_output=True, text=True, env=env)
    if check and r.returncode: raise SystemExit(f"{' '.join(a)} failed: {r.stderr.strip()[:300]}")
    return r

def show(stage, f): return sh("git", "show", f":{stage}:{f}", check=False).stdout

def resolve():
    files = sh("git", "diff", "--name-only", "--diff-filter=U").stdout.split()
    for f in files:
        base, up, mine = show(1, f), show(2, f), show(3, f)   # during a rebase stage 2 = upstream, stage 3 = our commit
        if f in ("state/PROGRESS.md", "state/growth_notes.md", "state/learnings.md"):
            b, m = base.splitlines(), mine.splitlines(); add = []
            for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, b, m).get_opcodes():
                if tag in ("insert", "replace"): add += m[j1:j2]
            out = up.rstrip("\n") + "\n" + "\n".join(add) + "\n"
        elif f in ("state/covered.json", "state/queue.json"):   # {"items": [...]} merged per id: ours wins for the ids we added, changed or removed
            u, m, b = json.loads(up), json.loads(mine), json.loads(base or '{"items": []}')
            bi, mi = {i.get("id"): i for i in b.get("items", [])}, {i.get("id"): i for i in m.get("items", [])}
            ui = {i.get("id"): i for i in u.get("items", [])}
            for k, v in mi.items():
                if bi.get(k) != v: ui[k] = v
            for k in set(bi) - set(mi): ui.pop(k, None)
            u["items"] = list(ui.values()); out = json.dumps(u, ensure_ascii=False, indent=2)
        elif f == "state/phase5_status.json":
            u, m, b = json.loads(up), json.loads(mine), json.loads(base or "{}")
            for k, v in m.items():
                if b.get(k) != v: u[k] = v
            out = json.dumps(u, ensure_ascii=False, indent=2)
        else: raise SystemExit(f"cannot auto-resolve a conflict in {f}")
        open(f, "w", encoding="utf-8").write(out); sh("git", "add", f)
    import os
    sh("git", "rebase", "--continue", env=dict(os.environ, GIT_EDITOR="true"))

for attempt in range(3):
    sh("git", "fetch", "-q", "origin", "main")
    if sh("git", "rebase", "--autostash", "-q", "origin/main", check=False).returncode: resolve()
    if sh("git", "push", "-q", "origin", "HEAD:main", check=False).returncode == 0: print("pushed"); sys.exit(0)   # a racing push makes this fail: refetch and retry
    print("push rejected, retry", attempt + 1)
sys.exit("could not push after 3 tries")
