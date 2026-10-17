"""Which item should the build job make next?  python scripts/next_to_build.py --track course|generic|interview [--buffer 2] [--count 1] [--json]
Items come from state/queue.json (written by the daily planner, plan-reels.yml). An item counts as started once state/phase5_status.json
has its mp4 or release assets. Prints the next item id or NONE (buffer full, or nothing planned). The buffer counts built-but-unpublished items of THAT track.
--count N prints up to N ids separated by spaces (as many as the buffer still has room for): the CI matrix (scripts/ci_build_matrix.py) uses it."""
import argparse, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PREFIX = {"course": "r", "generic": "e", "interview": "q"}
a = argparse.ArgumentParser()
a.add_argument("--track", choices=list(PREFIX), default="course")
a.add_argument("--buffer", type=int, default=2)
a.add_argument("--count", type=int, default=1)
a.add_argument("--json", action="store_true")
a = a.parse_args()
pat = re.compile(PREFIX[a.track] + r"\d+")
queue = json.loads((ROOT / "state/queue.json").read_text(encoding="utf-8")).get("items", [])
st = json.loads((ROOT / "state/phase5_status.json").read_text(encoding="utf-8"))
planned = [q["id"] for q in queue if q.get("track") == a.track and pat.fullmatch(q.get("id", "")) and q.get("status", "planned") == "planned"]
waiting = [k for k, v in st.items() if pat.fullmatch(k) and isinstance(v, dict) and not v.get("published") and (v.get("mp4") or v.get("release_assets"))]
started = {k for k, v in st.items() if isinstance(v, dict) and (v.get("mp4") or v.get("release_assets") or (v.get("status") == "build_failed" and v.get("attempts", 1) >= 2))}
todo = [i for i in planned if i not in started and (i not in st or st[i].get("status") == "build_failed")]  # office fix: a failed build is retried until attempts >= 2
ids = todo[:max(0, min(a.count, a.buffer - len(waiting)))]
nxt = ids[0] if ids else "NONE"
print(json.dumps({"next": nxt, "ids": ids, "track": a.track, "waiting": sorted(waiting), "buffer": a.buffer}) if a.json else (" ".join(ids) if ids else "NONE"))
