"""Independent fact check of a built reel (a fresh Claude session that has not seen the builder's notes):
  python scripts/fact_review.py <id> [--out qa]      -> exit 0 = pass, 1 = fix (prints the claims that are not backed), 2 = the reviewer could not run; writes <out>/facts_<id>.json
It reads the spoken narration (spec.json), the Instagram caption and the YouTube text of the reel, fetches the source URLs listed under "Sources:" in the YouTube text with WebFetch,
and judges every factual claim (numbers, dates, names, who did what, "all / first / only / now" statements, causes) as SUPPORTED, OVERSTATED, NOT_FOUND or WRONG.
Claims the reel labels as an example are fine. Every claim that is not SUPPORTED also gets a severity: high = a viewer would believe something false or materially stronger than the source says
(a number, date or name that the page does not back, 'done' where the page says 'decided', 'all' where it says 'some', a cause stated as fact); low = a plain-language simplification or hook-style
generalisation that keeps the gist. Pass rule: no claim of severity high. Low ones are listed as notes. UNVERIFIED means the page could not be read (for example a PDF): check those by hand.
Born from e05 (2026-10-12): the narration said "Anthropic's internal tests are offline now" while the source only says Anthropic decided to expand turning off internet access.
Needs the claude CLI (WebFetch and Read only). The report carries text_sha, so a changed narration or caption makes an old report stale."""
import hashlib
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODEL = "claude-sonnet-5-5"


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


def spoken(spec):
    parts = []
    for scene, t in spec.get("copy", {}).get("hi", {}).items():
        t = re.sub(r"\s+", " ", re.sub(r"\{[^}]*\}", " ", re.sub(r"@\w+", " ", t)).replace("|", " ")).strip()
        parts.append(f"[{scene}] {t}")
    return "\n".join(parts)


def texts(rid):
    st = json.loads((ROOT / "state/phase5_status.json").read_text(encoding="utf-8"))
    e = st.get(rid)
    if not e:
        sys.exit(f"{rid}: no entry in state/phase5_status.json")
    folder = ROOT / e["folder"] if e.get("folder") else ROOT / "reels" / Path(e["mp4"]).name.replace("_hi.mp4", "")
    spec = json.loads((folder / "spec.json").read_text(encoding="utf-8"))
    caption = (ROOT / e["caption"]).read_text(encoding="utf-8")
    yt = (ROOT / "social" / (folder.name + ".youtube.txt")).read_text(encoding="utf-8")
    urls = re.findall(r"https?://[^\s)]+", yt.split("Sources:")[-1]) if "Sources:" in yt else []
    return spoken(spec), caption, yt, urls


def sha_of(narration, caption, yt):
    return hashlib.sha256((narration + "\n" + caption + "\n" + yt).encode("utf-8")).hexdigest()


def current_sha(rid):
    """Hash of the texts as they are now; a facts report with another hash is stale (scripts/ci_verify_reel.py compares)."""
    narration, caption, yt, _ = texts(rid)
    return sha_of(narration, caption, yt)


def write_report(out_dir, rid, result):
    out = Path(out_dir)
    if not out.is_absolute():
        out = ROOT / out
    out.mkdir(parents=True, exist_ok=True)
    (out / f"facts_{rid}.json").write_text(json.dumps(result, ensure_ascii=False, indent=1), encoding="utf-8")


def main(rid, out_dir):
    narration, caption, yt, urls = texts(rid)
    sha = sha_of(narration, caption, yt)
    if not urls:
        result = {"reel": rid, "ok": False, "claims_checked": 0, "problems": ["the YouTube text lists no sources under 'Sources:': there is nothing to check the claims against"], "notes": [], "summary": "no sources", "claims": [], "text_sha": sha, "sources": []}
        write_report(out_dir, rid, result)
        print(json.dumps(result, ensure_ascii=False, indent=1))
        return 1
    prompt = (
        "You are a strict fact-checker for a short educational video. Work only from the source pages below, which you fetch yourself with the WebFetch tool; ignore what you remember.\n"
        "Sources (fetch every one):\n" + "\n".join(urls) + "\n\n"
        "SPOKEN NARRATION (scene by scene):\n" + narration + "\n\nINSTAGRAM CAPTION:\n" + caption + "\n\nYOUTUBE TEXT:\n" + yt.split("Sources:")[0] + "\n\n"
        "List every factual claim made in the narration, the caption and the YouTube text: numbers, dates, names, who did what, definitions, 'all / first / only / now / already' statements, causes and effects. "
        "Skip opinions, questions, calls to action and anything the text itself labels as an example or illustration (words like 'example', 'jaise', 'maan lo'). "
        "For every claim give a verdict: SUPPORTED (the page says it; quote the words), OVERSTATED (the page says something weaker, later or narrower: say what it really says; 'done' versus 'decided' and 'all' versus 'some' count), "
        "NOT_FOUND (the page does not say it), WRONG (the page says the opposite or a different number), or UNVERIFIED (the page could not be read, for example a PDF). "
        'For every claim that is not SUPPORTED add a severity: "high" when a viewer would come away believing something false or materially stronger than the source (a number, date or name the page does not back; '
        '"done" where the page says "decided"; "all" where it says "some"; a cause stated as fact; a product or person the page never mentions), or "low" for a plain-language simplification, a hook-style generalisation or a standard '
        "definition that keeps the gist and that a well-informed reader would accept. Do not mark a claim high only because it is shorter or punchier than the page.\n"
        'Answer with ONLY one JSON object: {"claims":[{"where":"narration B|caption|youtube","claim":"...","verdict":"SUPPORTED|OVERSTATED|NOT_FOUND|WRONG|UNVERIFIED","severity":"high|low|none","evidence":"quote or what the page really says"}],"summary":"two sentences"}'
    )
    rep = first_json(claude(prompt, "WebFetch,Read"))
    if not rep or not rep.get("claims"):
        print("fact review: the reviewer returned no JSON or no claims")
        return 2   # the reviewer could not run: not a finding (the CI step retries and then stops without counting an attempt)
    notsup =[c for c in rep["claims"] if str(c.get("verdict", "")).upper() in ("OVERSTATED", "NOT_FOUND", "WRONG", "UNVERIFIED")]
    bad = [c for c in notsup if str(c.get("verdict", "")).upper() != "UNVERIFIED" and str(c.get("severity", "high")).lower() != "low"]
    notes = [c for c in notsup if c not in bad]
    result = {"reel": rid, "ok": not bad, "claims_checked": len(rep["claims"]), "problems": [f"{c.get('where')}: {c.get('claim')} -> {c.get('verdict')}: {c.get('evidence')}" for c in bad],
              "notes": [f"{c.get('where')}: {c.get('claim')} -> {c.get('verdict')} ({c.get('severity')}): {c.get('evidence')}" for c in notes],
              "summary": rep.get("summary"), "claims": rep["claims"], "text_sha": sha, "sources": urls}
    write_report(out_dir, rid, result)
    print(json.dumps({k: result[k] for k in ("ok", "claims_checked", "problems", "notes", "summary")}, ensure_ascii=False, indent=1))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__)
    sys.exit(main(a[0], a[a.index("--out") + 1] if "--out" in a else "qa"))
