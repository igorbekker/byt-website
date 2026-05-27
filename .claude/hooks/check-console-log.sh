#!/bin/bash
FILE_PATH="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"

if ! echo "$FILE_PATH" | grep -qE "functions/api/"; then
  exit 0
fi

if echo "$FILE_PATH" | grep -q "_hubspot.ts"; then
  exit 0
fi

COUNT=$(grep -c "console\.log" "$FILE_PATH" 2>/dev/null || echo 0)

if [ "$COUNT" -gt 0 ]; then
  FILENAME=$(basename "$FILE_PATH")
  echo "BLOCKED: $FILENAME contains $COUNT console.log statement(s). Remove them before committing."
  exit 2
fi

exit 0
