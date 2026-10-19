"""Self-test of runner/scripts/delivery.py:  python3 runner/scripts/test_delivery.py"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import delivery as D

failures = []


def check(name, cond, detail=""):
    print(("ok   " if cond else "FAIL ") + name + (("  " + str(detail)) if not cond else ""))
    if not cond:
        failures.append(name)


def rep(**bad):
    names = ["state entry", "files exist", "video 1080x1920 h264 (vertical)", "audio aac present", "length 20-120 s", "length equals data.json total", "loudness -17..-12 LUFS",
             "true peak <= -1 dBTP", "hyperframes check", "caption lint (ig-caption, no FAIL)", "cover 1080x1920", "hindi-only spec", "hook (Roman caption line 1): no DEALBREAKER",
             "one idea: at most 6 technical terms", "hook_formula recorded in the state entry", "post texts are Roman Hinglish (no Devanagari in the caption and the YouTube text)",
             "visuals show the idea (lint_visuals: plan, pictures, text budget)", "visual review passed (mute test by a fresh reviewer)",
             "facts checked against the sources (no high finding)", "youtube metadata has a title and a description", "frames change over time", "video matches the composition"]
    return {"ok": not bad, "checks": [{"name": n, "ok": n not in bad.get("fail", []), "detail": "x"} for n in names]}


check("a reel that passes everything is delivered", D.deliver(rep()))
check("the mute test failing does not keep a reel from the owner", D.deliver(rep(fail=["visual review passed (mute test by a fresh reviewer)"])))
soft = ["length equals data.json total", "loudness -17..-12 LUFS", "true peak <= -1 dBTP", "hyperframes check", "caption lint (ig-caption, no FAIL)", "cover 1080x1920", "hindi-only spec",
        "hook (Roman caption line 1): no DEALBREAKER", "one idea: at most 6 technical terms", "hook_formula recorded in the state entry",
        "post texts are Roman Hinglish (no Devanagari in the caption and the YouTube text)", "visuals show the idea (lint_visuals: plan, pictures, text budget)",
        "facts checked against the sources (no high finding)", "youtube metadata has a title and a description"]
check("every judgement and bookkeeping check together still deliver", D.deliver(rep(fail=soft)))
check("the failed ones are listed as notes for the owner", len(D.notes(rep(fail=soft))) == len(soft))
for hard in ["files exist", "video 1080x1920 h264 (vertical)", "audio aac present", "length 20-120 s", "frames change over time", "state entry", "video matches the composition"]:
    check(f"a broken reel is not delivered: {hard}", not D.deliver(rep(fail=[hard])))
check("no gate report is not delivered", not D.deliver({}) and not D.deliver({"ok": False, "why": "no gate report"}))
check("a length that only differs from data.json is a note", D.deliver(rep(fail=["length equals data.json total"])))
never = rep(fail=["visual review passed (mute test by a fresh reviewer)", "facts checked against the sources (no high finding)", "cover 1080x1920"])
for c in never["checks"]:
    if c["name"].startswith("visual review"):
        c["detail"] = "no review yet: run python scripts/visual_review.py r101"
    if c["name"].startswith("facts checked"):
        c["detail"] = "no fact check yet: run python scripts/fact_review.py r101"
check("a review that never ran is not a note", D.notes(never) == ["cover 1080x1920: x"], D.notes(never))

print("\nall passed" if not failures else f"\n{len(failures)} FAILED: {failures}")
sys.exit(1 if failures else 0)
