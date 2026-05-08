/**
 * Purpose: Job posting document — open positions for the Careers page
 * Context: Careers page job listings, filtered by status
 * Source: design-source/pages/Careers.html
 */
import { defineType, defineField } from 'sanity';

export const jobPosting = defineType({
  name: 'jobPosting',
  title: 'Job Posting',
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
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'track',
      title: 'Track',
      type: 'string',
      options: {
        list: [
          { title: 'Facility-Based', value: 'facility' },
          { title: 'Teletherapy', value: 'teletherapy' },
        ],
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Open', value: 'open' },
          { title: 'Filled', value: 'filled' },
          { title: 'Paused', value: 'paused' },
        ],
      },
      initialValue: 'open',
    }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({ name: 'employmentType', title: 'Employment Type', type: 'string' }),
    defineField({ name: 'aboutRole', title: 'About the Role', type: 'text' }),
    defineField({
      name: 'duties',
      title: "What You'll Do",
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'requirements',
      title: 'What We Are Looking For',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'offers',
      title: 'What We Offer',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'status' },
  },
});
