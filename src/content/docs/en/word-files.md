# Word files and long documents

This page covers opening and saving Word files, and the tools for long documents: footnotes, multilevel numbering, page numbering options, the table of contents and the navigation pane.

## Word files (.docx)

### Saving as Word

"Download as Word (.docx)" in the "More" menu, or `exportWord()` on a template ref, downloads a real Word file in the Office Open XML format. Word, LibreOffice, Google Docs and other office suites open it for editing. The file name comes from the `title` prop.

The file keeps:

- paragraphs and headings with alignment, indents, paragraph spacing, line spacing and text direction;
- bold, italic, underline, strikethrough, subscript and superscript, text colour, highlight, font and font size;
- links, quotes and code blocks;
- bulleted and numbered lists with their nesting, the start number and multilevel numbering; checklist items get ☐ and ☑ characters;
- tables with merged cells and column widths; signature blocks and the table of contents without borders;
- images in PNG, JPEG, GIF and BMP;
- footnotes, as Word's own footnotes;
- tracked changes, as Word revisions with their author and time;
- page breaks and horizontal lines;
- paper size, orientation and margins, headers and footers with the PAGE and NUMPAGES fields, the watermark and the page numbering options.

Template variables are written as `{{name}}` text, and comments are left out: the commented text stays.

Images from a web address are downloaded while the file is built, so the server must allow the request (CORS). An image that cannot be read, or one in another format such as WebP or SVG, is skipped.

`buildDocx` builds the same file in your own code, for example to upload it instead of downloading:

```ts
import { buildDocx } from 'nuvra';

const blob = await buildDocx({ html, title: 'Contract', page });
await fetch('/api/documents/42/docx', { method: 'PUT', body: blob });
```

### Opening a Word file

"Open Word file (.docx)" in the "More" menu picks a file and replaces the document with its content. The paper size, orientation, margins, header and footer texts and page numbering come from the file too; the current watermark stays. The replacement is one undo step for the content. The entry is disabled while the editor is `disabled`.

The same works from code with `importWord(file)`. A file that cannot be read leaves the document unchanged and emits `importError`:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor } from 'nuvra';

const html = ref('');
const editor = ref<InstanceType<typeof DocumentEditor>>();

const open = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) void editor.value?.importWord(file);
};
</script>

<template>
  <input type="file" accept=".docx" @change="open" />
  <DocumentEditor ref="editor" v-model="html" @import-error="error => console.error(error)" />
</template>
```

The import reads paragraphs and headings (the Heading 1–6 and Title styles, and styles with an outline level), paragraph and character formatting, links, lists including multilevel numbering, tables with merged cells, images, page breaks, footnotes, revisions and content controls. Word's insertions and deletions become tracked changes of the editor, so a document reviewed in Word comes back with its changes still open. Images are embedded as data URLs and do not go through `uploadImage`. A table without borders becomes a borderless table, as a signature block is.

`readDocx` returns the result without an editor:

```ts
import { readDocx } from 'nuvra';

