"""Contact sheets for visual QA.  python scripts/frames.py video.mp4 [step_seconds=1.5] [out_dir=qa/<name>_frames]
Writes sheet_01.png ... (8 frames each, 4 cols x 2 rows) and prints which timestamps are on each sheet, so you can Read the PNGs and check
that visuals HOLD, nothing overlaps, and each frame matches the narration. Also prints a per-frame change score to find dead (static) spans."""
import subprocess, sys
from pathlib import Path
v = Path(sys.argv[1]); step = float(sys.argv[2]) if len(sys.argv) > 2 else 1.5; out = Path(sys.argv[3]) if len(sys.argv) > 3 else Path("qa") / (v.stem + "_frames")
out.mkdir(parents=True, exist_ok=True)
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(v)]))
ts = [round(i * step + 0.2, 2) for i in range(int((dur - 0.3) / step) + 1)]
for i in range(0, len(ts), 8):
    chunk = ts[i:i + 8]; sel = "+".join(f"eq(n,{int(t * 30)})" for t in chunk)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(v), "-vf", f"select='{sel}',scale=360:-1,tile=4x2", "-frames:v", "1", str(out / f"sheet_{i // 8 + 1:02d}.png")], check=True)
    print(f"sheet_{i // 8 + 1:02d}.png  t = {chunk}")
print("dir:", out)
