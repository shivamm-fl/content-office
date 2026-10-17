"""One-command setup on a new machine (macOS / Windows / Linux). Safe to re-run.
    python scripts/setup.py          # install/verify everything
    python scripts/setup.py --check  # only report what is missing
Needs: Node 22+, ffmpeg, Google Chrome, Python 3.10+ (uv recommended), internet (Edge TTS). whisper.cpp only with --with-whisper.
"""
import os, platform, shutil, subprocess, sys, urllib.request
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent; os.chdir(ROOT)
CHECK = "--check" in sys.argv; OS = platform.system()  # Darwin / Windows / Linux
VENV_PY = ROOT / ".venv" / ("Scripts/python.exe" if OS == "Windows" else "bin/python")
MODEL = ROOT / ".models" / "ggml-small.bin"; MODEL_URL = "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin"
problems = []
def say(s): print(s, flush=True)
def run(cmd, **k): say("$ " + " ".join(map(str, cmd))); return subprocess.run(cmd, check=True, **k)
def need(name, ok, fix):
    say(("  ok      " if ok else "  MISSING ") + name)
    if not ok: problems.append(f"{name}: {fix}")

say("== 1. system tools")
node_ok = False
if shutil.which("node"):
    v = subprocess.check_output(["node", "-v"], text=True).strip(); node_ok = int(v.lstrip("v").split(".")[0]) >= 22; say(f"  node {v}")
need("Node 22+", node_ok, {"Darwin": "brew install node", "Windows": "winget install OpenJS.NodeJS", "Linux": "install Node 22 (nvm)"}[OS])
need("ffmpeg + ffprobe", bool(shutil.which("ffmpeg") and shutil.which("ffprobe")), {"Darwin": "brew install ffmpeg", "Windows": "winget install Gyan.FFmpeg", "Linux": "apt install ffmpeg"}[OS])
chrome = {"Darwin": ["/Applications/Google Chrome.app"], "Windows": [r"C:\Program Files\Google\Chrome\Application\chrome.exe", r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"], "Linux": ["/usr/bin/google-chrome", "/usr/bin/chromium"]}[OS]
need("Google Chrome", any(Path(p).exists() for p in chrome) or bool(shutil.which("google-chrome")), "install Chrome (HyperFrames renders with it)")
WHISPER = "--with-whisper" in sys.argv   # only needed to RE-build the 2 legacy reels (ElevenLabs/whisper timing). New Hindi reels use Edge TTS word timings.
if WHISPER: need("whisper.cpp (whisper-cli)", bool(shutil.which("whisper-cli") or shutil.which("whisper-cpp")),
     {"Darwin": "brew install whisper-cpp", "Windows": "download whisper-cli.exe from github.com/ggerganov/whisper.cpp/releases and put it on PATH (or use WSL2)", "Linux": "build whisper.cpp, put whisper-cli on PATH"}[OS])
have_uv = bool(shutil.which("uv"))
say(f"  uv: {'yes' if have_uv else 'no (will use python -m venv; install uv for Python 3.12: https://docs.astral.sh/uv)'}")
if problems and (CHECK or any(("Node" in p or "ffmpeg" in p) for p in problems)):
    say("\nMissing tools (install, then re-run):"); [say("  - " + p) for p in problems]; sys.exit(1)
if CHECK: say("\nAll system tools present."); sys.exit(0)

say("\n== 2. python venv (.venv)")
if not VENV_PY.exists():
    if have_uv: run(["uv", "venv", "--python", "3.12", ".venv"])
    else: run([sys.executable, "-m", "venv", ".venv"])
if have_uv: run(["uv", "pip", "install", "--python", str(VENV_PY), "-r", "requirements.txt"])
else: run([str(VENV_PY), "-m", "pip", "install", "-r", "requirements.txt"])

say("\n== 3. whisper model (optional, 465 MB; only with --with-whisper)")
if WHISPER:
    if not MODEL.exists():
        MODEL.parent.mkdir(exist_ok=True); say(f"  downloading {MODEL_URL}")
        urllib.request.urlretrieve(MODEL_URL, MODEL)
    say(f"  {MODEL} {MODEL.stat().st_size // 2**20} MB")
else: say("  skipped (not needed for Edge-TTS reels)")

say("\n== 4. HyperFrames skills for Claude Code (.agents/skills)")
if not (ROOT / ".agents" / "skills").exists() and shutil.which("npx"):
    run([shutil.which("npx"), "--yes", "skills", "add", "heygen-com/hyperframes", "--yes"])
else: say("  already installed")

say("\n== 5. secrets")
env = ROOT / ".env"
if not env.exists(): shutil.copy(ROOT / ".env.example", env); say("  created .env from .env.example (ELEVENLABS_API_KEY is OPTIONAL now: only legacy reels 1-2 used it; new reels use free Edge TTS)")
elif "ELEVENLABS_API_KEY=" in env.read_text() and not any(l.split("=", 1)[1].strip() for l in env.read_text().splitlines() if l.startswith("ELEVENLABS_API_KEY=")): say("  .env exists but ELEVENLABS_API_KEY is empty")
else: say("  .env ok")

say("\n== 6. HyperFrames doctor")
subprocess.run([shutil.which("npx"), "--yes", "hyperframes", "doctor"], env={**os.environ, "HYPERFRAMES_PYTHON": str(VENV_PY)})
say("\nDone. Next: read README.md -> CLAUDE.md -> roadmap/ai-engineer.json and continue.")
