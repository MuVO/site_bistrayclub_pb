import type { APIRoute } from 'astro';
import { siteConfig } from '../lib/siteConfig';

export const prerender = true;

export const GET: APIRoute = () => {
  const lines = ['User-agent: *'];

  if (import.meta.env.DEV) {
    lines.push('Disallow: /');
  } else {
    lines.push('Allow: /');
    if (siteConfig.siteDomain) lines.push(`Sitemap: https://${siteConfig.siteDomain}/sitemap-index.xml`);
  }

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
