import { readFileSync } from 'node:fs';

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

// https://vite.dev/config/
export default defineConfig({
  // A sub-path deployment (for example GitHub Pages) sets DOCS_BASE, such as `/nuvra/`.
  base: process.env.DOCS_BASE ?? '/',
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
