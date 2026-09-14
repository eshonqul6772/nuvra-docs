# Languages

The editor interface — toolbar, menus, dialogs, status bar and messages — ships in Uzbek (Latin and Cyrillic), English and Russian. The translations are part of the package, so every app shows the same, reviewed texts.

| Locale | Code | Language |
| --- | --- | --- |
| `uz` | `'uz'` | O‘zbekcha (default) |
| `uzCyrl` | `'uz-Cyrl'` | Ўзбекча |
| `en` | `'en'` | English |
| `ru` | `'ru'` | Русский |

The language also decides the texts the editor writes into the document: signature blocks, document templates, amounts in words and long dates.

## One editor

Import the locale and pass it to the `locale` prop:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, ru } from 'nuvra';

const html = ref('');
</script>

<template>
  <DocumentEditor v-model="html" :locale="ru" />
</template>
```

The code works as well: `locale="en"`. `Editor` accepts the same prop.

## The whole app

Call `setEditorLocale` once, for example in `main.ts`. Every editor without its own `locale` prop uses that language:

```ts
import { en, setEditorLocale } from 'nuvra';

setEditorLocale(en);
```

The setting is reactive: calling `setEditorLocale` again, for example from a language switcher, updates editors that are already on the page.

## Language picker

`editorLocales` lists the built-in locales with their names, ready for a picker:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, type EditorLocaleCode, editorLocales } from 'nuvra';

const locale = ref<EditorLocaleCode>('uz');
</script>

<template>
  <select v-model="locale">
    <option v-for="item in editorLocales" :key="item.code" :value="item.code">{{ item.name }}</option>
  </select>
  <DocumentEditor :locale="locale" />
</template>
```

## Priority

1. The `locale` prop of the editor.
2. The language set with `setEditorLocale`.
3. Uzbek.

An unknown value, such as `locale="de"`, falls back to the next step.
