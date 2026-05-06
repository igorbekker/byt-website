/**
 * Purpose: Sanity Studio desk structure
 * Context: Organizes singletons at top, document collections below
 * Source: apps/studio/sanity.config.ts
 */
import type { StructureResolver } from 'sanity/structure';

const SINGLETONS = [
  { id: 'siteSettings', title: 'Site Settings' },
  { id: 'homePage', title: 'Homepage' },
  { id: 'aboutPage', title: 'About' },
  { id: 'patientsPage', title: 'Patients' },
  { id: 'communitiesPage', title: 'Communities' },
  { id: 'providersPage', title: 'Providers' },
  { id: 'careersPage', title: 'Careers' },
  { id: 'contactPage', title: 'Contact' },
  { id: 'blogIndexPage', title: 'Blog Index' },
  { id: 'privacyPage', title: 'Privacy Policy' },
  { id: 'termsPage', title: 'Terms and Conditions' },
] as const;

export const structure: StructureResolver = (S) =>
  S.list()
    .title('BYT Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items(
              SINGLETONS.filter((s) => s.id !== 'siteSettings').map((s) =>
                S.listItem()
                  .title(s.title)
                  .id(s.id)
                  .child(S.document().schemaType(s.id).documentId(s.id)),
              ),
            ),
        ),
      S.divider(),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      S.documentTypeListItem('condition').title('Conditions'),
      S.documentTypeListItem('blogPost').title('Blog Posts'),
      S.documentTypeListItem('blogCategory').title('Blog Categories'),
      S.documentTypeListItem('author').title('Authors'),
      S.documentTypeListItem('jobPosting').title('Job Postings'),
    ]);
