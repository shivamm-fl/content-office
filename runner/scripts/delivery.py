"""Does a built reel reach the owner? (the "Full gate" step of office-studio.yml and report_final.py use it)

    python3 -I runner/scripts/delivery.py <verify.json>      prints and writes  deliver=true|false  to $GITHUB_OUTPUT

The owner reviews every reel before anything is posted, so the automatic gate only stops a reel that is really broken: a file is missing,
the video is not 1080x1920 h264, it has no audio, its length is outside 20 to 180 seconds, its frames do not change, or the video is not the one made from the reel's files (a restored old video after a change that was never rendered), or the narration is not the owner's locked script (his words were changed). Everything else the
gate checks (the independent mute test, layout, hook score, term count, caption lint, loudness, bookkeeping, a fact finding) is shown to
the owner as a note on the reel and never keeps it from them (owner decision 2026-10-18: no failing on things that do not matter).
"""
import json
import os
import re
import sys
from pathlib import Path

HARD = [re.compile(p) for p in (r"^state entry", r"^files exist", r"^video 1080x1920", r"^audio aac", r"^length \d+-\d+ s$", r"^frames change over time", r"^video matches the composition", r"^narration is the owner's locked script")]


def checks(verify: dict) -> list[dict]:
    return [c for c in verify.get("checks", []) if isinstance(c, dict)]


def broken(verify: dict) -> list[dict]:
    """The failed checks that make the reel unusable; with no gate report at all, the missing report itself."""
    if not checks(verify):
        return [{"name": "gate report", "ok": False, "detail": str(verify.get("why") or "no gate report")}]
    return [c for c in checks(verify) if not c.get("ok") and any(p.match(str(c.get("name", ""))) for p in HARD)]


def notes(verify: dict) -> list[str]:
    """Every failed check, as a line for the owner (they are advice, not a verdict). A review that never ran is not a finding, so it is left out."""
    return [f"{c.get('name')}: {str(c.get('detail', ''))[:160]}" for c in checks(verify)
            if not c.get("ok") and not str(c.get("detail", "")).startswith(("no review yet", "no fact check yet"))]


def deliver(verify: dict) -> bool:
    return not broken(verify)


def main() -> None:
    try:
        verify = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    except (IndexError, OSError, ValueError):
        verify = {}
    ok = deliver(verify)
    line = f"deliver={'true' if ok else 'false'}"
    if os.environ.get("GITHUB_OUTPUT"):
        with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as fh:
            fh.write(line + "\n")
    print(line, "| broken:", [c["name"] for c in broken(verify)], "| notes:", len(notes(verify)))


if __name__ == "__main__":
    main()
