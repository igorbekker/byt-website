/**
 * Purpose: Terms and Conditions page singleton — full Portable Text body + SEO
 * Context: Rendered by apps/web/src/pages/terms.astro
 * Source: design-source/pages/Terms and Conditions.html
 */
import { defineType, defineField } from 'sanity';

export const termsPage = defineType({
  name: 'termsPage',
  title: 'Terms and Conditions',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page Title', type: 'string' }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'string',
      description: 'Effective date shown on the page, e.g. "May 4, 2026".',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Full legal content. Rendered as Portable Text on the /terms/ page.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoFields' }),
  ],
  preview: {
    prepare: () => ({ title: 'Terms and Conditions' }),
  },
});
