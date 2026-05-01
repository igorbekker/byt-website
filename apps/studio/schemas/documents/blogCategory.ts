/**
 * Purpose: Blog category document — top-level topic grouping with optional subtopics
 * Context: Blog index FilterPills, article breadcrumb, and blogPost category reference
 * Source: design-source/pages/Blog.html (.pill-row), design-source/pages/Blog Article.html (.crumb)
 */
import { defineType, defineField } from 'sanity';

export const blogCategory = defineType({
  name: 'blogCategory',
  title: 'Blog Category',
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
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Emoji or icon key for display',
    }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
    defineField({
      name: 'subtopics',
      title: 'Subtopics',
      type: 'array',
      of: [
        {
          type: 'object',
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
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({ name: 'description', title: 'Description', type: 'text' }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'slug' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
});
