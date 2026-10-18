"""Validate state/queue.json (written by the daily planner).  python scripts/validate_queue.py   -> exit 0 ok, 1 problems.
Checks what the builder and the poster depend on: track and id prefix, a source for every claim, cover and thumbnail text in clean English within their word limits,
length 20-120 s (CLAUDE.md rule 5), and that the planner did not approve anything (qa_passed stays false until the owner releases it)."""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEAM = json.loads((ROOT / "team.json").read_text(encoding="utf-8"))
PREFIX = {tr["id"]: tr["prefix"] for tr in TEAM["tracks"]}
_cfg = json.loads((ROOT / "state/config.json").read_text(encoding="utf-8")) if (ROOT / "state/config.json").exists() else {}
FORMATS = set(_cfg.get("formats", ["finding", "concept", "question", "demo", "myth-bust", "explainer"]))
SERIES_DAYS = _cfg.get("series_days")   # a series floor: the id number is the day
HOOK_TYPES = {"direct_question", "relatable_stake", "interviewer_asked", "company_specific", "surprising_fact", "misconception_question"}   # .claude/skills/hook-writer
REQUIRED = ["id", "track", "title", "one_idea", "spoken_hook", "hook_formula", "hook_source", "example", "sources",
            "facts_to_verify", "length_target_s", "cover_headline", "thumb_text", "keywords"]

config_file = ROOT / "state/config.json"
ID_START = _cfg.get("id_start", {})
f = ROOT / "state/queue.json"
if not f.exists():
    sys.exit("missing state/queue.json")
items = json.loads(f.read_text(encoding="utf-8")).get("items", [])
status_file = ROOT / "state/phase5_status.json"
started = set(json.loads(status_file.read_text(encoding="utf-8"))) if status_file.exists() else set()   # items already built or published keep their old shape
problems, seen = [], set()
for it in items:
    rid = str(it.get("id", "?"))
    for k in REQUIRED:
        if not it.get(k):
            problems.append(f"{rid}: missing {k}")
    if rid not in started:
        vi = str(it.get("visual_idea", "")).strip()
        if len(vi.split()) < 8:
            problems.append(f"{rid}: visual_idea must describe the picture that explains the idea (at least 8 words: what is drawn and what moves)")
        elif re.match(r"(?i)^(text|words?|title|caption|slide)s?\b", vi):
            problems.append(f"{rid}: visual_idea is text on screen; describe a diagram, experiment, before/after or mechanism")
        if len(str(it.get("everyday_anchor", "")).split()) < 5:
            problems.append(f"{rid}: everyday_anchor must be a sentence about a moment from everyday life the viewer knows (or 'none: <why>')")
        if it.get("format") not in FORMATS:
            problems.append(f"{rid}: format must be one of {sorted(FORMATS)}")
    track = it.get("track")
    if track not in PREFIX:
        problems.append(f"{rid}: unknown track {track!r}")
    elif not re.fullmatch(PREFIX[track] + r"\d+", rid):
        problems.append(f"{rid}: id prefix must match track {track} ({PREFIX[track]}##)")
    elif int(rid[1:]) < ID_START.get(track, 0):
        problems.append(f"{rid}: office ids start at {PREFIX[track]}{ID_START[track]} (state/config.json id_start)")
    if SERIES_DAYS:
        day = it.get("day")
        if not isinstance(day, int) or not 1 <= day <= SERIES_DAYS:
            problems.append(f"{rid}: day must be a whole number from 1 to {SERIES_DAYS} (the day of the series)")
        elif re.fullmatch(r"[a-z]\d+", rid) and int(rid[1:]) != day:
            problems.append(f"{rid}: the id number is the day, but day is {day}")
    if rid in seen:
        problems.append(f"{rid}: duplicate id")
    seen.add(rid)
    if not (20 <= float(it.get("length_target_s") or 0) <= 120):
        problems.append(f"{rid}: length_target_s must be between 20 and 120")
    # hook-writer (owner decisions 2026-10-15 and 2026-10-16): the hook has a type; each type has its own form and none is banned
    ht = it.get("hook_type")
    sh = str(it.get("spoken_hook", ""))
    if ht is not None and ht not in HOOK_TYPES:
        problems.append(f"{rid}: hook_type must be one of {sorted(HOOK_TYPES)}")
    max_words = 20 if ht in ("interviewer_asked", "company_specific") else 10   # the opener plus a question of at most 16 words
    if len(sh.split()) > max_words:
        problems.append(f"{rid}: spoken_hook is longer than {max_words} words")
    pre = lambda t: re.match(r"\s*(@\w+\s*)?(interviewer\s*(ने|ne)\s*(पूछा|poocha|pucha)|(ai\s*)?interview\s*(में|mein)\s*(अगर|agar))", str(t), re.I)
    if ht == "relatable_stake":
        for fld in ("spoken_hook", "hook_10s"):
            if pre(it.get(fld, "")):
                problems.append(f"{rid}: {fld} opens with an interview preamble but hook_type is relatable_stake; say the stake first or set hook_type interviewer_asked (.claude/skills/hook-writer)")
    if ht == "interviewer_asked":
        if not pre(sh):
            problems.append(f"{rid}: hook_type interviewer_asked: spoken_hook must open with 'Interviewer ने पूछा:'")
        mq = re.search(r"[:：]\s*(.+?[?？])", sh, re.S)
        qw = len(mq.group(1).split()) if mq else 0
        if qw < 7 or qw > 16:
            problems.append(f"{rid}: hook_type interviewer_asked: the question after the opener must be one complete sentence of 7 to 16 words ending in '?' (found {qw}); see Question quality in .claude/skills/hook-writer")
    if ht == "direct_question" and not re.search(r"(\?|？|क्या|कैसे|क्यों|कौन)", sh):
        problems.append(f"{rid}: hook_type direct_question: spoken_hook must be a plain question about the topic")
    if ht == "company_specific":
        if not str(it.get("company", "")).strip():
            problems.append(f"{rid}: hook_type company_specific needs the field company")
        if not str(it.get("company_source", "")).startswith("http"):
            problems.append(f"{rid}: hook_type company_specific needs company_source, the URL you fetched that supports the company claim")
    if len(str(it.get("cover_headline", "")).split()) > 8:
        problems.append(f"{rid}: cover_headline is longer than 8 words")
    if len(str(it.get("thumb_text", "")).split()) > 3:
        problems.append(f"{rid}: thumb_text is longer than 3 words")
    for k in ("cover_headline", "thumb_text"):
        if not str(it.get(k, "")).isascii():
            problems.append(f"{rid}: {k} must be clean English text (no Devanagari, no emoji)")
    if it.get("status", "planned") != "planned":
        problems.append(f"{rid}: a new entry must have status planned")
    if it.get("qa_passed") is True:
        problems.append(f"{rid}: the planner must not set qa_passed (only the owner releases an item)")
    if not isinstance(it.get("sources"), list) or not all(str(s).startswith("http") for s in it.get("sources", [])):
        problems.append(f"{rid}: sources must be a list of http(s) URLs you fetched")

if problems:
    print("\n".join(problems))
    sys.exit(1)
print(f"ok: {len(items)} queue entries")
