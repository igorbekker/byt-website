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
      name: 'slug',
      title: 'URL Slug',
      type: 'string',
      description: 'The URL path for this page (e.g. "about" = /about/). Leave empty for homepage.',
      validation: (r) =>
        r.required().custom((value, context) => {
          if (context.document?._type === 'homePage' && value === '') return true;
          if (!value) return 'Slug is required';
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))
            return 'Slug must be lowercase letters, numbers, and hyphens only';
          return true;
        }),
    }),
    defineField({
      name: 'oldSlugs',
      title: 'Previous URL Slugs (auto-managed)',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Previous URL slugs that auto-redirect to the current slug. Auto-managed on publish — remove an entry to stop that redirect.',
    }),
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
