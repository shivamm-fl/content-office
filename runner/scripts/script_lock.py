"""The owner's own script is locked: the narration of the reel must be his words, not a rewrite.

    python3 runner/scripts/script_lock.py <team_dir> <item_id>      prints the verdict, exit 1 when the narration differs

A queue item with "script_locked": true points at its script (state/scripts/<id>.txt, the owner's text as he gave it, in the
`A: line | line || line` form). The gate (scripts/ci_verify_reel.py, "narration is the owner's locked script") compares the words of the
reel's spec.json copy with that file. Pauses (| ||), the @hook/@emph markers, punctuation and the {spoken} pronunciation hints may differ; a word
may not. Why: on 2026-10-20 a Producer re-saved the owner's script with additions, and a rework later swapped it for the scriptwriter's draft.
"""
import json
import re
import sys
import unicodedata
from pathlib import Path


def words(text: str) -> list[str]:
    text = unicodedata.normalize("NFC", text)
    text = re.sub(r"\{[^}]*\}", " ", text)               # 133{one-thirty-three}: the hint after the number is how it is said, not what is shown
    text = re.sub(r"@\w+", " ", text).replace("|", " ")
    text = re.sub(r"[।,.!?:;\"“”'‘’…\-–—()\[\]]", " ", text)
    return text.lower().split()


def script_words(script_text: str) -> list[str]:
    """The words of a state/scripts/<id>.txt: one `A: ...` line per scene, the scene letter is not a word."""
    out: list[str] = []
    for line in script_text.splitlines():
        m = re.match(r"^\s*[A-Z]:\s?(.*)$", line)
        out += words(m.group(1) if m else line)
    return out


def spec_words(spec: dict) -> list[str]:
    copy = (spec.get("copy") or {}).get("hi") or {}
    order = [k for k in (spec.get("scenes") or []) if k in copy] or list(copy)
    out: list[str] = []
    for k in order:
        out += words(str(copy[k]))
    return out


def compare(script_text: str, spec: dict) -> tuple[bool, str]:
    want, got = script_words(script_text), spec_words(spec)
    if want == got:
        return True, f"{len(got)} words, the owner's wording"
    n = next((i for i, (a, b) in enumerate(zip(want, got)) if a != b), min(len(want), len(got)))
    ctx = lambda ws: " ".join(ws[max(0, n - 3):n + 5])  # noqa: E731
    return False, f"the owner's script has {len(want)} words, the reel {len(got)}; first difference at word {n + 1}: script '{ctx(want)}' / reel '{ctx(got)}'"


def locked_script(team_dir: Path, item_id: str) -> tuple[bool, str | None]:
    """(is the item locked, the script text or None when its file is missing)."""
    try:
        items = json.loads((team_dir / "state/queue.json").read_text(encoding="utf-8")).get("items", [])
    except (OSError, ValueError):
        return False, None
    item = next((i for i in items if isinstance(i, dict) and i.get("id") == item_id), None)
    if not item or item.get("script_locked") is not True:
        return False, None
    f = team_dir / (item.get("script_file") or f"state/scripts/{item_id}.txt")
    try:
        return True, f.read_text(encoding="utf-8")
    except OSError:
        return True, None


def main() -> int:
    team_dir, item_id = Path(sys.argv[1]), sys.argv[2]
    locked, text = locked_script(team_dir, item_id)
    if not locked:
        print(f"{item_id}: not locked")
        return 0
    if text is None:
        print(f"{item_id}: locked, but its script file is missing")
        return 1
    entry = json.loads((team_dir / "state/phase5_status.json").read_text(encoding="utf-8")).get(item_id, {})
    spec = json.loads((team_dir / entry["folder"] / "spec.json").read_text(encoding="utf-8"))
    ok, detail = compare(text, spec)
    print(("ok: " if ok else "DIFFERENT: ") + detail)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
