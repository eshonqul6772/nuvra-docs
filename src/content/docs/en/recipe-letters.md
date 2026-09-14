# Letters from a template

A mailing, a batch of notices or a set of certificates is one template filled in many times. The template is written once in `DocumentEditor` and saved as HTML; this recipe fills it for every recipient on the server, prints all letters at once in the browser, and lets a person fill a single letter as a form.

## A template to start with

Any document saved by the editor with template variables works. The built-in official letter is a ready starting point, in the language you ask for:

```ts
import { getDocumentTemplate } from 'nuvra';

const { html, variables } = getDocumentTemplate('letter', 'en');
// variables: org_name, org_address, doc_date, doc_number, recipient,
// subject, signer_position, signer_name, executor
```

Save `html` as your template, or load it into `DocumentEditor` first so someone can write the body of the letter. See [Templates and signatures](/docs/templates) for how variables are stored.

## On the server

`fillTemplate` and `getTemplateVariables` are plain string functions, so a Node script can generate the letters. The `nuvra` entry imports `vue` (its peer dependency), so install `vue` next to it; no DOM and no CSS loader are needed to import it.

```js
// letters.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fillTemplate, getTemplateVariables } from 'nuvra';

const template = await readFile('templates/letter.html', 'utf8');

const common = {
  org_name: 'Example LLC',
  org_address: '12 Main Street, Tashkent',
  doc_date: '14.09.2026',
  subject: 'Annual meeting',
  signer_position: 'Director',
  signer_name: 'A. Karimov',
  executor: 'N. Rashidova'
};

const recipients = [
  { doc_number: '01-12/345', recipient: 'Mr. John Smith' },
  { doc_number: '01-12/346', recipient: 'Ms. Emma Brown' }
];

// Check every letter before writing any of them.
const names = getTemplateVariables(template);
const problems = recipients.flatMap((person, index) => {
  const values = { ...common, ...person };
  return names.filter(name => !String(values[name] ?? '').trim()).map(name => `#${index + 1} ${name}`);
});
if (problems.length) throw new Error(`Missing values: ${problems.join(', ')}`);

await mkdir('out', { recursive: true });

for (const [index, person] of recipients.entries()) {
  const body = fillTemplate(template, { ...common, ...person }, { missing: 'empty' });
  const page = `<!doctype html><html><head><meta charset="utf-8"><title>Letter</title></head><body>${body}</body></html>`;
  await writeFile(`out/letter-${index + 1}.html`, page);
}
```

- Validate up front: a half-sent mailing is harder to fix than a failed script.
- `missing: 'empty'` is a safety net, so a variable added to the template later never reaches paper as a chip.
- Values are HTML-escaped by `fillTemplate`, so names like `Brown & Sons` are safe.
- Instead of writing files, hand `body` to your mail or PDF service. The bare page above has no editor styles; use the browser flow below when the output must match the editor's page layout.

## In the browser: all letters in one print job

The editor saves a page break as an empty `div` with `data-type="page-break"`. Joining the filled letters with it gives one document with every letter on its own sheet, which `DocumentEditor` prints with its page setup:

```vue
<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { DocumentEditor, fillTemplate } from 'nuvra';

const props = defineProps<{ template: string; recipients: Record<string, string>[] }>();

const PAGE_BREAK = '<div data-type="page-break" class="doc-page-break"></div>';

const html = ref('');
const editor = ref<InstanceType<typeof DocumentEditor>>();

const printAll = async () => {
  html.value = props.recipients
    .map(values => fillTemplate(props.template, values, { missing: 'empty' }))
    .join(PAGE_BREAK);
  await nextTick();
  await editor.value?.print();
};
</script>

<template>
  <button type="button" @click="printAll">Print all letters</button>
  <DocumentEditor ref="editor" v-model="html" title="Letters" disabled />
</template>
```

`disabled` keeps the generated document read-only. The same combined HTML can become one Word file with `buildDocx`, which also runs in the browser:

```ts
import { buildDocx, createPageSettings } from 'nuvra';

const blob = await buildDocx({ html: html.value, title: 'Letters', page: createPageSettings() });
await fetch('/api/letters/docx', { method: 'PUT', body: blob });
```

## One letter as a form

When a person fills a single letter, `DocumentForm` shows the template as it will be printed, with an input in place of every variable:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentForm, getDocumentTemplate } from 'nuvra';

const { html: template, variables } = getDocumentTemplate('letter', 'en');

const values = ref<Record<string, string>>({ doc_date: '14.09.2026' });
const form = ref<InstanceType<typeof DocumentForm>>();

const submit = async () => {
  if (form.value?.validate().length) return;
  const html = form.value?.getHTML({ missing: 'empty' });
  await fetch('/api/letters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, values: values.value })
  });
};
</script>

<template>
  <DocumentForm ref="form" v-model="values" :template="template" :variables="variables" locale="en" />
  <button type="button" @click="submit">Send</button>
</template>
```

- `validate()` returns the names of empty variables, marks their fields and focuses the first one.
- Sending `values` next to the HTML lets the server fill the same template again or store the data separately.

## See also

- [Templates and signatures](/docs/templates)
- [Forms and validation](/docs/recipe-forms)
- [Autosave](/docs/recipe-autosave)
- [API](/docs/api)
