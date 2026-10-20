"""Self-test of runner/scripts/script_lock.py:  python3 runner/scripts/test_script_lock.py"""
import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import script_lock as L

failures = []


def check(name, cond, detail=""):
    print(("ok   " if cond else "FAIL ") + name + (("  " + str(detail)) if not cond else ""))
    if not cond:
        failures.append(name)


SCRIPT = (
    "A: @hook एक AI model का training error zero है, | फिर भी नए questions पर उसकी गलती 133{one-thirty-three} है! || ये intelligent है?\n"
    "B: याद करो, exam से पहले solved examples रटने वाला student। || वही questions आए, तो full marks!\n"
)
spec = {"scenes": ["A", "B"], "copy": {"hi": {
    "A": "@hook एक AI model का training error zero है, | फिर भी नए questions पर उसकी गलती 133{one-hundred-thirty-three} है! || ये intelligent है?",
    "B": "याद करो, exam से पहले solved examples रटने वाला student। || वही questions आए, तो full marks!"}}}
check("the same wording passes, pronunciation hints may differ", L.compare(SCRIPT, spec)[0])

pauses = json.loads(json.dumps(spec))
pauses["copy"]["hi"]["B"] = "याद करो, | exam से पहले | solved examples रटने वाला student। | वही questions आए तो full marks"
check("other pauses and punctuation pass", L.compare(SCRIPT, pauses)[0])

added = json.loads(json.dumps(spec))
added["copy"]["hi"]["B"] = "मान लो याद करो, exam से पहले solved examples रटने वाला student। || वही questions आए, तो full marks!"
ok, detail = L.compare(SCRIPT, added)
check("an added word fails and the detail shows where", not ok and "first difference at word" in detail and "मान" in detail, detail)

swapped = json.loads(json.dumps(spec))
swapped["copy"]["hi"]["A"] = swapped["copy"]["hi"]["A"].replace("System", "x").replace("zero है", "शून्य है")
check("a swapped word fails", not L.compare(SCRIPT, swapped)[0])

other = {"scenes": ["A"], "copy": {"hi": {"A": "@hook Overfitting क्या होता है? || सोचो एक student ने 10{ten} solved examples के answers रट लिए।"}}}
check("a different script (the scriptwriter's draft) fails", not L.compare(SCRIPT, other)[0])

d = Path(tempfile.mkdtemp())
(d / "state/scripts").mkdir(parents=True)
(d / "state/scripts/q1.txt").write_text(SCRIPT, encoding="utf-8")
(d / "state/queue.json").write_text(json.dumps({"items": [
    {"id": "q1", "script_locked": True, "script_file": "state/scripts/q1.txt"}, {"id": "q2"}, {"id": "q3", "script_locked": True}]}), encoding="utf-8")
check("a locked item gives its script", L.locked_script(d, "q1") == (True, SCRIPT))
check("an item without the flag is not locked", L.locked_script(d, "q2") == (False, None))
check("a locked item whose file is missing says so", L.locked_script(d, "q3") == (True, None))
check("an unknown item is not locked", L.locked_script(d, "q9") == (False, None))

print("\nall passed" if not failures else f"\n{len(failures)} FAILED: {failures}")
sys.exit(1 if failures else 0)
