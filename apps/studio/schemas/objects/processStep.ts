/**
 * Purpose: One step in a numbered process flow
 * Context: Homepage HowItWorks section and Communities process steps
 * Source: design-source/pages/Homepage.html (.step, .step-num, .step-text)
 */
import { defineType, defineField } from 'sanity';

export const processStep = defineType({
  name: 'processStep',
  title: 'Process Step',
  type: 'object',
  fields: [
    defineField({
      name: 'stepNumber',
      title: 'Step Number',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'stepNumber' },
  },
});
