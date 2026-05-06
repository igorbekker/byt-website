// GROQ queries — import and run via useSanityClient() from @sanity/astro

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  businessName,
  phone,
  email,
  fax,
  address,
  bookingUrl,
  referralUrl,
  navCtaLabel,
  navCtaSecondaryLabel,
  footerTagline,
  copyrightEntity,
  newsletterHeading,
  newsletterBody,
  seo
}`;

export const HOME_PAGE_QUERY = `*[_type == "homePage"][0]{
  heroEyebrow,
  heroHeadline,
  heroSubhead,
  heroImage{ asset->{ url }, alt },
  heroPrimaryCta{ label, href, variant },
  heroSecondaryCta{ label, href, variant },
  routerEyebrow,
  routerHeading,
  routerSubhead,
  routerCards[]{
    tagline,
    heading,
    bodyCollapsed,
    bodyExpanded,
    image{ asset->{ url }, alt },
    cta{ label, href, variant }
  },
  beliefQuote,
  beliefBody,
  twoWaysEyebrow,
  twoWaysHeading,
  twoWaysSubhead,
  twoWaysTracks[]{
    label,
    heading,
    body,
    image{ asset->{ url }, alt },
    cta{ label, href, variant }
  },
  conditionsEyebrow,
  conditionsHeading,
  conditionsSubhead,
  howItWorksEyebrow,
  howItWorksHeading,
  teletherapyTrackLabel,
  teletherapySteps[]{ stepNumber, heading, body },
  teletherapyCta{ label, href, variant },
  facilityTrackLabel,
  facilitySteps[]{ stepNumber, heading, body },
  facilityCta{ label, href, variant },
  testimonialsEyebrow,
  testimonialsHeading,
  testimonialsSubhead,
  providerTeaserEyebrow,
  providerTeaserHeading,
  providerTeaserBody,
  providerTeaserImage{ asset->{ url }, alt },
  providerTeaserPrimaryCta{ label, href, variant },
  providerTeaserSecondaryCta{ label, href, variant },
  seo{ metaTitle, metaDescription }
}`;

export const CONDITIONS_HOME_QUERY = `*[_type == "condition" && showOnHomepage == true] | order(order asc) {
  _id,
  tagline,
  heading,
  body,
  image{ asset->{ url }, alt }
}`;

export const TESTIMONIALS_HOME_QUERY = `*[_type == "testimonial"] | order(_createdAt desc)[0...6] {
  _id,
  quote,
  authorName,
  authorRole,
  authorOrg,
  authorInitials,
  audienceType
}`;

export const COMMUNITIES_PAGE_QUERY = `*[_type == "communitiesPage"][0]{
  heroHeading, heroSubhead,
  heroCta{ label, href, variant },
  heroImage{ asset->{ url }, alt },
  processEyebrow, processHeading, processSubhead,
  processSteps[]{ stepNumber, heading, body },
  handlesEyebrow, handlesHeading, handlesSubhead,
  handlesItems[]{ heading, body },
  conditionsEyebrow, conditionsHeading, conditionsSubhead,
  serviceAreaHeading, serviceAreaLede,
  ctaHeading, ctaSubhead,
  ctaCta{ label, href, variant },
  seo{ metaTitle, metaDescription }
}`;

export const CONDITIONS_COMMUNITIES_QUERY = `*[_type == "condition" && showOnCommunities == true] | order(order asc) {
  _id, tagline, heading, body
}`;

export const PATIENTS_PAGE_QUERY = `*[_type == "patientsPage"][0]{
  heroHeading, heroSubhead,
  heroImage{ asset->{ url }, alt },
  heroPrimaryCta{ label, href, variant },
  audienceSelectorHeading, audienceSelectorSubhead,
  audienceSelectorCards[]{
    label, heading, body,
    cta{ label, href, variant },
    image{ asset->{ url }, alt }
  },
  deliveryEyebrow, deliveryHeading, deliverySubhead,
  deliveryTracks[]{
    label, heading, body,
    image{ asset->{ url }, alt },
    cta{ label, href, variant }
  },
  beliefQuote, beliefBody,
  conditionsEyebrow, conditionsHeading, conditionsSubhead,
  ctaHeading, ctaSubhead,
  ctaCta{ label, href, variant },
  seo{ metaTitle, metaDescription }
}`;

export const CONDITIONS_PATIENTS_QUERY = `*[_type == "condition" && showOnPatients == true] | order(name asc) {
  _id, tagline, heading, body
}`;

export const PROVIDERS_PAGE_QUERY = `*[_type == "providersPage"][0]{
  heroHeading, heroSubhead,
  heroPrimaryCta{ label, href, variant },
  heroImage{ asset->{ url }, alt },
  tracksEyebrow, tracksHeading, tracksSubhead,
  tracks[]{
    label, heading, body, statusNote,
    cta{ label, href, variant }
  },
  handlesEyebrow, handlesHeading,
  handlesItems[]{ heading, body },
  qualsEyebrow, qualsHeading,
  quals[]{ scope, body },
  ctaHeading, ctaSubhead,
  ctaCta{ label, href, variant },
  seo{ metaTitle, metaDescription }
}`;

export const TESTIMONIALS_THERAPIST_QUERY = `*[_type == "testimonial" && audienceType == "therapist"] | order(_createdAt desc)[0...4] {
  _id, quote, authorName, authorRole, authorOrg, authorInitials
}`;

export const CAREERS_PAGE_QUERY = `*[_type == "careersPage"][0]{
  heroHeading, heroSubhead,
  openPositionsIntro,
  noFitHeading, noFitBody,
  seo{ metaTitle, metaDescription }
}`;

export const JOB_POSTINGS_QUERY = `*[_type == "jobPosting"] | order(order asc) {
  _id, title, track, status, location, slug{ current }
}`;

export const CONTACT_PAGE_QUERY = `*[_type == "contactPage"][0]{
  heroHeading, heroSubhead,
  heroImage{ asset->{ url }, alt },
  hoursDescription, disclaimerCopy, responseCopy,
  seo{ metaTitle, metaDescription }
}`;

export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0]{
  heroHeading, heroSubhead,
  missionEyebrow, missionQuote, missionBody,
  storyEyebrow, storyHeading,
  storyBody[]{
    ...,
    _type == "block" => {
      ...,
      children[]{
        ...,
        _type == "span" => { ..., text, marks }
      }
    }
  },
  founderName, founderCredential,
  founderPhoto{ asset->{ url }, alt },
  principlesEyebrow, principlesHeading, principlesSubhead,
  principles[]{ number, heading, body },
  practiceEyebrow, practiceHeading,
  practicePillars[]{ number, label, heading, body },
  ctaHeading, ctaSubhead,
  ctaPrimary{ label, href, variant },
  ctaSecondary{ label, href, variant },
  ctaBackgroundImage{ asset->{ url }, alt },
  seo{ metaTitle, metaDescription }
}`;

