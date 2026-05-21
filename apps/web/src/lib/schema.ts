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
