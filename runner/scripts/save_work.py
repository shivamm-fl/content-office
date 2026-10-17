"""Save what an agent session changed, after a path check (the "save" job of office-run.yml).

    python3 -I runner/scripts/save_work.py --work <dir with files.tgz + manifest.json> --team <team> --run <run_id>

Runs in a fresh checkout of main, never on the machine where the agent worked. The bundle is data only:
- content (state, reels, social, covers, thumbnails, roadmap) of teams/<team>/ is committed to main;
- rules, prompts, agents, skills, scripts and the team's settings go to branch proposal/<run> for the owner;
- a content file that changed on main since the session started also goes to the proposal branch (no overwrite);
- everything else (other teams, the office code, workflows, links, huge files) is dropped and listed.
Then the office is told what was saved (GitHub OIDC identity, no shared secret).
"""
import argparse
import io
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


def git(*args: str, check: bool = True) -> str:
    r = subprocess.run(["git", "-c", "core.hooksPath=/dev/null", *args], capture_output=True, text=True)
    if check and r.returncode != 0:
        raise SystemExit(f"git {' '.join(args[:2])} failed: {r.stderr.strip()[:400]}")
    return r.stdout.strip()


def classify(rel: str) -> str:
    if NEVER.search(rel):
        return "drop"
    if CONTENT.match(rel):
        return "content"
    if PROPOSAL.match(rel):
        return "proposal"
    return "drop"


def changed_on_main(base: str, path: str) -> bool:
    if not re.fullmatch(r"[0-9a-f]{40}", base or ""):
        return False
    return bool(git("diff", "--name-only", base, "HEAD", "--", path, check=False))


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
                                     headers={"Content-Type": "application/json", "Authorization": f"Bearer {oidc}"})
        urllib.request.urlopen(req, timeout=20).read()
    except Exception as e:  # the save itself already happened
        print(f"could not report to the office: {e}")


def push(branch: str) -> None:
    for _ in range(3):
        if subprocess.run(["git", "-c", "core.hooksPath=/dev/null", "push", "origin", f"HEAD:refs/heads/{branch}"]).returncode == 0:
            return
        git("pull", "--rebase", "origin", branch, check=False)
    raise SystemExit(f"push to {branch} failed")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--work", required=True)
    ap.add_argument("--team", required=True)
    ap.add_argument("--run", required=True)
    a = ap.parse_args()
    if not re.fullmatch(r"[a-z0-9-]{2,40}", a.team) or not re.fullmatch(r"run_[A-Za-z0-9]{6,40}", a.run):
        raise SystemExit("bad team or run id")
    team_root = Path("teams") / a.team
    if not team_root.is_dir():
        raise SystemExit(f"no team folder {team_root}")
    work = Path(a.work)
    manifest = json.loads((work / "manifest.json").read_text()) if (work / "manifest.json").exists() else {"base": "", "deleted": []}
    prefix = f"teams/{a.team}/"

    content: dict[str, bytes | None] = {}
    proposal: dict[str, bytes | None] = {}
    dropped: list[str] = []

    def route(path: str, data: bytes | None) -> None:
        if not path.startswith(prefix) or ".." in path.split("/"):
            dropped.append(path)
            return
        kind = classify(path[len(prefix):])
        if kind == "content" and changed_on_main(manifest.get("base", ""), path):
            kind = "proposal"
        if kind == "content":
            content[path] = data
        elif kind == "proposal":
            proposal[path] = data
        else:
            dropped.append(path)

    bundle = work / "files.tgz"
    if bundle.exists():
        with tarfile.open(bundle, "r:gz") as tf:
            for m in tf.getmembers():
                name = m.name.lstrip("./")
                if not m.isfile() or m.size > MAX_FILE:
                    dropped.append(name)
                    continue
                f = tf.extractfile(m)
                route(name, f.read() if f else None)
    for path in manifest.get("deleted", []):
        route(path, None)

    def apply(files: dict[str, bytes | None]) -> int:
        n = 0
        for path, data in files.items():
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
    n = apply(content)
    if n:
        git("commit", "-q", "-m", f"office: {a.team} work from {a.run}")
        push("main")
        result.update(commit=git("rev-parse", "HEAD"), files=n)
    if proposal:
        branch = f"proposal/{a.run}"
        git("checkout", "-q", "-B", branch, "origin/main")
        if apply(proposal):
            git("commit", "-q", "-m", f"office: proposed by {a.run} (needs the owner's review)")
            push(branch)
            result["proposal_branch"] = branch
    if dropped:
        result["note"] = f"{len(dropped)} file(s) outside the team's content were not saved: " + ", ".join(sorted(set(dropped))[:8])
    print(json.dumps(result, indent=2))
    report(result)


if __name__ == "__main__":
    sys.exit(main())
