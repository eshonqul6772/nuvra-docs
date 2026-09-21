import { readFileSync } from 'node:fs';
import { URL, fileURLToPath } from 'node:url';

import Shiki from '@shikijs/markdown-it';
import vue from '@vitejs/plugin-vue';
import anchor from 'markdown-it-anchor';
import Markdown from 'unplugin-vue-markdown/vite';
import { defineConfig } from 'vite';

import { slugify } from './src/content/docs/slugify.ts';

/** The neighbouring nuvra checkout, used by `pnpm dev:local`. */
const NUVRA_CHECKOUT = new URL('../nuvra/', import.meta.url);

/** Version of a nuvra package.json under `root`, shown on the site. */
const readNuvraVersion = (root: URL): string => JSON.parse(readFileSync(new URL('package.json', root), 'utf8')).version;

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  /**
   * In `nuvra-local` mode (`pnpm dev:local`, or NUVRA_LOCAL=1) the site runs against the sources of the neighbouring `nuvra`
   * checkout instead of the published package, so a change in the editor is visible in the demo right away. Builds
   * and deployments never use it.
   */
  const useLocalNuvra = mode === 'nuvra-local' || Boolean(process.env.NUVRA_LOCAL);

  return {
    // A sub-path deployment (for example GitHub Pages) sets DOCS_BASE, such as `/nuvra/`.
    base: process.env.DOCS_BASE ?? '/',
    resolve: useLocalNuvra
      ? {
          alias: [
            // The style entry comes first: the editor components import their own styles, so it only has to resolve.
            {
              find: /^nuvra\/style\.css$/,
              replacement: fileURLToPath(new URL('src/styles/document-content.css', NUVRA_CHECKOUT))
            },
            { find: /^nuvra$/, replacement: fileURLToPath(new URL('src/index.ts', NUVRA_CHECKOUT)) }
          ],
          // The checkout has its own node_modules; a second copy of Vue would break reactivity and injection.
          dedupe: ['vue']
        }
      : undefined,
    // The checkout lies outside this project, so the dev server has to be allowed to serve its files.
    server: useLocalNuvra ? { fs: { allow: ['.', fileURLToPath(NUVRA_CHECKOUT)] } } : undefined,
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
      __NUVRA_VERSION__: JSON.stringify(
        readNuvraVersion(useLocalNuvra ? NUVRA_CHECKOUT : new URL('./node_modules/nuvra/', import.meta.url))
      )
    }
  };
});
