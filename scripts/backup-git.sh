#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="backups/git"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BUNDLE="$BACKUP_DIR/byt-website-$TIMESTAMP.bundle"

mkdir -p "$BACKUP_DIR"
git bundle create "$BUNDLE" --all
echo "Git backup created: $BUNDLE"
