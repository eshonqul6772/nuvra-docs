# nuvra-docs

Landing page and documentation of [nuvra](https://github.com/eshonqul6772/nuvra), the Word-style document editor for
Vue 3. English, Uzbek and Russian, light and dark, with the real editor running as a live demo, a playground for its
props and a search over every article (Ctrl+K / ⌘K).

Built with Vue 3, Vite and vue-router. Docs articles are Markdown files compiled to Vue components by
`unplugin-vue-markdown`, with Shiki code highlighting.

## Development

```sh
pnpm install
pnpm dev          # http://localhost:5173
pnpm dev:local    # the same, but against the sources of ../nuvra instead of the npm package
pnpm build        # type-check and production build into dist/
pnpm preview      # serve the production build
pnpm biome        # lint and format check
```

To deploy under a sub-path (for example GitHub Pages at `/nuvra/`), build with `DOCS_BASE=/nuvra/ pnpm build`.

## Structure

```text
src/
├── components/        site header, footer, logo, icons, install command, live editor demo, search dialog, copy button
├── composables/       colour scheme, search state, copy buttons for rendered Markdown
├── content/
│   ├── docs/
│   │   ├── nav.ts     sidebar: groups, slugs and titles in every language
│   │   ├── search-index.ts  search over the raw Markdown of the articles
│   │   ├── en/*.md    English articles, one file per slug
│   │   ├── uz/*.md    Uzbek articles, same slugs
│   │   └── ru/*.md    Russian articles, same slugs
│   └── snippets/      code samples shown on the landing page
├── i18n/              language state, site texts (messages/en.ts, messages/uz.ts, messages/ru.ts)
├── pages/             home, docs, playground, not found
└── styles/            design tokens and Markdown typography
```

## Adding a docs page

1. Write `src/content/docs/en/<slug>.md`, `src/content/docs/uz/<slug>.md` and `src/content/docs/ru/<slug>.md`, each starting
   with `# Title`.
2. Add the slug and the titles in every language to `src/content/docs/nav.ts`. The search picks the article up by itself.

Markdown is compiled as a Vue template: keep `{{`, `}}` and tag-like text such as `<DocumentEditor>` inside code spans
or code blocks.
