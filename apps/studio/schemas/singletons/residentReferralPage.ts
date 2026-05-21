/**
 * Purpose: Resident Referral page singleton — hero, HIPAA notice, sidebar instructions
 * Context: Rendered by apps/web/src/pages/resident-referral.astro
 */
import { defineType, defineField } from 'sanity';

export const residentReferralPage = defineType({
  name: 'residentReferralPage',
  title: 'Resident Referral',
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
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      options: { rows: 3 },
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      options: { rows: 3 },
    }),
    defineField({ name: 'hipaaNotice', title: 'HIPAA Notice', type: 'text', options: { rows: 2 } }),
    defineField({
      name: 'sidebarInstructions',
      title: 'Sidebar Instructions',
      type: 'text',
      options: { rows: 4 },
    }),
  ],
  preview: {
    select: { title: 'heroHeading' },
    prepare: ({ title }: { title?: string }) => ({ title: title ?? 'Resident Referral' }),
  },
});
