#!/usr/bin/env bash
# Before an agent session: remember the starting commit, allow user namespaces (Claude Code's command sandbox and
# Chrome need them on Ubuntu 24.04), then switch sudo off for the rest of the job.
set -eu
git rev-parse HEAD > "$RUNNER_TEMP/base_sha"
sudo sysctl -q -w kernel.apparmor_restrict_unprivileged_userns=0 || true
sudo rm -f /etc/sudoers.d/runner /etc/sudoers.d/90-cloud-init-users
if sudo -n true 2>/dev/null; then echo "sudo is still available"; exit 1; fi
echo "sudo is off for the agent session"
