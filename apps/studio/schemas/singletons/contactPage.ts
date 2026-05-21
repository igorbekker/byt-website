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
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'imageWithAlt' }),
    defineField({ name: 'hoursDescription', title: 'Hours Description', type: 'text' }),
    defineField({ name: 'infoEyebrow', title: 'Info Section Eyebrow', type: 'string' }),
    defineField({ name: 'infoHeading', title: 'Info Section Heading', type: 'string' }),
    defineField({ name: 'formHeading', title: 'Form Section Heading', type: 'string' }),
    defineField({ name: 'disclaimerCopy', title: 'Disclaimer Copy', type: 'text' }),
    defineField({ name: 'responseCopy', title: 'Response Copy', type: 'text' }),
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
    prepare: ({ title }: { title?: string }) => ({ title: title ?? 'Contact' }),
  },
});
