"""Independent visual review of a built reel (the "mute test", done by a fresh Claude session that never saw the builder's plan).
  python scripts/visual_review.py <id> [--out qa]        -> exit 0 = pass, 1 = fix (prints the reasons per scene); writes <out>/visual_<id>.json
How: one image strip per scene (three frames in time order) is cut from the rendered mp4.
  1. A blind pass looks at the strips only (captions ignored, no narration given) and says what idea the pictures teach, whether the scene is text only,
     and which layout problems it sees.
  2. A second pass compares that blind reading with the narration of the scene and rates 0-2 how well the pictures alone teach the narrated idea.
Pass rule: no scene except the first is text only; every scene rates at least 1; the average is at least 1.4 and at least half of the scenes rate 2.
A closing call-to-action scene (the narration of the LAST scene asks to comment, follow or subscribe) is shown but not rated: nothing in it can be drawn as an idea.
The gate (scripts/ci_verify_reel.py) requires a passing, fresh report."""
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODEL = "claude-sonnet-5-5"
FRAME_W = 540
CTA = re.compile(r"\b(comment|follow|subscribe)\b|कमेंट|कमेन्ट|फॉलो|फ़ॉलो|सब्सक्राइब", re.IGNORECASE)


def run(cmd, **kw):
    cmd = [shutil.which(cmd[0]) or cmd[0]] + list(cmd[1:])
    return subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", **kw)


def claude(prompt, tools):
    exe = shutil.which("claude") or str(Path.home() / ".local" / "bin" / "claude")
    r = subprocess.run([exe, "-p", prompt, "--model", MODEL, "--allowedTools", tools, "--permission-mode", "acceptEdits"],
                       capture_output=True, text=True, encoding="utf-8", errors="replace", cwd=ROOT)
    if r.returncode != 0 or not r.stdout.strip():
        # the reviewer returned nothing: say why in the log (a usage limit, a login problem and a crash look the same from outside)
        tail = lambda t: " ".join((t or "").split())[-300:]  # noqa: E731
        print(f"claude reviewer: exit {r.returncode}; stderr: {tail(r.stderr)!r}; stdout: {tail(r.stdout)!r}")
    return r.stdout


def first_json(text):
    start = text.find("{")
    while start != -1:
        depth, in_str, esc = 0, False, False
        for i in range(start, len(text)):
            ch = text[i]
            if in_str:
                esc = (ch == "\\") and not esc
                if ch == '"' and not esc:
                    in_str = False
                if ch != "\\":
                    esc = False
            elif ch == '"':
                in_str = True
            elif ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    try:
                        return json.loads(text[start:i + 1])
                    except ValueError:
                        break
        start = text.find("{", start + 1)
    return None


def spoken(spec, scene):
    t = spec.get("copy", {}).get("hi", {}).get(scene, "")
    return re.sub(r"\s+", " ", re.sub(r"\{[^}]*\}", " ", re.sub(r"@\w+", " ", t)).replace("|", " ")).strip()


def strips(mp4, data, scenes, out):
    out.mkdir(parents=True, exist_ok=True)
    starts = data["starts"]
    made = {}
    for k, sc in enumerate(scenes):
        t0 = starts[sc]
        t1 = starts[scenes[k + 1]] if k + 1 < len(scenes) else starts.get("end", data["total"])
        ts = [t0 + 0.5, (t0 + t1) / 2, t1 - 0.4]
        frames = []
        for j, t in enumerate(ts):
            f = out / f"{sc}_{j}.png"
            run(["ffmpeg", "-v", "error", "-y", "-ss", f"{max(t, 0):.2f}", "-i", str(mp4), "-frames:v", "1", "-vf", f"scale={FRAME_W}:-1", str(f)])
            frames.append(f)
        strip = out / f"scene_{sc}.png"
        args = ["ffmpeg", "-v", "error", "-y"]
        for f in frames:
            args += ["-i", str(f)]
        args += ["-filter_complex", "hstack=inputs=3", str(strip)]
        run(args)
        made[sc] = strip
        for f in frames:
            f.unlink(missing_ok=True)
    return made


