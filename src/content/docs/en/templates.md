# Templates and signatures

Letters, orders and contracts are usually written once as a template and then filled in for every recipient. nuvra supports that with **template variables** and ready-made **signature blocks**.

## Template variables

Pass the variables a template may use to the `variables` prop. The toolbar gets a **{ }** menu that inserts them, and typing `{{name}}` of a known variable turns it into a variable as well.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, type TemplateVariable } from 'nuvra';

const html = ref('');

const variables: TemplateVariable[] = [
  { name: 'full_name', label: 'Full name' },
  { name: 'position', label: 'Position' },
  { name: 'letter_number', label: 'Letter number' },
  { name: 'letter_date', label: 'Letter date' }
];
</script>

<template>
  <DocumentEditor v-model="html" :variables="variables" />
</template>
```

In the editor a variable is a single chip showing its label. It behaves like one character: Backspace and Delete remove it as a whole, and bold, italic, colour or font size applied around it are applied to the value later.

`Editor` accepts the same prop. A template ref of `DocumentEditor` also offers `insertVariable(name)`, for example for your own sidebar with variables.

### How variables are saved

The saved HTML keeps every variable as a small element with plain text inside:

```html
<p>Dear <strong><span data-variable="full_name">{{full_name}}</span></strong>,</p>
```

A chip whose name is not in `variables` stays in the document and is shown highlighted in orange, so a template loaded with an outdated variable list is never broken.

### Filling a template

`fillTemplate` replaces the variables with values. Values are HTML-escaped, so user input cannot inject markup, and line breaks become `<br>`.

```ts
import { fillTemplate } from 'nuvra';

const letter = fillTemplate(template, {
  full_name: 'Aziz Karimov',
  position: 'Director',
  letter_number: '01-12/345',
  letter_date: '14.09.2026'
});
```

A variable without a value is kept by default, so the result is still a template. Choose another behaviour with `missing`:

| `missing` | Result |
| --- | --- |
| `'keep'` (default) | The variable stays in place. |
| `'empty'` | The variable is removed. |
| `'name'` | `{{name}}` is written as plain text. |

`getTemplateVariables(html)` lists the variables a template uses, for example to build the form that asks for their values.

### Filling on the server

`fillTemplate` is a plain string function without DOM access, so it runs in Node as well. Any other backend can fill a template with a replacement of the whole element:

```java
String result = template.replaceAll(
    "<span[^>]*data-variable=\"full_name\"[^>]*>[^<]*</span>",
    Matcher.quoteReplacement(HtmlUtils.htmlEscape(fullName))
);
```

## Filling a template as a form

`DocumentForm` shows a saved template the way it will be printed, with an input field in place of every variable. Nothing else can be edited, so it suits the people who only fill documents in, while the template itself is written in `DocumentEditor`.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentForm, type TemplateVariable } from 'nuvra';

const props = defineProps<{ template: string; variables: TemplateVariable[] }>();

const values = ref<Record<string, string>>({ letter_date: '14.09.2026' });
const form = ref<InstanceType<typeof DocumentForm>>();

const submit = async () => {
  if (form.value?.validate().length) return;
  const html = form.value?.getHTML();
  await fetch('/api/letters', { method: 'POST', body: html });
};
</script>

<template>
  <DocumentForm ref="form" v-model="values" :template="props.template" :variables="props.variables" />
  <button type="button" @click="submit">Send</button>
</template>
```

- `v-model` holds the values by variable name. A variable used several times is typed once: all its fields share the value.
- An empty field shows the variable's label from `variables`. The variables of the built-in document templates are labelled even without it, in the language of `locale`.
- The fields keep the formatting around the variable, such as bold or a larger font, and grow with their text.
- `validate()` returns the names of the variables left empty, marks their fields in red and focuses the first one. An empty list means the form is complete.
- `getHTML(options?)` returns the filled document, made with `fillTemplate`: the values are escaped and `options.missing` decides what happens to variables that have no value.
- `readonly` shows the filled values without letting them change, for example on an approval page.

## Document templates

The document button of the toolbar inserts a ready-made document in the editor's language: an official letter, an order, an application, a certificate of employment or an act. Each one is laid out the way such documents usually are and uses template variables such as `{{org_name}}` and `{{doc_number}}`, so it can be filled with `fillTemplate` right away. The chips of these variables are labelled even when `variables` does not list them.

The same templates are available in code:

```ts
import { getDocumentTemplate } from 'nuvra';

const { html, variables } = getDocumentTemplate('order', 'uz');
```

## Amounts, dates and alphabets

The **More elements** menu has three helpers for official texts:

- **Amount in words** rewrites the number right before the caret, or a selected amount: `15 000 000 so‘m` becomes `15 000 000 (o‘n besh million) so‘m`. The words follow the editor's language; hundredths stay in digits.
- **Today’s date** inserts `14.09.2026`, and **Today’s date (long)** the written-out form: `2026-yil 14-sentabr`, `2026 йил 14 сентябрь`, `14 сентября 2026 г.` or `14 September 2026`.

The letter case menu converts Uzbek text between the Latin and the Cyrillic alphabet: the selection, or the whole document when nothing is selected. Formatting stays, and variables are left untouched.

The helpers are exported for your own code as well:

```ts
import { formatAmountInWords, formatLongDate, numberToWords, parseAmount, transliterate } from 'nuvra';

numberToWords(2500, 'ru'); // 'две тысячи пятьсот'
formatAmountInWords(1250.5, 'uz'); // '1 250,50 (bir ming ikki yuz ellik)'
parseAmount('1 250,50'); // 1250.5
formatLongDate(new Date(), 'uz'); // '2026-yil 14-sentabr'
transliterate('O‘zbekiston', 'toCyrillic'); // 'Ўзбекистон'
```

## Signature blocks

The pen button of the toolbar inserts a signature block written in the editor's language:

| Block | Content |
| --- | --- |
| Signature line | Position, signature line and full name in one row. |
| “Approved” block | APPROVED, position, signature with name and date at the right. |
| “Agreed” block | The same block at the left, titled AGREED. |
| Signatures of the parties | Customer and contractor side by side, with organization, position, signature and seal place. |

A signature block is a table without borders. On the page its cells are drawn with faint dashed lines while you edit; printing, PDF and Word export show no borders. Every text in it is ordinary content: replace the placeholders, add rows with the table menu or put template variables there, such as `{{full_name}}` next to the signature line.
