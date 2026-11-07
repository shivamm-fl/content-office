"""Stills check before a render: two frames per scene (35% and 80% into it) plus frame 0.3, and one contact sheet.
  python scripts/snap_sheet.py reels/<folder>        -> qa/snap/<folder>/ and qa/snap/<folder>.jpg
Patches data-duration in index.html from data.json first (as render_reel.py does). Read the sheet before rendering:
it catches wrapped headlines, boxes that overflow, labels that appear too late and blank stretches."""
import json, re, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
proj = (ROOT / sys.argv[1]).resolve() if not Path(sys.argv[1]).is_absolute() else Path(sys.argv[1])
d = json.loads((proj / "data.json").read_text(encoding="utf-8"))["hi"]
html = proj / "index.html"; s = html.read_text(encoding="utf-8")
old = re.search(r'data-composition-id="main"[^>]*?data-duration="([\d.]+)"', s).group(1)
html.write_text(s.replace(f'data-duration="{old}"', f'data-duration="{d["total"]:g}"'), encoding="utf-8")
keys = [k for k in d["starts"] if k != "end"]; ends = [d["starts"][k] for k in keys[1:]] + [d["total"]]
times = [0.3] + [round(a + (b - a) * f, 2) for a, b in zip([d["starts"][k] for k in keys], ends) for f in (0.35, 0.8)]
out = ROOT / "qa" / "snap" / proj.name
shutil.rmtree(out, ignore_errors=True); out.mkdir(parents=True)
npx = shutil.which("npx") or shutil.which("npx.cmd")
subprocess.run([npx, "--yes", "hyperframes@0.8.149", "snapshot", str(proj), "--at", ",".join(map(str, times)), "--no-end", "--describe", "false", "-o", str(out)],
               check=True, capture_output=True, text=True, encoding="utf-8", errors="replace")
frames = sorted(out.glob("frame-*.png"), key=lambda p: int(p.name.split("-")[1]))
for i, f in enumerate(frames):
    shutil.copy(f, out / f"s_{i:02d}.png")
cols = 8
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(out / "s_%02d.png"), "-vf", f"scale=300:-1,tile={cols}x{(len(frames) + cols - 1) // cols}:padding=6:color=white",
                "-frames:v", "1", str(out.parent / f"{proj.name}.jpg")], check=True)
print(f"{proj.name}: {len(frames)} frames at {','.join(map(str, times))} -> qa/snap/{proj.name}.jpg")