def main(rid, out_dir):
    st = json.loads((ROOT / "state/phase5_status.json").read_text(encoding="utf-8"))
    e = st.get(rid)
    if not e:
        sys.exit(f"{rid}: no entry in state/phase5_status.json")
    mp4 = ROOT / e["mp4"]
    folder = ROOT / e["folder"] if e.get("folder") else mp4.with_name(mp4.name.replace("_hi.mp4", ""))
    spec = json.loads((folder / "spec.json").read_text(encoding="utf-8"))
    data = json.loads((folder / "data.json").read_text(encoding="utf-8"))["hi"]
    scenes = spec["scenes"]
    out = Path(out_dir)
    if not out.is_absolute():
        out = ROOT / out
    made = strips(mp4, data, scenes, out / f"review_{rid}")
    files = "\n".join(f"scene {sc}: {p}" for sc, p in made.items())
    blind_prompt = (
        "You are a strict visual editor reviewing a vertical explainer video with the SOUND OFF. Ignore the captions: they are the big white words in the lower part of every frame. "
        f"Below are {len(made)} image strips, one per scene; each strip has three frames of that scene in time order, left to right. Open every file with the Read tool.\n"
        "Judge from the pictures ALONE (you have not been told what the narrator says). For every scene give:\n"
        '- "sees": what is drawn and what changes between the three frames (objects, diagram type, motion)\n'
        '- "idea_taught": the one idea a smart beginner would take away from the pictures alone, in one sentence; if the picture is only words/headings on a dark background or pure decoration, write "NOTHING: text only"\n'
        '- "text_only": true when the scene is only words (sentences, headings, big text cards) with no diagram, chart, drawing or moving object that carries meaning\n'
        '- "layout_issues": a list of strings, each starting with "MAJOR:" or "minor:". MAJOR = a phone viewer would miss or misread something: overlapping or cut-off text, labels smaller than about 36 px, low contrast, or a picture that fills less than half of the area between the top bar and the captions (a small diagram parked at the top with a big empty gap). minor = polish. [] when there is none\n'
        'Answer with ONLY one JSON object: {"scenes":[{"scene":"A","sees":"...","idea_taught":"...","text_only":false,"layout_issues":[]}]}\n' + files
    )
    blind = first_json(claude(blind_prompt, "Read"))
    if not blind or "scenes" not in blind:
        print("visual review: the blind pass returned no JSON")
        return 1
    by = {s.get("scene"): s for s in blind["scenes"]}
    lines = []
    for sc in scenes:
        lines.append(f"Scene {sc}\n  narration: {spoken(spec, sc)}\n  a muted viewer learned: {by.get(sc, {}).get('idea_taught', '(missing)')}")
    judge_prompt = (
        "You compare what a muted viewer learned from the pictures of an explainer video with what the narrator says. "
        "For every scene rate 0-2 how well the PICTURES ALONE teach the narrated idea: 0 = they teach nothing or something else (for example only words on a dark background); "
        "1 = they teach part of it or are vague; 2 = they teach it clearly. Be strict: a picture that only repeats the narrated words as text is a 0 or 1. "
        'Answer with ONLY one JSON object: {"scenes":[{"scene":"A","match":2,"note":"one sentence"}],"summary":"two sentences: what is good, what must change"}\n\n' + "\n".join(lines)
    )
    judge = first_json(claude(judge_prompt, "Read"))
    if not judge or "scenes" not in judge:
        print("visual review: the judge pass returned no JSON")
        return 1
    jb = {s.get("scene"): s for s in judge["scenes"]}
    problems, scores = [], []
    rows = []
    # A closing "comment and follow" scene has no idea to draw, so the pictures cannot teach it: it is shown in the report but not rated
    # (the reviewer itself writes "a 0 here is expected"; rating it made q101 fail the gate again and again).
    cta = len(scenes) > 1 and bool(CTA.search(spoken(spec, scenes[-1])))
    for k, sc in enumerate(scenes):
        b, j = by.get(sc, {}), jb.get(sc, {})
        m = int(j.get("match", 0))
        is_cta = cta and k == len(scenes) - 1
        if not is_cta:
            scores.append(m)
        rows.append({"scene": sc, "sees": b.get("sees"), "idea_taught": b.get("idea_taught"), "text_only": bool(b.get("text_only")), "layout_issues": b.get("layout_issues", []), "match": m, "note": j.get("note"), **({"cta": True} if is_cta else {})})
        if b.get("text_only") and k > 0:
            problems.append(f"scene {sc} is text only: {j.get('note') or b.get('idea_taught')}")
        elif not is_cta and (m == 0 or (k > 0 and m < 1)):
            problems.append(f"scene {sc} teaches nothing the narration says: {j.get('note')}")
    avg = sum(scores) / len(scores) if scores else 0
    if avg < 1.4:
        problems.append(f"average match {avg:.1f} is below 1.4")
    if sum(s == 2 for s in scores) * 2 < len(scores):
        problems.append("fewer than half of the scenes teach their idea clearly (rating 2)")
    major = [f"scene {r['scene']}: {i}" for r in rows for i in (r["layout_issues"] or []) if str(i).upper().startswith("MAJOR")]
    rep = {"reel": rid, "ok": not problems, "average": round(avg, 2), "problems": problems, "major_layout": major, "summary": judge.get("summary"), "scenes": rows, "mp4_mtime": mp4.stat().st_mtime}
    (out / f"visual_{rid}.json").write_text(json.dumps(rep, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps({k: rep[k] for k in ("ok", "average", "problems", "major_layout", "summary")}, ensure_ascii=False, indent=1))
    for r in rows:
        print(f"  {r['scene']}: match {r['match']} | text_only={r['text_only']} | {r['idea_taught']} | issues: {r['layout_issues']}")
    return 0 if rep["ok"] else 1


if __name__ == "__main__":
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__)
    out_dir = a[a.index("--out") + 1] if "--out" in a else "qa"
    sys.exit(main(a[0], out_dir))
