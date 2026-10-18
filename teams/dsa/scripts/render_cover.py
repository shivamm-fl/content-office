"""Build a reel's Instagram cover from the template and render it to brand/covers/<folder>.png (1080x1920).
  python scripts/render_cover.py <folder> "DSA" "How Does <em>Binary Search Work?</em>" --day 47
The template (brand/covers/_template) is: a filled pill with the category only (no item number, owner decision 2026-10-16), a centred headline whose key words take the accent colour, the DAY NNN / 150 counter with a progress bar, the handle.
Wrap the key words of the headline in <em></em>; without it the last one to three words get it. A trailing item number in the pill text (" · 03", " - 3") is removed automatically.
Options: --template <dir> to use another template folder (tests). Clean English only: no Hindi, no emoji."""
import argparse
import html
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


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
    a.add_argument("--template", default=str(ROOT / "brand" / "covers" / "_template"))
    a.add_argument("--day", type=int, default=None, help="the day of the series (1..of); default: the number in the folder name, d047_slug is Day 47")
    a.add_argument("--of", type=int, default=150, help="length of the series")
    a = a.parse_args()
    tpl = Path(a.template)
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
    if a.day is None:   # the studio tool passes only folder, pill and headline: the id number in the folder name is the day
        m = re.match(r"[a-z](\d{2,4})(?:_|$)", a.folder)
        if not m:
            sys.exit("give --day N, or name the folder <letter><day>_slug (for example d047_binary_search)")
        a.day = int(m.group(1))
    if not 1 <= a.day <= a.of:
        sys.exit("--day must be between 1 and --of")
    s, n3 = re.subn(r'(<div id="daynum">)[^<]*(</div>)', lambda m: m.group(1) + f"{a.day:03d}" + m.group(2), s)
    s, n4 = re.subn(r'(<div id="dayof">)[^<]*(</div>)', lambda m: m.group(1) + f"/ {a.of}" + m.group(2), s)
    s, n5 = re.subn(r'(<div id="fill" style="width:)[^"]*(")', lambda m: m.group(1) + f"{100 * a.day / a.of:.2f}%" + m.group(2), s)
    if (n3, n4, n5) != (1, 1, 1):
        sys.exit('the template must contain <div id="daynum">, <div id="dayof"> and <div id="fill" style="width:..">')
    if n1 != 1 or n2 != 1:
        sys.exit("the template must contain <div id=\"pill\">..</div> and <div id=\"headline\"><div>..</div></div>")
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
