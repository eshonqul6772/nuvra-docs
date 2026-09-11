# Usage

This page covers everyday work with `DocumentEditor` and `Editor`: the value, page settings, views, sizing, images, printing and export. For the complete list of options see [API](/docs/api).

## The document value

`v-model` holds the document as HTML.

- An empty document is written as an empty string `''`.
- While the user types, the value is updated after a short pause (about 200 ms), because serializing the whole document on every keystroke is expensive. Pending edits are written immediately when the editor loses focus and before it is unmounted.
- `getHTML()` on a template ref writes pending edits and returns the current HTML, so it is safe to call right before saving.
- Assigning a new value from outside replaces the document. The HTML is sanitized first, so only markup the editor supports is kept.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor } from 'nuvra';

const html = ref('<p>Loaded from the server</p>');

const save = () => fetch('/api/documents/1', { method: 'PUT', body: html.value });
</script>

<template>
  <DocumentEditor v-model="html" @blur="save" />
</template>
```

## Page settings

Paper size, orientation and margins are bound with `v-model:page`. `createPageSettings()` returns the defaults: A4, portrait, normal margins.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, type PageSettings, createPageSettings } from 'nuvra';

const html = ref('');
const page = ref<PageSettings>(createPageSettings());
</script>

<template>
  <DocumentEditor v-model="html" v-model:page="page" />
</template>
```

Users change the settings in the page setup popover of the toolbar. Margins are in millimetres (0–100 in the exact value inputs).

### Paper sizes

| Key | Name | Size (portrait, mm) |
| --- | --- | --- |
| `a3` | A3 | 297 × 420 |
| `a4` | A4 | 210 × 297 |
| `a5` | A5 | 148 × 210 |
| `letter` | Letter | 215.9 × 279.4 |
| `legal` | Legal | 215.9 × 355.6 |

### Margin presets

| Preset | Top | Right | Bottom | Left |
| --- | --- | --- | --- | --- |
| Normal (default) | 25.4 | 25.4 | 25.4 | 25.4 |
| Narrow | 12.7 | 12.7 | 12.7 | 12.7 |
| Moderate | 25.4 | 19.1 | 25.4 | 19.1 |
| Wide | 25.4 | 50.8 | 25.4 | 50.8 |
| Official document (O‘zDSt 1.14) | 20 | 15 | 20 | 30 |

The same settings are used by printing and by HTML and Word export.

## Views

The editor has two views, switched from the status bar:

- **Page view** (`'page'`) shows separate sheets with the chosen paper size and margins, a page counter and zoom from 30% to 200% in steps of 10%. In narrow containers the page is zoomed out automatically until the user picks a zoom level.
- **Web view** (`'web'`) shows one continuous sheet, like a web page.

`defaultViewMode` chooses the view shown first. `DocumentEditor` starts in the page view; `Editor` always uses the web view.

```vue
<template>
  <DocumentEditor v-model="html" default-view-mode="web" />
</template>
```

## Sizing

| Prop | Default | Description |
| --- | --- | --- |
| `height` | `760` | Height of the whole editor, or `'auto'` to grow with the content. |
| `minHeight` | `240` | Smallest height when `height` is `'auto'`. |
| `maxHeight` | `600` | Largest height when `height` is `'auto'`; longer documents scroll. |
| `canvasPadding` | `50` | Gray space around the page or web sheet. |

Numbers are pixels; strings are used as CSS lengths, such as `'100%'` or `'50vh'`. `Editor` always uses `height: 'auto'`.

The editor root also receives any attributes you pass, such as `class` and `style`.

## Read-only documents

`disabled` makes the document read-only and disables every editing control. Search, page setup, printing and export stay available.

```vue
<template>
  <DocumentEditor :model-value="html" disabled />
</template>
```

## Character limit

`maxLength` limits the number of characters; `0` (the default) means unlimited. Typing, pasting and insertions that would exceed the limit are rejected, and the status bar shows the counter as `count / limit`, highlighted once the limit is reached.

## Placeholder

`placeholder` sets the text shown while the document is empty. Without it the editor shows its built-in label `editor.placeholder`.

## Images

Users insert images from the toolbar (upload from the computer or a web address), by pasting image files and by dropping them onto the document.

Without an upload handler, images are embedded into the HTML as data URLs. To store them on your server, pass `uploadImage`: a function that receives the `File` and resolves with its URL.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, type DocumentImageUploadHandler } from 'nuvra';

const html = ref('');

const uploadImage: DocumentImageUploadHandler = async file => {
  const body = new FormData();
  body.append('file', file);
  const response = await fetch('/api/files', { method: 'POST', body });
  return (await response.json()).url;
};

const onUploadError = (error: unknown) => {
  console.error(error);
};
</script>

<template>
  <DocumentEditor v-model="html" :upload-image="uploadImage" :max-image-size-mb="5" @upload-error="onUploadError" />
</template>
```

- Only files with an `image/*` type are accepted.
- Files larger than `maxImageSizeMb` (10 MB by default) are rejected.
- Several images are processed one after another while an “uploading” indicator is shown.
- A rejected file, a failed upload or an empty URL from the handler emits `uploadError` with the error; the other images are still inserted. Validation errors are `Error` objects with a translated message.
- Image addresses typed in the toolbar must start with `http://`, `https://` or `/`.

## Template ref methods

`DocumentEditor` exposes a few methods through a template ref:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor } from 'nuvra';

const html = ref('');
const editor = ref<InstanceType<typeof DocumentEditor>>();

const save = () => {
  const latest = editor.value?.getHTML();
  // send `latest` to the server
};
</script>

<template>
  <DocumentEditor ref="editor" v-model="html" />
  <button type="button" @click="save">Save</button>
  <button type="button" @click="editor?.print()">Print</button>
</template>
```

| Member | Description |
| --- | --- |
| `focus()` | Moves keyboard focus into the document. |
| `getHTML()` | Writes pending edits into the model and returns the document HTML. |
| `print()` | Opens the browser print dialog for the document. |
| `exportHtml()` | Downloads the document as a standalone HTML page. |
| `exportWord()` | Downloads the document as a Word-compatible `.doc` file. |
| `engine` | The internal editing engine (`null` until the editor is mounted), for advanced integrations. |

`Editor` does not expose these methods.

## Printing and export

Printing, HTML export and Word export are also available from the “More” menu of the toolbar; `Ctrl+P` prints.

- **Print** renders the document in a hidden frame with the page size and margins of the page settings, waits for images to load and opens the browser print dialog. Choose “Save as PDF” there to get a PDF.
- **HTML export** downloads a standalone HTML page with the document styles and the page size.
- **Word export** downloads a `.doc` file that Word opens in print layout; page breaks become Word page breaks.

The `title` prop is used as the print title and the file name. Without it the built-in label `editor.document` is used. Characters that are not allowed in file names are replaced.

## HTML source

The “More” menu also switches to an HTML source view. When the user leaves it, the edited HTML is sanitized and applied to the document as a single undo step.

## Fullscreen

The status bar button and the “More” menu toggle fullscreen; `Escape` leaves it. The editor covers the viewport and page scrolling is locked. Inside a dialog (a native `dialog` element or an element with `role="dialog"`) the editor stays within that dialog, so the dialog's focus handling keeps working. The stacking order is set by the `--nuvra-fullscreen-z-index` variable, see [Theming](/docs/theming).

## Pasted content

Content pasted from Word, Google Docs or web pages is sanitized: unsupported elements, attributes and unsafe links are removed, and only markup the editor supports is kept. Inside a code block only plain text is pasted. Pasting a single web address over selected text turns the selection into a link.
