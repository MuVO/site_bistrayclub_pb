import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const siteDomain = process.env.PUBLIC_SITE_DOMAIN;

export default defineConfig({
  site: siteDomain ? `https://${siteDomain}` : undefined,
  integrations: siteDomain ? [sitemap()] : [],
  output: 'static',
});
