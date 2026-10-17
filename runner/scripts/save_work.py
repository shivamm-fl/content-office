"""Save what an agent session changed, after a path check (the "save" job of office-run.yml).

    python3 -I runner/scripts/save_work.py --work <dir with files.tgz + manifest.json> --team <team> --run <run_id>

Runs in a fresh checkout of main, never on the machine where the agent worked. The bundle is data only:
- content (state, reels, social, covers, thumbnails, roadmap) of teams/<team>/ is committed to main;
- the shared state files (queue, covered, phase5_status) are merged item by item with what other desks
  saved meanwhile, so two desks working at the same time never lose each other's items;
- rules, prompts, agents, skills, scripts and the team's settings go to branch proposal/<run> for the owner;
- any other content file that changed on main since the session started also goes to the proposal branch;
- everything else (other teams, the office code, workflows, links, huge files) is dropped and listed.
Pushes retry on a fresh main, so several runs can save at once. Then the office is told what was saved.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import tarfile
import urllib.request
from pathlib import Path

MAX_FILE = 20 * 1024 * 1024
CONTENT = re.compile(
    r"^(state/(?!learnings\.md$|config\.json$)[^/]+\.(json|md|txt)"
    r"|state/[\w-]+/[\w./-]+"
    r"|reels/(?!_kit/|_template/)[^/]+/[\w./ -]+"
    r"|social/[\w./ -]+"
    r"|brand/covers/(?!_template/)[\w./ -]+"
    r"|brand/yt_thumbs/[\w./ -]+"
    r"|roadmap/[\w.-]+\.json)$"
)
PROPOSAL = re.compile(
    r"^(CLAUDE\.md|team\.json|requirements\.txt|skills-lock\.json|state/learnings\.md|state/config\.json"
    r"|\.claude/[\w./ -]+|prompts/[\w./ -]+|scripts/[\w./ -]+|docs-notes/[\w./ -]+"
    r"|reels/_kit/[\w./ -]+|reels/_template/[\w./ -]+|brand/[\w./ -]+)$"
)
NEVER = re.compile(r"(^|/)(\.env[^/]*|\.dev\.vars|\.git|\.github|node_modules|\.venv)(/|$)|\.(mp4|pem|key)$")
# Shared state merged per item: {"items": [{"id": ...}]} lists, or a dict keyed by item id.
MERGEABLE = {"state/queue.json": "items", "state/covered.json": "items", "state/phase5_status.json": "dict"}


def git(*args: str, check: bool = True) -> str:
    r = subprocess.run(["git", "-c", "core.hooksPath=/dev/null", *args], capture_output=True, text=True)
    if check and r.returncode != 0:
        raise SystemExit(f"git {' '.join(args[:2])} failed: {r.stderr.strip()[:400]}")
    return r.stdout.strip()


def git_bytes(ref: str, path: str) -> bytes | None:
    r = subprocess.run(["git", "show", f"{ref}:{path}"], capture_output=True)
    return r.stdout if r.returncode == 0 else None


def classify(rel: str) -> str:
    if NEVER.search(rel):
        return "drop"
    if CONTENT.match(rel):
        return "content"
    if PROPOSAL.match(rel):
        return "proposal"
    return "drop"


def valid_base(base: str) -> bool:
    return bool(re.fullmatch(r"[0-9a-f]{40}", base or "")) and subprocess.run(["git", "cat-file", "-e", f"{base}^{{commit}}"], capture_output=True).returncode == 0


def changed_on_main(base: str, path: str) -> bool:
    if not valid_base(base):
        return False
    return bool(git("diff", "--name-only", base, "HEAD", "--", path, check=False))


def merge_state(kind: str, base: dict, ours: dict, theirs: dict) -> dict:
    """Three-way merge per item id: the agent's additions and edits win for the items it touched."""
    if kind == "dict":
        out = dict(theirs)
        for k, v in ours.items():
            if base.get(k) != v:
                out[k] = v
        for k, v in base.items():
            if k not in ours and out.get(k) == v:
                out.pop(k, None)
        return out
    key = lambda i: i.get("id") if isinstance(i, dict) else json.dumps(i, sort_keys=True)  # noqa: E731
    b = {key(i): i for i in base.get("items", [])}
    o = {key(i): i for i in ours.get("items", [])}
    items = [i for i in theirs.get("items", [])]
    where = {key(i): n for n, i in enumerate(items)}
    for k, item in o.items():
        if b.get(k) != item:
            if k in where:
                items[where[k]] = item
            else:
                where[k] = len(items)
                items.append(item)
    gone = {k for k in b if k not in o}
    items = [i for i in items if not (key(i) in gone and i == b.get(key(i)))]
    out = dict(theirs)
    out.update({k: v for k, v in ours.items() if k != "items" and base.get(k) != v})
    out["items"] = items
    return out


