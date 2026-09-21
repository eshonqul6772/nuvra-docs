# Usage

This page covers everyday work with `DocumentEditor` and `Editor`: the value, page settings, views, the `/` menu, sizing, images, your own toolbar buttons, printing and export. For the complete list of options see [API](/docs/api).

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

## Headers and footers

The header and footer button of the toolbar edits the running text at the top and at the bottom of every page; each has a left, a centre and a right part. Both are stored in the page settings as `header` and `footer`, so `v-model:page` saves and restores them with the rest of the setup.

| Token | Becomes |
| --- | --- |
| `{page}` | Number of the current page |
| `{pages}` | Number of pages in the document |
| `{date}` | Today's date (dd.mm.yyyy) |
| `{title}` | Document title from the `title` prop |

- In the page view the running texts are drawn in the margins of every sheet, with the tokens resolved for that page. A footer replaces the editor's own page indicator.
- Printing and HTML export lay the document out in sheets exactly as the editor does, so the page numbers and page breaks on paper match the screen.
- The Word export turns them into Word's own header and footer, and `{page}` and `{pages}` into the Word fields PAGE and NUMPAGES, so the numbers stay correct after the document is edited in Word.
- Exported from the web view the document is not split into sheets: the running texts are still repeated on every printed page, but `{page}` stays empty.
- The same popover hides the running texts on the first page and sets the number of the first page; see [Page numbering](/docs/word-files#page-numbering).

## Watermark

Typing a text into the "Watermark" section of the page setup (for example `DRAFT` or `COPY`) draws it faintly behind the text of every page. Its colour can be picked, and the "Diagonal" switch lays the text across the page at an angle.

- The text is scaled to span the paper and drawn at 16% opacity, so it never gets in the way of reading.
- It is stored in the page settings as `watermark`, so `v-model:page` saves and restores it with the rest of the setup.
- Printing and HTML export repeat it on every sheet; the Word export writes it in Word's own watermark form (a VML shape inside the header).
- Clearing the text removes the watermark from the settings again.

## Ruler

The page view carries a ruler above the sheet: it is measured in centimetres, separates the text area from the margins and offers five markers to drag.

| Marker | Changes |
| --- | --- |
| Triangle on top | First line indent of the paragraph (`text-indent`) |
| Left triangle below | Left indent of the paragraph (`margin-left`) |
| Right triangle below | Right indent of the paragraph (`margin-right`) |
| Left bar in the middle | Left page margin |
| Right bar in the middle | Right page margin |

- Values snap to whole millimetres and are applied when the pointer is released, so one drag is one undo step.
- The indent markers act on the paragraph at the caret (or on the selected paragraphs); the margin markers change the margins in `v-model:page`.
- `:ruler="false"` hides the ruler from the start; users switch it with the "Ruler" entry of the "More" menu. The web view and the form field never show it.

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

## Formatting tools

The toolbar carries the tools office editors are used for:

- **Format painter** picks up the formatting at the caret (font, size, color, highlight, bold and italic, block type, alignment, line spacing and indentation) and paints it onto the text selected next, or onto the paragraph that is clicked. `Escape` drops it.
- **Letter case** (Aa) turns the selected text into UPPERCASE, lowercase, Title Case or sentence case, and toggles the case of every character.
- **The font size field** accepts a size that is not in the list (1–400 pt); the A↑ and A↓ buttons next to it step through the list.
- **Paragraph spacing** is added from the line spacing menu: 12 pt before or after the paragraph. It is stored in the document HTML as the `data-space-before` and `data-space-after` attributes together with a `margin`, and the spacing of paragraphs pasted from Word or Google Docs is converted into the same form.
- **Formatting marks** are switched on from the "More" menu and draw a pilcrow at the end of every paragraph. They are painted by the editor only: the document HTML, printing and export never contain them.
- **The context menu** opens on a right click and follows what was clicked: cut, copy and paste, link actions, table rows and columns, deleting an image, clearing formatting and selecting everything.
- **Zoom** follows `Ctrl` (`⌘` on macOS) with the mouse wheel.

## The / menu

Typing `/` at the start of a line or after a space opens a list of commands under the caret: normal text, headings 1–3, bulleted, numbered and checklists, quote, code block, table, horizontal line, page break, footnote, table of contents, section breaks for landscape and portrait pages, today's date in the short and the long form, the signature blocks and the template variables from `variables`.

- The letters typed after `/` filter the list by name, and by a few keywords in Uzbek, Russian and English: `/jadval` finds the table.
- `↑` and `↓` move through the list; `Enter`, `Tab` or a click runs the command. The typed `/filter` is removed first.
- `Escape` closes the menu, and it stays closed until the text before the caret changes.
- The menu does not open inside code blocks, in a `disabled` editor or in the HTML source view. `Editor` has it too.

### Your own commands

`slashCommands` adds commands of your application at the top of the list. `run` receives the editing engine:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, type SlashCommand } from 'nuvra';

