/**
 * Purpose: Careers page singleton — hero, open positions intro, no-fit section
 * Context: Rendered by apps/web/src/pages/careers.astro
 * Source: design-source/pages/Careers.html
 */
import { defineType, defineField } from 'sanity';

export const careersPage = defineType({
  name: 'careersPage',
  title: 'Careers',
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
    defineField({ name: 'heroEyebrow', title: 'Hero Eyebrow', type: 'string' }),
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'heroSubhead', title: 'Hero Subhead', type: 'text' }),
    defineField({ name: 'openPositionsEyebrow', title: 'Open Positions Eyebrow', type: 'string' }),
    defineField({ name: 'openPositionsHeading', title: 'Open Positions Heading', type: 'string' }),
    defineField({ name: 'openPositionsIntro', title: 'Open Positions Intro', type: 'text' }),
    defineField({ name: 'noFitHeading', title: 'No Fit Heading', type: 'string' }),
    defineField({ name: 'noFitBody', title: 'No Fit Body', type: 'text' }),
    defineField({
      name: 'sections',
      title: 'Section Visibility',
      type: 'array',
      of: [{ type: 'pageSection' }],
      description:
        'Leave empty to show all sections. Add entries to control individual section visibility.',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoFields' }),
  ],
  preview: {
    select: { title: 'heroHeading' },
    prepare: ({ title }: { title?: string }) => ({ title: title ?? 'Careers' }),
  },
});
