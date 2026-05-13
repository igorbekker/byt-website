# Task Plan

## Status Legend

- [ ] Pending
- [x] Complete
- [~] In Progress
- [!] Blocked

---

## Decisions Log

| #   | Question                                        | Decision                                                                                  |
| --- | ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | Schema sharing between apps/web and apps/studio | Stub config in apps/web for Phase 1; extract to packages/schemas in Phase 2. See DEC-001. |

---

## Quick Status Summary

- **Last work:** 2026-05-13 — Wired 7 patients page images, replaced Unsplash fallbacks
- **Current issues:** None open
- **Detailed history:** See `tasks/todo-archive.md`

---

### Place 4 providers images — 2026-05-12 [x] COMPLETE 2026-05-12

Replace Unsplash placeholder URLs on providers.astro with project-owned JPGs. Replace testimonial avatar gradient div with img tag.

- [x] A. 2026-05-12 Pulled 4 providers-\*.jpg from origin/main (were in design-source/assets/, not local)
- [x] B. 2026-05-12 Copied all 4 to apps/web/public/images/
- [x] C. 2026-05-12 Updated providers.astro — .h98-bg > img → /images/providers-hero.jpg
- [x] D. 2026-05-12 Updated providers.astro — .l422-card:nth-child(1) img → /images/providers-track-tele.jpg (Teletherapy card)
- [x] E. 2026-05-12 Updated providers.astro — .l422-card:nth-child(2) img → /images/providers-track-facility.jpg (Facility-Based card)
- [x] F. 2026-05-12 Replaced .t37-avatar div (testimonials[0]) with <img> tag; alt="" role="presentation"
- [x] G. 2026-05-12 Added FTC disclosure <small> below t37-meta for testimonial [0]
- [x] H. 2026-05-12 pnpm --filter web build — PASSED (all routes, 0 errors); all 4 images in dist/client/images/

### Session Review — 2026-05-12 (Providers images)

**What was done:** Wired 4 project-owned JPGs into providers.astro, replacing Unsplash placeholders. Replaced the gradient-placeholder `<div class="t37-avatar t37-avatar-init">` for testimonial [0] with a proper `<img>` tag. Added FTC "Image for representation" disclosure.

**Files changed:**

- `apps/web/public/images/providers-hero.jpg` (new)
- `apps/web/public/images/providers-track-tele.jpg` (new)
- `apps/web/public/images/providers-track-facility.jpg` (new)
- `apps/web/public/images/providers-testimonial-avatar.jpg` (new)
- `apps/web/src/pages/providers.astro` — 3 img src replacements, 1 div→img swap, 1 FTC disclosure added

**Implementation notes:**

- Task spec had facility/tele mapped to wrong nth-child selectors; confirmed DOM order and swapped (`:nth-child(1)` = Teletherapy, `:nth-child(2)` = Facility-Based)
- Testimonial [0] (FB, Facility-Based) gets the avatar photo; testimonial [1] (TT, Teletherapy) stays as gradient placeholder
- FTC disclosure: `<small style="display:block;font-size:12px;color:#9CA3AF;margin-top:4px;">Image for representation</small>` after t37-meta div
- No CSS classes renamed, no DOM restructured, no other HTML touched

**Verification:** Build PASS — all routes, 0 errors. All 4 files confirmed in dist/client/images/ ✓

---

### Wire 13 homepage images — 2026-05-12 [x] COMPLETE 2026-05-12

Replace all Unsplash placeholder URLs on the homepage with project-owned JPGs.
Commit: c5dbfef — branch feat/homepage-images → merged to main → pushed → Cloudflare auto-deploying

- [x] A. 2026-05-12 Downloaded all 13 home-\*.jpg from GitHub remote to design-source/assets/
- [x] B. 2026-05-12 Created apps/web/public/images/ and copied all 13 JPGs there
- [x] C. 2026-05-12 Updated index.astro — hero img src fallback → /images/home-hero.jpg
- [x] D. 2026-05-12 Updated index.astro — 3 router .r-wide-image bg URLs (communities, patients, providers)
- [x] E. 2026-05-12 Updated index.astro — 2 .twoways-card-bg URLs (tele, facility)
- [x] F. 2026-05-12 Updated index.astro — 4 .l349-img bg URLs (depression, grief, ptsd, relationships)
- [x] G. 2026-05-12 Updated index.astro — 2 .testimonial-avatar bg URLs + FTC "Image for illustration" disclosure
- [x] H. 2026-05-12 Updated index.astro — .provider-bg Sanity fallback → /images/home-provider-bg.jpg
- [x] I. 2026-05-12 pnpm --filter web build — PASSED (17 routes, 0 errors); all 13 images in dist/client/images/

### Session Review — 2026-05-12

**What was done:** Wired 13 project-owned JPGs into the homepage, replacing all Unsplash placeholder URLs.

**Files changed:**

- `apps/web/public/images/home-*.jpg` (13 new files)
- `apps/web/src/pages/index.astro` — 13 URL replacements, 2 FTC disclosure `<p>` tags added, placeholder initials removed

**Implementation notes:**

