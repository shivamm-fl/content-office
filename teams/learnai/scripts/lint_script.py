"""Lint a reel script against the owner's standard (.claude/skills/hinglish-script).
  python3 scripts/lint_script.py reels/<folder>/spec.json      # or a plain text file of the spoken script
Exit 1 on any FAIL. WARN is judgement. Words are counted after braces are resolved; 2.3 words per second is the voice rate (measured: 165 words = 70 s) (pace 1.26 with pauses)."""
import json, re, sys
from pathlib import Path

p = Path(sys.argv[1])
raw = p.read_text(encoding="utf-8")
if p.suffix == ".json":
    scenes = json.loads(raw)["copy"]["hi"]
    text = " ".join(scenes.values())
else:
    text = raw
text = re.sub(r"@\w+ ?", "", text).replace("|", " ")
spoken = re.sub(r"\S+\{([^}]*)\}", r"\1", text)          # display{spoken} -> spoken
hook = re.split(r"[।?!]", spoken.strip(), maxsplit=2)
hook_text = " ".join(hook[:2]) if len(hook) > 1 else spoken[:160]
last = spoken.strip()[-260:]
out = []
def chk(level, name, ok, detail=""):
    out.append((level if not ok else "ok", name, detail))

TRAP = r"(मत बोलना|मत बोलो|trap|गलत|नहीं|क्यों|कैसे|क्या|कौन|कब|कहाँ|\?)"
chk("FAIL", "hook names a trap or a wrong belief, or asks the real question", bool(re.search(TRAP, hook_text)), hook_text[:110])
chk("WARN", "hook is not a teaser (no 'aaj hum', 'is video mein')", not re.search(r"(आज हम|इस video में|today we)", hook_text, re.I))
# hook-writer (owner decision 2026-10-15, our skip-rate data): stake first, open loop inside the first ~10 s
first10 = " ".join(spoken.split()[:38])
# owner decisions 2026-10-15 and 2026-10-16: the hook has a TYPE (spec.json "hook_type") and each type has its own form; none is banned
HOOK_TYPES = ("direct_question", "relatable_stake", "interviewer_asked", "company_specific", "surprising_fact")
htype = (json.loads(raw).get("hook_type") or "") if p.suffix == ".json" else ""
PREAMBLE = r"\s*(Interviewer\s*(ने|ne)\s*(पूछा|poocha|pucha)|(AI\s*)?interview\s*(में|mein)\s*(अगर|agar))"
has_pre = bool(re.match(PREAMBLE, spoken, re.I))
first_sentence = re.split(r"[।!]", spoken.strip(), maxsplit=1)[0]
chk("WARN", "spec.json sets hook_type (one of " + ", ".join(HOOK_TYPES) + ")", htype != "", "")
chk("FAIL", "hook_type is a known type", htype in ("",) + HOOK_TYPES, htype)
if htype == "direct_question":
    first_q = re.split(r"(?<=\?)", spoken.strip(), maxsplit=1)[0] if "?" in spoken[:200] else first_sentence   # the first question, question mark included
    chk("FAIL", "direct_question hook: the first sentence is a plain question about the topic", bool(re.search(r"(\?|क्या|कैसे|क्यों|कौन|कब|कहाँ)", first_q)) and len(first_q.split()) <= 25, first_q[:90])
    chk("WARN", "direct_question hook: the question is at most 10 words", len(first_q.split()) <= 10, f"{len(first_q.split())} words")
