"""Run a long render without blocking a tool call (CI builds: one tool call may not exceed ~10 min, a render takes ~11 min on a 2-core runner).
  python scripts/render_job.py start reels/r08_xxx          # starts scripts/render_reel.py detached, returns at once
  python scripts/render_job.py wait  [--max 540]            # blocks up to --max seconds; prints RUNNING (call again) or DONE ok / DONE FAILED + log tail
Single job per workspace (state in qa/render_job.json). Never use background tool calls for this: a headless session ends when the model stops calling tools."""
import argparse, json, os, subprocess, sys, time
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
JOB = ROOT / "qa" / "render_job.json"; LOG = ROOT / "qa" / "render_job.log"

def alive(pid):
    if os.name == "nt":  # os.kill(pid, 0) would TERMINATE the process on Windows
        out = subprocess.run(["tasklist", "/FI", f"PID eq {pid}", "/NH"], capture_output=True, text=True).stdout
        return str(pid) in out
    try: os.kill(pid, 0); return True
    except OSError: return False

a = argparse.ArgumentParser(); a.add_argument("cmd", choices=["start", "wait"]); a.add_argument("folder", nargs="?"); a.add_argument("--max", type=int, default=540); a = a.parse_args()
if a.cmd == "start":
    folder = Path(a.folder); name = folder.name; JOB.parent.mkdir(exist_ok=True)
    py = ROOT / ".venv" / ("Scripts/python.exe" if os.name == "nt" else "bin/python"); py = str(py if py.exists() else sys.executable)
    with open(LOG, "w") as lg:
        p = subprocess.Popen([py, str(ROOT / "scripts/render_reel.py"), str(folder), str(ROOT / "reels" / name), "hi"], cwd=str(ROOT), stdout=lg, stderr=subprocess.STDOUT, start_new_session=True)
    JOB.write_text(json.dumps({"pid": p.pid, "folder": str(folder), "started": time.time(), "mp4": str(ROOT / "reels" / f"{name}_hi.mp4")}))
    print(f"started render pid {p.pid}; now call: python scripts/render_job.py wait"); sys.exit(0)
if not JOB.exists(): sys.exit("no render job; run start first")
j = json.loads(JOB.read_text()); t0 = time.time()
while alive(j["pid"]) and time.time() - t0 < a.max: time.sleep(5)
if alive(j["pid"]): print(f"RUNNING for {int(time.time() - j['started'])} s; call wait again"); sys.exit(0)
tail = "\n".join(LOG.read_text(errors="ignore").splitlines()[-6:]) if LOG.exists() else ""
ok = Path(j["mp4"]).exists() and Path(j["mp4"]).stat().st_mtime >= j["started"]
print("DONE ok" if ok else "DONE FAILED", "->", j["mp4"]); print(tail)
sys.exit(0 if ok else 1)
