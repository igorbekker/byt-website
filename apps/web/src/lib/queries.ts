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
