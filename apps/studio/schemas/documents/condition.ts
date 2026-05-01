/**
 * Purpose: Condition document — mental health condition for sticky-scroll sections
 * Context: Homepage ConditionsScroll, Patients and Communities conditions sections
 * Source: design-source/pages/Homepage.html (.l349-section), design-source/pages/Patients.html
 */
import { defineType, defineField } from 'sanity';

export const condition = defineType({
  name: 'condition',
  title: 'Condition',
  type: 'document',
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  fields: [
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Eyebrow label, e.g. "Depression"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'e.g. "Depression & Anxiety"',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'body', title: 'Body', type: 'text' }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
      description: 'The sticky-scroll section image',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Sort order across all pages',
    }),
    defineField({
      name: 'showOnHomepage',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'showOnPatients',
      title: 'Show on Patients Page',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'showOnCommunities',
      title: 'Show on Communities Page',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'tagline' },
  },
});
