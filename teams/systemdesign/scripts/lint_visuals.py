"""Static check of a reel's visuals, no rendering needed:  python scripts/lint_visuals.py reels/<folder>   -> exit 0 ok, 1 problems (printed).
It catches the failure that started the diagram-first rules: "motion graphics" that are only the spoken words on a dark background.
  1. visual_plan.md has one row per scene of spec.json; each picture cell is at least six words and does not start with text/words/title/caption.
  2. index.html: every scene except the first has a picture: a diagram helper called on that scene (M.map, M.flow, ... M.box, M.arrow, M.icon, M.dots, M.bars, M.beam)
     or a `// diagram: <scene>` marker above custom SVG/GSAP code. With five or more scenes one more text-only scene is allowed (a closing line).
  3. text budget: at most 3 M.slam/M.big calls in the reel, no M.pill longer than 5 words.
  4. no mirroring: an on-screen text of three or more words that is (70% or more) made of words the narration of the same scene says is a failure; at most one.
Rules and the design order: docs-notes/diagram-first-visuals.md."""
import json
import re
import sys
from pathlib import Path

DIAGRAM = ("map", "vecs", "flow", "chips", "search", "versus", "loop", "stack", "dist", "code", "plot", "heat", "box", "arrow", "icon", "dots", "bars", "beam")
WORD = re.compile(r"[A-Za-z0-9ऀ-ॿ']+")


def words(s):
    return [w.lower() for w in WORD.findall(s)]


def spoken(spec, scene):
    t = spec.get("copy", {}).get("hi", {}).get(scene, "")
    return re.sub(r"\{[^}]*\}", " ", re.sub(r"@\w+", " ", t)).replace("|", " ")


def main(folder):
    folder = Path(folder)
    problems = []
    spec = json.loads((folder / "spec.json").read_text(encoding="utf-8"))
    scenes = spec.get("scenes", [])
    # 1. the plan
    plan = folder / "visual_plan.md"
    if not plan.exists():
        problems.append("visual_plan.md is missing: write the plan before the code")
    else:
        rows = {}
        for line in plan.read_text(encoding="utf-8").splitlines():
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if len(cells) >= 4 and re.fullmatch(r"[A-Z][A-Za-z0-9]*", cells[0]):
                rows[cells[0]] = cells
        for sc in scenes:
            c = rows.get(sc)
            if not c:
                problems.append(f"visual_plan.md: no row for scene {sc}")
                continue
            pic = c[2]
            if len(pic.split()) < 6:
                problems.append(f"visual_plan.md scene {sc}: describe the picture in at least six words (what is drawn, what moves)")
            if re.match(r"(?i)^(text|words?|title|caption|slide|sentence)\b", pic):
                problems.append(f"visual_plan.md scene {sc}: the picture is text; draw the idea instead")
            if len(c) < 5 or not c[4].strip():
                problems.append(f"visual_plan.md scene {sc}: say what builds the picture (helper names or custom)")
    # 2 + 3 + 4. the code
    html = (folder / "index.html").read_text(encoding="utf-8")
    var2scene = {m.group(1): m.group(2) for m in re.finditer(r"(\w+)\s*=\s*M\.\$\(\s*[\"']#s([A-Za-z0-9_]+)[\"']\s*\)", html)}
    pic_scenes = set()
    for m in re.finditer(r"\bM\.(" + "|".join(DIAGRAM) + r")\(\s*(?:M\.\$\(\s*[\"']#s([A-Za-z0-9_]+)[\"']\s*\)|(\w+))", html):
        sc = m.group(2) or var2scene.get(m.group(3))
        if sc:
            pic_scenes.add(sc)
    for m in re.finditer(r"diagram:\s*([A-Za-z][A-Za-z0-9_]*)", html):
        pic_scenes.add(m.group(1))
    missing = [s for s in scenes[1:] if s not in pic_scenes]
    allowed = 1 if len(scenes) >= 5 else 0
    if len(missing) > allowed:
        problems.append(f"scenes without a picture: {', '.join(missing)} (call a diagram helper on the scene, or mark custom SVG/GSAP code with `// diagram: <scene>`)")
    big_text = len(re.findall(r"\bM\.(?:slam|big)\(", html))
    if big_text > 3:
        problems.append(f"{big_text} M.slam/M.big calls: at most 3 big-text takeaways per reel; the picture carries the rest")
    mirrors = []
    for m in re.finditer(r"\bM\.(slam|big|pill)\(\s*(?:M\.\$\(\s*[\"']#s([A-Za-z0-9_]+)[\"']\s*\)|(\w+))\s*,\s*([\"'`])(.*?)\4", html):
        kind, sc, text = m.group(1), m.group(2) or var2scene.get(m.group(3)), m.group(5)
        ws = words(text)
        if kind == "pill" and len(ws) > 5:
            problems.append(f"M.pill is a sentence ({len(ws)} words): {text[:50]!r}; a pill is a label of at most 5 words")
        if len(ws) >= 3 and sc:
            said = set(words(spoken(spec, sc)))
            if sum(w in said for w in ws) / len(ws) >= 0.7:
                mirrors.append(text)
    if len(mirrors) > 1:
        problems.append("on-screen text repeats the narration: " + "; ".join(repr(t[:40]) for t in mirrors))
    if problems:
        print("\n".join(problems))
        return 1
    print(f"ok: {len(scenes)} scenes, pictures in {len(pic_scenes & set(scenes))}, {big_text} big-text takeaways")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1]))
