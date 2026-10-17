#!/usr/bin/env bash
# Tools of an agent studio job (build, fix): ffmpeg and the sandbox packages, a root-owned Python for the trusted
# steps (the session cannot change what they run), Claude Code, the HyperFrames skills. Every network install is
# time-limited and never interactive.
set -eu
sudo apt-get update -qq && sudo apt-get install -y -qq ffmpeg bubblewrap socat >/dev/null
sudo "$(command -v python3)" -m venv /opt/office/venv && sudo /opt/office/venv/bin/pip install -q $PIP_PACKAGES
ln -sfn /opt/office/venv "teams/$TEAM/.venv"
npm install -g --no-fund --no-audit @anthropic-ai/claude-code@2.1.301 >/dev/null
(cd "teams/$TEAM" && timeout 240 npx --yes skills add heygen-com/hyperframes --yes </dev/null >/dev/null 2>&1) || echo "::warning::HyperFrames skills install failed"
# the skills install rewrites the lock file's hashes; that is not a change the team made
git checkout -q -- "teams/$TEAM/skills-lock.json" 2>/dev/null || true
timeout 180 npx --yes hyperframes@0.8.149 --version </dev/null >/dev/null 2>&1 || true
claude --version && ffmpeg -version | head -1
