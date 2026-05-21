# SKILL: Quality Assurance

Domain knowledge for the QA agent. Performance targets, validation criteria, diagnostic guides.

---

## Performance Targets

| Metric                    | Target              |
| ------------------------- | ------------------- |
| Lighthouse Performance    | 95+                 |
| Lighthouse Accessibility  | 95+                 |
| Lighthouse Best Practices | 95+                 |
| Lighthouse SEO            | 95+                 |
| LCP                       | < 2.5s              |
| CLS                       | < 0.1               |
| INP                       | < 200ms             |
| Per-page JS shipped       | 0KB (Astro default) |

---

## Design-Source Parity Checklist

Compare live/preview against `design-source/` HTML files:

- Layout structure (section order, grid columns, flex direction)
- Colors reference tokens defined in `global.css`. No `--byt-*` prefixed tokens. No rogue hex values.
- Typography (family, weight, size, line-height, letter-spacing)
- Spacing (padding, margin, gap)
- Component states (hover, active, focus)
- Responsive behavior
- Images render (no broken src, no missing alt)

### Documenting Divergences

1. Page, section, element
2. Expected (design-source file path + line number)
3. Actual (live/preview)
4. Severity (P1/P2/P3)
5. Create `OBS-XXX-design-divergence-<page>.md`

---

## Accessibility (WCAG 2.2 AA)

- Images: `alt` on all (meaningful for content, empty for decorative)
- Headings: logical hierarchy (no skipped levels)
- Contrast: 4.5:1 normal text, 3:1 large text
- Keyboard: all interactive elements accessible
- Focus: visible indicators
- Forms: inputs have associated labels
- ARIA: correct use, not overuse
- Language: `lang` on `<html>`
- Navigation: skip-to-content link

---

## SEO Schema Requirements

| Page Type  | Required JSON-LD                              |
| ---------- | --------------------------------------------- |
| Homepage   | MedicalOrganization + LocalBusiness           |
| Blog posts | Article + Author + Publisher + BreadcrumbList |
| FAQ page   | FAQPage                                       |
| All pages  | BreadcrumbList                                |

### Validation

```bash
grep -o '<script type="application/ld+json">.*</script>' dist/<page>/index.html | \
  sed 's/<[^>]*>//g' | python3 -m json.tool
```

Check: valid JSON, required fields present, no hardcoded values, consistent `@id` references.

---

## No-Hardcoding Scan

Every QA pass must verify no hardcoded values leaked:

| Type   | Scan for                                             |
| ------ | ---------------------------------------------------- |
| Colors | Hex values outside `global.css` and `design-source/` |
| Phone  | Any phone literal in templates                       |
| Email  | Any email literal in templates                       |
| URLs   | Site URL not from env var                            |
| Copy   | Inline strings that should come from Sanity          |
| Images | Direct URLs that should be Sanity assets             |
| Forms  | Formspree URLs not from env vars                     |

---

## Lighthouse Diagnostic Guide

| Symptom     | Likely Cause                                 | Where to Look                   |
| ----------- | -------------------------------------------- | ------------------------------- |
| LCP > 2.5s  | Hero image, font loading, render-blocking    | `<Image>` component, font links |
| CLS > 0.1   | Images without dimensions, dynamic injection | `<img>` tags, client-side JS    |
| INP > 200ms | JS execution                                 | Should be ~0 for Astro static   |
| a11y < 95   | Missing alt, contrast, heading gaps          | axe-core, WCAG checklist        |
| SEO < 95    | Missing meta, schema, sitemap                | `<head>`, JSON-LD, `robots.txt` |

---

## Severity Reference

| Level | Definition                          | Action                            |
| ----- | ----------------------------------- | --------------------------------- |
| P0    | Site broken, data loss              | Block deploy. Notify immediately. |
| P1    | Visible bug, broken UX, schema fail | Block merge. Must fix.            |
| P2    | Performance/a11y, minor visual      | Fix this sprint.                  |
| P3    | Cosmetic                            | Backlog.                          |

---

## 226-Item QA Checklist

### SEO Meta (25)

