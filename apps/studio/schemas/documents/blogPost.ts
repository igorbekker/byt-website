/**
 * Purpose: Blog post document — full article with Portable Text body, meta, and SEO
 * Context: Blog index ArticleCard, Article page ArticleHero + ArticleBody
 * Source: design-source/pages/Blog.html (.article-card), design-source/pages/Blog Article.html
 */
import { defineType, defineField } from 'sanity';

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  orderings: [
    {
      title: 'Newest First',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
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
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
    defineField({ name: 'readingTimeMinutes', title: 'Reading Time (minutes)', type: 'number' }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'blogCategory' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subcategoryLabel',
      title: 'Subcategory Label',
      type: 'string',
      description: 'Free-text label for breadcrumb subcategory',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: '1–2 sentences for article cards and meta',
      validation: (r) => r.required().max(200),
    }),
    defineField({ name: 'featuredImage', title: 'Featured Image', type: 'imageWithAlt' }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Pin as Featured Article on Blog index',
      initialValue: false,
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoFields' }),
  ],
  preview: {
    select: { title: 'title', media: 'featuredImage' },
  },
});