- Hero: `src` fallback → `/images/home-hero.jpg`; Sanity URL still takes precedence
- Router cards (3): `.r-wide-image` inline bg-image updated
- Two Ways (2): `.twoways-card-bg` inline bg-image updated
- Conditions (4): `.l349-img` inline background updated
- Testimonials (2): `.testimonial-avatar` bg updated; `<p style="font-size:11px;color:#9CA3AF;...">Image for illustration</p>` added after each `.testimonial-attribution`
- Provider bg: Sanity `??` fallback updated
- No CSS classes renamed, no DOM restructured, no object-fit/position CSS touched

**Verification:** Build PASS — 17 routes, 0 errors. All 13 files in dist/client/images/ ✓

**Issues:** Review section accidentally written to wrong todo.md (byt-website project dir instead of repo). Corrected in /post.

---

### Wire 7 patients page images — 2026-05-13 [x] COMPLETE 2026-05-13

Replace all Unsplash placeholder fallback URLs on patients.astro with project-owned JPGs.

- [x] A. 2026-05-13 Confirmed all 7 images exist in design-source/assets/ on GitHub remote
- [x] B. 2026-05-13 Printed current state of all 7 slots — all had <img> tags, all had Unsplash fallbacks
- [x] C. 2026-05-13 Copied 7 JPGs from design-source/assets/ to apps/web/public/images/
- [x] D. 2026-05-13 Updated .ph-hero-bg img — fallback src + alt
- [x] E. 2026-05-13 Updated 4 .ph-card-img img slots (families, adults, caregivers, espanol) — fallback src + alt
- [x] F. 2026-05-13 Updated 2 .ph-way-bg img slots (tele `:nth-child(1)`, facility `:nth-child(2)`) — fallback src + alt
- [x] G. 2026-05-13 pnpm --filter web build — PASSED (17 routes, 0 errors); all 7 images confirmed in dist/client/images/

### Session Review — 2026-05-13

**What was done:** Wired 7 project-owned JPGs into patients.astro, replacing all Unsplash placeholder fallback URLs. Sanity ternaries preserved — local images are fallbacks only.

**Files changed:**

- `apps/web/public/images/patients-hero-bg.jpg` (new)
- `apps/web/public/images/patients-card-families.jpg` (new)
- `apps/web/public/images/patients-card-adults.jpg` (new)
- `apps/web/public/images/patients-card-caregivers.jpg` (new)
- `apps/web/public/images/patients-card-espanol.jpg` (new)
- `apps/web/public/images/patients-track-tele.jpg` (new)
- `apps/web/public/images/patients-track-facility.jpg` (new)
- `apps/web/src/pages/patients.astro` — 7 fallback src replacements + alt text updates

**Implementation notes:**

- Task spec had facility/tele mapped to wrong nth-child selectors (Lesson 16 applies); confirmed DOM order: `:nth-child(1)` = Teletherapy, `:nth-child(2)` = Facility
- All slots already had `<img>` tags — no placeholder div → img swaps needed
- Sanity ternary structure preserved: `src={sanityVar ?? '/images/filename.jpg'}`
- No CSS classes renamed, no DOM restructured, no other HTML touched

**Verification:** Build PASS — 17 routes, 0 errors. All 7 files confirmed in dist/client/images/ ✓

**Issues:** Task review initially written to wrong tasks/ directory (/home/personal/projects/byt-website/tasks/ instead of repo). Corrected before commit.

---

### Wire 2 About Us page images — 2026-05-13 [x] COMPLETE 2026-05-13

Install hero team photo and CTA background on about.astro.

- [x] A. 2026-05-13 Created apps/web/public/images/about/ and copied about-hero-team.png + about-cta-bg.png from design-source/assets/
- [x] B. 2026-05-13 Updated .about-hero-image img — static src (no Sanity ternary existed); alt → "Better You Therapy clinical team in South Florida"
- [x] C. 2026-05-13 Updated .about-cta-bg — replaced Unsplash fallback URL; Sanity ternary preserved as primary
- [x] D. 2026-05-13 pnpm --filter web build — PASSED (0 errors); both images confirmed in dist/client/images/about/

### Session Review — 2026-05-13 (About Images)

**What was done:** Wired 2 project-owned PNGs into about.astro, replacing Unsplash placeholder URLs. Sanity ternary for CTA bg preserved — local image is fallback only. Hero slot had no Sanity ternary; static path set directly.

**Files changed:**

- `apps/web/public/images/about/about-hero-team.png` (new)
- `apps/web/public/images/about/about-cta-bg.png` (new)
- `apps/web/src/pages/about.astro` — 2 URL replacements

**Implementation notes:**

- Hero: `.about-hero-image img` had no Sanity ternary — replaced static Unsplash `src` directly with `/images/about/about-hero-team.png`
- CTA bg: `.about-cta-bg` had `page?.ctaBackgroundImage?.asset?.url ?? [unsplash]` — kept Sanity primary, replaced fallback only
- Overlay CSS (`opacity: 0.22` + navy gradient on `.about-cta-overlay`) left untouched per instructions
- No CSS classes renamed, no DOM restructured, no other HTML touched

**Verification:** Build PASS — 0 errors. Both files confirmed in dist/client/images/about/ ✓

**Issues:** Session review initially written to wrong tasks/ directory (/home/personal/projects/byt-website/tasks/ instead of repo). Lesson 15 violated. Corrected during /post.
