"""Self-test of runner/scripts/pick_best.py (a temporary git repository, no network):  python3 runner/scripts/test_pick_best.py"""
import io
import json
import os
import subprocess
import sys
import tarfile
import tempfile
import contextlib
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import apply_work as AW
import pick_best as PB

failures = []


def check(name, cond, detail=""):
    print(("ok   " if cond else "FAIL ") + name + (("  " + str(detail)) if not cond else ""))
    if not cond:
        failures.append(name)


def bundle(path: Path, files: dict, mtime: int):
    path.parent.mkdir(parents=True, exist_ok=True)
    with tarfile.open(path, "w:gz") as tf:
        for name, data in files.items():
            ti = tarfile.TarInfo(f"teams/learnai/{name}")
            ti.size, ti.mtime = len(data), mtime
            tf.addfile(ti, io.BytesIO(data))


def report(path: Path, ok: bool, avg: float, major: int, facts_ok: bool = True):
    path.mkdir(parents=True, exist_ok=True)
    (path / "visual_q101.json").write_text(json.dumps({"ok": ok, "average": avg, "major_layout": ["m"] * major, "scenes": [{"match": 2}] * 3}), encoding="utf-8")
    (path / "facts_q101.json").write_text(json.dumps({"ok": facts_ok, "problems": []}), encoding="utf-8")


def version_files(tag: str, extra=False):
    f = {"social/q101.hi.caption.txt": f"caption {tag}".encode(), "reels/q101_x/index.html": f"html {tag}".encode(),
         "state/phase5_status.json": json.dumps({"q101": {"v": tag}}).encode()}
    if extra:
        f["reels/q101_x/extra.html"] = f"extra {tag}".encode()
    return f


def setup(last_reports):
    """A checkout of main with version 3 applied, and the artifacts of versions 1 and 2. last_reports = (ok, avg, major) of version 3 or None."""
    root = Path(tempfile.mkdtemp())
    repo = root / "repo"
    (repo / "teams/learnai/state").mkdir(parents=True)
    (repo / "teams/learnai/state/phase5_status.json").write_text(json.dumps({"base": True}), encoding="utf-8")
    for cmd in (["git", "init", "-q"], ["git", "add", "-A"], ["git", "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", "main"]):
        subprocess.run(cmd, cwd=repo, check=True, capture_output=True)
    tmp = root / "runner_temp"
    ver = tmp / "versions"
    for k, extra in ((1, False), (2, True)):
        bundle(ver / str(k) / "work" / "files.tgz", version_files(f"v{k}", extra), 1_700_000_000 + k)
        bundle(ver / str(k) / "media" / "media.tgz", {"reels/q101_x_hi.mp4": f"video v{k}".encode()}, 1_700_000_000 + k)
    report(ver / "1" / "qa", True, 1.5, 7)
    report(ver / "2" / "qa", True, 1.5, 2)
    work3, media3 = tmp / "work", tmp / "media"
    bundle(work3 / "files.tgz", version_files("v3", True) | {"reels/q101_x/only3.html": b"only 3"}, 1_700_000_003)
    bundle(media3 / "media.tgz", {"reels/q101_x_hi.mp4": b"video v3"}, 1_700_000_003)
    AW.REPO = PB.REPO = repo
    AW.unpack(work3 / "files.tgz", "learnai", True)
    AW.unpack(media3 / "media.tgz", "learnai", True, allow_media=True)
    if last_reports:
        report(repo / "teams/learnai/qa", *last_reports)
    return repo, tmp


def run(repo, tmp, last=3):
    out = io.StringIO()
    os.environ["GITHUB_OUTPUT"] = str(tmp / "gh_output")
    with contextlib.redirect_stdout(out):
        code = PB.main(["--team", "learnai", "--item", "q101", "--last", str(last), "--versions", str(tmp / "versions"), "--current-work", str(tmp / "work")])
    outputs = dict(line.split("=", 1) for line in (tmp / "gh_output").read_text(encoding="utf-8").splitlines())
    return code, outputs, out.getvalue()


def text(repo, rel):
    p = repo / "teams/learnai" / rel
    return p.read_text(encoding="utf-8") if p.exists() else None


# the last fix made the reel worse: version 2 comes back
repo, tmp = setup((False, 1.33, 3))
code, outputs, log = run(repo, tmp)
check("the better earlier version is chosen", code == 0 and outputs["version"] == "2", (outputs, log))
check("its files replace the last version's", text(repo, "social/q101.hi.caption.txt") == "caption v2" and text(repo, "reels/q101_x/index.html") == "html v2")
check("a file only the last version had is gone", text(repo, "reels/q101_x/only3.html") is None)
check("the video is the chosen version's", (repo / "teams/learnai/reels/q101_x_hi.mp4").read_bytes() == b"video v2")
check("a tracked file is the chosen version's, not main's and not the last one's", json.loads(text(repo, "state/phase5_status.json")) == {"q101": {"v": "v2"}})
v = json.loads(text(repo, "qa/visual_q101.json"))
check("the chosen version's own reviews are in place", v["ok"] is True and v["average"] == 1.5 and len(v["major_layout"]) == 2, v)
check("the save job gets the chosen version's files", outputs["work"] == str(tmp / "versions" / "2" / "work"), outputs)
check("the modification time of the video is the one the review saw", int((repo / "teams/learnai/reels/q101_x_hi.mp4").stat().st_mtime) == 1_700_000_002)

# the last version is the best: nothing changes
repo, tmp = setup((True, 1.67, 0))
code, outputs, log = run(repo, tmp)
check("a better last version is kept", code == 0 and outputs["version"] == "3" and text(repo, "reels/q101_x/only3.html") == "only 3" and outputs["work"] == str(tmp / "work"), (outputs, log))

# the reviewers could not run on the last version: the best earlier one is used
repo, tmp = setup(None)
code, outputs, log = run(repo, tmp)
check("a last version without reviews loses to a reviewed one", code == 0 and outputs["version"] == "2" and text(repo, "social/q101.hi.caption.txt") == "caption v2", (outputs, log))

# a file that main tracks and only the last version changed goes back to main
repo, tmp = setup((False, 1.0, 5))
(tmp / "versions" / "2" / "work" / "files.tgz").unlink()
bundle(tmp / "versions" / "2" / "work" / "files.tgz", {k: v for k, v in version_files("v2", True).items() if k != "state/phase5_status.json"}, 1_700_000_002)
code, outputs, log = run(repo, tmp)
check("a tracked file the chosen version did not change is restored from main", json.loads(text(repo, "state/phase5_status.json")) == {"base": True}, text(repo, "state/phase5_status.json"))

# ties go to the later version
check("a tie is won by the later version", PB.choose({1: [True, True, -2, 1.5, 3], 2: [True, True, -2, 1.5, 3], 3: [False, False, 0, 0.0, 0]}) == 2)
check("facts that fail lose to facts that pass", PB.choose({1: [False, True, 0, 2.0, 5], 2: [True, False, -9, 0.1, 0]}) == 2)

print("\nall passed" if not failures else f"\n{len(failures)} FAILED: {failures}")
sys.exit(1 if failures else 0)
