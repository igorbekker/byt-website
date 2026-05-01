/**
 * Purpose: One card in the AudienceRouter section with collapsed and expanded copy states
 * Context: Homepage AudienceRouter section (.r-card, .r-card-wide, .r-card-narrow)
 * Source: design-source/pages/Homepage.html (.router-section, .r-card)
 */
import { defineType, defineField } from 'sanity';

export const audienceCard = defineType({
  name: 'audienceCard',
  title: 'Audience Card',
  type: 'object',
  description:
    'One card in the AudienceRouter section. Has collapsed (narrow) and expanded (wide) copy states.',
  fields: [
    defineField({
      name: 'tagline',
      title: 'Eyebrow / Tagline',
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
      name: 'bodyCollapsed',
      title: 'Body (Collapsed State)',
      type: 'text',
      description: 'Short copy shown when the card is in narrow/inactive state (2–3 lines).',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'bodyExpanded',
      title: 'Body (Expanded State)',
      type: 'text',
      description: 'Full copy shown when the card is selected/active.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Card Image',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'ctaLink',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'tagline' },
  },
});
