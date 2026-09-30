#!/usr/bin/env bash
# Push this project to Antideploy.
#
# The exclude list is the point of this script. `tar` does not read
# `.gitignore`, so a plain `tar czf - .` sweeps up `.env.local` — which on this
# project holds a live Neon connection string and two API tokens — and ships it
# inside the deployed container. That happened once; this file exists so the
# list is never retyped from memory.
#
# Everything excluded is either a secret, a build artefact, or documentation
# that nothing imports:
#
#   .env*                 live credentials. The platform injects DATABASE_URL
#                         and the PG* set itself; anything here would also take
#                         precedence over them and point the deploy at the real
#                         database.
#   design/               3.3 MB of brandbook PDF, the PRD and design-system
#                         exports. Referenced only in a comment in globals.css,
#                         so excluding it cannot break the build — and none of
#                         it belongs on a public web host.
#   .git, node_modules    per Antideploy's own example.
#   .next, *.tsbuildinfo  build output, rebuilt on their side.
#   .claude/              agent configuration, not application code.
#   docs/                 33 MB, nearly all of it the layout reference's own
#                         captures — full-page screenshots of a third-party
#                         Framer template. They are working material for us and
#                         publishing them would be republishing someone else's
#                         site, so this exclusion is not negotiable for size
#                         reasons later.
#   brag-output/          6 MB of rendered launch video and its working files.
#   "Claude outputs/"     Neither is imported by anything or served; they are
#                         agent working directories that happen to sit in the
#                         project root, and they are untracked, so nothing else
#                         would have caught them.
#
# Usage: scripts/deploy-antideploy.sh
set -euo pipefail

CONFIG="$HOME/.antideploy/config.json"
PROJECT="$(cd "$(dirname "$0")/.." && pwd)"

[ -f "$CONFIG" ] || { echo "Not connected. Run the device flow first."; exit 1; }
[ -f "$PROJECT/.antideploy.json" ] || { echo "No .antideploy.json — create the application first."; exit 1; }

TOKEN="$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).token)' "$(cygpath -w "$CONFIG" 2>/dev/null || echo "$CONFIG")")"
APP_ID="$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).applicationId)' "$(cygpath -w "$PROJECT/.antideploy.json" 2>/dev/null || echo "$PROJECT/.antideploy.json")")"

ARCHIVE="$(mktemp -t antideploy-XXXXXX).tgz"
trap 'rm -f "$ARCHIVE"' EXIT

cd "$PROJECT"
tar czf "$ARCHIVE" \
  --exclude='.env' --exclude='.env.*' \
  --exclude=.git --exclude=node_modules --exclude=.next \
  --exclude=design --exclude=.claude --exclude=tsconfig.tsbuildinfo \
  --exclude=brag-output --exclude='Claude outputs' --exclude=docs \
  .

# Refuse to send an archive that still contains a secret, rather than trusting
# the list above to have stayed correct.
if tar tzf "$ARCHIVE" | grep -qiE '(^|/)\.env($|\.)'; then
  echo "REFUSING: an .env file is still in the archive." >&2
  tar tzf "$ARCHIVE" | grep -iE '(^|/)\.env($|\.)' >&2
  exit 1
fi

echo "archive: $(du -h "$ARCHIVE" | cut -f1)  ($(tar tzf "$ARCHIVE" | wc -l) entries)"

curl -sS --max-time 900 -X POST \
  "https://antideploy.com/api/v1/deploy?applicationId=$APP_ID" \
  -H "authorization: Bearer $TOKEN" \
  -F "archive=@$ARCHIVE"
echo
