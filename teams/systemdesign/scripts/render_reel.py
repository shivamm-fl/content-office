"""Render a reel per language with the right length (patches data-duration in index.html from data.json, per language).
Usage: python scripts/render_reel.py reels/ep002_r1 out_prefix [en|hi ...]   e.g. -> reels/ep002_r1_en.mp4
Preview of the first N seconds (owner checks the look before a full render): PREVIEW_SECS=10 python scripts/render_reel.py reels/<folder> tmp/<folder>_preview hi"""
import json, os, re, subprocess, sys, shutil
from pathlib import Path
proj = Path(sys.argv[1]); prefix = sys.argv[2]
data = json.loads((proj / "data.json").read_text(encoding="utf-8")); html = proj / "index.html"
langs = sys.argv[3:] or [l for l in ("en", "hi") if l in data]
for lang in langs:
    total = min(data[lang]["total"], float(os.environ.get("PREVIEW_SECS") or 1e9)); s = html.read_text(encoding="utf-8")
    old = re.search(r'data-composition-id="main"[^>]*?data-duration="([\d.]+)"', s).group(1)
    html.write_text(s.replace(f'data-duration="{old}"', f'data-duration="{total:g}"'), encoding="utf-8")
    vars_ = proj / f"vars.{lang}.json"; out = Path(prefix + f"_{lang}.mp4").resolve()
    subprocess.run([shutil.which("npx"), "--yes", "hyperframes@0.8.149", "render", "--variables-file", vars_.name, "--strict-variables", "--quality", "delivery", "--workers", "2", "--output", str(out)], cwd=proj, check=True, stdout=subprocess.DEVNULL)
    print(lang, total, "s ->", out)
