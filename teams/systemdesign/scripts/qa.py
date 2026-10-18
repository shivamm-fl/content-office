"""QA a rendered video: duration/size/fps, loudness, sample frames. Usage: python scripts/qa.py video.mp4 [--expect-seconds 30] [--size 1080x1920]"""
import argparse, json, re, subprocess, sys
from pathlib import Path
a = argparse.ArgumentParser(); a.add_argument("video"); a.add_argument("--expect-seconds", type=float); a.add_argument("--size"); a.add_argument("--frames", type=int, default=10)
a = a.parse_args(); v = Path(a.video); ok = True
pr = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_format", "-show_streams", "-of", "json", str(v)]))
vs = next(s for s in pr["streams"] if s["codec_type"] == "video"); dur = float(pr["format"]["duration"])
print(f"duration {dur:.2f}s  {vs['width']}x{vs['height']}  fps {vs['r_frame_rate']}  audio {any(s['codec_type']=='audio' for s in pr['streams'])}")
if a.expect_seconds and abs(dur - a.expect_seconds) > 0.5: ok = False; print("FAIL duration")
if a.size and a.size != f"{vs['width']}x{vs['height']}": ok = False; print("FAIL size")
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(v), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
lufs = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", r)[-1]); tp = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r)[-1])
print(f"loudness {lufs} LUFS (target -16..-13)  true-peak {tp} dBTP (<= -1)")
if not -17 <= lufs <= -12: ok = False; print("FAIL loudness")
if tp > -1: ok = False; print("FAIL peak")
out = Path("qa") / v.stem; out.mkdir(parents=True, exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(v), "-vf", f"fps={a.frames}/{dur},scale=360:-1", str(out / "f%02d.png")], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(v), "-vf", f"fps={a.frames}/{dur},scale=360:-1,tile={a.frames}x1", "-frames:v", "1", str(out / "sheet.png")], check=True)
print("frames ->", out, "| view sheet.png: captions readable, no Devanagari tofu, code == code/*.py")
sys.exit(0 if ok else 1)