const { html, page } = await readDocx(await file.arrayBuffer());
```

### Limits

| Word feature | What happens |
| --- | --- |
| Footnotes | Kept both ways; on import only the text of a note is read, its formatting is dropped. |
| Endnotes | Not imported. |
| Revisions | Insertions and deletions of text are kept both ways. Text Word marked as moved arrives as a deletion at its old place and an insertion at the new one. A formatting revision arrives as the new formatting without a revision. |
| Word comments | Not imported. |
| Several sections | The document gets one page setup: the one of the last section. |
| Different first page header | The option is kept, but the content of the first page header and footer is not imported. |
| Headers and footers | Only their text is imported, split into the left, centre and right parts; formatting and images are dropped. |
| Watermark, text boxes, shapes | Not imported. |
| Fields | PAGE and NUMPAGES in headers and footers become `{page}` and `{pages}`; other fields keep the text they showed. |

## Footnotes

"Footnote" in the insert menu (the **+** button) or in the `/` menu inserts a numbered reference at the caret and opens a small form for the note. `Ctrl+Enter` or **Save** keeps it; **Cancel** or `Escape` leaves the form, and a new footnote left empty is removed again. Clicking a reference opens the form to change the note or **Delete** the footnote.

References are numbered in document order and renumbered whenever footnotes are added, moved or deleted. A footnote is saved in the reference itself, with its current number:

```html
<p>The act was signed by both parties<sup data-footnote="Signed copies are kept in the archive.">1</sup>.</p>
```

Where the notes appear:

| Place | Notes |
| --- | --- |
| Page view | At the bottom of the sheet the reference is on, under a short rule; the layout keeps the space free. |
| Web view | All notes after the document. |
| Printing and HTML export from the page view | At the bottom of each sheet, as on screen. |
| Printing and HTML export from the web view | All notes after the document. |
| Word export | Word's own footnotes, numbered by Word. |

- The note is plain text, up to 2000 characters, without formatting.
- A paragraph is not split between sheets, so its notes sit on the sheet it starts on. A block taller than a page keeps all its notes on its first sheet.
- From code: `engine.insertFootnote(text)`, `setFootnoteText(element, text)`, `removeFootnote(element)` and `getFootnotes()`.

## Multilevel numbering

Official documents such as orders and regulations number their clauses 1., 1.1., 1.1.1. Open the arrow next to the numbered list button and choose "Multilevel numbering (1.1, 1.2)"; "Simple numbering (1, 2, 3)" switches back. When the caret is not in a numbered list, one is created.

Nest items with `Tab` and lift them with `Shift+Tab`: each nested level continues its parent's number.

```html
<ol data-numbering="legal">
  <li><p>General provisions</p>
    <ol>
      <li><p>This regulation applies to all employees.</p></li>
      <li><p>It enters into force on signing.</p></li>
    </ol>
  </li>
  <li><p>Duties</p></li>
</ol>
```

The attribute sits on the outermost list only. The Word export writes multilevel numbering Word continues on its own, and the import recognizes such lists in Word files. From code: `engine.setListNumbering('legal')` or `'default'`.

## Page numbering

The header and footer popover of the toolbar has two options below the texts:

| Option | Setting | Effect |
| --- | --- | --- |
| "Hide on the first page" | `differentFirstPage: true` | The first page shows no header, footer or page number, as title pages and letterheads need. |
| "Start numbering at" | `firstPageNumber` | Number printed on the first page (0–9999); the following pages count on from it. |

Both are stored in `v-model:page` and are left out while they have their default values. The page view, printing, HTML export and the Word export follow them; in Word they become the "Different first page" option and the start number of the page numbering. `{pages}` still counts every sheet.

```ts
const page = ref<PageSettings>({
  ...createPageSettings(),
  footer: { left: '', center: '{page}', right: '' },
  differentFirstPage: true,
  firstPageNumber: 0
});
```

With these settings the title page has no number and the next page is numbered 1.

In Word the watermark is part of the header, so a document with "Hide on the first page" shows no watermark on its first page there.

## Table of contents

"Table of contents" in the insert menu (the **+** button) or in the `/` menu inserts a table of contents at the caret. It lists the headings of levels 1 to 3 written directly in the document, not those inside tables, lists or quotes, with the page each starts on. Page numbers need the page view; in the web view the number column stays empty.

The table of contents does not follow edits by itself. Once the document has one, the same entry reads "Update table of contents" and rebuilds it in place, wherever the caret is. `updateTableOfContents()` on a template ref does the same, for example right before saving.

It is saved as ordinary content, a borderless table:

```html
<table data-type="toc"><tbody>
  <tr><td colspan="2"><p style="text-align: center"><strong>Table of contents</strong></p></td></tr>
  <tr><td><p><strong>1. General provisions</strong></p></td><td><p style="text-align: right">2</p></td></tr>
  <tr><td><p style="margin-left: 24px">1.1. Scope</p></td><td><p style="text-align: right">2</p></td></tr>
</tbody></table>
```

So it prints, exports to HTML and Word, and is compared like any other table. Text typed into it is replaced on the next update. `buildTableOfContents` and `readOutline` build the same markup in your own code.

## Navigation pane

"Navigation pane" in the "More" menu opens a panel at the left with every heading of the document, indented by level. In the page view each heading shows the page it starts on. Clicking a heading scrolls to it and puts the caret at its start. The list follows edits after a short pause; a document without headings shows a hint to apply a heading style.
