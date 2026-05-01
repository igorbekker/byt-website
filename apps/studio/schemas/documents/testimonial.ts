/**
 * Purpose: Testimonial document — quote, attribution, audience type, and featured flag
 * Context: Homepage TestimonialsSection, Providers QuoteCards; filtered by audienceType
 * Source: design-source/pages/Homepage.html (.testimonial-card), design-source/pages/Providers.html (.p-quote-card)
 */
import { defineType, defineField } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'authorRole',
      title: 'Author Role',
      type: 'string',
      description: 'e.g. "Director of Wellness"',
    }),
    defineField({
      name: 'authorOrg',
      title: 'Author Organization',
      type: 'string',
      description: 'e.g. "Assisted Living · Palm Beach County"',
    }),
    defineField({
      name: 'authorInitials',
      title: 'Author Initials',
      type: 'string',
      description: 'Max 2 characters',
      validation: (r) => r.max(2),
    }),
    defineField({
      name: 'authorPhoto',
      title: 'Author Photo',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'audienceType',
      title: 'Audience Type',
      type: 'string',
      options: {
        list: [
          { title: 'Senior Facility', value: 'facility' },
          { title: 'Patient', value: 'patient' },
          { title: 'Therapist', value: 'therapist' },
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show on Homepage testimonials section',
    }),
  ],
  preview: {
    select: { title: 'authorName', subtitle: 'audienceType' },
  },
});
