import { defineType, defineField } from 'sanity';

export const redirect = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  preview: {
    select: { source: 'sourcePath', dest: 'destinationPath', code: 'statusCode' },
    prepare({ source, dest, code }: { source?: string; dest?: string; code?: number }) {
      return { title: `${source ?? '?'} → ${dest ?? '?'} (${code ?? '?'})` };
    },
  },
  fields: [
    defineField({
      name: 'sourcePath',
      title: 'Source Path',
      type: 'string',
      description: 'The old URL path to redirect from, e.g. /wound-care/',
      validation: (r) =>
        r
          .required()
          .custom((val?: string) => {
            if (!val) return true;
            return val.startsWith('/') || 'Must start with /';
          })
          .unique(),
    }),
    defineField({
      name: 'destinationPath',
      title: 'Destination',
      type: 'string',
      description: 'New path (e.g. /blog) or full URL (https://...)',
      validation: (r) =>
        r.required().custom((val?: string) => {
          if (!val) return true;
          return (
            val.startsWith('/') || val.startsWith('https://') || 'Must start with / or https://'
          );
        }),
    }),
    defineField({
      name: 'statusCode',
      title: 'Status Code',
      type: 'number',
      initialValue: 301,
      options: {
        list: [
          { title: '301 — Permanent Redirect', value: 301 },
          { title: '302 — Temporary Redirect', value: 302 },
          { title: '410 — Gone', value: 410 },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Disable without deleting',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 2,
      description: 'Optional context, e.g. "Old service page merged into /patients/"',
    }),
    defineField({
      name: 'hitCount',
      title: 'Hit Count',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      description: 'Incremented automatically each time this redirect fires',
    }),
    defineField({
      name: 'lastHitAt',
      title: 'Last Hit At',
      type: 'datetime',
      readOnly: true,
      description: 'Timestamp of the most recent redirect hit',
    }),
  ],
});
