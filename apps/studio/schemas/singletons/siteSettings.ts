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
    defineField({ name: 'newsletterEyebrow', title: 'Newsletter Eyebrow', type: 'string' }),
    defineField({ name: 'newsletterDisclaimer', title: 'Newsletter Disclaimer', type: 'text' }),
    defineField({
      name: 'gtmContainerId',
      title: 'GTM Container ID',
      type: 'string',
      description: 'Google Tag Manager container ID, e.g. GTM-XXXXXXX. Leave blank to disable GTM.',
    }),
    defineField({
      name: 'robotsTxt',
      title: 'robots.txt Custom Rules',
      type: 'text',
      description:
        'Custom robots.txt directives appended before the Sitemap line. One directive per line.',
    }),
    defineField({
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navLink',
          title: 'Nav Link',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'children',
              title: 'Dropdown Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'navSubLink',
                  title: 'Sub Link',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: 'href',
                      title: 'URL',
                      type: 'string',
                      validation: (r) => r.required(),
                    }),
                  ],
                  preview: { select: { title: 'label', subtitle: 'href' } },
                },
              ],
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer Link Columns',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'footerColumn',
          title: 'Footer Column',
          fields: [
            defineField({
              name: 'heading',
              title: 'Column Heading',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'footerLink',
                  title: 'Link',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: 'href',
                      title: 'URL',
                      type: 'string',
                      validation: (r) => r.optional(),
                    }),
                    defineField({
                      name: 'action',
                      title: 'Modal Action',
                      type: 'string',
                      description:
                        'If set, renders a button that opens this modal instead of a link. Values: book, refer. Leave empty for normal links.',
                      options: {
                        list: [
                          { title: 'Open Book Modal', value: 'book' },
                          { title: 'Open Refer Modal', value: 'refer' },
                        ],
                      },
                    }),
                  ],
                  preview: { select: { title: 'label', subtitle: 'href' } },
                },
              ],
            }),
          ],
          preview: { select: { title: 'heading' } },
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'Default SEO',
      type: 'seoFields',
      description: 'Fallback SEO fields used when a page has no override.',
    }),
  ],
});
