"""Render a reel per language with the right length (patches data-duration in index.html from data.json, per language).
Usage: python scripts/render_reel.py reels/ep002_r1 out_prefix [en|hi ...]   e.g. -> reels/ep002_r1_en.mp4
Preview of the first N seconds (owner checks the look before a full render): PREVIEW_SECS=10 python scripts/render_reel.py reels/<folder> tmp/<folder>_preview hi"""
import json, os, re, subprocess, sys, shutil
from pathlib import Path

def loudness(path):
    """Narration recipe v4 finish (owner 2026-11-13): -14 LUFS integrated, true peak <= -1 dBTP, by gain and a peak limiter only (never a
    time-stretch). The video stream is copied untouched. Returns (LUFS, true peak) of the file as it is now."""
    def measure(p):
        e = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(p), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
        t = e[e.rfind("Summary:"):]
        return float(re.search(r"I:\s+(-?[\d.]+) LUFS", t).group(1)), float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", t).group(1))
    I, tp = measure(path)
    if I < -60 or (abs(I + 14) <= 0.5 and tp <= -1.0): return I, tp   # silent, or already right
    tmp, gain, lim = path.with_name(path.stem + ".loud.mp4"), -14.0 - I, 10 ** (-1.6 / 20)
    for _ in range(4):
        af = f"aresample=192000,volume={gain:.2f}dB,alimiter=limit={lim:.4f}:attack=2:release=60:level=false,aresample=48000"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(path), "-map", "0:v", "-map", "0:a", "-c:v", "copy", "-af", af, "-c:a", "aac", "-b:a", "192k",
                        "-movflags", "+faststart", str(tmp)], check=True)
        I, tp = measure(tmp)
        if abs(I + 14) <= 0.5 and tp <= -1.0: break
        if tp > -1.0: lim *= 10 ** ((-1.0 - tp - 0.2) / 20)
        gain += -14.0 - I
    os.replace(tmp, path); return I, tp
proj = Path(sys.argv[1]); prefix = sys.argv[2]
data = json.loads((proj / "data.json").read_text(encoding="utf-8")); html = proj / "index.html"
langs = sys.argv[3:] or [l for l in ("en", "hi") if l in data]
for lang in langs:
    total = min(data[lang]["total"], float(os.environ.get("PREVIEW_SECS") or 1e9)); s = html.read_text(encoding="utf-8")
    old = re.search(r'data-composition-id="main"[^>]*?data-duration="([\d.]+)"', s).group(1)
    html.write_text(s.replace(f'data-duration="{old}"', f'data-duration="{total:g}"'), encoding="utf-8")
    vars_ = proj / f"vars.{lang}.json"; out = Path(prefix + f"_{lang}.mp4").resolve()
    subprocess.run([shutil.which("npx"), "--yes", "hyperframes@0.8.149", "render", "--variables-file", vars_.name, "--strict-variables", "--quality", "delivery", "--workers", "2", "--output", str(out)], cwd=proj, check=True, stdout=subprocess.DEVNULL)
    if not os.environ.get("PREVIEW_SECS"):
        I, tp = loudness(out); print(f"loudness {I:.1f} LUFS, true peak {tp:.1f} dBTP")
    print(lang, total, "s ->", out)
