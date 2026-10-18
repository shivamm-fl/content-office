"""Put the best-reviewed version of a reel back before the final gate (the "Best version" step of office-studio.yml, a trusted job).

    python3 -I runner/scripts/pick_best.py --team <team> --item <id> --last <n> --versions <dir> --current-work <dir>

The studio builds version 1, then a FIX session may make version 2 and another version 3. Each version is reviewed on its own machine
(qa-<run>-<k>); version <last> is reviewed in the final job and its reports are in teams/<team>/qa. A FIX session can make a reel that
already passed worse (q101: rounds 1 and 2 passed the mute test with 1.5, the last fix fell to 1.33 and failed the gate), and the best
copy that ci_review_round.py keeps is lost between jobs, so the gate always judged the last version. This step compares the versions
with the same score as scripts/ci_review_round.py (facts pass, visual passes, fewer MAJOR layout problems, higher average, more scenes
rated 2; a version without both reports scores lowest; on a tie the later version wins) and, when an earlier version beats the last
one, puts it back: the item's files and video of the last version are removed, the earlier version's files, video and reports are
applied. The gate then runs on it as usual, so it passes only on that version's own reviews.

<versions>/<k>/work/files.tgz, <versions>/<k>/media/media.tgz and <versions>/<k>/qa/{visual,facts}_<item>.json exist for the versions before <last>.
Writes version=<k> and work=<dir of the chosen version's files.tgz> to $GITHUB_OUTPUT (the save job needs them)."""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tarfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from apply_work import REPO, unpack  # noqa: E402
from save_work import classify  # noqa: E402

MEDIA = re.compile(r"reels/[\w.-]+_hi\.mp4|reels/[\w.-]+/audio/hi/(voice|bed|sfx)\.wav|reels/[\w.-]+/audio/hi/el_[\w.-]+\.(mp3|json)")


def read(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None


def score(v, f):
    """Bigger is better; the same order as scripts/ci_review_round.py. Both reports are needed to count at all."""
    if not v or not f:
        return [False, False, -999, 0.0, 0]
    return [bool(f.get("ok")), bool(v.get("ok")), -len(v.get("major_layout") or []), float(v.get("average", 0)), sum(1 for s in v.get("scenes", []) if s.get("match") == 2)]


def choose(scores: dict) -> int:
    """scores: version -> score. The best wins; on a tie the later version."""
    return max(scores, key=lambda k: (scores[k], k))


def members(bundle: Path, team: str, media: bool):
    """The paths (relative to the repository) a bundle would write, by the same rules as apply_work.unpack."""
    prefix = f"teams/{team}/"
    out = []
    if not bundle.exists():
        return out
    with tarfile.open(bundle, "r:gz") as tf:
        for m in tf.getmembers():
            name = m.name.lstrip("./")
            if not m.isfile() or not name.startswith(prefix) or ".." in name.split("/"):
                continue
            rel = name[len(prefix):]
            if (media and MEDIA.fullmatch(rel)) or (not media and classify(rel) == "content"):
                out.append(name)
    return out


def git_tracked(path: str) -> bool:
    return subprocess.run(["git", "ls-files", "--error-unmatch", "--", path], cwd=REPO, capture_output=True).returncode == 0


def wipe(paths):
    """Back to what main has: a tracked file is restored, any other file is removed."""
    for name in paths:
        if git_tracked(name):
            subprocess.run(["git", "checkout", "HEAD", "--", name], cwd=REPO, check=True, capture_output=True)
        else:
            (REPO / name).unlink(missing_ok=True)


def set_output(key, value):
    if os.environ.get("GITHUB_OUTPUT"):
        with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as fh:
            fh.write(f"{key}={value}\n")
    print(f"{key}={value}")


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--team", required=True)
    ap.add_argument("--item", required=True)
    ap.add_argument("--last", required=True, type=int)
    ap.add_argument("--versions", required=True)
    ap.add_argument("--current-work", required=True)
    a = ap.parse_args(argv)
    if not re.fullmatch(r"[a-z0-9-]{2,40}", a.team) or not re.fullmatch(r"[a-z][0-9]{2,4}", a.item):
        sys.exit("bad team or item")
    versions = Path(a.versions)
    qa_now = REPO / "teams" / a.team / "qa"
    scores = {a.last: score(read(qa_now / f"visual_{a.item}.json"), read(qa_now / f"facts_{a.item}.json"))}
    for k in range(1, a.last):
        qa = versions / str(k) / "qa"
        scores[k] = score(read(qa / f"visual_{a.item}.json"), read(qa / f"facts_{a.item}.json"))
    best = choose(scores)
    print("scores by version:", json.dumps(scores))
    if best == a.last:
        print(f"version {a.last} is the best-reviewed one: kept")
        set_output("version", a.last)
        set_output("work", a.current_work)
        return 0
    print(f"version {best} beats version {a.last}: putting it back")
    wipe(members(Path(a.current_work) / "files.tgz", a.team, media=False))
    media_now = Path(a.current_work).parent / "media" / "media.tgz"
    wipe(members(media_now, a.team, media=True))
    src = versions / str(best)
    n = unpack(src / "work" / "files.tgz", a.team, True) if (src / "work" / "files.tgz").exists() else 0
    m = unpack(src / "media" / "media.tgz", a.team, True, allow_media=True) if (src / "media" / "media.tgz").exists() else 0
    qa_now.mkdir(parents=True, exist_ok=True)
    for name in ("visual", "facts"):
        f = src / "qa" / f"{name}_{a.item}.json"
        if f.exists():
            shutil.copy2(f, qa_now / f.name)
    print(f"applied version {best}: {n} file(s), {m} video(s), its reviews")
    set_output("version", best)
    set_output("work", str(src / "work"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
