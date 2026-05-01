#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="backups/sanity"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
DATASET="production"
OUTPUT="$BACKUP_DIR/sanity-$DATASET-$TIMESTAMP.tar.gz"

mkdir -p "$BACKUP_DIR"
cd apps/studio
pnpm sanity dataset export "$DATASET" "../../$OUTPUT"
echo "Sanity backup created: $OUTPUT"
