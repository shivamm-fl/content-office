"""Import the LearnAI team workspace from ai-course into teams/learnai (one-time, re-runnable).

    python tools/import_from_ai_course.py ../ai-course [--team learnai]

The office repo is PUBLIC, so only what a team needs to plan, write and build reels comes over:
skills, build/review/gate scripts, the reel kit and template, brand templates, the roadmap and the
planning memory. Posting scripts, credentials, the DM bot, engagement drafts, competitor data,
insights, finished reels and the git history stay in ai-course.

Files the office maintains by hand (team CLAUDE.md, .claude/agents, team.json, state/config.json)
are never overwritten.
"""
import json
import shutil
import sys
from pathlib import Path

DIRS = [
    ".claude/skills",
    "reels/_kit",
    "reels/_template",
    "brand/fonts",
    "brand/avatar",
    "brand/covers/_template",
    "roadmap",
]
FILES = [
    "brand/avatar.png", "brand/brand.md", "brand/tokens.css",
    "requirements.txt", "skills-lock.json",
    "state/covered.json", "state/learnings.md", "state/growth_notes.md",
    "docs-notes/diagram-first-visuals.md", "docs-notes/hyperframes-cheatsheet.md",
    "docs-notes/reel-style-v2.md", "docs-notes/script-style-v3.md", "docs-notes/script-references.md",
]
SCRIPTS = [
    "ci_review_round.py", "ci_sync_push.py", "ci_verify_reel.py", "edge_tts_hosts.py", "fact_review.py",
    "frames.py", "gen_audio_assets.py", "hinglish_roman.py", "lint_script.py", "lint_visuals.py", "make_intro_audio.py",
    "make_reel_audio.py", "market_signals.py", "new_reel.py", "next_to_build.py", "prune_audio_cache.py",
    "qa.py", "render_cover.py", "render_job.py", "render_reel.py", "romanize_reel.py", "setup.py",
    "validate_queue.py", "visual_review.py",
]
# The ai-course prompts are kept as reference for the office roles (studio mode adapts them in phase 2).
PROMPTS = ["plan-reels.md", "build-reel.md", "ci-build-mode.md", "engage.md"]

SKIP_PARTS = {"__pycache__", "snapshots", "node_modules", "audio", ".hf-transaction"}
NEVER = ("ig_post", "fb_", "yt_upload", "yt_auth", "delete_reels", "ci_set_secrets", "dm_bot", ".env")


def copy_tree(src: Path, dst: Path) -> int:
    n = 0
    for p in src.rglob("*"):
        rel = p.relative_to(src)
        if any(part in SKIP_PARTS for part in rel.parts) or p.suffix in (".pyc", ".mp4"):
            continue
        if any(bad in p.name for bad in NEVER):
            continue
        if p.is_file():
            out = dst / rel
            out.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(p, out)
            n += 1
    return n


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        sys.exit(__doc__)
    src = Path(args[0]).resolve()
    team = sys.argv[sys.argv.index("--team") + 1] if "--team" in sys.argv else "learnai"
    root = Path(__file__).resolve().parent.parent
    dst = root / "teams" / team
    if not (src / "CLAUDE.md").exists() or not (src / "scripts").is_dir():
        sys.exit(f"{src} does not look like ai-course")

    count = 0
    for d in DIRS:
        count += copy_tree(src / d, dst / d)
    for f in FILES:
        if (src / f).exists():
            (dst / f).parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src / f, dst / f)
            count += 1
    (dst / "scripts").mkdir(parents=True, exist_ok=True)
    for s in SCRIPTS:
        shutil.copy2(src / "scripts" / s, dst / "scripts" / s)
        count += 1
    (dst / "prompts").mkdir(parents=True, exist_ok=True)
    for p in PROMPTS:
        shutil.copy2(src / ".github" / "prompts" / p, dst / "prompts" / p)
        count += 1

    # Fresh office state: ids start at 101 so they never collide with ai-course during the test phase.
    state = dst / "state"
    for name, empty in (("queue.json", {"items": []}), ("phase5_status.json", {})):
        target = state / name
        if not target.exists():
            target.write_text(json.dumps(empty, indent=2) + "\n", encoding="utf-8")
    for keep in ("social", "brand/yt_thumbs", "reels"):
        (dst / keep).mkdir(parents=True, exist_ok=True)
        gk = dst / keep / ".gitkeep"
        if not any((dst / keep).iterdir()):
            gk.touch()
    print(f"imported {count} files into {dst.relative_to(root)}")


if __name__ == "__main__":
    main()