// ── BLOG ─────────────────────────────────────────────────────────────────────

export const BLOG_INDEX_PAGE_QUERY = `*[_type == "blogIndexPage"][0]{
  heroHeading, heroSubhead,
  featuredLabel,
  browseByTopicHeading, browseByTopicSubhead,
  recentlyPublishedHeading,
  newsletterHeading, newsletterSubhead,
  seo{ metaTitle, metaDescription }
}`;

export const BLOG_CATEGORIES_QUERY = `*[_type == "blogCategory"] | order(order asc) {
  _id, title, slug{ current }, description, icon,
  subtopics[]{ title, slug },
  "postCount": count(*[_type == "blogPost" && category._ref == ^._id])
}`;

export const BLOG_CATEGORY_QUERY = `*[_type == "blogCategory" && slug.current == $categorySlug][0]{
  _id, title, slug{ current }, description,
  subtopics[]{ title, slug, description }
}`;

const BLOG_POST_CARD_FIELDS = `
  _id, title, slug{ current }, publishedAt, readingTimeMinutes, excerpt,
  category->{ title, slug{ current } },
  subcategoryLabel,
  author->{ name, credentials, initials },
  featuredImage{ asset->{ url }, alt }
`;

export const BLOG_FEATURED_POST_QUERY = `*[_type == "blogPost" && featured == true] | order(publishedAt desc)[0] {
  ${BLOG_POST_CARD_FIELDS}
}`;

export const BLOG_POSTS_ALL_QUERY = `*[_type == "blogPost"] | order(publishedAt desc) {
  ${BLOG_POST_CARD_FIELDS}
}`;

export const BLOG_CATEGORY_POSTS_QUERY = `*[_type == "blogPost" && category->slug.current == $categorySlug] | order(publishedAt desc) {
  ${BLOG_POST_CARD_FIELDS}
}`;

export const BLOG_SUBCATEGORY_POSTS_QUERY = `*[_type == "blogPost" && category->slug.current == $categorySlug && subcategoryLabel == $subSlug] | order(publishedAt desc) {
  ${BLOG_POST_CARD_FIELDS}
}`;

export const BLOG_POST_QUERY = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id, title, slug{ current }, publishedAt, readingTimeMinutes, excerpt,
  category->{ title, slug{ current } },
  subcategoryLabel,
  featuredImage{ asset->{ url }, alt },
  body[]{
    ...,
    _type == "block" => {
      ...,
      children[]{ ..., _type == "span" => { ..., text, marks } }
    }
  },
  author->{ name, credentials, initials, photo{ asset->{ url }, alt }, bio },
  seo{ metaTitle, metaDescription }
}`;

export const BLOG_POST_PATHS_QUERY = `*[_type == "blogPost"]{ "slug": slug.current }`;

export const BLOG_CATEGORY_PATHS_QUERY = `*[_type == "blogCategory"]{ "slug": slug.current }`;

export const BLOG_RELATED_POSTS_QUERY = `*[_type == "blogPost" && category->slug.current == $categorySlug && _id != $excludeId] | order(publishedAt desc)[0...3] {
  _id, title, slug{ current }, readingTimeMinutes, excerpt,
  category->{ title, slug{ current } }
}`;

export const BLOG_SUBCATEGORY_PATHS_QUERY = `*[_type == "blogCategory" && defined(subtopics) && count(subtopics) > 0]{
  "categorySlug": slug.current,
  "subs": subtopics[]{ "subSlug": slug }
}`;

// ── LEGAL PAGES ───────────────────────────────────────────────────────────────

export const PRIVACY_PAGE_QUERY = `*[_type == "privacyPage"][0]{
  body[]{
    ...,
    _type == "block" => {
      ...,
      children[]{ ..., _type == "span" => { ..., text, marks } }
    }
  },
  seo{ metaTitle, metaDescription }
}`;

export const TERMS_PAGE_QUERY = `*[_type == "termsPage"][0]{
  body[]{
    ...,
    _type == "block" => {
      ...,
      children[]{ ..., _type == "span" => { ..., text, marks } }
    }
  },
  seo{ metaTitle, metaDescription }
}`;
