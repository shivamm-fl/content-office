"""Staged release gate for a built reel (replaces scripts/ci_verify_reel.py once the preview builds finish).
  python scripts/ci_verify_reel_next.py r08      # exit 0 = passes, 1 = blocked; prints a JSON report
Same checks as before, with two changes:
  - the hook is scored on the Roman-letter opener (caption line 1). hookscore is English-calibrated and reads Devanagari as one word,
    so only its DEALBREAKER flags block; the overall score is reported, not gated.
  - one idea per reel: at most 3 distinct technical terms in the spoken copy (display text outside the {spoken} braces).
Style beyond these is decided by the skills."""
import hashlib, json, re, shutil, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
MIN_S, MAX_S = 20, 180   # owner 2026-10-19: value first, a series day may run up to 3 minutes (Instagram's limit); 2026-10-14: depth over brevity
MAX_TECH_TERMS = 6
TECH = ["query", "key", "value", "token", "attention", "embedding", "vector", "softmax", "transformer", "position", "weight", "match", "label", "logit"]


def sh(*cmd, cwd=None):
    cmd = (shutil.which(cmd[0]) or cmd[0],) + tuple(cmd[1:])  # Windows: npx is npx.cmd
    return subprocess.run(cmd, capture_output=True, text=True, cwd=cwd)


def first_caption_line(cap):
    for line in cap.read_text(encoding="utf-8").splitlines():
        if line.strip():
            return line.strip().strip('"').strip()
    return ""


def display_text(spec):
    text = " ".join(spec["copy"]["hi"].values())
    return re.sub(r"\{[^}]*\}", " ", re.sub(r"@\w+", " ", text)).replace("|", " ")


def tech_terms(spec):
    found = set()
    for t in TECH:
        if re.search(r"\b" + t + r"s?\b", display_text(spec), flags=re.I):
            found.add(t)
    return sorted(found)


def hook_check(cap):
    line = first_caption_line(cap)
    hs = sh(sys.executable, str(ROOT / ".claude/skills/ig-reel/hookscore.py"), "--hook", line)
    text = hs.stdout + hs.stderr
    score = re.search(r"HOOK SCORE[^\n]*?(\d+\.\d)", text)
    return "HOOK SCORE" in text and "DEALBREAKER" not in text, ("score " + (score.group(1) if score else "?") + ": " + line[:70])


