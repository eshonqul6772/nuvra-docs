import { readFileSync } from 'node:fs';
import { URL, fileURLToPath } from 'node:url';

import Shiki from '@shikijs/markdown-it';
import vue from '@vitejs/plugin-vue';
import anchor from 'markdown-it-anchor';
import Markdown from 'unplugin-vue-markdown/vite';
import { defineConfig } from 'vite';

/** Version of the installed nuvra package, shown on the site. */
const NUVRA_VERSION: string = JSON.parse(
  readFileSync(new URL('./node_modules/nuvra/package.json', import.meta.url), 'utf8')
).version;

/** Heading ids: lower-case words joined by dashes; Uzbek apostrophes are dropped so ids stay readable. */
const slugify = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[‘’'`ʻʼ]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

/**
 * With NUVRA_LOCAL=1 the site runs against the sources of the neighbouring `nuvra` checkout instead of the published
 * package, so a change in the editor is visible in the demo right away. Builds and deployments never set it.
 */
const localNuvra = process.env.NUVRA_LOCAL
  ? [
      // The style entry comes first: the editor components import their own styles, so it only has to resolve.
      {
        find: /^nuvra\/style\.css$/,
        replacement: fileURLToPath(new URL('../nuvra/src/styles/document-content.css', import.meta.url))
      },
      { find: /^nuvra$/, replacement: fileURLToPath(new URL('../nuvra/src/index.ts', import.meta.url)) }
    ]
  : undefined;

// https://vite.dev/config/
export default defineConfig({
  // A sub-path deployment (for example GitHub Pages) sets DOCS_BASE, such as `/nuvra/`.
  base: process.env.DOCS_BASE ?? '/',
  resolve: { alias: localNuvra },
  plugins: [
    vue({ include: [/\.vue$/, /\.md$/] }),
    Markdown({
      wrapperClasses: 'prose',
      headEnabled: false,
      async markdownItSetup(md) {
        md.use(anchor, { slugify, permalink: anchor.permalink.headerLink({ safariReaderFix: true }) });
        md.use(
          await Shiki({
            themes: { light: 'github-light', dark: 'github-dark' },
            defaultColor: false
          })
        );
      }
    })
  ],
  define: {
    __NUVRA_VERSION__: JSON.stringify(NUVRA_VERSION)
  }
});
