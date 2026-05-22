# Obstacle Report: Trailing-Slash Redirect Failure

**Date:** 2026-05-21
**Duration to resolve:** ~2 hours, 20+ diagnostic tests
**Severity:** All CMS-driven URL slug changes were silently non-functional on the live site

---

## What Happened

We built a 5-phase system to allow CMS-controlled URL slugs:

1. Added slug + oldSlugs[] fields to all 11 page singletons
2. Replaced 11 static .astro page files with a single dynamic catch-all router
3. Created a Sanity document action that auto-archives the old slug into oldSlugs[] on publish
4. Extended the build-time redirectsIntegration() in astro.config.mjs to query all oldSlugs and write them into the Cloudflare \_redirects file as 301 redirects
5. Deployed everything — build passed, Studio deployed, seed data confirmed

We changed the About page slug from "about" to "about-us" and Resident Referral from "resident-referral" to "referral". New URLs loaded correctly. Old URLs did NOT redirect — they served a 200.

---

## Root Cause

Cloudflare Pages \_redirects matching is exact on path. /about and /about/ are two different paths.

The \_redirects file contained:

/about /about-us 301
/resident-referral /referral 301

This matched /about (no trailing slash) but NOT /about/ (with trailing slash). Every browser uses trailing slashes. Zero redirects worked for real users.

---

## What We Investigated (and Why Each Failed)

| #     | Test                                        | Why It Didn't Find the Bug                                                                 |
| ----- | ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1     | DNS propagation                             | Red herring — cf-ray confirmed Cloudflare was serving                                      |
| 2     | Cloudflare deployment list                  | All commits deployed — irrelevant to the content bug                                       |
| 3     | Browser cache / incognito                   | Not a cache issue                                                                          |
| 4     | Studio deploy                               | Real issue for Studio UI, unrelated to redirects                                           |
| 5     | Sanity seed data                            | CMS data was correct                                                                       |
| 6     | Local build output                          | \_redirects had correct entries — wrong format                                             |
| 7     | Build env vars                              | Sanity dataset publicly queryable                                                          |
| 8     | Worker routes / page rules                  | None exist                                                                                 |
| 9     | WordPress proxy                             | No proxy rule in \_redirects                                                               |
| 10    | curl status codes only                      | /about returned 301 — assumed it was our redirect. It was Cloudflare's slash normalization |
| 11    | Force rebuild                               | Deployed fine — bug was in content, not pipeline                                           |
| 12-18 | Header checks, deploy logs, git comparisons | Correct infrastructure, wrong \_redirects format                                           |
| 19    | curl -I showing Location headers            | Finally useful — but only tested no-slash version                                          |
| 20    | Full header dump BOTH slash variants        | ROOT CAUSE FOUND: /about/ returned 200                                                     |

---

## The Fix

One change in astro.config.mjs: for every redirect entry, write TWO lines:

/about /about-us 301
/about/ /about-us 301

Commit: fix(redirects): add trailing-slash variants to \_redirects

---

## Why 20+ Tests Missed a 1-Line Bug

1. **Tested the wrong URL format.** Every curl used /about (no slash). Browsers use /about/ (with slash). The version that mattered was never tested until test 19.

2. **CC reported success without proof.** CC said "redirects working" based on status codes. A 301 from /about could be our redirect OR Cloudflare's slash normalization. Without the Location: header, indistinguishable.

3. **Chased infrastructure, bug was in content.** Hours on DNS, deployments, build vars, WordPress proxying. The bug was a missing trailing slash in a text file.

4. **Never asked how browsers request URLs.** The \_redirects was verified with cat. Nobody asked: "Do browsers send /about or /about/?" Answer: /about/. Would have caught it instantly.

---

## Rules Added

1. **Test both slash variants for all redirect work.** Any redirect change must verify BOTH /path and /path/ on the live site.

2. **CC must show Location headers for redirect verification.** Use curl -s -I url | grep -i location. Status codes without destinations prove nothing.

3. **Lesson for lessons.md:** "Test the URL the way users actually type it — with trailing slash. /path and /path/ are different in Cloudflare \_redirects. Always write both."