def report(payload: dict) -> None:
    url, tok, office = os.environ.get("ACTIONS_ID_TOKEN_REQUEST_URL"), os.environ.get("ACTIONS_ID_TOKEN_REQUEST_TOKEN"), os.environ.get("OFFICE_URL")
    if not (url and tok and office):
        print("not reporting to the office (no OIDC or OFFICE_URL)")
        return
    try:
        req = urllib.request.Request(f"{url}&audience=content-office", headers={"Authorization": f"Bearer {tok}"})
        oidc = json.load(urllib.request.urlopen(req, timeout=20))["value"]
        body = json.dumps(payload).encode()
        req = urllib.request.Request(f"{office.rstrip('/')}/api/runner/saved", data=body, method="POST",
                                     headers={"Content-Type": "application/json", "Authorization": f"Bearer {oidc}", "User-Agent": "content-office-runner/1.0"})  # Cloudflare blocks the default urllib agent (1010)
        urllib.request.urlopen(req, timeout=20).read()
    except Exception as e:  # the save itself already happened
        print(f"could not report to the office: {e}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--work", required=True)
    ap.add_argument("--team", required=True)
    ap.add_argument("--run", required=True)
    a = ap.parse_args()
    if not re.fullmatch(r"[a-z0-9-]{2,40}", a.team) or not re.fullmatch(r"run_[A-Za-z0-9]{6,40}", a.run):
        raise SystemExit("bad team or run id")
    if not (Path("teams") / a.team).is_dir():
        raise SystemExit(f"no team folder teams/{a.team}")
    work = Path(a.work)
    manifest = json.loads((work / "manifest.json").read_text()) if (work / "manifest.json").exists() else {"base": "", "deleted": []}
    base = manifest.get("base", "")
    prefix = f"teams/{a.team}/"

    # Read the bundle once: path -> bytes (None = deleted).
    files: dict[str, bytes | None] = {}
    dropped: list[str] = []
    bundle = work / "files.tgz"
    if bundle.exists():
        with tarfile.open(bundle, "r:gz") as tf:
            for m in tf.getmembers():
                name = m.name.lstrip("./")
                if m.isdir():
                    continue
                if not m.isfile() or m.size > MAX_FILE:
                    dropped.append(name)
                    continue
                f = tf.extractfile(m)
                files[name] = f.read() if f else None
    for path in manifest.get("deleted", []):
        files[path] = None
    for path in list(files):
        if not path.startswith(prefix) or ".." in path.split("/") or classify(path[len(prefix):]) == "drop":
            dropped.append(path)
            files.pop(path)

    def plan() -> tuple[dict[str, bytes | None], dict[str, bytes | None], list[str]]:
        """Route every file against the current HEAD: (to main, to the proposal branch, merged names)."""
        content, proposal, merged = {}, {}, []
        for path, data in files.items():
            rel = path[len(prefix):]
            kind = classify(rel)
            if kind == "content" and rel in MERGEABLE and data is not None and changed_on_main(base, path):
                try:
                    theirs = json.loads(Path(path).read_text(encoding="utf-8")) if Path(path).exists() else {}
                    old = git_bytes(base, path) if valid_base(base) else None
                    ancestor = json.loads(old) if old else ({} if MERGEABLE[rel] == "dict" else {"items": []})
                    ours = json.loads(data)
                    out = merge_state(MERGEABLE[rel], ancestor, ours, theirs)
                    content[path] = (json.dumps(out, ensure_ascii=False, indent=2) + "\n").encode()
                    merged.append(rel)
                    continue
                except (ValueError, TypeError, AttributeError):
                    kind = "proposal"
            elif kind == "content" and changed_on_main(base, path):
                kind = "proposal"
            (content if kind == "content" else proposal)[path] = data
        return content, proposal, merged

    def apply(changes: dict[str, bytes | None]) -> int:
        n = 0
        for path, data in changes.items():
            p = Path(path)
            if data is None:
                if p.exists():
                    git("rm", "-q", "--", path)
                    n += 1
                continue
            if p.exists() and p.read_bytes() == data:
                continue
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes(data)
            git("add", "--", path)
            n += 1
        return n

    result: dict = {"team": a.team, "run_id": a.run, "commit": None, "files": 0, "proposal_branch": None, "note": None}
    proposal: dict[str, bytes | None] = {}
    merged: list[str] = []
    for attempt in range(5):
        git("fetch", "-q", "origin", "main")
        git("reset", "-q", "--hard", "origin/main")
        content, proposal, merged = plan()
        n = apply(content)
        if not n:
            break
        git("commit", "-q", "-m", f"office: {a.team} work from {a.run}")
        if subprocess.run(["git", "-c", "core.hooksPath=/dev/null", "push", "-q", "origin", "HEAD:refs/heads/main"]).returncode == 0:
            result.update(commit=git("rev-parse", "HEAD"), files=n)
            break
        print(f"main moved while saving, retrying ({attempt + 1})")
    else:
        raise SystemExit("could not push to main after 5 tries")

    if proposal:
        branch = f"proposal/{a.run}"
        git("checkout", "-q", "-B", branch, "origin/main")
        if apply(proposal):
            git("commit", "-q", "-m", f"office: proposed by {a.run} (needs the owner's review)")
            subprocess.run(["git", "-c", "core.hooksPath=/dev/null", "push", "-q", "-f", "origin", f"HEAD:refs/heads/{branch}"], check=True)
            result["proposal_branch"] = branch
    notes = []
    if merged:
        notes.append("Merged item by item with other desks' work: " + ", ".join(sorted(set(merged))) + ".")
    if dropped:
        notes.append(f"{len(dropped)} file(s) outside the team's content were not saved: " + ", ".join(sorted(set(dropped))[:8]))
    result["note"] = " ".join(notes) or None
    print(json.dumps(result, indent=2))
    report(result)


if __name__ == "__main__":
    sys.exit(main())
