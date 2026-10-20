"""Build a reel's Instagram cover from the template and render it to brand/covers/<folder>.png (1080x1920).
  python scripts/render_cover.py <folder> "AI ENGINEER ROADMAP" "How Does an LLM <em>Write Answers?</em>"
The template (brand/covers/_template) is: a filled gold pill with the category only (no item number, owner decision 2026-10-16), a centred headline whose key words are gold, the LearnAI robot Bit, the handle.
Wrap the key words of the headline in <em></em>; without it the last one to three words get it. A trailing item number in the pill text (" · 03", " - 3") is removed automatically.
A series cover (folder a047_slug is Day 47 of 150, or --day N --of 150) uses brand/covers/_template_series: pill, headline, the DAY NNN / 150 counter with its progress bar, the handle, no mascot.
An interview cover (folder q105_slug is question 001: the series counts from its first reel under the ladder, so the number is the id minus 104; q101 to q104 keep the old cover; or --count N) uses brand/covers/_template_interview: pill, headline, QUESTION with the number, the handle, no mascot, no total and no bar
(the interview series has no end; owner 2026-10-20). A variant of a reel for a trial test shows the number of the question it repeats: --count 1 on folder q107_slug_b.
Options: --template <dir> to use another template folder (tests). Clean English only: no Hindi, no emoji."""
import argparse
import html
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# the interview series is counted from its first reel under the ladder (roadmap/interview-series-draft.json): q105 is question 001 (owner, 2026-10-20)
INTERVIEW_COUNT_OFFSET = 104


def headline_html(text):
    text = text.strip()
    if "<em>" not in text:
        words = text.split()
        k = 1 if len(words) < 3 else min(3, max(1, round(len(words) * 0.4)))
        while k > 1 and words[-k].lower().strip("?:,.") in ("a", "an", "the", "is", "of", "to", "in", "and", "or", "vs", "does", "do"):
            k -= 1   # the gold span never starts with a filler word
        text = " ".join(words[:-k]) + (" " if len(words) > k else "") + "<em>" + " ".join(words[-k:]) + "</em>"
    parts = re.split(r"(</?em>)", text)
    return "".join(p if p in ("<em>", "</em>") else html.escape(p, quote=False) for p in parts)


def main():
    a = argparse.ArgumentParser()
    a.add_argument("folder")
    a.add_argument("pill")
    a.add_argument("headline")
    a.add_argument("--template", default=None)
    a.add_argument("--day", type=int, default=None, help="series cover: the day (1..of); default: the number in a folder named a047_slug")
    a.add_argument("--of", type=int, default=150, help="length of the series")
    a.add_argument("--count", type=int, default=None, help="interview cover: the question number; default: the id number minus 104 for a folder named q105_slug (the series has no end, so no total)")
    a = a.parse_args()
    if a.day is None:
        m = re.match(r"a(\d{2,4})(?:_|$)", a.folder)
        a.day = int(m.group(1)) if m else None
    series = a.day is not None
    if not series and a.count is None:
        m = re.match(r"q(\d{2,4})(?:_|$)", a.folder)
        a.count = int(m.group(1)) - INTERVIEW_COUNT_OFFSET if m and int(m.group(1)) > INTERVIEW_COUNT_OFFSET else None   # q101 to q104 are older than the ladder: old cover
    interview = not series and a.count is not None
    if series and not 1 <= a.day <= a.of:
        sys.exit("--day must be between 1 and --of")
    tpl = Path(a.template) if a.template else ROOT / "brand" / "covers" / ("_template_series" if series else "_template_interview" if interview else "_template")
    cover = ROOT / "brand" / "covers" / a.folder
    if not (tpl / "index.html").exists():
        sys.exit(f"template not found: {tpl}")
    cover.mkdir(parents=True, exist_ok=True)
    for f in tpl.iterdir():   # fonts, hyperframes.json, package.json, avatar.png, README.md (index.html is written below)
        if f.name in ("index.html", "snapshots"):
            continue
        dst = cover / f.name
        if f.is_dir():
            shutil.copytree(f, dst, dirs_exist_ok=True)
        else:
            shutil.copy2(f, dst)
    s = (tpl / "index.html").read_text(encoding="utf-8")
    pill_text = re.sub(r"\s*[·•\-–]\s*\d{1,3}\s*$", "", a.pill.strip())   # owner 2026-10-16: no item number on the cover
    pill = html.escape(pill_text, quote=False).replace("·", "&middot;")
    s, n1 = re.subn(r'(<div id="pill">)[^<]*(</div>)', lambda m: m.group(1) + pill + m.group(2), s)
    s, n2 = re.subn(r'(<div id="headline"><div>).*?(</div></div>)', lambda m: m.group(1) + headline_html(a.headline) + m.group(2), s, flags=re.S)
    if n1 != 1 or n2 != 1:
        sys.exit("the template must contain <div id=\"pill\">..</div> and <div id=\"headline\"><div>..</div></div>")
    if series:
        s, n3 = re.subn(r'(<div id="daynum">)[^<]*(</div>)', lambda m: m.group(1) + f"{a.day:03d}" + m.group(2), s)
        s, n4 = re.subn(r'(<div id="dayof">)[^<]*(</div>)', lambda m: m.group(1) + f"/ {a.of}" + m.group(2), s)
        s, n5 = re.subn(r'(<div id="fill" style="width:)[^"]*(")', lambda m: m.group(1) + f"{100 * a.day / a.of:.2f}%" + m.group(2), s)
        if (n3, n4, n5) != (1, 1, 1):
            sys.exit('the series template must contain <div id="daynum">, <div id="dayof"> and <div id="fill" style="width:..">')
    if interview:
        s, n6 = re.subn(r'(<div id="qnum">)[^<]*(</div>)', lambda m: m.group(1) + f"{a.count:03d}" + m.group(2), s)
        if n6 != 1:
            sys.exit('the interview template must contain <div id="qnum">..</div>')
    with open(cover / "index.html", "w", encoding="utf-8", newline="\n") as fh:
        fh.write(s)
    npx = shutil.which("npx") or shutil.which("npx.cmd")
    snap = cover / "snapshots"
    shutil.rmtree(snap, ignore_errors=True)
    r = subprocess.run([npx, "--yes", "hyperframes@0.8.149", "snapshot", str(cover), "--at", "0", "--no-end", "--describe", "false"], cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace")
    pngs = sorted(snap.glob("frame-*.png"), key=lambda p: p.stat().st_mtime)
    if not pngs:
        sys.exit("snapshot produced no PNG: " + (r.stdout + r.stderr)[-300:])
    out = ROOT / "brand" / "covers" / f"{a.folder}.png"
    shutil.copy2(pngs[-1], out)
    print("saved", out)


if __name__ == "__main__":
    main()
