// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Paths that exist only to redirect or to route devices; keep them out of the sitemap.
const SITEMAP_EXCLUDE = ['/get-app/', '/404/'];

export default defineConfig({
  site: 'https://blackfinfuels.com',
  // The live WordPress site uses trailing slashes on every URL. Keep them so
  // existing links and search rankings carry over unchanged.
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Astro 7 defaults to JSX-style whitespace stripping, which removes the space
  // between an inline element and the text on the next line. Keep HTML rules.
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !SITEMAP_EXCLUDE.some((path) => page.endsWith(path)),
    }),
  ],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  vite: {
    server: { watch: { ignored: ['**/reference/**', '**/docs/**'] } },
    build: { assetsInlineLimit: 2048 },
  },
});
