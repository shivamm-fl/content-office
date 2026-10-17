"""Tell the office how the studio run ended (the last step of office-studio.yml, a trusted job).

    python3 -I runner/scripts/report_final.py --team <team> --run <run_id> --item <id> --verify <verify.json> [--release <tag>]

Reads the gate report and the item's files (phase5 status, caption, YouTube text, script) and posts them with the
GitHub OIDC identity of this job. The office turns a passed gate into the owner's final approval with the video.
"""
import argparse
import json
import os
import urllib.request
from pathlib import Path


def read(p: Path, limit: int = 20000) -> str:
    try:
        return p.read_text(encoding="utf-8")[:limit]
    except OSError:
        return ""


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--team", required=True)
    ap.add_argument("--run", required=True)
    ap.add_argument("--item", required=True)
    ap.add_argument("--verify", required=True)
    ap.add_argument("--release")
    a = ap.parse_args()
    root = Path("teams") / a.team
    try:
        verify = json.loads(Path(a.verify).read_text(encoding="utf-8"))
    except (OSError, ValueError):
        verify = {"ok": False, "why": "no gate report"}
    try:
        entry = json.loads((root / "state/phase5_status.json").read_text(encoding="utf-8")).get(a.item, {})
    except (OSError, ValueError):
        entry = {}
    folder = Path(entry.get("folder") or "")
    name = folder.name
    office = os.environ.get("OFFICE_URL", "").rstrip("/")
    media = lambda f: f"{office}/media/{a.team}/{a.item}/{f}" if a.release and f else None  # noqa: E731
    cover = Path(entry.get("cover") or "").name
    thumb = f"{name}.jpg" if (root / "brand/yt_thumbs" / f"{name}.jpg").exists() else ""
    payload = {
        "team": a.team, "run_id": a.run, "item": a.item, "ok": bool(verify.get("ok")),
        "title": entry.get("title") or a.item,
        "video_url": media(Path(entry.get("mp4") or "").name), "cover_url": media(cover), "thumb_url": media(thumb),
        "caption": read(root / (entry.get("caption") or "missing")),
        "youtube": read(root / "social" / f"{name}.youtube.txt"),
        "script": read(root / folder / "script.txt") if name else "",
        "duration_s": verify.get("duration_s") or entry.get("duration_s"),
        "failed": [f"{c.get('name')}: {str(c.get('detail', ''))[:160]}" for c in verify.get("checks", []) if not c.get("ok")],
        "note": verify.get("why"),
    }
    print(json.dumps({k: v for k, v in payload.items() if k not in ("caption", "youtube", "script")}, indent=2))
    url, tok = os.environ.get("ACTIONS_ID_TOKEN_REQUEST_URL"), os.environ.get("ACTIONS_ID_TOKEN_REQUEST_TOKEN")
    if not (url and tok and office):
        print("not reporting (no OIDC or OFFICE_URL)")
        return
    req = urllib.request.Request(f"{url}&audience=content-office", headers={"Authorization": f"Bearer {tok}"})
    oidc = json.load(urllib.request.urlopen(req, timeout=20))["value"]
    req = urllib.request.Request(f"{office}/api/runner/final", data=json.dumps(payload).encode(), method="POST",
                                 headers={"Content-Type": "application/json", "Authorization": f"Bearer {oidc}"})
    print(urllib.request.urlopen(req, timeout=30).read().decode()[:200])


if __name__ == "__main__":
    main()
