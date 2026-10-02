#!/usr/bin/env bash
# Boots the Leven web frontend (Vite/React) for local development.
#
# - Ensures Node.js/npm are available, installing Node via Homebrew if
#   they're missing.
# - Installs npm dependencies if node_modules is missing/out of date.
# - Starts the Vite dev server.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

log() { printf '[web] %s\n' "$1"; }

# ---------------------------------------------------------------------------
# 1. Ensure Node/npm are available
# ---------------------------------------------------------------------------
if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  log "Node.js/npm not found."
  if command -v brew >/dev/null 2>&1; then
    log "Installing Node via Homebrew..."
    brew install node
  else
    log "Homebrew not found. Install Node.js manually from https://nodejs.org and re-run this script."
    exit 1
  fi
fi

log "Using node $(node --version), npm $(npm --version)"

# ---------------------------------------------------------------------------
# 2. Install dependencies if needed
# ---------------------------------------------------------------------------
node_modules_healthy() {
  [ -d node_modules ] || return 1
  [ -x node_modules/.bin/vite ] || return 1
  # Catches stale installs with native binaries built for a different
  # platform/architecture (e.g. node_modules copied from another machine).
  node_modules/.bin/vite --version >/dev/null 2>&1
}

needs_install=false
if ! node_modules_healthy; then
  needs_install=true
elif [ package-lock.json -nt node_modules ]; then
  needs_install=true
fi

if [ "$needs_install" = true ]; then
  if [ -d node_modules ]; then
    log "Existing node_modules looks stale/incompatible, reinstalling..."
    rm -rf node_modules
  fi
  log "Installing npm dependencies..."
  npm install
fi

# ---------------------------------------------------------------------------
# 3. Start the dev server
# ---------------------------------------------------------------------------
log "Starting Vite dev server on http://0.0.0.0:5173 ..."
exec npm run dev
