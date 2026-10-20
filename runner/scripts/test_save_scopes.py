"""Self-test of the save rules added after the 2026-10-20 incident (temporary origin, no network):  python3 runner/scripts/test_save_scopes.py

- a desk session may not write a reel's files; the studio's save wins over main for a reel's own files
- a file changed on both sides is merged line by line; only the same lines on both sides keep it off main, and the result says so (`diverted`)
- a company floor (HQ) puts everything on a proposal branch, except its own state notes; workflows and secrets are dropped"""
import contextlib
import io
import json
import os
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import save_work as SW

failures = []


def check(name, cond, detail=""):
    print(("ok   " if cond else "FAIL ") + name + (("  " + str(detail)) if not cond else ""))
    if not cond:
        failures.append(name)


ENV = dict(os.environ, GIT_AUTHOR_NAME="t", GIT_AUTHOR_EMAIL="t@t", GIT_COMMITTER_NAME="t", GIT_COMMITTER_EMAIL="t@t")


def sh(cwd, *args):
    return subprocess.run(args, cwd=cwd, env=ENV, check=True, capture_output=True, text=True).stdout.strip()


def scenario(seed_files, later, bundle, team, profile):
    """seed_files: what main has when the session starts; later: what main gains before the save; bundle: what the session changed.
    Returns (result dict, files on main, files on the proposal branch, text of main files)."""
    root = Path(tempfile.mkdtemp())
    origin, seed, clone = root / "origin.git", root / "seed", root / "clone"
    sh(root, "git", "init", "-q", "--bare", "-b", "main", str(origin))
    sh(root, "git", "clone", "-q", str(origin), str(seed))
    for rel, data in seed_files.items():
        p = seed / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(data.encode("utf-8"))   # bytes: Windows text mode would turn LF into CRLF and every line would differ
    sh(seed, "git", "add", "-A")
    sh(seed, "git", "commit", "-q", "-m", "seed")
    sh(seed, "git", "push", "-q", "origin", "HEAD:main")
    sh(root, "git", "clone", "-q", str(origin), str(clone))
    base = sh(clone, "git", "rev-parse", "HEAD")
    if later:
        for rel, data in later.items():
            p = seed / rel
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes(data.encode("utf-8"))
        sh(seed, "git", "add", "-A")
        sh(seed, "git", "commit", "-q", "-m", "main moved")
        sh(seed, "git", "push", "-q", "origin", "HEAD:main")
    work = root / "work"
    work.mkdir()
    with tarfile.open(work / "files.tgz", "w:gz") as tf:
        for rel, data in bundle.items():
            raw = data.encode("utf-8")
            ti = tarfile.TarInfo(rel)
            ti.size = len(raw)
            tf.addfile(ti, io.BytesIO(raw))
    (work / "manifest.json").write_text(json.dumps({"base": base, "deleted": []}), encoding="utf-8")
    os.chdir(clone)
    os.environ.update(ENV)
    out = io.StringIO()
    sys.argv = ["save_work.py", "--work", str(work), "--team", team, "--run", "run_abcdef123456", "--profile", profile]
    with contextlib.redirect_stdout(out):
        SW.main()
    text = out.getvalue()
    result = json.loads(text[text.index("{"):text.rindex("}") + 1])
    main_files = set(sh(origin, "git", "ls-tree", "-r", "--name-only", "main").splitlines())
    branches = sh(origin, "git", "branch", "--list", "proposal/*")
    prop_files = set(sh(origin, "git", "diff", "--name-only", "main", "proposal/run_abcdef123456").splitlines()) if branches else set()
    main_text = {f: sh(origin, "git", "show", f"main:{f}") for f in main_files}
    os.chdir(root)
    return result, main_files, prop_files, main_text


LEARN = {"teams/learnai/state/phase5_status.json": "{}", "teams/learnai/state/covered.json": '{"items": []}', "teams/learnai/team.json": '{"slug": "learnai"}'}

# 1. a desk session writes a reel draft and a script: the draft stays off main and is reported, the script is saved
r, main, prop, _ = scenario(
    LEARN, None,
    {"teams/learnai/reels/q9_x/spec.json": "{}", "teams/learnai/social/q9_x.hi.caption.txt": "c", "teams/learnai/state/scripts/q9.txt": "A: hello"},
    "learnai", "desk")
