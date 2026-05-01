/**
 * Purpose: Providers page singleton — hero, role tracks, handles grid, qualifications, CTA
 * Context: Rendered by apps/web/src/pages/providers.astro
 * Source: design-source/pages/Providers.html
 */
import { defineType, defineField } from 'sanity';

export const providersPage = defineType({
  name: 'providersPage',
  title: 'Providers',
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
    defineField({ name: 'heroPrimaryCta', title: 'Hero Primary CTA', type: 'ctaLink' }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'imageWithAlt' }),

    // ── Tracks ────────────────────────────────────────────────────────────
    defineField({ name: 'tracksEyebrow', title: 'Tracks Eyebrow', type: 'string' }),
    defineField({ name: 'tracksHeading', title: 'Tracks Heading', type: 'string' }),
    defineField({ name: 'tracksSubhead', title: 'Tracks Subhead', type: 'text' }),
    defineField({
      name: 'tracks',
      title: 'Tracks',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({ name: 'body', title: 'Body', type: 'text' }),
            defineField({ name: 'statusNote', title: 'Status Note', type: 'text' }),
            defineField({ name: 'cta', title: 'CTA', type: 'ctaLink' }),
          ],
          preview: {
            select: { title: 'heading', subtitle: 'label' },
          },
        },
      ],
      validation: (r) => r.max(2),
    }),

    // ── What We Handle ────────────────────────────────────────────────────
    defineField({ name: 'handlesEyebrow', title: 'Handles Eyebrow', type: 'string' }),
    defineField({ name: 'handlesHeading', title: 'Handles Heading', type: 'string' }),
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

    // ── Qualifications ────────────────────────────────────────────────────
    defineField({ name: 'qualsEyebrow', title: 'Quals Eyebrow', type: 'string' }),
    defineField({ name: 'qualsHeading', title: 'Quals Heading', type: 'string' }),
    defineField({
      name: 'quals',
      title: 'Qualifications',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'scope',
              title: 'Scope',
              type: 'string',
              options: {
                list: [
                  { title: 'All Tracks', value: 'all' },
                  { title: 'Facility-Based Only', value: 'facility' },
                  { title: 'Teletherapy Only', value: 'teletherapy' },
                ],
              },
            }),
            defineField({ name: 'body', title: 'Body', type: 'text' }),
          ],
          preview: {
            select: { title: 'scope', subtitle: 'body' },
          },
        },
      ],
    }),

    // ── CTA Band ──────────────────────────────────────────────────────────
    defineField({ name: 'ctaHeading', title: 'CTA Heading', type: 'string' }),
    defineField({ name: 'ctaSubhead', title: 'CTA Subhead', type: 'text' }),
    defineField({ name: 'ctaCta', title: 'CTA Button', type: 'ctaLink' }),

    // ── SEO ───────────────────────────────────────────────────────────────
    defineField({ name: 'seo', title: 'SEO', type: 'seoFields' }),
  ],
  preview: {
    select: { title: 'heroHeading' },
    prepare: ({ title }: { title?: string }) => ({ title: title ?? 'Providers' }),
  },
});
