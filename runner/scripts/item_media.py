"""A reel's last video, its voice and the owner-voice phrase cache, kept between studio runs (office-studio.yml, a trusted tool).

    python3 -I runner/scripts/item_media.py restore --team <team> --item <id> --state <file>     build job, before the session
    python3 -I runner/scripts/item_media.py changed --team <team> --item <id> --state <file>     after the session: video_changed=true|false to $GITHUB_OUTPUT
    python3 -I runner/scripts/item_media.py stamp   --team-dir <dir> --folder reels/<name>       the render_video tool, after a render
    python3 -I runner/scripts/item_media.py verify  --team <team> --item <id>                    the gate: is the video made from these files?
    python3 -I runner/scripts/item_media.py pack    --team <team> --item <id> --run <run_id> --out <dir>    final job: media.tgz and a copy of this version

Why (owner, 2026-10-19): a studio run starts from git, and git has no video, no voice and no phrase cache. A note about the cover
or about a name on the screen therefore made the studio buy the owner's voice (ElevenLabs characters) and render ten minutes again, and a
failed run left nothing of the reel behind. Now every delivery keeps `media.tgz` (the video, the voice / bed / effects, the phrase cache
and the stamp) and one copy of each version in the release office-<team>-<item>-archive; the next run restores them first. Phrases that did not
change are in the cache, so they cost no characters; a cover-only note needs neither voice nor render.

The stamp (reels/<name>/audio/hi/video.stamp.json) is the sha256 of everything the picture and the sound come from, written when the video was
rendered. The gate refuses a video whose stamp no longer matches the files: a restored video can never pass for the new one."""
import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import apply_work  # noqa: E402  (unpack: the one place that decides which media files may be written)

REPO = Path(__file__).resolve().parents[2]
STAMP = "audio/hi/video.stamp.json"
SOUND = ("voice.wav", "bed.wav", "sfx.wav")
SKIP = {"node_modules", "snapshots", "__pycache__"}


def team_root(team: str) -> Path:
    return REPO / "teams" / team


def where(team: str, item: str):
    """(reel folder, video) of the item from its state entry, or None."""
    try:
        e = json.loads((team_root(team) / "state/phase5_status.json").read_text(encoding="utf-8")).get(item) or {}
    except (OSError, ValueError):
        return None
    # the state file is written by an agent session: only these shapes of path are followed (never "..", never outside reels/ and brand/covers/)
    if not (re.fullmatch(r"reels/\w[\w.-]*", str(e.get("folder"))) and re.fullmatch(r"reels/\w[\w.-]*_hi\.mp4", str(e.get("mp4")))):
        return None
    cover = e.get("cover") if re.fullmatch(r"brand/covers/\w[\w.-]*\.png", str(e.get("cover"))) else None
    return team_root(team) / e["folder"], team_root(team) / e["mp4"], {**e, "cover": cover}


def sha_file(p: Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def sha_text_aware(p: Path) -> str:
    """sha256 of a file; a text file is hashed with LF line endings, because git keeps LF (.gitattributes eol=lf) while a Windows checkout and a Windows render write CRLF:
    the same reel must have the same fingerprint on the laptop and on the Linux runner."""
    data = p.read_bytes()
    if b"\0" not in data[:8000]:
        data = data.replace(b"\r\n", b"\n")
    return hashlib.sha256(data).hexdigest()


def composition(folder: Path) -> str:
    """Everything the video is made from: the composition and its data, kit, fonts and assets, and the voice / bed / effects wavs.
    Only what the final job also has: not the phrase cache, snapshots, other audio files, template wavs or the video itself."""
    h = hashlib.sha256()
    for p in sorted(folder.rglob("*")):
        if not p.is_file():
            continue
        rel = p.relative_to(folder).as_posix()
        parts = rel.split("/")
        if any(x in SKIP or x.startswith(".") for x in parts) or rel.endswith(".mp4"):
            continue
        if parts[0] == "audio" and rel not in {f"audio/hi/{n}" for n in SOUND}:
            continue
        # git-ignored files that exist on the build machine but not on the final one (the template's music bed and effects are copied into
        # assets/ for every build; voice samples), so they must not decide whether the video is fresh
        if parts[0] == "voice_samples" or (parts[0] == "assets" and rel.endswith(".wav")):
            continue
        h.update(rel.encode() + b"\0" + sha_text_aware(p).encode() + b"\0")
    return h.hexdigest()


def write_stamp(folder: Path) -> str:
    sha = composition(folder)
    out = folder / STAMP
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({"composition": sha}), encoding="utf-8")
    return sha


