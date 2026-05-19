# HOOK_07: Image Integrity Check

**Trigger:** After any image upload to Sanity
**Purpose:** Ensure all images have correct _type, valid asset refs, and alt text

**Why this hook exists:** All 23 images in the CMS parity fix were uploaded with `_type: 'image'` instead of `_type: 'imageWithAlt'`. Studio showed empty image wells. The verification checklist only asked "has asset ref: YES/NO" — it never asked "does the stored _type match the schema field type?"

## CC Prompt Template

```
TASK: Verify image integrity across all Sanity documents

For EACH singleton and document that has image fields:
1. Fetch the published document
2. For every image field (including nested in arrays):
   - _type is 'imageWithAlt': YES/NO
   - asset._ref exists and is non-null: YES/NO
   - alt text is non-empty: YES/NO
   - Construct CDN URL from asset ref — confirm format is valid

3. Summary table:
   | Document | Field | _type | Has Ref | Has Alt | CDN URL Valid |

FAIL CONDITIONS:
- Any _type: 'image' (should be 'imageWithAlt')
- Any null asset._ref
- Any empty alt text
- Any malformed CDN URL

MANDATORY VERIFICATION:
☐ Total image fields checked: ___
☐ _type violations: ___
☐ Missing asset refs: ___
☐ Missing alt text: ___
☐ PASS/FAIL: ___
```
