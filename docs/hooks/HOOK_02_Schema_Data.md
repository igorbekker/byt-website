# HOOK_02: Schema-Data Integrity Check

**Trigger:** After any schema change, or on demand
**Purpose:** Ensure every schema field has data, every document type has documents, and all data types match

**Why this hook exists:** During the CMS parity fix, schema fields were created but never seeded, entire document types had zero documents, and 23 images were uploaded with wrong _type. A completeness check after every schema change would have caught all of these.

## CC Prompt Template

```
TASK: Run schema-data integrity check

PART A — Singleton field completeness:
For EACH singleton (homePage, aboutPage, communitiesPage, patientsPage, providersPage, careersPage, contactPage, privacyPage, termsPage, blogIndexPage, siteSettings, formSettings):
1. Read the schema .ts file — list every field name and type
2. Fetch the published document — show each field's value (first 30 chars) or "EMPTY"
3. For imageWithAlt fields: confirm stored _type is 'imageWithAlt' not 'image'

PART B — Document type completeness:
For EACH document type (condition, testimonial, blogPost, blogCategory, author, jobPosting, formOption, redirect):
1. Run: count(*[_type == "typeName"])
2. If count is 0 — flag as EMPTY COLLECTION
3. List which pages query this type

PART C — Array item integrity:
For any singleton with array fields (routerCards, twoWaysTracks, processSteps, noCostCards, etc.):
1. Fetch the array
2. Confirm each item has _key and correct _type
3. For image sub-fields: confirm _type is 'imageWithAlt'

FAIL CONDITIONS:
- Any field that is EMPTY and not intentionally blank (seo fields before SEO sprint are OK)
- Any document type with 0 documents that is queried by a page
- Any image with _type: 'image' instead of 'imageWithAlt'
- Any array item missing _key

Output as tables per section. Summary: total fields, populated, empty, violations.

MANDATORY VERIFICATION:
☐ Total singletons checked: ___
☐ Total fields checked: ___
☐ Empty fields: ___
☐ Document types with 0 docs: ___
☐ Image _type violations: ___
☐ PASS/FAIL: ___
```
