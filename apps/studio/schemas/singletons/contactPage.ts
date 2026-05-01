/**
 * Purpose: Contact page singleton — hero, hours, disclaimer, and response copy
 * Context: Rendered by apps/web/src/pages/contact.astro
 * Source: design-source/pages/Contact.html
 */
import { defineType, defineField } from 'sanity';

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'heroSubhead', title: 'Hero Subhead', type: 'text' }),
    defineField({ name: 'hoursDescription', title: 'Hours Description', type: 'text' }),
    defineField({ name: 'disclaimerCopy', title: 'Disclaimer Copy', type: 'text' }),
    defineField({ name: 'responseCopy', title: 'Response Copy', type: 'text' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoFields' }),
  ],
  preview: {
    select: { title: 'heroHeading' },
    prepare: ({ title }: { title?: string }) => ({ title: title ?? 'Contact' }),
  },
});
