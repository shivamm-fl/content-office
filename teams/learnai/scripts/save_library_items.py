"""Save finished learnai reels in the Office private Saved reels library (KV), then write the staging manifest.
  python scripts/save_library_items.py <out_dir> <items.json>   items: [{"id","folder","title","duration_s","track"}]
No approval, schedule or post (company rule 1). Mirrors tools/save_daily_office_20261102.py. Replaces only a version this tool delivered (office-delivery.json)."""
import concurrent.futures, hashlib, json, os, subprocess, sys, time
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]; TEAM = "learnai"; T = ROOT / "teams" / TEAM
NS = "99c28111858b4e5fbbeae1b6b663211a"; WR = ROOT / "apps/api/node_modules/wrangler/bin/wrangler.js"
OUT = Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)
ITEMS = json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))
def digest(b): return hashlib.sha256(b).hexdigest()
def kv(*args, missing=False):
    r = subprocess.run(["node", str(WR), "kv", *args, "--namespace-id", NS, "--remote"], cwd=ROOT / "apps/api", env=dict(os.environ, CI="true", NO_COLOR="1"), capture_output=True)
    if r.returncode:
        if missing and b"404: Not Found" in r.stderr: return b""
        raise RuntimeError(r.stderr.decode(errors="replace")[-800:])
    return r.stdout
def manifest():
    raw = kv("key", "get", f"reel-library/{TEAM}/manifest.json", missing=True)
    if not raw: return {"v": 1, "team": TEAM, "items": []}
    d = json.loads(raw); assert isinstance(d.get("items"), list); return d

own, assets = [], []
for it in ITEMS:
    video = T / "reels" / f"{it['folder']}_hi.mp4"; cover = T / "brand/covers" / f"{it['folder']}.png"
    caption = (T / "social" / f"{it['folder']}.hi.caption.txt").read_text(encoding="utf-8")
    youtube = (T / "social" / f"{it['folder']}.youtube.txt").read_text(encoding="utf-8")
    vh, ch = digest(video.read_bytes()), digest(cover.read_bytes())
    version = digest((vh + ch + caption + youtube).encode())[:16]
    assert video.stat().st_size < 25 * 1024 * 1024 and cover.stat().st_size < 25 * 1024 * 1024
    own.append(dict(item=it["id"], title=it["title"], track=it.get("track", "generic"), folder=it["folder"], version=version, duration_s=it["duration_s"],
                    caption=caption, youtube=youtube, video_sha256=vh, cover_sha256=ch, saved_at=datetime.now(timezone.utc).isoformat(),
                    production_date_ist=datetime.now(timezone(timedelta(hours=5, minutes=30))).date().isoformat(), owner_approved=False, published=False,
                    review_scope="Rendered on GitHub runner; full decode, frame sheets and cover inspected; facts from fetched primary pages. No human listening claimed."))
    for kind, path, sha in (("video", video, vh), ("cover", cover, ch)):
        assets.append(dict(key=f"reel-library/{TEAM}/{it['id']}/{version}/{'video.mp4' if kind == 'video' else 'cover.png'}", path=path, sha=sha, item=it["id"], kind=kind))

before = manifest(); (OUT / f"{TEAM}-library-backup.json").write_text(json.dumps(before, ensure_ascii=False, indent=2), encoding="utf-8")
ids = {x["item"] for x in own}
for old in [x for x in before["items"] if x["item"] in ids]:
    # replace only our own earlier delivery of this item (its office-delivery.json names that exact version)
    new = next(x for x in own if x["item"] == old["item"]); rec = T / "reels" / new["folder"] / "office-delivery.json"
    assert rec.exists() and json.loads(rec.read_text())["version"] == old["version"], f"{old['item']}: existing version is not ours; refusing to replace"
    assert not old.get("owner_approved") and not old.get("published"), f"{old['item']}: already approved or published"
    (OUT / f"{TEAM}-{old['item']}-{old['version']}-previous.json").write_text(json.dumps(old, ensure_ascii=False, indent=2), encoding="utf-8")
    print("REPLACING_OWN", old["item"], old["version"], "->", new["version"], flush=True)

def put(a):
    remote = kv("key", "get", a["key"], missing=True)
    if remote: assert digest(remote) == a["sha"], "immutable asset mismatch"
    else:
        kv("key", "put", a["key"], "--path", str(a["path"]))
        for _ in range(20):
            remote = kv("key", "get", a["key"], missing=True)
            if remote and digest(remote) == a["sha"]: break
            time.sleep(3)
    assert digest(remote) == a["sha"]; print("REMOTE_BYTES_VERIFIED", a["item"], a["kind"], flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool: list(pool.map(put, assets))

latest = manifest(); combined = dict(latest, items=[x for x in latest["items"] if x["item"] not in ids] + own)
f = OUT / f"{TEAM}-library-delivered.json"; f.write_text(json.dumps(combined, ensure_ascii=False, indent=2), encoding="utf-8")
kv("key", "put", f"reel-library/{TEAM}/manifest.json", "--path", str(f))
for _ in range(20):
    if manifest() == combined: break
    time.sleep(3)
else: raise RuntimeError("manifest not visible after the wait")
print("MANIFEST_VERIFIED", len(before["items"]), "->", len(combined["items"]), "items", flush=True)

stage = dict(team=TEAM, items=[{k: x[k] for k in ("item", "folder", "version", "title", "track", "duration_s", "caption", "youtube", "video_sha256", "cover_sha256")} for x in own])
(OUT / "stage-manifest.json").write_text(json.dumps(stage, ensure_ascii=False, indent=2), encoding="utf-8")
for x in own:
    rec = dict(team=TEAM, item=x["item"], version=x["version"], remote_verified=True, video_sha256=x["video_sha256"], cover_sha256=x["cover_sha256"],
               location=f"{TEAM} floor / Calendar / Saved reels", owner_approval="pending", published=False, scheduled=False, prior_unrelated_items_preserved=True)
    (T / "reels" / x["folder"] / "office-delivery.json").write_text(json.dumps(rec, indent=2), encoding="utf-8")
    print("SAVED", x["item"], x["version"], flush=True)
