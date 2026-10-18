"""Give a finished reel Roman Hinglish captions without new audio:  python scripts/romanize_reel.py reels/<folder>
Rewrites the caption tokens of data.json and data.js (Devanagari token -> Roman `t`, the original kept in `sp`, timings untouched) and refreshes the reel's kit/ files from
reels/_kit (M.W then finds a word by either form). Render afterwards (scripts/render_job.py start/wait). Idempotent."""
import json
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import hinglish_roman as HR

ROOT = Path(__file__).resolve().parent.parent


def main(folder):
    folder = Path(folder)
    if not folder.is_absolute():
        folder = ROOT / folder
    f = folder / "data.json"
    data = json.loads(f.read_text(encoding="utf-8"))
    n = sum(1 for lang in ("hi",) for c in data[lang]["caps"] if "sp" not in c and HR.DEV.search(c["t"]))
    for lang in ("hi",):
        HR.romanize_caps(data[lang]["caps"])
    f.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    (folder / "data.js").write_text("window.REEL=" + json.dumps(data, ensure_ascii=False) + ";", encoding="utf-8")
    for name in ("motion.css", "motion.js", "viz.js"):
        shutil.copy2(ROOT / "reels" / "_kit" / name, folder / "kit" / name)
    print(f"{folder.name}: {n} caption tokens romanized; kit refreshed")
    print("sample:", " ".join(c["t"] for c in data["hi"]["caps"][:14]))


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
