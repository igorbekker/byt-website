/**
 * Purpose: Global site settings — contact info, URLs, nav/footer copy, default SEO
 * Context: Queried on every page via SITE_SETTINGS_QUERY; used in Nav, Footer, CTAs
 * Source: design-source/partials/nav.html, design-source/partials/footer.html
 */
import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'businessName',
      title: 'Business Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        defineField({ name: 'street', title: 'Street', type: 'string' }),
        defineField({ name: 'city', title: 'City', type: 'string' }),
        defineField({ name: 'state', title: 'State', type: 'string' }),
        defineField({ name: 'zip', title: 'ZIP Code', type: 'string' }),
      ],
    }),
    defineField({ name: 'fax', title: 'Fax', type: 'string' }),
    defineField({
      name: 'bookingUrl',
      title: 'Booking URL',
      type: 'string',
      description: 'URL for "Book a Session" CTA across the site.',
    }),
    defineField({
      name: 'referralUrl',
      title: 'Referral URL',
      type: 'string',
      description: 'URL for "Refer a Resident" CTA across the site.',
    }),
    defineField({
      name: 'navCtaLabel',
      title: 'Nav CTA Label',
      type: 'string',
      description: 'Primary CTA button label in the navigation bar.',
    }),
    defineField({
      name: 'navCtaSecondaryLabel',
      title: 'Nav Secondary CTA Label',
      type: 'string',
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'text',
      description: 'Tagline text beneath the logo in the footer.',
    }),
    defineField({
      name: 'copyrightEntity',
      title: 'Copyright Entity',
      type: 'string',
      description: 'e.g. "Better You Therapy LLC"',
    }),
    defineField({ name: 'newsletterHeading', title: 'Newsletter Heading', type: 'string' }),
    defineField({ name: 'newsletterBody', title: 'Newsletter Body', type: 'text' }),
    defineField({
      name: 'seo',
      title: 'Default SEO',
      type: 'seoFields',
      description: 'Fallback SEO fields used when a page has no override.',
    }),
  ],
});