elif htype in ("interviewer_asked", "company_specific"):
    if htype == "interviewer_asked":
        chk("FAIL", "interviewer_asked hook opens with 'Interviewer ने पूछा:'", has_pre, spoken[:60])
    else:
        chk("WARN", "company_specific hook names the company and its interview ('<Company> के AI interview में')", bool(re.search(r"(के|ke)\s+.{0,40}(interview|इंटरव्यू)", first_sentence[:140], re.I)), first_sentence[:90])
    mq = re.search(r"[:：]\s*(.+?\?)", spoken, re.S)
    question = re.sub(r"\s+", " ", mq.group(1)).strip() if mq else ""
    qw = len(question.split())
    chk("FAIL", "the question after the opener is there, a complete sentence ending in '?' (not a fragment or a bare concept name: 7 to 16 words)", qw >= 7, question[:90] or "no 'opener: question?' found")
    chk("WARN", "the question is one sentence of at most 16 words (hook-writer, Question quality)", qw <= 16, f"{qw} words")
    chk("FAIL", "the question is not far too long (at most 22 words)", qw <= 22, f"{qw} words")
    chk("WARN", "the question does not stack two questions ('... और ... क्यों/कैसे/क्या')", not re.search(r"(और|aur|and)\s+.{0,45}(क्यों|कैसे|क्या|कौन)", question), question[:90])
else:
    chk("FAIL" if htype == "relatable_stake" else "WARN", "relatable_stake / stake-first hook does not open with an 'Interviewer ने पूछा' preamble (that is the interviewer_asked type)", not has_pre, spoken[:60])
if htype != "direct_question": chk("WARN", "a contradiction lands in the first ~10 s ('फिर भी', 'पर', 'लेकिन', 'गलत', 'crash', 'नहीं')", bool(re.search(r"(फिर भी|लेकिन|ग़लत|गलत|crash|नहीं| पर )", first10)), first10[:90])
if htype != "direct_question": chk("WARN", "an open loop with a count in the first ~10 s ('तीन वजह', 'तीन steps', '3 fixes')", bool(re.search(r"(तीन|दो|चार|पाँच|three|two|four|five|3|4|5)\b.{0,25}(वजह|steps?|तरीके|checks?|fix|गलती|rules?|कारण)", first10, re.I)), "")
steps = len(re.findall(r"(First|Second|Third|पहले|पहला|पहली|दूसरा|दूसरे|दूसरी|तीसरा|तीसरे|तीसरी|चौथा|चौथे|step|Step)", spoken))
chk("FAIL", "has numbered or ordered steps (at least 3 markers)", steps >= 3, f"{steps} markers")
chk("WARN", "gives a cause ('क्योंकि' / 'इसलिए' / 'इसी वजह')", bool(re.search(r"(क्योंकि|इसलिए|इसी वजह|इसीलिए|kyunki)", spoken)))
chk("WARN", "names the weak baseline or a failure ('लेकिन', 'पर', 'problem', 'fail')", bool(re.search(r"(लेकिन|problem|fail|crash|गलत|expensive|zero|महँगी|slow)", spoken, re.I)))
chk("FAIL", "closing is a comment question", "?" in last, last[-100:])
chk("WARN", "closing asks for a comment and a follow, not a save (owner 2026-10-15)", bool(re.search(r"(comment|Comment|कमेंट)", last)) and bool(re.search(r"(follow|Follow|फ़ॉलो|फॉलो)", last)) and not re.search(r"(save कर|Save कर|सेव)", last))
digits = [m for m in re.findall(r"(?<![\w{-])\d[\d.,]*(?![\w}]*\})", re.sub(r"\S+\{[^}]*\}", "", text))]
chk("FAIL", "numbers are spoken in English (digits without a {spoken} brace)", not digits, ", ".join(digits[:6]))
words = len(spoken.split())
secs = words / 2.3
chk("WARN", "length 60 to 100 s (about 2.3 words per second)", 55 <= secs <= 100, f"{words} words, about {secs:.0f} s")
bad = re.findall(r"(\w+\{[^}\s-]+ [^}]*\})", text)
chk("FAIL", "no multi-word braces (said twice)", not bad, "; ".join(bad[:3]))

fails = 0
for level, name, detail in out:
    if level == "FAIL": fails += 1
    print(f"  {level:4}  {name}" + (f"  [{detail}]" if detail else ""))
print("VERDICT", "BLOCKED" if fails else "OK")
sys.exit(1 if fails else 0)