check("desk: the script reaches main", "teams/learnai/state/scripts/q9.txt" in main)
check("desk: a reel draft does not reach main", not any("reels/q9_x" in f or "social/q9_x" in f for f in main), sorted(main))
check("desk: the reel draft waits on the proposal branch", {"teams/learnai/reels/q9_x/spec.json", "teams/learnai/social/q9_x.hi.caption.txt"} <= prop, sorted(prop))
check("desk: the result lists what was kept off main", len(r["diverted"]) == 2 and "only the studio" in r["diverted"][0], r["diverted"])

# 2. the studio's reel files win over a desk draft that landed on main first
r, main, prop, text = scenario(
    dict(LEARN, **{"teams/learnai/reels/q9_x/spec.json": "old"}), {"teams/learnai/reels/q9_x/spec.json": "desk draft"},
    {"teams/learnai/reels/q9_x/spec.json": "studio build"}, "learnai", "studio")
check("studio: its reel file wins over main", text.get("teams/learnai/reels/q9_x/spec.json") == "studio build", text.get("teams/learnai/reels/q9_x/spec.json"))
check("studio: nothing is diverted", r["diverted"] == [] and not prop, (r["diverted"], sorted(prop)))

# 3. two desks change different lines of one script: merged, nothing lost
base_txt = "A: one\nB: two\nC: three\nD: four\nE: five\n"
r, main, prop, text = scenario(
    dict(LEARN, **{"teams/learnai/state/scripts/q9.txt": base_txt}),
    {"teams/learnai/state/scripts/q9.txt": base_txt.replace("A: one", "A: ONE")},
    {"teams/learnai/state/scripts/q9.txt": base_txt.replace("E: five", "E: FIVE")}, "learnai", "desk")
merged = text.get("teams/learnai/state/scripts/q9.txt", "")
check("merge: both desks' lines are in the file", "A: ONE" in merged and "E: FIVE" in merged, merged)
check("merge: nothing is diverted", r["diverted"] == [] and not prop)

# 4. the same line changed on both sides: main keeps its version, the session's waits on the branch and the result says so
r, main, prop, text = scenario(
    dict(LEARN, **{"teams/learnai/state/scripts/q9.txt": base_txt}),
    {"teams/learnai/state/scripts/q9.txt": base_txt.replace("B: two", "B: main's two")},
    {"teams/learnai/state/scripts/q9.txt": base_txt.replace("B: two", "B: session's two")}, "learnai", "desk")
check("conflict: main keeps its version", "main's two" in text.get("teams/learnai/state/scripts/q9.txt", ""))
check("conflict: the session's version waits on the proposal branch", "teams/learnai/state/scripts/q9.txt" in prop or r["proposal_branch"] == "proposal/run_abcdef123456", r)
check("conflict: the result names the file", any("q9.txt" in d and "same lines" in d for d in r["diverted"]), r["diverted"])
check("conflict: the note says so", "NOT saved to main" in (r["note"] or ""), r["note"])

# 5. the company floor: only its own state notes reach main; code and rules wait for the owner; workflows are dropped
HQ = {"teams/hq/team.json": json.dumps({"slug": "hq", "scope": "company"}), "apps/api/src/x.ts": "old"}
r, main, prop, text = scenario(
    HQ, None,
    {"apps/api/src/x.ts": "new", "teams/hq/state/notes.md": "note", "teams/hq/proposals/run_abcdef123456.md": "# change",
     "teams/learnai/CLAUDE.md": "rule", ".github/workflows/evil.yml": "on: push", "teams/hq/.env": "SECRET=1"},
    "hq", "desk")
check("hq: its own state note reaches main", text.get("teams/hq/state/notes.md") == "note", sorted(main))
check("hq: code does not reach main", text.get("apps/api/src/x.ts") == "old", text.get("apps/api/src/x.ts"))
check("hq: code, rules and the proposal text wait on the branch", {"apps/api/src/x.ts", "teams/learnai/CLAUDE.md", "teams/hq/proposals/run_abcdef123456.md"} <= prop, sorted(prop))
check("hq: a workflow is dropped", ".github/workflows/evil.yml" not in main | prop)
check("hq: a secret file is dropped", "teams/hq/.env" not in main | prop)
check("hq: the note lists what was dropped", "evil.yml" in (r["note"] or "") and "NOT saved" not in (r["note"] or ""), r["note"])

print("\nall passed" if not failures else f"\n{len(failures)} FAILED: {failures}")
sys.exit(1 if failures else 0)
