# HOOK_04: LLM/GEO Readability Check

**Trigger:** After content changes, or before launch
**Purpose:** Ensure pages are structured for AI answer engines (Google SGE, ChatGPT, Perplexity)

## CC Prompt Template

```
TASK: Run LLM readability check on [PAGE].astro

1. Read the rendered HTML structure (not the .astro source — the built output)
2. Check for:
   - Clear semantic HTML: <article>, <section>, <nav>, <header>, <footer>, <aside>
   - Heading hierarchy tells a complete story when read alone (h1 → h2 → h3)
   - FAQ markup: if FAQ exists, uses FAQPage JSON-LD schema
   - Service descriptions: use MedicalBusiness or HealthAndBeautyBusiness schema
   - Geographic specificity: LocalBusiness with areaServed
   - Author/expertise signals: author markup on blog, credentials on service pages
   - HowTo schema for process/step sections
   - Review/testimonial markup where applicable

3. Score:
   - Structured data completeness: X/10
   - Semantic HTML quality: X/10
   - Heading story coherence: X/10
   - Entity specificity (names, locations, credentials cited): X/10

FAIL CONDITIONS:
- No structured data on a service or blog page
- Generic headings that don't contain entity-specific language
- Process sections without HowTo schema
- No geographic signals on location-based service pages

MANDATORY VERIFICATION:
☐ Page checked: ___
☐ JSON-LD types present: ___
☐ Semantic HTML score: ___/10
☐ Heading hierarchy score: ___/10
☐ Entity specificity score: ___/10
☐ Recommendations: ___
```
