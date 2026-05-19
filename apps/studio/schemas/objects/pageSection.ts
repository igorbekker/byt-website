import { defineType, defineField } from 'sanity';

export const pageSection = defineType({
  name: 'pageSection',
  title: 'Page Section',
  type: 'object',
  preview: {
    select: { id: 'sectionId', enabled: 'enabled' },
    prepare({ id, enabled }: { id?: string; enabled?: boolean }) {
      return {
        title: id ?? '(no id)',
        subtitle: enabled === false ? 'Hidden' : 'Visible',
      };
    },
  },
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Machine-readable section key (e.g. "hero", "conditions")',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
      description: 'Uncheck to hide this section. Empty sections array = all sections visible.',
    }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
  ],
});
