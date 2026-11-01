"""Trusted fail-closed gate for Blind 75 / POTD: signed Accepted code and a 60–120s teaching arc.
No code from a reel is executed here. CODING_PROOF_SECRET is never forwarded to the agent.
"""
import hashlib
import hmac
import html
import json
import os
import re
from datetime import date
from pathlib import Path

BEATS = ("problem", "brute_force", "bottleneck", "optimization", "dry_run", "complexity")


def inspect_visible_code(folder, require_complete=False):
    """Inspect actual rendered HTML text, without executing the submitted Python."""
    folder = Path(folder)
    source = (folder / "solution.py").read_text(encoding="utf-8").splitlines()
    page = (folder / "index.html").read_text(encoding="utf-8")
    covered, panels = set(), set()
    visible_rows = 0

    def source_group(match):
        nonlocal visible_rows
        attrs, body = match.groups()
        number = int(re.search(r'data-source-line="(\d+)"', attrs)[1])
        if not 1 <= number <= len(source):
            raise ValueError("invalid on-screen source line")
        parts = [html.unescape(re.sub(r'<[^>]+>', '', b))
                 for a, b in re.findall(r'<text\b([^>]*)>(.*?)</text>', body, re.S)
                 if re.search(r'font-family=[\"\x27]Code[\"\x27]', a)]
        if not parts or ' '.join(' '.join(parts).split()) != ' '.join(source[number - 1].split()):
            raise ValueError(f"on-screen code differs from Accepted source line {number}")
        covered.add(number)
        visible_rows += len(parts)
        panel = re.search(r'data-code-panel="([^"]+)"', attrs)
        if panel:
            panels.add(panel[1])
        return ''

    remaining = re.sub(r'<g\b([^>]*data-source-line="\d+"[^>]*)>(.*?)</g>', source_group, page, flags=re.S)
    for attrs, body in re.findall(r'<text\b([^>]*)>(.*?)</text>', remaining, re.S):
        if not re.search(r'font-family=[\"\x27]Code[\"\x27]', attrs):
            continue
        value = html.unescape(re.sub(r'<[^>]+>', '', body)).strip()
        matches = {n for n, line in enumerate(source, 1) if value and value == line.strip()}
        if not matches:
            raise ValueError("on-screen code contains a row outside the Accepted source")
        covered.update(matches)
        visible_rows += 1
    required = {n for n, line in enumerate(source, 1)
                if line.startswith('        ') and line.strip() and not line.lstrip().startswith('#')}
    missing = sorted(required - covered)
    if not visible_rows or len(covered & required) < min(3, max(1, len(required))):
        raise ValueError("actual on-screen Accepted algorithm code is missing")
    if require_complete and missing:
        raise ValueError(f"missing on-screen Accepted source lines: {missing}")
    return dict(has_on_screen_code=True, method_body_complete=not missing,
                covered_source_lines=sorted(covered), missing_source_lines=missing,
                panels=sorted(panels), visible_code_rows=visible_rows,
                accepted_source_sha256=hashlib.sha256((folder / 'solution.py').read_bytes()).hexdigest(),
                wrapped_lines_are_editor_soft_wraps=True)


def check_visible_code(folder, rid):
    if not re.fullmatch(r"[bp]\d{2,4}", rid):
        return True, "not a coding track"
    try:
        spec = json.loads((Path(folder) / 'spec.json').read_text(encoding='utf-8'))
        result = inspect_visible_code(folder, require_complete=spec.get('on_screen_code_contract') == 'complete_method_body')
        return True, f"{len(result['covered_source_lines'])} Accepted source lines visible; complete body: {result['method_body_complete']}"
    except (OSError, ValueError, TypeError, KeyError, AttributeError) as exc:
        return False, str(exc)


