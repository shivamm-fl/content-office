"""Unpack a work bundle (files.tgz from an agent job) into this checkout.

    python3 -I runner/scripts/apply_work.py --work <dir> --team <team> [--content-only] [--media <dir with media.tgz>]

--content-only (trusted jobs: reviews, final gate): only the team's content files (state, reels, social, covers,
thumbnails, roadmap) are written, so a script, prompt or setting an agent changed never runs with the Claude token.
Without it (agent jobs: the fix session) every file of the team folder comes back as the agent left it.
Links, absolute paths and paths outside teams/<team>/ are always skipped. Deleted files are not replayed.
"""
import argparse
import sys
import tarfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from save_work import MAX_FILE, classify  # noqa: E402


def unpack(bundle: Path, team: str, content_only: bool, allow_media: bool = False) -> int:
    prefix = f"teams/{team}/"
    n = 0
    with tarfile.open(bundle, "r:gz") as tf:
        for m in tf.getmembers():
            name = m.name.lstrip("./")
            if not m.isfile() or m.size > (600 * 1024 * 1024 if allow_media else MAX_FILE):
                continue
            if not name.startswith(prefix) or ".." in name.split("/"):
                continue
            rel = name[len(prefix):]
            if allow_media:
                if not (rel.startswith("reels/") and rel.endswith("_hi.mp4") and rel.count("/") == 1):
                    continue
            elif content_only and classify(rel) != "content":
                continue
            out = Path(name)
            out.parent.mkdir(parents=True, exist_ok=True)
            f = tf.extractfile(m)
            if f is None:
                continue
            out.write_bytes(f.read())
            # keep the time stamp: a visual review is valid only for the video it saw (mp4 mtime)
            import os
            os.utime(out, (m.mtime, m.mtime))
            n += 1
    return n


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--work", required=True)
    ap.add_argument("--team", required=True)
    ap.add_argument("--content-only", action="store_true")
    ap.add_argument("--media")
    a = ap.parse_args()
    work = Path(a.work) / "files.tgz"
    n = unpack(work, a.team, a.content_only) if work.exists() else 0
    m = 0
    if a.media and (Path(a.media) / "media.tgz").exists():
        m = unpack(Path(a.media) / "media.tgz", a.team, True, allow_media=True)
    print(f"applied {n} file(s){' (content only)' if a.content_only else ''}, {m} video(s)")


if __name__ == "__main__":
    main()
