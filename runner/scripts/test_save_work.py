"""Self-test of runner/scripts/save_work.py against a temporary origin (no network):  python3 runner/scripts/test_save_work.py

The studio's final job applies the bundle to its checkout and then saves it. Files that are already on disk with exactly the bundle's
content must still be committed (they were skipped before, so only the two state files of a reel reached main)."""
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


root = Path(tempfile.mkdtemp())
origin, seed, clone = root / "origin.git", root / "seed", root / "clone"
sh(root, "git", "init", "-q", "--bare", "-b", "main", str(origin))
sh(root, "git", "clone", "-q", str(origin), str(seed))
(seed / "teams/learnai/state").mkdir(parents=True)
(seed / "teams/learnai/state/phase5_status.json").write_text("{}", encoding="utf-8")
(seed / "teams/learnai/state/covered.json").write_text('{"items": []}', encoding="utf-8")
(seed / ".gitignore").write_text("teams/*/reels/*/assets/*.wav\n", encoding="utf-8")
sh(seed, "git", "add", "-A")
sh(seed, "git", "commit", "-q", "-m", "seed")
sh(seed, "git", "push", "-q", "origin", "HEAD:main")
sh(root, "git", "clone", "-q", str(origin), str(clone))
base = sh(clone, "git", "rev-parse", "HEAD")

# what the reel's build produced
reel = {
    "reels/r104_x/index.html": b"<html>r104</html>", "reels/r104_x/spec.json": b'{"scenes": ["A"]}',
    "social/r104_x.hi.caption.txt": b"caption", "social/r104_x.youtube.txt": b"title\nbody",
    "state/phase5_status.json": json.dumps({"r104": {"status": "built"}}).encode(),
    "bunfig.toml": b"not content",
}
work = root / "work"
work.mkdir()
with tarfile.open(work / "files.tgz", "w:gz") as tf:
    for rel, data in reel.items():
        ti = tarfile.TarInfo(f"teams/learnai/{rel}")
        ti.size = len(data)
        tf.addfile(ti, io.BytesIO(data))
(work / "manifest.json").write_text(json.dumps({"base": base, "deleted": []}), encoding="utf-8")

# the final job has already written them (apply_work), and a 16 MB wav sits in assets (ignored by git, never in a bundle)
for rel, data in reel.items():
    p = clone / "teams/learnai" / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_bytes(data)
(clone / "teams/learnai/reels/r104_x/assets").mkdir()
(clone / "teams/learnai/reels/r104_x/assets/music.wav").write_bytes(b"wav" * 10)

os.chdir(clone)
os.environ.update(ENV)
out = io.StringIO()
sys.argv = ["save_work.py", "--work", str(work), "--team", "learnai", "--run", "run_abcdef123456"]
with contextlib.redirect_stdout(out):
    SW.main()
result = json.loads(out.getvalue()[out.getvalue().index("{"):out.getvalue().rindex("}") + 1])
files = set(sh(origin, "git", "ls-tree", "-r", "--name-only", "main").splitlines())

check("a commit was made", result["commit"] is not None, result)
check("the reel's files reach main even though they were already on disk",
      {"teams/learnai/reels/r104_x/index.html", "teams/learnai/reels/r104_x/spec.json", "teams/learnai/social/r104_x.hi.caption.txt", "teams/learnai/social/r104_x.youtube.txt"} <= files, sorted(files))
check("the state file is saved", json.loads(sh(origin, "git", "show", "main:teams/learnai/state/phase5_status.json")) == {"r104": {"status": "built"}})
check("a file outside the team's content is dropped", "teams/learnai/bunfig.toml" not in files and "not saved" in (result["note"] or ""), result)
check("the music wav stays out of git", not any(f.endswith(".wav") for f in files), sorted(files))
check("the count is the number of files the commit changed", result["files"] == 5, result["files"])

# a second save of the same work does not commit the reel's files again (only the state file is re-merged and re-formatted by the three-way merge)
out = io.StringIO()
with contextlib.redirect_stdout(out):
    SW.main()
again = json.loads(out.getvalue()[out.getvalue().index("{"):out.getvalue().rindex("}") + 1])
check("saving the same work twice does not commit the reel's files again", again["files"] <= 1, again)

print("\nall passed" if not failures else f"\n{len(failures)} FAILED: {failures}")
sys.exit(1 if failures else 0)
