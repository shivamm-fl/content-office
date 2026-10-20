"""CI: one round of independent reviews of a built reel. build-reel.yml runs it as a PLAIN step, because only plain steps get the Claude login token (the builder session never needs it).
  python3 scripts/ci_review_round.py <id> <round>      runs the visual review (scripts/visual_review.py: the mute test on the pictures) and the fact check (scripts/fact_review.py: every claim of
                                                       the narration, caption and YouTube text against the sources), each with one retry when the reviewer returned nothing; keeps a copy of the
                                                       best version so far and writes  fix=true|false  to $GITHUB_OUTPUT. fix=true: a high-severity fact finding, a failed visual review or MAJOR
                                                       layout problems, and another round is left (at most 3 rounds, so 2 FIX sessions).
  python3 scripts/ci_review_round.py <id> --finalize   put the best-reviewed version back when the last FIX session made the reel worse (or changed nothing)
A version whose facts pass always beats one whose facts do not; then the visual result decides. The final gate (scripts/ci_verify_reel.py) requires both reports to pass and to be fresh.
Exit 1 only when a reviewer could not run at all (no report): the workflow stops, nothing is committed, the item is not counted as an attempt and is built again at the next run."""
import json
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import fact_review as FR   # noqa: E402  (current_sha: a facts report is only valid for the texts it was made for)

MAX_ROUNDS = 3
RETRY_WAIT = 45   # seconds between the attempts of a reviewer that returned nothing (a limit or a crash often clears within a minute)
ATTEMPTS = 3
KEEP = Path(os.environ.get("RUNNER_TEMP") or "/tmp") / "best_reel"


def set_output(key, value):
    line = f"{key}={value}"
    if os.environ.get("GITHUB_OUTPUT"):
        with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as fh:
            fh.write(line + "\n")
    print(line)


def locate(rid):
    st = json.loads((ROOT / "state/phase5_status.json").read_text(encoding="utf-8"))
    e = st.get(rid)
    if not e:
        sys.exit(f"{rid}: no entry in state/phase5_status.json (the builder did not finish its bookkeeping)")
    mp4 = ROOT / e["mp4"]
    folder = ROOT / e["folder"] if e.get("folder") else mp4.with_name(mp4.name.replace("_hi.mp4", ""))
    texts = [ROOT / e["caption"], ROOT / "social" / (folder.name + ".youtube.txt")]   # a fact FIX session may rewrite these
    return mp4, folder, texts


def visual_report(rid, mp4):
    """qa/visual_<id>.json of THIS video; None when missing or written for an older video."""
    f = ROOT / "qa" / f"visual_{rid}.json"
    if not f.exists() or not mp4.exists():
        return None
    try:
        r = json.loads(f.read_text(encoding="utf-8"))
    except ValueError:
        return None
    return r if r.get("mp4_mtime", 0) >= mp4.stat().st_mtime - 1 else None


def facts_report(rid):
    """qa/facts_<id>.json for the narration and texts as they are now; None when missing or stale."""
    f = ROOT / "qa" / f"facts_{rid}.json"
    if not f.exists():
        return None
    try:
        r = json.loads(f.read_text(encoding="utf-8"))
    except ValueError:
        return None
    return r if r.get("text_sha") == FR.current_sha(rid) else None


def score(v, f):
    """Bigger is better: facts pass, visual passes, fewer MAJOR layout problems, higher average, more scenes rated 2."""
    v, f = v or {}, f or {}
    return [bool(f.get("ok")), bool(v.get("ok")), -len(v.get("major_layout") or []), float(v.get("average", 0)), sum(1 for s in v.get("scenes", []) if s.get("match") == 2)]