def verify(team: str, item: str) -> tuple[bool, str]:
    w = where(team, item)
    if not w:
        return False, "no entry for the item in state/phase5_status.json"
    folder, mp4, _ = w
    if not mp4.exists():
        return False, f"{mp4.name} is missing"
    stamp = folder / STAMP
    if not stamp.exists():
        return True, "no stamp (video rendered before stamps existed)"
    try:
        was = json.loads(stamp.read_text(encoding="utf-8")).get("composition")
    except ValueError:
        return False, "unreadable video stamp: render_video again"
    if was != composition(folder):
        return False, "the composition, its data or the voice changed after the video was rendered: render_video again (the video on disk is the old one)"
    return True, "the video is made from these files"


# ---- the release is reached through two small functions, so a test can stand in for GitHub ----
def release_names(tag: str) -> list[str]:
    r = subprocess.run(["gh", "release", "view", tag, "--json", "assets", "--jq", ".assets[].name"], capture_output=True, text=True)
    return r.stdout.split() if r.returncode == 0 else []


def release_get(tag: str, name: str, dest: Path) -> bool:
    r = subprocess.run(["gh", "release", "download", tag, "--pattern", name, "--dir", str(dest), "--clobber"], capture_output=True, text=True)
    return r.returncode == 0 and (dest / name).exists()


def restore(team: str, item: str, state_path: Path) -> dict:
    state = {"restored": False}
    w = where(team, item)
    if w:
        folder, mp4, _ = w
        archive, main = f"office-{team}-{item}-archive", f"office-{team}-{item}"
        tmp = Path(tempfile.mkdtemp())
        if "media.tgz" in release_names(archive) and release_get(archive, "media.tgz", tmp):
            print(f"restored {apply_work.unpack(tmp / 'media.tgz', team, True, allow_media=True)} media file(s) of {item} from {archive}")
        if not mp4.exists() and mp4.name in release_names(main) and release_get(main, mp4.name, tmp):
            mp4.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(tmp / mp4.name, mp4)
            print(f"restored {mp4.name} from {main} (no voice or phrase cache was kept for this one)")
        if mp4.exists():
            if not (folder / STAMP).exists():
                write_stamp(folder)   # a video delivered before stamps: it is taken to match the files as they are now
            state = {"restored": True, "mp4_sha": sha_file(mp4)}
    if not state["restored"]:
        print(f"nothing to restore for {item}")
    state_path.write_text(json.dumps(state), encoding="utf-8")
    return state


def changed(team: str, item: str, state_path: Path) -> bool:
    """False only when a video was restored and the session left it exactly as it was (the reviews of that video still hold)."""
    try:
        state = json.loads(state_path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return True
    w = where(team, item)
    return not (state.get("restored") and w and w[1].exists() and sha_file(w[1]) == state.get("mp4_sha"))


def pack(team: str, item: str, run: str, out: Path) -> list[Path]:
    """media.tgz (same layout as the work artifact, so apply_work reads it) and one copy of this version's video and cover."""
    w = where(team, item)
    if not w or not w[1].exists():
        raise SystemExit(f"{item} has no video to keep")
    folder, mp4, e = w
    audio = folder / "audio/hi"
    files = [mp4, *(audio / n for n in SOUND), *sorted(audio.glob("el_*.mp3")), *sorted(audio.glob("el_*.json")), folder / STAMP]
    out.mkdir(parents=True, exist_ok=True)
    made = [out / "media.tgz"]
    with tarfile.open(made[0], "w:gz") as tf:
        for p in files:
            if p.exists():
                tf.add(p, arcname=p.relative_to(REPO).as_posix())
    shutil.copy2(mp4, out / f"{mp4.stem}.{run}.mp4")
    made.append(out / f"{mp4.stem}.{run}.mp4")
    cover = team_root(team) / e["cover"] if e.get("cover") else None
    if cover and cover.exists():
        shutil.copy2(cover, out / f"{cover.stem}.{run}.png")
        made.append(out / f"{cover.stem}.{run}.png")
    return made


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["restore", "changed", "stamp", "verify", "pack"])
    ap.add_argument("--team")
    ap.add_argument("--item")
    ap.add_argument("--state")
    ap.add_argument("--team-dir")
    ap.add_argument("--folder")
    ap.add_argument("--run")
    ap.add_argument("--out")
    a = ap.parse_args(argv)
    if a.cmd == "stamp":
        print("stamped", write_stamp(Path(a.team_dir) / a.folder)[:12])
        return 0
    if a.cmd == "verify":
        ok, msg = verify(a.team, a.item)
        print(msg)
        return 0 if ok else 1
    if a.cmd == "restore":
        restore(a.team, a.item, Path(a.state))
        return 0
    if a.cmd == "changed":
        line = f"video_changed={'true' if changed(a.team, a.item, Path(a.state)) else 'false'}"
        print(line)
        if os.environ.get("GITHUB_OUTPUT"):
            with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as fh:
                fh.write(line + "\n")
        return 0
    for p in pack(a.team, a.item, a.run, Path(a.out)):
        print(p)
    return 0


if __name__ == "__main__":
    sys.exit(main())
