#!/usr/bin/env bash
# HOOK_09: Route-Schema Parity Check
# Verifies every static .astro page has a corresponding Sanity singleton schema.
# Run after adding any new page to catch mismatches early.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PAGES_DIR="$REPO_ROOT/apps/web/src/pages"
SINGLETONS_DIR="$REPO_ROOT/apps/studio/schemas/singletons"

# Pages that intentionally have no singleton (use document types, not singletons)
SKIP=(
  "blog/index.astro"
  "blog/[slug].astro"
  "blog/[category]/index.astro"
  "blog/[category]/[sub]/index.astro"
)

# Map page filename (no extension) to expected singleton schema name
page_to_singleton() {
  local page="$1"
  case "$page" in
    index)       echo "homePage" ;;
    about)       echo "aboutPage" ;;
    careers)     echo "careersPage" ;;
    communities) echo "communitiesPage" ;;
    contact)     echo "contactPage" ;;
    patients)    echo "patientsPage" ;;
    privacy)     echo "privacyPage" ;;
    providers)   echo "providersPage" ;;
    resident-referral) echo "residentReferralPage" ;;
    terms)       echo "termsPage" ;;
    *)           echo "" ;;
  esac
}

is_skipped() {
  local rel="$1"
  for skip in "${SKIP[@]}"; do
    [[ "$rel" == "$skip" ]] && return 0
  done
  return 1
}

is_dynamic() {
  local rel="$1"
  [[ "$rel" == *'['*']'* ]] && return 0
  return 1
}

COVERED=()
ORPHAN=()

while IFS= read -r -d '' filepath; do
  rel="${filepath#$PAGES_DIR/}"

  # Skip dynamic routes
  is_dynamic "$rel" && continue

  # Skip known exceptions
  is_skipped "$rel" && continue

  stem="${rel%.astro}"
  # For nested pages, use the basename only
  basename_stem="$(basename "$stem")"

  singleton="$(page_to_singleton "$basename_stem")"

  if [[ -z "$singleton" ]]; then
    ORPHAN+=("$rel → UNMAPPED (no entry in page_to_singleton)")
  elif [[ -f "$SINGLETONS_DIR/${singleton}.ts" ]]; then
    COVERED+=("$rel → $singleton")
  else
    ORPHAN+=("$rel → $singleton (schema file missing: singletons/${singleton}.ts)")
  fi
done < <(find "$PAGES_DIR" -name "*.astro" -print0 | sort -z)

echo "=============================="
echo " HOOK_09: Route-Schema Parity"
echo "=============================="
echo ""
echo "COVERED (${#COVERED[@]}):"
for entry in "${COVERED[@]}"; do
  echo "  ✓ $entry"
done

echo ""
echo "ORPHAN (${#ORPHAN[@]}):"
if [[ ${#ORPHAN[@]} -eq 0 ]]; then
  echo "  (none)"
else
  for entry in "${ORPHAN[@]}"; do
    echo "  ✗ $entry"
  done
fi

echo ""
if [[ ${#ORPHAN[@]} -gt 0 ]]; then
  echo "RESULT: FAIL — ${#ORPHAN[@]} orphan(s) found"
  exit 1
else
  echo "RESULT: PASS — all static pages have singleton schemas"
  exit 0
fi
