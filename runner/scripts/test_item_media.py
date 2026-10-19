"""Self-test of runner/scripts/item_media.py (no network, GitHub is replaced by a folder):  python3 runner/scripts/test_item_media.py

A reel's last video, voice and phrase cache survive between studio runs, so a note about the cover or a name on the screen needs neither
a new voice (paid characters) nor a render, and a restored video can never pass for a new one."""
import json
import os
import shutil
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import apply_work as AW
import item_media as IM

failures = []


def check(name, cond, detail=""):
    print(("ok   " if cond else "FAIL ") + name + (("  " + str(detail)) if not cond else ""))
    if not cond:
        failures.append(name)


def make_repo(root: Path, with_media: bool):
    """teams/learnai with one reel q101_x: composition in git, video + voice + cache beside it when with_media."""
    t = root / "teams/learnai"
    (t / "state").mkdir(parents=True)
    (t / "reels/q101_x/kit").mkdir(parents=True)
    (t / "brand/covers").mkdir(parents=True)
    (t / "state/phase5_status.json").write_text(json.dumps({"q101": {"folder": "reels/q101_x", "mp4": "reels/q101_x_hi.mp4", "cover": "brand/covers/q101_x.png"}}), encoding="utf-8")
    (t / "reels/q101_x/index.html").write_text("<html>handle @ai.learnai</html>", encoding="utf-8")
    (t / "reels/q101_x/spec.json").write_text('{"copy": {"hi": {"A": "namaste"}}}', encoding="utf-8")
    (t / "reels/q101_x/kit/motion.js").write_text("// kit", encoding="utf-8")
    (t / "brand/covers/q101_x.png").write_bytes(b"cover v1")
    if with_media:
        a = t / "reels/q101_x/audio/hi"
        a.mkdir(parents=True)
        (t / "reels/q101_x_hi.mp4").write_bytes(b"video v1")
        for n in IM.SOUND:
            (a / n).write_bytes(b"wav " + n.encode())
        (a / "el_abc123.mp3").write_bytes(b"paid phrase")
        (a / "el_abc123.json").write_text("{}", encoding="utf-8")
        IM.write_stamp(t / "reels/q101_x")
    return t


def use(root: Path):
    IM.REPO = root
    AW.REPO = root


tmp = Path(tempfile.mkdtemp())

# ---- the fingerprint ----
a = tmp / "a"
t = make_repo(a, True)
use(a)
folder = t / "reels/q101_x"
base = IM.composition(folder)
check("a stamped video is fresh", IM.verify("learnai", "q101")[0], IM.verify("learnai", "q101"))
(folder / "audio/hi/el_zzz.mp3").write_bytes(b"another cache file")
(folder / "snapshots").mkdir()
(folder / "snapshots/f1.png").write_bytes(b"png")
(folder / "audio/hi/music_dump.wav").write_bytes(b"x")
(folder / "assets").mkdir(exist_ok=True)
(folder / "assets/music.wav").write_bytes(b"template music bed, copied in on the build machine only")
(folder / "voice_samples").mkdir(exist_ok=True)
(folder / "voice_samples/s.mp3").write_bytes(b"sample")
check("the phrase cache, snapshots, other audio files, template wavs and voice samples do not count", IM.composition(folder) == base)
(folder / "assets/logo.png").write_bytes(b"a logo the reel shows")
check("a picture in assets does count", IM.composition(folder) != base)
(folder / "assets/logo.png").unlink()
(folder / "index.html").write_text("<html>handle @ai.learnvora</html>", encoding="utf-8")
ok, msg = IM.verify("learnai", "q101")
check("a changed composition makes the old video stale", not ok and "render_video" in msg, msg)
IM.write_stamp(folder)
check("a new stamp (a render) makes it fresh again", IM.verify("learnai", "q101")[0])
(folder / "audio/hi/voice.wav").write_bytes(b"a new voice")
check("a new voice makes the old video stale", not IM.verify("learnai", "q101")[0])
(folder / "audio/hi/voice.wav").write_bytes(b"wav voice.wav")
IM.write_stamp(folder)
(folder / IM.STAMP).unlink()
ok, msg = IM.verify("learnai", "q101")
check("a video from before stamps passes with a note", ok and "no stamp" in msg, msg)
(t / "reels/q101_x_hi.mp4").unlink()
check("no video is not fresh", not IM.verify("learnai", "q101")[0])

# ---- pack, then restore into a fresh checkout ----
a = tmp / "a2"
t = make_repo(a, True)
use(a)
out = tmp / "archive"
made = IM.pack("learnai", "q101", "run_Abc123", out)
check("pack writes media.tgz, a copy of the video and of the cover", sorted(p.name for p in made) == sorted(["media.tgz", "q101_x_hi.run_Abc123.mp4", "q101_x.run_Abc123.png"]), [p.name for p in made])
check("the version copy is the video", (out / "q101_x_hi.run_Abc123.mp4").read_bytes() == b"video v1")

archive_dir = tmp / "release"          # what GitHub would serve
archive_dir.mkdir()
shutil.copy2(out / "media.tgz", archive_dir / "media.tgz")
IM.release_names = lambda tag: sorted(p.name for p in archive_dir.iterdir()) if tag.endswith("-archive") else []
IM.release_get = lambda tag, name, dest: (archive_dir / name).exists() and bool(shutil.copy2(archive_dir / name, dest / name))

