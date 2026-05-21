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
