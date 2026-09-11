# nuvra-docs

Landing page and documentation of [nuvra](https://github.com/eshonqul6772/nuvra), the Word-style document editor for
Vue 3. English and Uzbek, light and dark, with the real editor running as a live demo.

Built with Vue 3, Vite and vue-router. Docs articles are Markdown files compiled to Vue components by
`unplugin-vue-markdown`, with Shiki code highlighting.

## Development

```sh
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # type-check and production build into dist/
pnpm preview      # serve the production build
pnpm biome        # lint and format check
```

To deploy under a sub-path (for example GitHub Pages at `/nuvra/`), build with `DOCS_BASE=/nuvra/ pnpm build`.

## Structure

```text
src/
├── components/        site header, footer, logo, icons, install command, live editor demo
├── composables/       colour scheme
├── content/
│   ├── docs/
│   │   ├── nav.ts     sidebar: groups, slugs and titles in both languages
│   │   ├── en/*.md    English articles, one file per slug
│   │   └── uz/*.md    Uzbek articles, same slugs
│   └── snippets/      code samples shown on the landing page
├── i18n/              language state, site texts (messages/en.ts, messages/uz.ts), English editor labels
├── pages/             home, docs, not found
└── styles/            design tokens and Markdown typography
```

## Adding a docs page

1. Write `src/content/docs/en/<slug>.md` and `src/content/docs/uz/<slug>.md`, each starting with `# Title`.
2. Add the slug and both titles to `src/content/docs/nav.ts`.

Markdown is compiled as a Vue template: keep `{{`, `}}` and tag-like text such as `<DocumentEditor>` inside code spans
or code blocks.
