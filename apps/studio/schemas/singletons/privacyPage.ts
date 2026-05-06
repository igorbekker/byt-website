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
