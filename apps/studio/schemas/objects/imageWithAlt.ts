/**
 * Purpose: Reusable image type with required alt text
 * Context: Used across all schemas that embed images (hero, cards, author photos)
 * Source: design-source/pages/Homepage.html, design-source/pages/About.html
 */
import { defineType, defineField } from 'sanity';

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image with Alt Text',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      validation: (r) => r.required().warning('Alt text is required for accessibility'),
    }),
  ],
});