def run_script(name, rid):
    p = subprocess.run([sys.executable, f"scripts/{name}", rid], cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace")
    print((p.stdout or "")[-5000:])
    if (p.stderr or "").strip():
        print((p.stderr or "")[-1500:])
    return p.returncode


def snapshot(rid, mp4, folder, texts, sc, rnd):
    shutil.rmtree(KEEP, ignore_errors=True)
    KEEP.mkdir(parents=True)
    shutil.copytree(folder, KEEP / "folder", symlinks=True)
    shutil.copy2(mp4, KEEP / "video.mp4")   # copy2 keeps the modification time, which the freshness check of the visual report compares
    for name in ("visual", "facts"):
        src = ROOT / "qa" / f"{name}_{rid}.json"
        if src.exists():
            shutil.copy2(src, KEEP / f"{name}.json")
    for i, t in enumerate(texts):
        shutil.copy2(t, KEEP / f"text{i}.txt")
    (KEEP / "best.json").write_text(json.dumps({"score": sc, "round": rnd}), encoding="utf-8")


def review_round(rid, rnd):
    mp4, folder, texts = locate(rid)
    if not mp4.exists():
        sys.exit(f"{rid}: {mp4} does not exist")
    v = f = None
    for attempt in range(1, ATTEMPTS + 1):   # the visual review writes qa/visual_<id>.json only for a complete review
        run_script("visual_review.py", rid)
        v = visual_report(rid, mp4)
        if v:
            break
        print(f"visual review, attempt {attempt}: no report was written")
        if attempt < ATTEMPTS:
            time.sleep(RETRY_WAIT * attempt)
    for attempt in range(1, ATTEMPTS + 1):   # the fact check exits 2 when the reviewer could not run
        run_script("fact_review.py", rid)
        f = facts_report(rid)
        if f:
            break
        print(f"fact check, attempt {attempt}: no usable report was written")
        if attempt < ATTEMPTS:
            time.sleep(RETRY_WAIT * attempt)
    if not v or not f:
        set_output("fix", "false")
        print("::error::a reviewer could not run (no " + ("visual" if not v else "fact") + " report). Nothing is committed; the item is built again at the next run.")
        return 1
    sc = score(v, f)
    best_f = KEEP / "best.json"
    if not best_f.exists() or sc > json.loads(best_f.read_text(encoding="utf-8"))["score"]:
        snapshot(rid, mp4, folder, texts, sc, rnd)
        print(f"round {rnd}: best version so far (score {sc}) saved")
    need = (not f.get("ok")) or (not v.get("ok")) or bool(v.get("major_layout"))
    fix = need and rnd < MAX_ROUNDS
    set_output("fix", "true" if fix else "false")
    print(f"round {rnd}: facts ok={f.get('ok')} ({len(f.get('problems') or [])} high findings) | visual ok={v.get('ok')} average={v.get('average')} "
          f"major layout problems={len(v.get('major_layout') or [])} -> " + ("a FIX session follows" if fix else "no further FIX session"))
    return 0


def finalize(rid):
    best_f = KEEP / "best.json"
    if not best_f.exists():
        print("no snapshot: nothing to restore")
        return 0
    best = json.loads(best_f.read_text(encoding="utf-8"))
    mp4, folder, texts = locate(rid)
    cur = score(visual_report(rid, mp4), facts_report(rid))
    if cur > best["score"]:   # equal is restored too: a crashed FIX session can leave a broken folder next to an unchanged video
        print("the last version is the best-reviewed one: kept")
        return 0
    print(f"restoring the best-reviewed version (round {best['round']}, score {best['score']}) over the last one")
    shutil.rmtree(folder, ignore_errors=True)
    shutil.copytree(KEEP / "folder", folder, symlinks=True)
    shutil.copy2(KEEP / "video.mp4", mp4)
    for name in ("visual", "facts"):
        if (KEEP / f"{name}.json").exists():
            shutil.copy2(KEEP / f"{name}.json", ROOT / "qa" / f"{name}_{rid}.json")
    for i, t in enumerate(texts):
        if (KEEP / f"text{i}.txt").exists():
            shutil.copy2(KEEP / f"text{i}.txt", t)
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    sys.exit(finalize(sys.argv[1]) if sys.argv[2] == "--finalize" else review_round(sys.argv[1], int(sys.argv[2])))
