/**
 * Purpose: Blog index page singleton — hero, featured label, topic browsing, newsletter
 * Context: Rendered by apps/web/src/pages/blog/index.astro
 * Source: design-source/pages/Blog.html
 */
import { defineType, defineField } from 'sanity';

export const blogIndexPage = defineType({
  name: 'blogIndexPage',
  title: 'Blog Index',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'heroSubhead', title: 'Hero Subhead', type: 'text' }),
    defineField({
      name: 'featuredLabel',
      title: 'Featured Label',
      type: 'string',
      description: 'Eyebrow above the featured article',
    }),
    defineField({ name: 'browseByTopicHeading', title: 'Browse By Topic Heading', type: 'string' }),
    defineField({ name: 'browseByTopicSubhead', title: 'Browse By Topic Subhead', type: 'text' }),
    defineField({
      name: 'recentlyPublishedHeading',
      title: 'Recently Published Heading',
      type: 'string',
    }),
    defineField({ name: 'newsletterHeading', title: 'Newsletter Heading', type: 'string' }),
    defineField({ name: 'newsletterSubhead', title: 'Newsletter Subhead', type: 'text' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoFields' }),
  ],
  preview: {
    select: { title: 'heroHeading' },
    prepare: ({ title }: { title?: string }) => ({ title: title ?? 'Blog Index' }),
  },
});
