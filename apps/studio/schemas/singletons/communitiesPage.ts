/**
 * Purpose: Communities page singleton — hero, process steps, handles grid, conditions, CTA
 * Context: Rendered by apps/web/src/pages/communities.astro
 * Source: design-source/pages/Communities.html
 */
import { defineType, defineField } from 'sanity';

export const communitiesPage = defineType({
  name: 'communitiesPage',
  title: 'Communities',
  type: 'document',
  fields: [
    // ── Hero ─────────────────────────────────────────────────────────────
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'heroSubhead', title: 'Hero Subhead', type: 'text' }),
    defineField({ name: 'heroCta', title: 'Hero CTA', type: 'ctaLink' }),

    // ── Process Steps ─────────────────────────────────────────────────────
    defineField({ name: 'processEyebrow', title: 'Process Eyebrow', type: 'string' }),
    defineField({ name: 'processHeading', title: 'Process Heading', type: 'string' }),
    defineField({
      name: 'processSteps',
      title: 'Process Steps',
      type: 'array',
      of: [{ type: 'processStep' }],
      validation: (r) => r.max(4),
    }),

    // ── What We Handle ────────────────────────────────────────────────────
    defineField({ name: 'handlesEyebrow', title: 'Handles Eyebrow', type: 'string' }),
    defineField({ name: 'handlesHeading', title: 'Handles Heading', type: 'string' }),
    defineField({ name: 'handlesSubhead', title: 'Handles Subhead', type: 'text' }),
    defineField({
      name: 'handlesItems',
      title: 'Handles Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({ name: 'body', title: 'Body', type: 'text' }),
          ],
          preview: {
            select: { title: 'heading' },
          },
        },
      ],
      validation: (r) => r.max(12),
    }),

    // ── Conditions Section ────────────────────────────────────────────────
    defineField({ name: 'conditionsEyebrow', title: 'Conditions Eyebrow', type: 'string' }),
    defineField({ name: 'conditionsHeading', title: 'Conditions Heading', type: 'string' }),
    defineField({ name: 'conditionsSubhead', title: 'Conditions Subhead', type: 'text' }),

    // ── CTA Band ──────────────────────────────────────────────────────────
    defineField({ name: 'ctaHeading', title: 'CTA Heading', type: 'string' }),
    defineField({ name: 'ctaSubhead', title: 'CTA Subhead', type: 'text' }),
    defineField({ name: 'ctaCta', title: 'CTA Button', type: 'ctaLink' }),

    // ── SEO ───────────────────────────────────────────────────────────────
    defineField({ name: 'seo', title: 'SEO', type: 'seoFields' }),
  ],
  preview: {
    select: { title: 'heroHeading' },
    prepare: ({ title }: { title?: string }) => ({ title: title ?? 'Communities' }),
  },
});
