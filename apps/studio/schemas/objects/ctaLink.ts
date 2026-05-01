/**
 * Purpose: Reusable CTA button link with label, URL, and visual variant
 * Context: Used in hero sections, audience cards, service tracks, nav, and page CTAs
 * Source: design-source/styles/base.css (.btn variants), design-source/pages/Homepage.html
 */
import { defineType, defineField } from 'sanity';

export const ctaLink = defineType({
  name: 'ctaLink',
  title: 'CTA Link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Button Style',
      type: 'string',
      options: {
        list: [
          { title: 'Coral (primary)', value: 'btn-coral' },
          { title: 'Ink (dark fill)', value: 'btn-ink' },
          { title: 'Sage (green)', value: 'btn-sage' },
          { title: 'Outline – Navy', value: 'btn-outline-navy' },
          { title: 'Outline – Ink', value: 'btn-outline-ink' },
          { title: 'Outline – White', value: 'btn-outline-white' },
          { title: 'Outline – Coral', value: 'btn-outline-coral' },
          { title: 'White fill', value: 'btn-white' },
        ],
      },
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' },
  },
});
