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
    defineField({ name: 'seo', title: 'SEO', type: 'seoFields' }),
  ],
  preview: {
    select: { title: 'heroHeading' },
    prepare: ({ title }: { title?: string }) => ({ title: title ?? 'Careers' }),
  },
});
