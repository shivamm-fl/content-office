"""Keep only the cached TTS wavs that the latest build actually used (reels/*/audio/*/s?_N.<hash>.wav whose bytes equal s?_N.wav).
Others are MOVED (not deleted) to ../ai-course-stale-cache. Dry-run unless --apply."""
import hashlib, re, shutil, sys
from pathlib import Path
apply = "--apply" in sys.argv; dest = Path("..") / "ai-course-stale-cache"; moved = kept = 0
md5 = lambda p: hashlib.md5(p.read_bytes()).hexdigest()
for out in Path("reels").glob("*/audio/*/s[A-Z]_[0-9]*.wav"):
    if re.fullmatch(r"s[A-Z]_\d+\.wav", out.name):
        used = md5(out)
        for c in out.parent.glob(out.stem + ".*.wav"):
            if md5(c) == used: kept += 1; continue
            moved += 1; print(("move " if apply else "would move ") + str(c))
            if apply: t = dest / c.relative_to("reels"); t.parent.mkdir(parents=True, exist_ok=True); shutil.move(str(c), t)
print(f"kept {kept} used cache files, {moved} stale")