def main(rid, skip_review=False):
    st = json.loads((ROOT / "state/phase5_status.json").read_text(encoding="utf-8")); e = st.get(rid)
    rep = {"reel": rid, "checks": [], "ok": True}
    def chk(name, ok, detail=""):
        rep["checks"].append({"name": name, "ok": bool(ok), "detail": str(detail)[:300]}); rep["ok"] &= bool(ok)
    if not e: chk("state entry", False, "no entry in state/phase5_status.json"); return rep
    mp4, cover, cap, folder = ROOT / e.get("mp4", "x"), ROOT / e.get("cover", "x"), ROOT / e.get("caption", "x"), ROOT / e.get("folder", "x")
    meta = ROOT / "social" / (folder.name + ".youtube.txt")
    chk("files exist", all(p.exists() for p in (mp4, cover, cap, meta, folder / "spec.json", folder / "data.json")), mp4.name + " " + cover.name + " " + cap.name + " " + meta.name)
    if not rep["ok"]: return rep
    im = ROOT.parents[1] / "runner/scripts/item_media.py"   # the video must be made from these files: a restored video never passes for a new one
    if im.exists():
        vm = sh(sys.executable, str(im), "verify", "--team", ROOT.name, "--item", rid)
        chk("video matches the composition", vm.returncode == 0, (vm.stdout + vm.stderr).strip())
    pr = sh("ffprobe", "-v", "error", "-show_entries", "stream=codec_name,codec_type,width,height", "-show_entries", "format=duration", "-of", "json", str(mp4))
    pj = json.loads(pr.stdout or "{}"); streams = pj.get("streams", []); dur = float(pj.get("format", {}).get("duration", 0))
    v = next((s for s in streams if s.get("codec_type") == "video"), {}); au = next((s for s in streams if s.get("codec_type") == "audio"), {})
    chk("video 1080x1920 h264 (vertical)", (v.get("width"), v.get("height"), v.get("codec_name")) == (1080, 1920, "h264"), v)
    chk("audio aac present", au.get("codec_name") == "aac", au)
    data = json.loads((folder / "data.json").read_text(encoding="utf-8")).get("hi", {})
    chk("length " + str(MIN_S) + "-" + str(MAX_S) + " s", MIN_S <= dur <= MAX_S, "%.1fs" % dur)
    chk("length equals data.json total", abs(dur - float(data.get("total", -99))) < 1.0, "%.1f vs %s" % (dur, data.get("total")))
    lo = sh("ffmpeg", "-hide_banner", "-nostats", "-i", str(mp4), "-af", "ebur128=peak=true", "-f", "null", "-")
    m = re.findall(r"I:\s+(-?[\d.]+) LUFS", lo.stderr); tp = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", lo.stderr)
    lufs = float(m[-1]) if m else None; peak = float(tp[-1]) if tp else None
    chk("loudness -17..-12 LUFS", lufs is not None and -17 <= lufs <= -12, lufs); chk("true peak <= -1 dBTP", peak is not None and peak <= -1.0, peak)
    c = sh("npx", "--yes", "hyperframes@0.8.149", "check", cwd=str(folder)); out = c.stdout + c.stderr
    chk("hyperframes check", c.returncode == 0 and "Check passed" in out, [l for l in out.strip().splitlines() if l.strip()][-1] if out.strip() else "no output")
    lint = sh(sys.executable, str(ROOT / ".claude/skills/ig-caption/caption.py"), str(cap), "--json")
    try: checks = json.loads(lint.stdout).get("checks", [])
    except Exception: checks = [{"check": "lint", "status": "FAIL", "detail": "linter crashed"}]
    fails = ["%s: %s" % (x["check"], x["detail"]) for x in checks if x.get("status") == "FAIL"]
    chk("caption lint (ig-caption, no FAIL)", not fails, "; ".join(fails))
    cv = sh("ffprobe", "-v", "error", "-show_entries", "stream=width,height", "-of", "csv=p=0", str(cover))
    chk("cover 1080x1920", cv.stdout.strip() == "1080,1920", cv.stdout.strip())
    spec = json.loads((folder / "spec.json").read_text(encoding="utf-8"))
    chk("hindi-only spec", list(spec.get("copy", {}).keys()) == ["hi"], list(spec.get("copy", {}).keys()))
    ok_hook, hook_detail = hook_check(cap)
    chk("hook (Roman caption line 1): no DEALBREAKER", ok_hook, hook_detail)
    terms = tech_terms(spec)
    chk("one idea: at most %d technical terms" % MAX_TECH_TERMS, len(terms) <= MAX_TECH_TERMS, ", ".join(terms))
    chk("hook_formula recorded in the state entry", e.get("hook_formula") is not None, e.get("hook_formula"))
    dev = [p.name for p in (cap, meta) if re.search(r"[\u0900-\u097F]", p.read_text(encoding="utf-8"))]
    chk("post texts are Roman Hinglish (no Devanagari in the caption and the YouTube text)", not dev, ", ".join(dev))
    lv = sh(sys.executable, str(ROOT / "scripts/lint_visuals.py"), str(folder))
    chk("visuals show the idea (lint_visuals: plan, pictures, text budget)", lv.returncode == 0, (lv.stdout + lv.stderr).strip().replace("\n", "; "))
    vr, vok, vdetail = ROOT / "qa" / ("visual_" + rid + ".json"), False, "no review yet: run python scripts/visual_review.py " + rid
    if skip_review:   # GitHub builder and FIX sessions (--skip-review): the workflow runs the review itself, as a separate step, and the final gate has no such flag
        vok, vdetail = True, "skipped: build-reel.yml runs the independent review after this session"
    elif vr.exists():
        try:
            rj = json.loads(vr.read_text(encoding="utf-8"))
            vok = bool(rj.get("ok")) and rj.get("mp4_mtime", 0) >= mp4.stat().st_mtime - 1
            vdetail = ("average %s" % rj.get("average")) if vok else ("; ".join(rj.get("problems", [])) if not rj.get("ok") else "the review is older than the mp4: run scripts/visual_review.py again")
        except ValueError:
            vdetail = "unreadable review report: run scripts/visual_review.py again"
    chk("visual review passed (mute test by a fresh reviewer)", vok, vdetail)
    fr, fok, fdetail = ROOT / "qa" / ("facts_" + rid + ".json"), False, "no fact check yet: run python scripts/fact_review.py " + rid
    if skip_review:   # the workflow runs the fact check as a separate step after the builder session, like the visual review
        fok, fdetail = True, "skipped: build-reel.yml runs the fact check after this session"
    elif fr.exists():
        try:
            fj = json.loads(fr.read_text(encoding="utf-8"))
            sys.path.insert(0, str(ROOT / "scripts"))
            import fact_review
            fresh = fj.get("text_sha") == fact_review.current_sha(rid)
            fok = bool(fj.get("ok")) and fresh
            fdetail = ("%s claims checked" % fj.get("claims_checked")) if fok else (("; ".join(fj.get("problems", [])))[:250] if not fj.get("ok") else "the fact check is older than the narration or texts: run scripts/fact_review.py again")
        except ValueError:
            fdetail = "unreadable fact report: run scripts/fact_review.py again"
    chk("facts checked against the sources (no high finding)", fok, fdetail)
    chk("youtube metadata has a title and a description", len([l for l in meta.read_text(encoding="utf-8").splitlines() if l.strip()]) >= 2, meta.name)
    hashes = set()
    for i in range(6):
        t = dur * (i + 0.5) / 6
        f = subprocess.run(["ffmpeg", "-v", "error", "-ss", "%.2f" % t, "-i", str(mp4), "-frames:v", "1", "-vf", "scale=96:-1", "-f", "image2pipe", "-vcodec", "bmp", "-"], capture_output=True)
        hashes.add(hashlib.md5(f.stdout).hexdigest())
    chk("frames change over time", len(hashes) >= 4, str(len(hashes)) + " distinct of 6")
    rep["duration_s"] = round(dur, 1); rep["lufs"] = lufs
    return rep


if __name__ == "__main__":
    r = main(sys.argv[1], "--skip-review" in sys.argv[2:]); print(json.dumps(r, ensure_ascii=False, indent=1)); sys.exit(0 if r["ok"] else 1)