1. canonical present on all pages
2. og:title present on all pages
3. og:description present on all pages
4. og:url present on all pages
5. og:type present on all pages
6. og:site_name present on all pages
7. og:locale present on all pages
8. twitter:card present on all pages
9. twitter:title present on all pages
10. twitter:description present on all pages
11. JSON-LD script tag present on all pages
12. theme-color present on all pages
13. robots meta present on all pages
14. skip link present on all pages
15. main id="main-content" present on all pages
16. prefers-reduced-motion in dist CSS
17. focus-visible in dist CSS
18. breadcrumbs on all non-homepage pages
19. sitemap-index.xml present in dist/
20. robots.txt present in dist/
21. meta description 150–160 characters
22. title tag 50–60 characters
23. canonical is absolute URL with domain
24. og:image present on all pages
25. MedicalOrganization JSON-LD on homepage only

### Accessibility WCAG 2.2 AA (30)

26. html lang="en" on all pages
27. viewport no maximum-scale restriction
28. viewport no user-scalable=no
29. all content images have non-empty alt text
30. all srcset images have explicit width+height
31. every nav element has aria-label
32. .sr-only class defined in global CSS
33. color-scheme declared in :root
34. @media print stylesheet exists
35. --z-base token declared
36. --z-dropdown token declared
37. --z-sticky token declared
38. --z-overlay token declared
39. --z-modal token declared
40. --z-toast token declared
41. --z-skip-link token declared
42. safe-area env() present in CSS
43. skip link navigates to #main-content
44. :focus-visible outline defined
45. heading hierarchy logical (no skipped levels)
46. color contrast ≥ 4.5:1 for normal text
47. color contrast ≥ 3:1 for large text and UI components
48. form inputs have associated labels
49. buttons have accessible names
50. ARIA attributes used correctly (not overused)
51. ARIA tab pattern on communities page
52. modal has role=dialog and aria-modal=true
53. mobile menu has role=dialog
54. breadcrumb nav has aria-label=Breadcrumb
55. breadcrumb current item has aria-current=page

### Performance CWV (25)

56. fetchpriority="high" on hero/LCP image
57. loading="lazy" on below-fold images
58. decoding="async" on content images
59. no CSS @import for fonts (use link tag)
60. content-visibility on below-fold sections
61. preconnect cdn.sanity.io on all pages
62. no render-blocking external scripts in head
63. overflow-wrap: break-word on headings
64. font: inherit on form elements
65. Google Fonts loaded via link not @import
66. preconnect fonts.googleapis.com
67. preconnect fonts.gstatic.com with crossorigin
68. WebP format (?fm=webp) on Sanity CDN images
69. srcset with 400w/800w/1200w on Sanity images
70. only one image has fetchpriority=high per page
71. LCP target < 2.5s
72. CLS target < 0.1
73. INP target < 200ms
74. Lighthouse Performance ≥ 95
75. Lighthouse Accessibility ≥ 95
76. Lighthouse Best Practices ≥ 95
77. Lighthouse SEO ≥ 95
78. JS shipped per page: 0KB (Astro static)
79. no unnecessary third-party scripts
80. scroll-behavior: smooth declared

### HTML/CSS Standards (25)

81. Manrope font loaded for headings
82. Montserrat font loaded for body
83. --font-size-base: 15px (not 16px)
84. --line-height-base: 1.55 declared
85. --max-w: 1200px declared
86. --pad-x responsive at 1024px and 768px
87. --navy token declared
88. --coral token declared
89. --sage token declared
90. --border token declared
91. --r-btn: 6px declared
92. --r-card: 12px declared
93. --r-pill: 999px declared
94. --t-hover: 0.15s ease declared
95. no --byt-\* prefixed tokens in any .astro file
96. no rogue hex values outside token set
97. text-wrap: balance on headings
98. text-wrap: pretty on paragraphs
99. scroll-margin-top on :target (accounts for sticky nav)
100.  -webkit-text-size-adjust: 100% declared
101.  -webkit-font-smoothing: antialiased declared
102.  box-sizing: border-box on \* declared
103.  img, video: max-width: 100%
104.  a: color: inherit declared
105.  body padding-left/right for safe-area

### CMS/Content Parity (25)

106. every page has SCHEMA step complete
107. every page has QUERY step complete
108. every page has TEMPLATE step complete
109. every page has SEED step complete
110. every image field uses imageWithAlt type
111. every Sanity variable has ?? fallback
112. no .map() loops replacing HTML structure
113. no hardcoded phone numbers in templates
114. no hardcoded email addresses in templates
115. no hardcoded business address in templates
116. GTM container ID from Sanity (not hardcoded)
117. robotsTxt from Sanity (not hardcoded)
118. seo.metaTitle wired on every page
119. seo.metaDescription wired on every page
120. seo.robotsDirective wired on every page
121. canonical URL correct for each page
122. published documents exist in Sanity for each page
123. no "drafts." prefix in mutations
124. images use \_type: imageWithAlt
125. siteSettings document exists and published
126. formSettings document exists and published
127. blogIndexPage document exists
128. redirect documents managed via Studio tool
129. no hardcoded GTM ID in templates
130. CMS-SKIP comments on all intentional hardcodes

