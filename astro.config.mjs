import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const env = loadEnv(mode, process.cwd(), 'PUBLIC_');
const siteDomain = (env.PUBLIC_SITE_DOMAIN || process.env.PUBLIC_SITE_DOMAIN || 'pb.bistray.club')
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '');

export default defineConfig({
  site: siteDomain ? `https://${siteDomain}` : undefined,
  integrations: siteDomain ? [sitemap()] : [],
  output: 'static',
});
