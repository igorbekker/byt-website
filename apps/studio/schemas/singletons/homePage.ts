/**
 * Purpose: Homepage singleton — all section copy for the BYT homepage
 * Context: Rendered by apps/web/src/pages/index.astro via all homepage section components
 * Source: design-source/pages/Homepage.html
 */
import { defineType, defineField } from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  fields: [
    // ── Hero ─────────────────────────────────────────────────────────────
    defineField({ name: 'heroEyebrow', title: 'Hero Eyebrow', type: 'string' }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'heroSubhead', title: 'Hero Subhead', type: 'text' }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'imageWithAlt' }),
    defineField({ name: 'heroPrimaryCta', title: 'Hero Primary CTA', type: 'ctaLink' }),
    defineField({ name: 'heroSecondaryCta', title: 'Hero Secondary CTA', type: 'ctaLink' }),

    // ── Audience Router ───────────────────────────────────────────────────
    defineField({ name: 'routerEyebrow', title: 'Router Eyebrow', type: 'string' }),
    defineField({ name: 'routerHeading', title: 'Router Heading', type: 'string' }),
    defineField({ name: 'routerSubhead', title: 'Router Subhead', type: 'text' }),
    defineField({
      name: 'routerCards',
      title: 'Router Cards',
      type: 'array',
      of: [{ type: 'audienceCard' }],
      validation: (r) => r.min(1).max(3),
    }),

    // ── Belief Band ───────────────────────────────────────────────────────
    defineField({
      name: 'beliefQuote',
      title: 'Belief Quote',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'beliefBody', title: 'Belief Body', type: 'text' }),

    // ── Two Ways ──────────────────────────────────────────────────────────
    defineField({ name: 'twoWaysEyebrow', title: 'Two Ways Eyebrow', type: 'string' }),
    defineField({ name: 'twoWaysHeading', title: 'Two Ways Heading', type: 'string' }),
    defineField({ name: 'twoWaysSubhead', title: 'Two Ways Subhead', type: 'text' }),
    defineField({
      name: 'twoWaysTracks',
      title: 'Two Ways Tracks',
      type: 'array',
      of: [{ type: 'serviceTrack' }],
      validation: (r) => r.max(2),
    }),

    // ── Conditions Section ────────────────────────────────────────────────
    defineField({ name: 'conditionsEyebrow', title: 'Conditions Eyebrow', type: 'string' }),
    defineField({ name: 'conditionsHeading', title: 'Conditions Heading', type: 'string' }),
    defineField({ name: 'conditionsSubhead', title: 'Conditions Subhead', type: 'text' }),

    // ── How It Works ──────────────────────────────────────────────────────
    defineField({ name: 'howItWorksEyebrow', title: 'How It Works Eyebrow', type: 'string' }),
    defineField({ name: 'howItWorksHeading', title: 'How It Works Heading', type: 'string' }),
    defineField({
      name: 'teletherapyTrackLabel',
      title: 'Teletherapy Track Label',
      type: 'string',
    }),
    defineField({
      name: 'teletherapySteps',
      title: 'Teletherapy Steps',
      type: 'array',
      of: [{ type: 'processStep' }],
      validation: (r) => r.max(3),
    }),
    defineField({ name: 'teletherapyCta', title: 'Teletherapy CTA', type: 'ctaLink' }),
    defineField({ name: 'facilityTrackLabel', title: 'Facility Track Label', type: 'string' }),
    defineField({
      name: 'facilitySteps',
      title: 'Facility Steps',
      type: 'array',
      of: [{ type: 'processStep' }],
      validation: (r) => r.max(3),
    }),
    defineField({ name: 'facilityCta', title: 'Facility CTA', type: 'ctaLink' }),

    // ── Testimonials ──────────────────────────────────────────────────────
    defineField({ name: 'testimonialsEyebrow', title: 'Testimonials Eyebrow', type: 'string' }),
    defineField({ name: 'testimonialsHeading', title: 'Testimonials Heading', type: 'string' }),
    defineField({ name: 'testimonialsSubhead', title: 'Testimonials Subhead', type: 'text' }),

    // ── Provider Teaser ───────────────────────────────────────────────────
    defineField({
      name: 'providerTeaserEyebrow',
      title: 'Provider Teaser Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'providerTeaserHeading',
      title: 'Provider Teaser Heading',
      type: 'string',
    }),
    defineField({ name: 'providerTeaserBody', title: 'Provider Teaser Body', type: 'text' }),
    defineField({
      name: 'providerTeaserImage',
      title: 'Provider Teaser Image',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'providerTeaserPrimaryCta',
      title: 'Provider Teaser Primary CTA',
      type: 'ctaLink',
    }),
    defineField({
      name: 'providerTeaserSecondaryCta',
      title: 'Provider Teaser Secondary CTA',
      type: 'ctaLink',
    }),

    // ── SEO ───────────────────────────────────────────────────────────────
    defineField({ name: 'seo', title: 'SEO', type: 'seoFields' }),
  ],
  preview: {
    select: { title: 'heroHeadline' },
    prepare: ({ title }: { title?: string }) => ({ title: title ?? 'Homepage' }),
  },
});
