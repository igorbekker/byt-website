/**
 * Purpose: Privacy Policy page singleton — full Portable Text body + SEO
 * Context: Rendered by apps/web/src/pages/privacy.astro
 * Source: design-source/pages/Privacy Policy.html
 */
import { defineType, defineField } from 'sanity';

export const privacyPage = defineType({
  name: 'privacyPage',
  title: 'Privacy Policy',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'string',
      description: 'The URL path for this page (e.g. "about" = /about/). Leave empty for homepage.',
      validation: (r) =>
        r.required().custom((value, context) => {
          if (context.document?._type === 'homePage' && value === '') return true;
          if (!value) return 'Slug is required';
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))
            return 'Slug must be lowercase letters, numbers, and hyphens only';
          return true;
        }),
    }),
    defineField({
      name: 'oldSlugs',
      title: 'Previous URL Slugs (auto-managed)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Previous slugs that redirect to the current slug. Do not edit manually.',
      readOnly: true,
    }),
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
      description: 'Full legal content. Rendered as Portable Text on the /privacy/ page.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoFields' }),
  ],
  preview: {
    prepare: () => ({ title: 'Privacy Policy' }),
  },
});