def check(folder, rid, secret=None):
    if not re.fullmatch(r"[bp]\d{2,4}", rid):
        return True, "not a coding track"
    try:
        folder = Path(folder)
        item = json.loads((folder / "coding.json").read_text(encoding="utf-8"))
        code = (folder / "solution.py").read_text(encoding="utf-8")
        secret = secret if secret is not None else os.environ.get("CODING_PROOF_SECRET", "")
        if len(secret) < 32:
            raise ValueError("CODING_PROOF_SECRET is missing")
        token = json.loads(item["accepted_proof"])
        signature = hmac.new(secret.encode(), token["body"].encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, token["sig"]):
            raise ValueError("Accepted evidence signature mismatch")
        p = json.loads(token["body"])
        track = "blind75" if rid[0] == "b" else "potd"
        if (p["v"], p["kind"], p["item"], p["track"], p["status"], p["language"]) != (1, "accepted", rid, track, "Accepted", "python3"):
            raise ValueError("Accepted evidence is for a different item")
        if item["id"] != rid or item["track"] != track or not re.fullmatch(r"\d+", str(p["submission_id"])):
            raise ValueError("invalid item or submission identity")
        if code != item["solution_code"] or hashlib.sha256(code.encode()).hexdigest() != p["code_sha256"]:
            raise ValueError("solution changed since LeetCode Accepted; resubmit exact code")
        if any(item["problem"][k] != p[k] for k in ("slug", "question_id")):
            raise ValueError("Accepted problem identity mismatch")
        if track == "potd":
            day = date.fromisoformat(item["challenge_date"])
            n = (day - date(2026, 11, 1)).days + 1
            if p["challenge_date"] != day.isoformat() or rid != f"p{n:04d}" or not 1 <= n <= 9999:
                raise ValueError("POTD challenge date mismatch")
        else:
            n = int(rid[1:])
            if not 1 <= n <= 75 or item["position"] != n:
                raise ValueError("Blind 75 position mismatch")
        if not 60 <= float(item["length_target_s"]) <= 120:
            raise ValueError("coding lesson must target 60–120 seconds")
        if any(len(item["teaching"][beat].split()) < 5 for beat in BEATS):
            raise ValueError("missing concrete teaching beat or optimization reasoning")
        spec = json.loads((folder / "spec.json").read_text(encoding="utf-8"))
        scenes = spec["scenes"]
        phrase_contract = spec.get("teaching_phrases")
        positions = []
        for beat in BEATS:
            names = spec["teaching_scenes"][beat]
            if not isinstance(names, list) or not names or any(not spec["copy"]["hi"].get(s, "").strip() for s in names):
                raise ValueError(f"{beat} has no narrated scenes")
            ix = [scenes.index(s) for s in names]
            if ix != sorted(set(ix)):
                raise ValueError(f"{beat} scenes must be unique and ordered")
            if phrase_contract is None:
                positions.extend(ix)
            else:
                entries = phrase_contract[beat]
                if not isinstance(entries, list) or not entries:
                    raise ValueError(f"{beat} has no teaching phrases")
                used_scenes = []
                for entry in entries:
                    if not isinstance(entry, list) or len(entry) != 2:
                        raise ValueError("teaching phrase must identify scene and phrase index")
                    scene, phrase = entry
                    if scene not in names or type(phrase) is not int or phrase < 0:
                        raise ValueError("invalid teaching phrase identity")
                    parts = spec["copy"]["hi"][scene].split("|")
                    if phrase >= len(parts) or not parts[phrase].strip():
                        raise ValueError("teaching phrase has no actual narration")
                    if scene not in used_scenes:
                        used_scenes.append(scene)
                    positions.append((scenes.index(scene), phrase))
                if used_scenes != names:
                    raise ValueError("teaching scenes and phrases disagree")
        if positions != sorted(set(positions)):
            raise ValueError("teach problem → brute force → bottleneck → optimization reasoning → dry run → complexity in order, with separate scenes or explicitly separate narrated phrases")
        if spec.get("solution_sha256") != p["code_sha256"]:
            raise ValueError("composition must reference the exact accepted solution hash")
        return True, f"LeetCode Accepted #{p['submission_id']}; exact code; six ordered teaching beats"
    except (OSError, ValueError, TypeError, KeyError, AttributeError) as exc:
        return False, str(exc)


if __name__ == "__main__":
    import sys
    ok, detail = check(sys.argv[1], sys.argv[2])
    print(detail)
    sys.exit(0 if ok else 1)
