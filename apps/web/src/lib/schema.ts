const SITE_URL = 'https://getbetteryou.com';
const ORG_NAME = 'Better You Therapy';
const ORG_PHONE = '+17549990011';
const ORG_EMAIL = 'hello@getbetteryou.com';
const ORG_COUNTIES = ['Palm Beach', 'Martin', 'St. Lucie', 'Okeechobee'];

export function organizationSchema(): Record<string, unknown> {
  return {
    '@type': 'MedicalOrganization',
    '@id': `${SITE_URL}/#organization`,
    name: ORG_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    telephone: ORG_PHONE,
    email: ORG_EMAIL,
    sameAs: [SITE_URL],
    areaServed: ORG_COUNTIES.map((county) => ({
      '@type': 'AdministrativeArea',
      name: `${county} County, FL`,
    })),
    medicalSpecialty: 'Psychiatric',
  };
}

export function localBusinessSchema(): Record<string, unknown> {
  return {
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: ORG_NAME,
    url: SITE_URL,
    telephone: ORG_PHONE,
    email: ORG_EMAIL,
    image: `${SITE_URL}/favicon.png`,
    priceRange: '$$',
    areaServed: ORG_COUNTIES.map((county) => ({
      '@type': 'AdministrativeArea',
      name: `${county} County, FL`,
    })),
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: ORG_NAME,
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

export function homepageGraphSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema(), localBusinessSchema(), websiteSchema()],
  };
}

export interface JobPostingParams {
  title: string;
  description: string;
  datePosted: string;
  validThrough?: string;
  employmentType?: string;
  hiringOrganization?: string;
  jobLocation?: string;
  slug: string;
}

export function jobPostingSchema(p: JobPostingParams): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: p.title,
    description: p.description,
    datePosted: p.datePosted,
    validThrough: p.validThrough ?? '',
    employmentType: p.employmentType ?? 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: p.hiringOrganization ?? ORG_NAME,
      sameAs: SITE_URL,
    },
    jobLocation: {
      '@type': 'Place',
      name: p.jobLocation ?? 'Southeast Florida',
      address: { '@type': 'PostalAddress', addressRegion: 'FL', addressCountry: 'US' },
    },
    url: `${SITE_URL}/careers/${p.slug}/`,
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqPageSchema(items: FaqItem[]): Record<string, unknown> {
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

export interface WebPageParams {
  name: string;
  description: string;
  url: string;
  type?: 'WebPage' | 'ContactPage' | 'CollectionPage';
  dateModified?: string;
}

export function webPageSchema(p: WebPageParams): string {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': p.type ?? 'WebPage',
    name: p.name,
    description: p.description,
    url: p.url,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
  };
  if (p.dateModified) schema.dateModified = p.dateModified;
  return JSON.stringify(schema);
}

interface BlogPostingParams {
  title: string;
  description?: string;
  datePublished?: string;
  dateModified?: string;
  imageUrl?: string;
  imageAlt?: string;
  authorName?: string;
  slug: string;
}

export function blogPostingSchema(p: BlogPostingParams): string {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.description ?? '',
    datePublished: p.datePublished ?? '',
    dateModified: p.dateModified ?? p.datePublished ?? '',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://getbetteryou.com/blog/${p.slug}/`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Better You Therapy',
      sameAs: 'https://getbetteryou.com',
    },
  };
  if (p.imageUrl) {
    schema.image = { '@type': 'ImageObject', url: p.imageUrl, description: p.imageAlt ?? '' };
  }
  if (p.authorName) {
    schema.author = { '@type': 'Person', name: p.authorName };
  }
  return JSON.stringify(schema);
}
