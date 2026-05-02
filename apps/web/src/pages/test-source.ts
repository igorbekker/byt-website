export const prerender = false;

import raw from '../../../../design-source/pages/Homepage.html?raw';

export function GET() {
  return new Response(raw, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
