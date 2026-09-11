# Getting started

nuvra is a Word-style document editor for Vue 3. This page takes you from installation to a working editor in a few minutes.

## Requirements

- Vue 3.5 or newer. Vue is the only peer dependency; nuvra needs no UI framework.
- A current evergreen browser (Chrome, Edge, Safari or Firefox). See [Browser support](/docs/browser-support) for details.

## Installation

Install the package with your package manager:

```sh
pnpm add nuvra
# or
npm install nuvra
# or
yarn add nuvra
```

## Import the styles

The editor ships its styles as a separate file. Import it once, for example in `main.ts`:

```ts
import { createApp } from 'vue';
import 'nuvra/style.css';

import App from './App.vue';

createApp(App).mount('#app');
```

## Your first document editor

`DocumentEditor` is the full editor: a toolbar, a page view with paper sizes and margins, a status bar, find and replace, printing and export. Bind the document HTML with `v-model`:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor } from 'nuvra';

const html = ref('<p>Hello, <strong>nuvra</strong>!</p>');
</script>

<template>
  <DocumentEditor v-model="html" title="My first document" />
</template>
```

The editor is 760 px tall by default. Pass `height` with a number (pixels) or any CSS length, for example `height="100%"` inside a container that has a height.

## A rich text field for forms

`Editor` is the same editor in the lighter web view. It grows with its content between `minHeight` (240 px) and `maxHeight` (600 px), which makes it a good fit for form fields:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Editor } from 'nuvra';

const description = ref('');
</script>

<template>
  <Editor v-model="description" placeholder="Describe the role" :max-length="2000" />
</template>
```

An empty field has the value `''`, so the usual “required” validation works without extra checks.

## Next steps

- [Usage](/docs/usage) — page settings, view modes, sizing, images, printing and export.
- [Translations](/docs/translations) — show the interface in your language.
- [Theming](/docs/theming) — change colors and enable the dark palette.
- [API](/docs/api) — every prop, event, method and type.
- [Keyboard shortcuts](/docs/keyboard-shortcuts) — shortcuts and Markdown-like input rules.
