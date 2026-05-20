import { defineMiddleware } from 'astro:middleware';

// Static output — no runtime middleware execution; all requests pass through
export const onRequest = defineMiddleware((_context, next) => next());
