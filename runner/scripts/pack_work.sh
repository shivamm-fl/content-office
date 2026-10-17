#!/usr/bin/env bash
# Pack what an agent session changed in teams/$TEAM: files.tgz + manifest.json (for the save job) and the
# rendered videos (media.tgz). System binaries only, git without hooks or fsmonitor: the session could have
# changed PATH dirs or .git/config.
set -u
export PATH=/usr/bin:/bin
G="/usr/bin/git -c core.hooksPath=/dev/null -c core.fsmonitor=false"
base=$(cat "$RUNNER_TEMP/base_sha" 2>/dev/null || echo "")
mkdir -p "$RUNNER_TEMP/work" "$RUNNER_TEMP/media"
$G ls-files -m -o --exclude-standard -z -- "teams/$TEAM" > "$RUNNER_TEMP/changed"
$G ls-files -d -z -- "teams/$TEAM" > "$RUNNER_TEMP/deleted"
if [ -s "$RUNNER_TEMP/changed" ]; then /usr/bin/tar --null -T "$RUNNER_TEMP/changed" -czf "$RUNNER_TEMP/work/files.tgz"; fi
/usr/bin/python3 -I -c "import json,sys; d=open(sys.argv[1],'rb').read().split(b'\0'); json.dump({'base': sys.argv[2], 'deleted': [x.decode() for x in d if x]}, open(sys.argv[3],'w'))" "$RUNNER_TEMP/deleted" "$base" "$RUNNER_TEMP/work/manifest.json"
shopt -s nullglob
videos=( "teams/$TEAM"/reels/*_hi.mp4 )
if [ ${#videos[@]} -gt 0 ]; then /usr/bin/tar -czf "$RUNNER_TEMP/media/media.tgz" "${videos[@]}"; fi
echo "changed: $(tr -cd '\0' < "$RUNNER_TEMP/changed" | wc -c) file(s), deleted: $(tr -cd '\0' < "$RUNNER_TEMP/deleted" | wc -c), videos: ${#videos[@]}"