b = tmp / "b"
make_repo(b, False)
use(b)
state_file = tmp / "state.json"
st = IM.restore("learnai", "q101", state_file)
tb = b / "teams/learnai"
check("restore brings back the video, the voice, the phrase cache and the stamp",
      (tb / "reels/q101_x_hi.mp4").read_bytes() == b"video v1" and (tb / "reels/q101_x/audio/hi/voice.wav").exists()
      and (tb / "reels/q101_x/audio/hi/el_abc123.mp3").read_bytes() == b"paid phrase" and (tb / "reels/q101_x" / IM.STAMP).exists() and st["restored"])
check("the restored video is fresh for the restored files", IM.verify("learnai", "q101")[0], IM.verify("learnai", "q101"))
check("nothing touched: the video did not change (the reviews of it still hold)", IM.changed("learnai", "q101", state_file) is False)
(tb / "brand/covers/q101_x.png").write_bytes(b"cover v2")
check("a new cover alone leaves the video unchanged", IM.changed("learnai", "q101", state_file) is False)
(tb / "reels/q101_x/index.html").write_text("<html>handle @ai.learnvora</html>", encoding="utf-8")
check("a handle changed in the composition, no render: the old video is stale, not delivered as new", not IM.verify("learnai", "q101")[0])
(tb / "reels/q101_x_hi.mp4").write_bytes(b"video v2")
check("a new render is a changed video", IM.changed("learnai", "q101", state_file) is True)

# ---- an item delivered before archives existed: the video from its release, no cache ----
c = tmp / "c"
make_repo(c, False)
use(c)
main_dir = tmp / "main_release"
main_dir.mkdir()
(main_dir / "q101_x_hi.mp4").write_bytes(b"old delivered video")
IM.release_names = lambda tag: ["q101_x_hi.mp4", "q101_x.png"] if tag == "office-learnai-q101" else []
IM.release_get = lambda tag, name, dest: (main_dir / name).exists() and bool(shutil.copy2(main_dir / name, dest / name))
st = IM.restore("learnai", "q101", tmp / "state_c.json")
tc = c / "teams/learnai"
check("an older delivery gets its video back and is taken to match the committed files",
      st["restored"] and (tc / "reels/q101_x_hi.mp4").read_bytes() == b"old delivered video" and IM.verify("learnai", "q101")[0])
check("no cache exists for it (the voice cannot be reused)", not (tc / "reels/q101_x/audio/hi/voice.wav").exists())

# ---- nothing to restore, GitHub unreachable ----
d = tmp / "d"
make_repo(d, False)
use(d)
IM.release_names = lambda tag: []
st = IM.restore("learnai", "q101", tmp / "state_d.json")
check("a reel never delivered restores nothing and is always 'changed'", not st["restored"] and IM.changed("learnai", "q101", tmp / "state_d.json") is True)
check("a missing state file means changed (the reviews run)", IM.changed("learnai", "q101", tmp / "nope.json") is True)

# ---- the state file comes from an agent: paths that leave the reel folders are not followed ----
e = tmp / "e"
te = make_repo(e, True)
use(e)
for bad in ({"folder": "reels/../../x", "mp4": "reels/q101_x_hi.mp4"}, {"folder": "reels/q101_x", "mp4": "../../.git/config"}, {"folder": "reels/q101_x", "mp4": "reels/../q101_x_hi.mp4"}, {"folder": "reels/..", "mp4": "reels/q101_x_hi.mp4"}):
    (te / "state/phase5_status.json").write_text(json.dumps({"q101": bad}), encoding="utf-8")
    check(f"a path that leaves reels/ is refused: {bad['folder']} {bad['mp4']}", IM.where("learnai", "q101") is None)
(te / "state/phase5_status.json").write_text(json.dumps({"q101": {"folder": "reels/q101_x", "mp4": "reels/q101_x_hi.mp4", "cover": "../../.git/config"}}), encoding="utf-8")
made = IM.pack("learnai", "q101", "run_x", tmp / "archive_e")
check("a cover path that leaves brand/covers/ is left out of the archive", sorted(p.name for p in made) == ["media.tgz", "q101_x_hi.run_x.mp4"], [p.name for p in made])

# ---- the cli ----
use(a)
code = IM.main(["verify", "--team", "learnai", "--item", "q101"])
check("verify exits 0 for a fresh video", code == 0)
(a / "teams/learnai/reels/q101_x/index.html").write_text("changed", encoding="utf-8")
check("verify exits 1 for a stale one", IM.main(["verify", "--team", "learnai", "--item", "q101"]) == 1)
IM.main(["stamp", "--team-dir", str(a / "teams/learnai"), "--folder", "reels/q101_x"])
check("stamp makes it fresh", IM.main(["verify", "--team", "learnai", "--item", "q101"]) == 0)
go = tmp / "gh_output"
os.environ["GITHUB_OUTPUT"] = str(go)
IM.main(["changed", "--team", "learnai", "--item", "q101", "--state", str(tmp / "state.json")])
check("changed writes video_changed to GITHUB_OUTPUT", go.read_text(encoding="utf-8").strip() in ("video_changed=true", "video_changed=false"))

shutil.rmtree(tmp, ignore_errors=True)
print("\nall passed" if not failures else f"\n{len(failures)} FAILED: {failures}")
sys.exit(1 if failures else 0)
