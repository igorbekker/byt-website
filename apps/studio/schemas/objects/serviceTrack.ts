/**
 * Purpose: One full-bleed card in the Two Ways / Delivery Options sections
 * Context: Homepage TwoWays section and Patients/Communities delivery tracks
 * Source: design-source/pages/Homepage.html (.twoways-card), design-source/pages/Patients.html
 */
import { defineType, defineField } from 'sanity';

export const serviceTrack = defineType({
  name: 'serviceTrack',
  title: 'Service Track',
  type: 'object',
  description: 'One full-bleed card in the Two Ways / Delivery Options sections.',
  fields: [
    defineField({
      name: 'label',
      title: 'Eyebrow Label',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
    }),
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'ctaLink',
    }),
    defineField({
      name: 'image',
      title: 'Background Image',
      type: 'imageWithAlt',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'label' },
  },
});
