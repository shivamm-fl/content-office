"""Self-test of teams/<floor>/scripts/lint_script.py:  python3 runner/scripts/test_lint_script.py

What an interviewer says and what the owner writes must not FAIL: a request ("difference batao") is a valid interviewer prompt without a question mark,
a script organised by named parts needs no numbered steps, a closing that asks for a comment passes without a follow line."""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
failures = []


def check(name, cond, detail=""):
    print(("ok   " if cond else "FAIL ") + name + (("  " + str(detail)) if not cond else ""))
    if not cond:
        failures.append(name)


def lint(team, copy, hook_type):
    spec = {"hook_type": hook_type, "copy": {"hi": copy}}
    with tempfile.TemporaryDirectory() as d:
        p = Path(d) / "spec.json"
        p.write_text(json.dumps(spec, ensure_ascii=False), encoding="utf-8")
        r = subprocess.run([sys.executable, "-X", "utf8", str(ROOT / "teams" / team / "scripts" / "lint_script.py"), str(p)], capture_output=True, text=True, encoding="utf-8")
    return r.returncode, r.stdout


OWNER = {
    "A": "@hook Interviewer ने पूछा: | LLM में Temperature, Top-K और Top-P का difference बताओ. || भाई, तीनों AI को next word choose करने में help करते हैं... | पर तीनों का काम अलग है!",
    "B": "Top-K बोलता है: | सिर्फ़ top 3{three} probable words रखो. || Top-P fixed number नहीं देखता. || Temperature का काम अलग है!",
    "C": "अब बताओ: | temperature बढ़ाने से नमकीन word delete होगा या उसका relative chance बढ़ सकता है? || Comment करो!",
}
QUESTION = dict(OWNER, A="@hook Interviewer ने पूछा: | Temperature, Top-K और Top-P में क्या फ़र्क है? || भाई, तीनों का काम अलग है, पर कैसे?")
NO_COMMENT = dict(OWNER, C="अब बताओ: | temperature बढ़ाने से नमकीन word का chance बढ़ेगा या घटेगा।")

for team in ("learnai", "dsa", "systemdesign"):
    code, out = lint(team, OWNER, "interviewer_asked")
    check(f"{team}: an interviewer's request without a question mark does not FAIL", code == 0 and "FAIL" not in out, out[-400:])
    check(f"{team}: no numbered steps is advice (WARN), not a FAIL", "WARN  has numbered steps or at least three clear parts" in out and "FAIL" not in out)
    code, out = lint(team, QUESTION, "interviewer_asked")
    check(f"{team}: a question still passes", code == 0 and "FAIL" not in out, out[-300:])
    code, out = lint(team, NO_COMMENT, "interviewer_asked")
    check(f"{team}: a closing with no comment ask still fails", code != 0 and "FAIL  closing asks the viewer to comment" in out)
    code, out = lint(team, dict(OWNER, A="@hook Interviewer ने पूछा: | बताओ। || भाई, तीनों अलग हैं।"), "interviewer_asked")
    check(f"{team}: a fragment as the interviewer's line still fails", code != 0 and "FAIL  the question or request after the opener" in out, out[-300:])

print("\nall passed" if not failures else f"\n{len(failures)} FAILED: {failures}")
sys.exit(1 if failures else 0)
