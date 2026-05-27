#!/bin/bash
FILE_PATH="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"

if ! echo "$FILE_PATH" | grep -qE "apps/studio/schemas/"; then
  exit 0
fi

SCHEMA_NAME=$(basename "$FILE_PATH" .ts)
PROJECT_ROOT=$(echo "$FILE_PATH" | sed 's|/apps/studio/schemas/.*||')
QUERIES_ABS="$PROJECT_ROOT/apps/web/src/lib/queries.ts"

if ! grep -qi "$SCHEMA_NAME" "$QUERIES_ABS" 2>/dev/null; then
  echo "WARNING: Schema '$SCHEMA_NAME' was modified but no matching query found in queries.ts. Verify the four-step triad: SCHEMA → QUERY → TEMPLATE → SEED"
fi

exit 0
