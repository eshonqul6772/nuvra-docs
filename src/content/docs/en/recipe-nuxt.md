# Nuxt 3

nuvra works in Nuxt 3 without extra build settings: it is a regular ESM package with Vue as its only peer dependency. The editor measures pages and edits the DOM, so it has to render in the browser; plain functions such as `fillTemplate` also run on the server.

## Installation and styles

```sh
pnpm add nuvra
```

Add the stylesheet once in `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['nuvra/style.css']
});
```

No `build.transpile` entry is needed.

## Render the editor on the client

Importing `nuvra` on the server is safe, but the editor itself must not be rendered there. Wrap it in `ClientOnly` and give the `#fallback` slot a placeholder of the same height, so the layout does not jump when the editor appears:

```vue
<!-- pages/documents/[id].vue -->
<script setup lang="ts">
import { DocumentEditor } from 'nuvra';

const route = useRoute();
const { data: html } = await useFetch<string>(`/api/documents/${route.params.id}`, { default: () => '' });
</script>

<template>
  <ClientOnly>
    <DocumentEditor v-model="html" title="Contract" />
    <template #fallback>
      <div style="height: 760px">Loading editor…</div>
    </template>
  </ClientOnly>
</template>
```

The document is still loaded during server rendering; only the editor waits for the browser.

### A client-only component

If the editor is used on many pages, put a small wrapper in a file ending in `.client.vue`. Nuxt auto-imports it and renders it only in the browser. Pick a name that does not clash with nuvra's own components:

```vue
<!-- components/NuvraEditor.client.vue -->
<script setup lang="ts">
import { DocumentEditor, type TemplateVariable } from 'nuvra';

defineProps<{ title?: string; variables?: TemplateVariable[] }>();
const html = defineModel<string>({ default: '' });
</script>

<template>
  <DocumentEditor v-model="html" :title="title" :variables="variables" />
</template>
```

```vue
<template>
  <NuvraEditor v-model="html" title="Contract" />
</template>
```

When you need the editor's methods through a template ref, such as `print()` or `getHTML()`, use `DocumentEditor` directly inside `ClientOnly`: a wrapper would have to re-expose them.

## Interface language

Set the language for every editor in a client plugin. Files in `plugins/` are registered automatically, and the `.client` suffix keeps this one out of the server bundle:

```ts
// plugins/nuvra.client.ts
import { ru, setEditorLocale } from 'nuvra';

export default defineNuxtPlugin(() => {
  setEditorLocale(ru);
});
```

`setEditorLocale` is reactive, so a language switcher can call it again later. The `locale` prop of a single editor still wins. See [Languages](/docs/translations).

## Filling templates in a server route

`fillTemplate` needs no DOM, so a Nitro route can fill a saved template, for example before storing a letter or passing it to a PDF service:

```ts
// server/api/letters.post.ts
import { fillTemplate, getTemplateVariables } from 'nuvra';

export default defineEventHandler(async event => {
  const { values } = await readBody<{ values: Record<string, string> }>(event);
  const template = await loadTemplate('letter'); // your storage

  const missing = getTemplateVariables(template).filter(name => !values[name]?.trim());
  if (missing.length) {
    throw createError({ statusCode: 422, statusMessage: `Missing: ${missing.join(', ')}` });
  }

  return { html: fillTemplate(template, values, { missing: 'empty' }) };
});
```

Printing, Word export with `buildDocx` and every editor component stay in the browser.

## See also

- [Getting started](/docs/getting-started)
- [Letters from a template](/docs/recipe-letters)
- [Autosave](/docs/recipe-autosave)
- [Image upload](/docs/recipe-image-upload)
- [API](/docs/api)
