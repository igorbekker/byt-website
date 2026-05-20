const SITE_URL = 'https://getbetteryou.com';
const ORG_ID = `${SITE_URL}/#organization`;

export function organizationSchema() {
  return {
    '@type': 'MedicalOrganization',
    '@id': ORG_ID,
    name: 'Better You Therapy',
    url: SITE_URL,
    telephone: '+17549990011',
    email: 'hello@getbetteryou.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Palm Beach',
      addressRegion: 'FL',
      addressCountry: 'US',
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Palm Beach County, FL' },
      { '@type': 'AdministrativeArea', name: 'Martin County, FL' },
      { '@type': 'AdministrativeArea', name: 'St. Lucie County, FL' },
      { '@type': 'AdministrativeArea', name: 'Okeechobee County, FL' },
    ],
    medicalSpecialty: 'Psychiatric',
    availableService: {
      '@type': 'MedicalTherapy',
      name: 'Licensed Mental Health Therapy',
      description:
        'On-site licensed mental health therapy in assisted living facilities, skilled nursing facilities, and CCRCs',
    },
  };
}

export function localBusinessSchema() {
  return {
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: 'Better You Therapy',
    telephone: '+17549990011',
    email: 'hello@getbetteryou.com',
    url: SITE_URL,
    priceRange: 'Covered by Medicare and private insurance',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Palm Beach',
      addressRegion: 'FL',
      addressCountry: 'US',
    },
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Better You Therapy',
    url: SITE_URL,
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/blog/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function homepageGraphSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema(), localBusinessSchema(), websiteSchema()],
  };
}

interface BlogPostingInput {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  imageUrl?: string;
  imageAlt?: string;
  authorName?: string;
  slug: string;
}

export function blogPostingSchema(post: BlogPostingInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}/`,
    },
    image: post.imageUrl
      ? {
          '@type': 'ImageObject',
          url: post.imageUrl,
          caption: post.imageAlt || post.title,
        }
      : undefined,
    author: { '@type': 'Person', name: post.authorName || 'Better You Therapy' },
    publisher: { '@id': ORG_ID },
  };
}

interface JobPostingInput {
  title: string;
  description: string;
  datePosted: string;
  validThrough?: string;
  employmentType?: string;
}

export function jobPostingSchema(job: JobPostingInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.datePosted,
    validThrough: job.validThrough || undefined,
    employmentType: job.employmentType || 'CONTRACTOR',
    hiringOrganization: { '@id': ORG_ID },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'FL',
        addressCountry: 'US',
      },
    },
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
