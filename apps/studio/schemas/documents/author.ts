/**
 * Purpose: Author document — therapist/staff bio for blog posts and article bylines
 * Context: Blog ArticleHero byline, AuthorCard, and blogPost author reference
 * Source: design-source/pages/Blog Article.html (.byline-avatar, .author-card)
 */
import { defineType, defineField } from 'sanity';

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'credentials',
      title: 'Credentials',
      type: 'string',
      description: 'e.g. LMHC, LCSW, PhD',
    }),
    defineField({
      name: 'initials',
      title: 'Initials',
      type: 'string',
      validation: (r) => r.max(2),
    }),
    defineField({ name: 'photo', title: 'Photo', type: 'imageWithAlt' }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'credentials', media: 'photo' },
  },
});
