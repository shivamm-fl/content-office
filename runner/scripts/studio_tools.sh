#!/usr/bin/env bash
# Tools of an agent studio job (build, fix): ffmpeg and the sandbox packages, a root-owned Python for the trusted
# steps (the session cannot change what they run), Claude Code, the HyperFrames skills. Every network install is
# time-limited and never interactive.
set -eu
# a hung mirror once held the whole step for its 20 minutes (run_mvl0yc4gaxRwCrY): each install gets a limit and one retry
retry() { local t=$1; shift; timeout "$t" "$@" || { echo "::warning::retrying: $*"; timeout "$t" "$@"; }; }
retry 150 sudo apt-get -o Acquire::Retries=3 -o Acquire::http::Timeout=30 update -qq
retry 240 sudo apt-get -o Acquire::Retries=3 -o Acquire::http::Timeout=30 install -y -qq ffmpeg bubblewrap socat >/dev/null
sudo "$(command -v python3)" -m venv /opt/office/venv && retry 240 sudo /opt/office/venv/bin/pip install -q --timeout 30 --retries 3 $PIP_PACKAGES
ln -sfn /opt/office/venv "teams/$TEAM/.venv"
retry 240 npm install -g --no-fund --no-audit @anthropic-ai/claude-code@2.1.301 >/dev/null
(cd "teams/$TEAM" && timeout 240 npx --yes skills add heygen-com/hyperframes --yes </dev/null >/dev/null 2>&1) || echo "::warning::HyperFrames skills install failed"
# the skills install rewrites the lock file's hashes; that is not a change the team made
git checkout -q -- "teams/$TEAM/skills-lock.json" 2>/dev/null || true
timeout 180 npx --yes hyperframes@0.8.149 --version </dev/null >/dev/null 2>&1 || true
# reels/<x>/assets/*.wav (the music bed and effects, 16 MB, identical for every reel) are never committed: give each reel folder the ones it lacks
for d in "teams/$TEAM"/reels/*/assets; do
  case "$d" in */_template/*|*/_kit/*) continue;; esac
  for w in "teams/$TEAM"/reels/_template/assets/*.wav; do [ -e "$d/$(basename "$w")" ] || cp "$w" "$d/"; done
done
claude --version && ffmpeg -version | head -1
