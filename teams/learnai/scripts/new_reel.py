"""Scaffold a reel project.  python scripts/new_reel.py r01_slug "Title" "CATEGORY PILL"
Creates reels/<id>/ from reels/_template (assets, hyperframes.json, package.json), the motion kit (reels/_kit: motion.css, motion.js, viz.js) and index.html from
reels/_kit/template_motion.html, plus vars.hi.json, a spec.json skeleton and a visual_plan.md skeleton. The cover project is copied from brand/covers/_template."""
import json, shutil, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
rid = sys.argv[1]
title = sys.argv[2] if len(sys.argv) > 2 else rid
chip = sys.argv[3] if len(sys.argv) > 3 else "AI BASICS"
dst = ROOT / "reels" / rid
if dst.exists():
    sys.exit(f"{dst} exists")
tpl = ROOT / "reels" / "_template"
kit = ROOT / "reels" / "_kit"
(dst / "assets").mkdir(parents=True); (dst / "fonts").mkdir(); (dst / "kit").mkdir(); (dst / "audio" / "hi").mkdir(parents=True)
for f in (tpl / "assets").iterdir():
    shutil.copy(f, dst / "assets" / f.name)
for f in (ROOT / "brand" / "fonts").glob("*.ttf"):
    shutil.copy(f, dst / "fonts" / f.name)
for f in ["motion.css", "motion.js", "viz.js"]:
    shutil.copy(kit / f, dst / "kit" / f)
shutil.copy(tpl / "hyperframes.json", dst / "hyperframes.json"); shutil.copy(tpl / "package.json", dst / "package.json")
(dst / "vars.hi.json").write_text(json.dumps({"lang": "hi", "voiceSrc": "audio/hi/voice.wav", "bedSrc": "audio/hi/bed.wav", "sfxSrc": "audio/hi/sfx.wav"}))
(dst / "index.html").write_text((kit / "template_motion.html").read_text(encoding="utf-8").replace("{{TITLE}}", title).replace("{{CHIP}}", chip), encoding="utf-8")
spec = {"tts": "edge", "voice": "hi-IN-SwaraNeural", "pace": 1.26, "audio": "v2", "tone": "calm", "scenes": ["A"], "min": {"A": 6.0}, "tail": {},
        "cues": [["impact", None, None, 0.05]], "copy": {"hi": {"A": "@hook यहाँ पहला phrase लिखो।"}}}
(dst / "spec.json").write_text(json.dumps(spec, ensure_ascii=False, indent=1), encoding="utf-8")
PLAN = """# Visual plan: write this BEFORE editing index.html (rules: docs-notes/diagram-first-visuals.md)

Idea in one line:
The picture that explains it with the sound off (from the queue item's visual_idea, improved if you can):

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A |  |  |  |  |
"""
(dst / "visual_plan.md").write_text(PLAN, encoding="utf-8")
cov = ROOT / "brand" / "covers" / rid
if not cov.exists() and (ROOT / "brand" / "covers" / "_template").exists():
    shutil.copytree(ROOT / "brand" / "covers" / "_template", cov)
print("created", dst, "| cover project:", "yes" if cov.exists() else "no")