### Design Parity (25)

131. section count matches design-source for each page
132. no Sanity .map() loops in template HTML structure
133. all Sanity vars have ?? fallbacks
134. all script tags have is:inline attribute
135. no class renaming vs design-source
136. no global.css-owned selectors in page style blocks
137. no --byt-\* tokens in any .astro file
138. link count within 35 of design-source (BaseLayout offset)
139. hero section present and matches design-source
140. audience router/CTA section present
141. how-it-works section present
142. testimonials section present
143. footer matches across all pages
144. nav matches across all pages
145. mobile menu present and accessible
146. IntersectionObserver fade-up animations work
147. container max-width: 1200px
148. base font-size: 15px
149. fonts loaded: Manrope and Montserrat
150. no broken image sources
151. CTAs have correct onclick handlers
152. button variants match design-source
153. section padding/spacing matches design-source
154. color tokens match design-source colors
155. typography scale matches design-source

### Forms (20)

156. book-a-session form modal opens
157. refer-a-facility form modal opens
158. required fields enforce validation
159. honeypot field present and hidden
160. correct Formspree endpoint wired
161. form success message displays after submission
162. error states display on invalid input
163. all form inputs have associated labels
164. consent checkbox is required
165. form step 1 → step 2 → confirmation flow works
166. newsletter form in footer
167. resident referral form page loads
168. form labels are screen-reader accessible
169. client-side validation fires before submission
170. form submission reaches Formspree endpoint
171. book form multi-step navigation works
172. refer form multi-step navigation works
173. mobile form layout is responsive
174. form modals close on backdrop click
175. form modals close on Escape key

### Images (15)

176. hero image loads from Sanity CDN
177. hero image has fetchpriority=high
178. hero image has descriptive alt text
179. hero image has srcset with WebP
180. hero image has explicit width+height
181. below-fold content images have loading=lazy
182. all Sanity CDN images use ?fm=webp format
183. all Sanity CDN images have srcset
184. alt text is meaningful (not "image" or empty on content images)
185. footer logo loads from /assets/logo-white-trans.png
186. nav logo loads from /assets/logo.png
187. no broken image sources (onerror fallback present)
188. content images have decoding=async
189. images do not overflow containers on mobile
190. no images with both fetchpriority=high and loading=lazy

### Navigation & Footer (10)

191. sticky nav stays visible on scroll
192. all nav links navigate correctly
193. mobile hamburger visible below 1024px
194. mobile menu contains all nav links
195. mobile menu closes on overlay click
196. footer has all required links (Privacy, Terms, Refer)
197. footer newsletter form present and functional
198. footer copyright displays current year
199. legal links (Privacy Policy, Terms of Service) in footer
200. skip link targets #main-content correctly

### JSON-LD Structured Data (15)

201. homepage MedicalOrganization schema present
202. homepage LocalBusiness schema present
203. homepage WebSite schema with SearchAction
204. blog posts have Article schema
205. blog posts have Author schema
206. blog posts have Publisher referencing #organization
207. all non-homepage pages have BreadcrumbList
208. JSON-LD is valid, parseable JSON
209. @id cross-references consistent between graph nodes
210. no hardcoded phone in JSON-LD (from Sanity)
211. no hardcoded email in JSON-LD (from Sanity)
212. no hardcoded address in JSON-LD (from Sanity)
213. sameAs array references correct URLs
214. areaServed lists all four SE Florida counties
215. medicalSpecialty: MentalHealth present

### Cross-Browser & Responsive (11)

216. layout correct at 375px (iPhone SE)
217. layout correct at 768px (tablet)
218. layout correct at 1200px+ (desktop)
219. no horizontal overflow on mobile
220. touch targets ≥ 44×44px for interactive elements
221. no fixed widths that break layout on small screens
222. images constrained within containers on mobile
223. mobile CTA bar visible below 768px
224. mobile menu drawer works on iOS Safari
225. viewport meta allows user zoom
226. no flash of unstyled content (FOUC)