const html = ref('');

const slashCommands: SlashCommand[] = [
  {
    id: 'director',
    label: 'Director’s name',
    icon: 'pencil',
    keywords: ['direktor', 'директор'],
    run: engine => engine.insertText('A. Karimov')
  },
  {
    id: 'approved',
    label: 'Approval stamp',
    icon: 'signature',
    run: engine => engine.insertContent('<p style="text-align: right"><strong>APPROVED</strong></p>', { asBlocks: true })
  }
];
</script>

<template>
  <DocumentEditor v-model="html" :slash-commands="slashCommands" />
</template>
```

`icon` is one of the editor's icon names (`IconName`); without it the command shows a plus. The most useful engine methods are listed under [DocumentEngine](/docs/api#documentengine).

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
| `insertVariable(name)` | Inserts a template variable at the selection. |
| `updateTableOfContents()` | Inserts or refreshes the table of contents. |
| `importWord(file)` | Replaces the document with the content of a `.docx` file. |
| `importPdf(file)` | Replaces the document with the content of a `.pdf` file, as editable text. |
| `print()` | Opens the browser print dialog for the document. |
| `exportHtml()` | Downloads the document as a standalone HTML page. |
| `exportWord()` | Downloads the document as a Word file (`.docx`). |
| `exportPdf()` | Downloads the document as a PDF drawn from its pages (new in 0.6.0). |
| `engine` | The editing engine (`null` until the editor is mounted), for advanced integrations. |

`Editor` does not expose these methods.

## Your own toolbar buttons

The `toolbar` slot places buttons of your application at the start of the toolbar's right-hand group. It receives the editing `engine`, the formatting `state` at the caret and `disabled`, which is `true` while the document cannot be edited.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor } from 'nuvra';

const html = ref('');

const lookUp = (text: string) => window.open(`https://www.google.com/search?q=${encodeURIComponent(text)}`);
</script>

<template>
  <DocumentEditor v-model="html">
    <template #toolbar="{ engine, state, disabled }">
      <button
        type="button"
        class="doc-tb-button"
        title="Insert today's stamp"
        :disabled="disabled"
        @mousedown.prevent
        @click="engine.insertText(`Received ${new Date().toLocaleDateString()}`)"
      >
        Stamp
      </button>
      <button
        type="button"
        class="doc-tb-button"
        title="Look up the selected text"
        :disabled="!state.textSelected"
        @mousedown.prevent
        @click="lookUp(engine.getSelectedText())"
      >
        Look up
      </button>
    </template>
  </DocumentEditor>
</template>
```

- `@mousedown.prevent` keeps the selection in the document when the button is pressed, as the built-in buttons do.
- The `doc-tb-button` class gives a button the look of the toolbar's own buttons; any other markup works as well.
- Engine commands are undo steps and update `v-model` like typing does. The `state` fields are listed under [EditorUiState](/docs/api#editoruistate).

## Printing and export

Printing, PDF download, HTML export and Word export are also available from the “More” menu of the toolbar; `Ctrl+P` prints.

- **Print** renders the document in a hidden frame with the page size and margins of the page settings, waits for images to load and opens the browser print dialog. Choose “Save as PDF” there to get a PDF with selectable text.
- **PDF download** (new in 0.6.0) saves a PDF right away, without the print dialog; its pages are pictures, so the text cannot be selected. See [Downloading a PDF](/docs/word-files#downloading-a-pdf).
- **HTML export** downloads a standalone HTML page with the document styles and the page size.
- **Word export** downloads a real Word file (`.docx`) with the page setup, headers and footers and page breaks. "Open Word file (.docx)" in the same menu loads one into the editor. See [Word files and long documents](/docs/word-files).

The `title` prop is used as the print title and the file name. Without it the built-in label `editor.document` is used. Characters that are not allowed in file names are replaced.

## HTML source

The “More” menu also switches to an HTML source view. When the user leaves it, the edited HTML is sanitized and applied to the document as a single undo step.

## Fullscreen

The status bar button and the “More” menu toggle fullscreen; `Escape` leaves it. The editor covers the viewport and page scrolling is locked. Inside a dialog (a native `dialog` element or an element with `role="dialog"`) the editor stays within that dialog, so the dialog's focus handling keeps working. The stacking order is set by the `--nuvra-fullscreen-z-index` variable, see [Theming](/docs/theming).

## Pasted content

Content pasted from Word, Google Docs or web pages is sanitized: unsupported elements, attributes and unsafe links are removed, and only markup the editor supports is kept. Inside a code block only plain text is pasted. Pasting a single web address over selected text turns the selection into a link.
