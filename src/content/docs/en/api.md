# API

A complete reference of everything nuvra exports: components, functions, constants and types.

Entries marked **New in 0.6.0** were added in version 0.6.0; see [Changelog](/docs/changelog).

## Exports

```ts
import {
  DocumentCompare,
  DocumentEditor,
  DocumentForm,
  Editor,
  buildDocx,
  buildTableOfContents,
  collaboratorColor,
  compareDocuments,
  createCommentId,
  createHeaderFooter,
  createPageSettings,
  createWatermark,
  editorLocales,
  en,
  fillTemplate,
  formatAmountInWords,
  formatLongDate,
  formatShortDate,
  getDocumentTemplate,
  getTemplateVariables,
  numberToWords,
  parseAmount,
  readDocx,
  readOutline,
  ru,
  setEditorLocale,
  transliterate,
  uz,
  uzCyrl,
  type Collaborator,
  type DocumentComment,
  type DocumentCommentReply,
  type DocumentComparison,
  type DocumentEngine,
  type DocumentImageUploadHandler,
  type DocumentTemplate,
  type DocumentTemplateId,
  type DocumentViewMode,
  type DocxImport,
  type DocxSource,
  type EditorLocale,
  type EditorLocaleCode,
  type EditorLocaleInput,
  type EditorUiState,
  type FillTemplateOptions,
  type IconName,
  type NumberWordsLocale,
  type OutlineHeading,
  type PageHeaderFooter,
  type PageMargins,
  type PageOrientation,
  type PageSettings,
  type PageSizeKey,
  type PageWatermark,
  type SelectionOffsets,
  type SlashCommand,
  type TableOfContentsEntry,
  type TableOfContentsOptions,
  type TemplateValues,
  type TemplateVariable,
  type TrackedChange,
  type TransliterationDirection
} from 'nuvra';
import 'nuvra/style.css';
```

## DocumentEditor

The full Word-style editor with toolbar, page or web view, status bar, find and replace, comments, tracked changes, footnotes, printing, import and export.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `author` | `string` | `''` | Name written as the author of new comments, replies and tracked changes; see [Comments and comparison](/docs/review). |
| `autofocus` | `boolean` | `false` | Places the caret at the end of the document as soon as the editor is ready. |
| `canvasPadding` | `number \| string` | `50` | Gray space around the page or web sheet. |
| `collaborators` | `Collaborator[]` | `[]` | **New in 0.6.0.** Other people editing the document; their carets and selections are drawn over it. See [Editing together](/docs/collaboration). |
| `defaultViewMode` | `DocumentViewMode` | `'page'` | View shown first; the user can switch it in the status bar. |
| `disabled` | `boolean` | `false` | Makes the document read-only and disables every editing control. |
| `height` | `number \| string` | `760` | Height of the whole editor, or `'auto'` to grow with the content between `minHeight` and `maxHeight`. |
| `locale` | `EditorLocaleInput` | — | Interface language: `uz`, `uzCyrl`, `en`, `ru` or their codes; defaults to the app-wide language. |
| `maxHeight` | `number \| string` | `600` | Largest height of an auto-height editor; longer documents scroll inside it. |
| `maxImageSizeMb` | `number` | `10` | Largest accepted image file, in megabytes. |
| `maxLength` | `number` | `0` | Largest number of characters; `0` means unlimited. |
| `minHeight` | `number \| string` | `240` | Smallest height of an auto-height editor. |
| `placeholder` | `string` | `''` | Text shown while the document is empty; falls back to the `editor.placeholder` label. |
| `ruler` | `boolean` | `true` | Shows the ruler above the sheet in the page view; users can also toggle it in the "More" menu. |
| `slashCommands` | `SlashCommand[]` | `[]` | Commands of your application, listed first in the `/` menu; see [Usage](/docs/usage). |
| `title` | `string` | `''` | Print title and exported file name; falls back to the `editor.document` label. |
| `uploadImage` | `DocumentImageUploadHandler` | — | Uploads an inserted image and resolves with its URL; without it images are embedded as data URLs. |
| `variables` | `TemplateVariable[]` | `[]` | Template variables the user can insert; see [Templates and signatures](/docs/templates). |

Numbers are pixels; strings are used as CSS lengths. Other attributes, such as `class` and `style`, are applied to the editor root.

### v-model

| Binding | Type | Default | Description |
| --- | --- | --- | --- |
| `v-model` | `string` | `''` | Document HTML. An empty document is `''`; typing updates the value after a short pause. |
| `v-model:page` | `PageSettings` | `createPageSettings()` | Paper size, orientation, margins, headers and footers, watermark and page numbering. |
| `v-model:comments` | `DocumentComment[]` | — | Comments on the document. Binding it turns the comment tools on; the HTML keeps only their anchors. |
| `v-model:trackChanges` | `boolean` | `false` | Whether edits are recorded as tracked changes. "Track changes" in the Review menu of the toolbar switches it too. |

### Events

| Event | Payload | Description |
| --- | --- | --- |
| `focus` | — | The editing surface received focus. |
| `blur` | — | The editing surface lost focus; pending model updates have already been written. |
| `uploadError` | `error: unknown` | An image was rejected by validation or its upload failed. |
| `importError` | `error: unknown` | A Word file could not be read; the document is left unchanged. |
| `exportError` | `error: unknown` | **New in 0.6.0.** The PDF could not be drawn, for example because the browser does not allow it; no file is downloaded. |
| `selectionChange` | `selection: SelectionOffsets \| null` | **New in 0.6.0.** The caret or selection moved; `null` when it left the document. Send it to the other people editing. |

### Slots

| Slot | Props | Description |
| --- | --- | --- |
| `toolbar` | `{ engine: DocumentEngine; state: EditorUiState; disabled: boolean }` | Buttons of your application, placed at the start of the toolbar's right-hand group. `disabled` is `true` while the document is read-only or the HTML source is shown. |

### Exposed members

Available through a template ref.

| Member | Type | Description |
| --- | --- | --- |
| `focus` | `() => void` | Moves keyboard focus into the document. |
| `getHTML` | `() => string` | Writes pending edits into the model and returns the document HTML. |
| `insertVariable` | `(name: string) => void` | Inserts a template variable at the selection. |
| `updateTableOfContents` | `() => Promise<void>` | Inserts a table of contents at the selection, or refreshes the existing one. |
| `importWord` | `(file: File) => Promise<void>` | Replaces the document and the page setup with the content of a `.docx` file, as one undo step. Errors are emitted as `importError`. |
| `print` | `() => Promise<void>` | Opens the browser print dialog. |
| `exportHtml` | `() => Promise<void>` | Downloads the document as an HTML page. |
| `exportWord` | `() => Promise<void>` | Downloads the document as a Word file (`.docx`). |
| `exportPdf` | `() => Promise<void>` | **New in 0.6.0.** Downloads the document as a PDF drawn from its pages, without the print dialog; the text of the PDF is not selectable. Errors are emitted as `exportError`. See [Word files and long documents](/docs/word-files#downloading-a-pdf). |
| `engine` | `DocumentEngine \| null` | The editing engine, for advanced integrations; `null` until the editor is mounted. |

## Editor

A rich text field for forms: `DocumentEditor` in the web view with `height: 'auto'`, growing with its content between `minHeight` and `maxHeight`.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `autofocus` | `boolean` | `false` | Places the caret at the end of the content once the editor is ready. |
| `canvasPadding` | `number \| string` | `50` | Gray space around the sheet. |
| `disabled` | `boolean` | `false` | Makes the content read-only and disables the toolbar. |
| `locale` | `EditorLocaleInput` | — | Interface language: `uz`, `uzCyrl`, `en`, `ru` or their codes; defaults to the app-wide language. |
| `maxHeight` | `number \| string` | `600` | Height at which the field stops growing and starts scrolling. |
| `maxImageSizeMb` | `number` | `10` | Largest accepted image file, in megabytes. |
| `maxLength` | `number` | `0` | Character limit; `0` means unlimited. |
| `minHeight` | `number \| string` | `240` | Smallest height of the field, including the gray space around the sheet. |
| `placeholder` | `string` | `''` | Text shown while the field is empty. |
| `uploadImage` | `DocumentImageUploadHandler` | — | Uploads an image and resolves with its URL; without it images are embedded as data URLs. |
| `variables` | `TemplateVariable[]` | `[]` | Template variables the user can insert. |

### v-model and events

| Name | Type | Description |
| --- | --- | --- |
| `v-model` | `string` | Field value as sanitized HTML; an empty field is `''`. |
| `focus` | event | The editable area received focus. |
| `blur` | event | The editable area lost focus. |
| `uploadError` | event, `error: unknown` | An image was rejected or could not be uploaded. |

`Editor` has no `v-model:page`, `v-model:comments`, `v-model:trackChanges`, `author`, `defaultViewMode`, `height`, `title`, `ruler`, `slashCommands` or `toolbar` slot, and exposes no methods. The `/` menu works in it with the built-in commands.

## DocumentCompare

A read-only comparison of two versions of a document: the new version with inserted words underlined in green and deleted words struck through in red, and the number of changes above it. See [Comments and comparison](/docs/review).

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `before` | `string` | — | HTML of the earlier version. Required. |
| `after` | `string` | — | HTML of the later version. Required. |
| `locale` | `EditorLocaleInput` | — | Interface language; defaults to the app-wide language. |
| `height` | `number \| string` | `'auto'` | Height of the component; `'auto'` grows with the document, a fixed height scrolls. |

It has no events and exposes no members.

## DocumentForm

A template filled in like a form: the document is shown as it will be printed, and only its variables are input fields. See [Templates and signatures](/docs/templates).

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `template` | `string` | — | Template HTML as saved by the editor. Required. |
| `variables` | `TemplateVariable[]` | `[]` | Labels shown in empty fields; the variables of the built-in document templates are labelled without it. |
| `locale` | `EditorLocaleInput` | — | Language of the built-in variable labels; defaults to the app-wide language. |
| `readonly` | `boolean` | `false` | Shows the values without letting them change. |

### v-model

| Binding | Type | Default | Description |
| --- | --- | --- | --- |
| `v-model` | `Record<string, string>` | `{}` | Values by variable name. Every field of the same variable shares one value. |

### Exposed members

| Member | Type | Description |
| --- | --- | --- |
| `getHTML` | `(options?: FillTemplateOptions) => string` | The filled document HTML, made with `fillTemplate`. |
| `validate` | `() => string[]` | Names of the variables left empty. It marks their fields and focuses the first one; an empty list means the form is complete. |

## Functions

### createPageSettings

```ts
function createPageSettings(): PageSettings;
```

Returns new default page settings: A4, portrait, margins of 25.4 mm on every side. Each call returns a new object.

### createHeaderFooter, createWatermark

```ts
function createHeaderFooter(): PageHeaderFooter;
function createWatermark(): PageWatermark;
```

An empty header or footer (`{ left: '', center: '', right: '' }`), and an empty watermark in the default colour: `{ text: '', color: '#9ca3af', diagonal: true }`.

### setEditorLocale

```ts
function setEditorLocale(locale: EditorLocaleInput): void;
```

Sets the interface language of every editor without its own `locale` prop. Reactive: editors already on the page switch right away. See [Languages](/docs/translations).

### fillTemplate

```ts
function fillTemplate(html: string, values: TemplateValues, options?: FillTemplateOptions): string;
```

Replaces the template variables of saved HTML with HTML-escaped values. Variables without a value are kept unless `options.missing` is `'empty'` or `'name'`. Works without a DOM, so it runs on a Node server too. See [Templates and signatures](/docs/templates).

### getTemplateVariables

```ts
function getTemplateVariables(html: string): string[];
```

Names of the template variables saved HTML uses, each once, in document order.

### getDocumentTemplate

```ts
function getDocumentTemplate(id: DocumentTemplateId, locale?: EditorLocaleCode): DocumentTemplate;
```

A built-in document template with its variables, in the given language (Uzbek by default).

### numberToWords, formatAmountInWords, parseAmount

```ts
function numberToWords(value: number, locale?: NumberWordsLocale): string;
function formatAmountInWords(value: number, locale?: NumberWordsLocale): string;
function parseAmount(text: string): number | null;
```

`numberToWords` writes the whole part of a number in words, up to trillions. `formatAmountInWords` adds the grouped digits: `15 000 000 (o‘n besh million)`. `parseAmount` reads typed amounts such as `15 000 000`, `1 250,50` or `1,250.50`.

### formatShortDate, formatLongDate

```ts
function formatShortDate(date: Date): string;
function formatLongDate(date: Date, locale?: NumberWordsLocale): string;
```

`14.09.2026`, and the written-out form of official documents in the given language.

### transliterate

```ts
function transliterate(text: string, direction: TransliterationDirection, previous?: string): string;
```

Converts Uzbek text between the Latin and the Cyrillic alphabet; `{placeholders}` and `{{variables}}` stay as they are.

### buildDocx

```ts
function buildDocx(source: DocxSource): Promise<Blob>;
```

Builds a Word file (Office Open XML) from document HTML, the title and the page settings. Images are embedded from data URLs or fetched from their address. Runs in the browser. See [Word files and long documents](/docs/word-files).

### readDocx

```ts
function readDocx(data: ArrayBuffer | Uint8Array): Promise<DocxImport>;
```

Reads a `.docx` file into editor HTML and page settings. Rejects when the file is not a Word document. Runs in the browser.

### compareDocuments

```ts
function compareDocuments(before: string, after: string): DocumentComparison;
```

Compares two versions of a document and returns display HTML of the new version with `<ins>` and `<del>` marks, and the number of inserted and deleted words. `DocumentCompare` is built on it. Needs a DOM.

### createCommentId

```ts
function createCommentId(): string;
```

A new random id for a comment or a reply, usable as an HTML attribute value, such as `cmfz3k1a9x2b7q`.

### collaboratorColor

```ts
function collaboratorColor(collaborator: Pick<Collaborator, 'id' | 'color'>): string;
```

**New in 0.6.0.** The colour the editor draws a collaborator in: their own `color`, or one of eight colours picked from the `id`, the same for the same id. Useful for a list of people next to the editor.

### readOutline

```ts
function readOutline(root: HTMLElement, depth?: number): OutlineHeading[];
```

Headings written directly in `root`, not inside tables, lists or quotes, down to `depth` (6 by default). Empty headings are skipped.

### buildTableOfContents

```ts
function buildTableOfContents(entries: TableOfContentsEntry[], options: TableOfContentsOptions): string;
```

HTML of a table of contents: the title, then one row per entry with its page number on the right. Entries of the highest level are bold, deeper levels are indented. The result is a borderless `<table data-type="toc">`.

## Constants

### uz, uzCyrl, en, ru

```ts
const uz: EditorLocale;
const uzCyrl: EditorLocale;
const en: EditorLocale;
const ru: EditorLocale;
```

The built-in interface languages: Uzbek in Latin (the default) and Cyrillic script, English and Russian.

### editorLocales

```ts
const editorLocales: ReadonlyArray<EditorLocale>;
```

Every built-in locale, for language pickers.

## Types

### PageSettings

```ts
interface PageSettings {
  /** Paper format. */
  size: PageSizeKey;
  /** Paper orientation. */
  orientation: PageOrientation;
  /** Margins in millimetres. */
  margins: PageMargins;
  /** Text repeated in the top margin of every page; omitted while the document has no header. */
  header?: PageHeaderFooter;
  /** Text repeated in the bottom margin of every page; omitted while the document has no footer. */
  footer?: PageHeaderFooter;
  /** Watermark drawn behind the text of every page; omitted while the document has none. */
  watermark?: PageWatermark;
  /** Whether the first page shows no header, footer or page number. */
  differentFirstPage?: boolean;
  /** Number printed on the first page; the following pages count on from it. Defaults to 1. */
  firstPageNumber?: number;
}
```

### PageMargins

```ts
/** Page margins in millimetres. */
interface PageMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
```

### PageHeaderFooter

```ts
/** Text repeated in the top or bottom margin of every page, in three aligned parts. */
interface PageHeaderFooter {
  left: string;
  center: string;
  right: string;
}
```

The texts may contain the `{page}`, `{pages}`, `{date}` and `{title}` tokens; see [Usage](/docs/usage).

### PageWatermark

```ts
interface PageWatermark {
  /** Text of the watermark, such as DRAFT or COPY. */
  text: string;
  /** Colour of the text; it is drawn faintly. */
  color: string;
  /** Whether the text runs diagonally across the page. */
  diagonal: boolean;
}
```

### PageOrientation

```ts
type PageOrientation = 'portrait' | 'landscape';
```

### PageSizeKey

```ts
type PageSizeKey = 'a3' | 'a4' | 'a5' | 'letter' | 'legal';
```

### DocumentViewMode

```ts
/** `page` shows sheets like a word processor, `web` a continuous surface. */
type DocumentViewMode = 'page' | 'web';
```

### DocumentImageUploadHandler

```ts
/** Uploads an image and resolves with its public URL. */
type DocumentImageUploadHandler = (file: File) => Promise<string>;
```

### DocumentComment

```ts
interface DocumentComment {
  /** Unique id; the anchor in the HTML is `<span data-comment="id">`. */
  id: string;
  /** Text of the comment. */
  text: string;
  /** Name of the person who wrote it, when the editor has `author`. */
  author?: string;
  /** When it was written, as an ISO 8601 string. */
  createdAt: string;
  /** Whether the discussion is closed; resolved comments keep their anchor but are not highlighted. */
  resolved?: boolean;
  /** Replies in the order they were written. */
  replies?: DocumentCommentReply[];
}
```

### DocumentCommentReply

```ts
interface DocumentCommentReply {
  id: string;
  text: string;
  author?: string;
  /** ISO 8601 string. */
  createdAt: string;
}
```

### TrackedChange

```ts
/** A tracked insertion or deletion; the parts of one edit are joined. */
interface TrackedChange {
  /** Id shared by the parts of the edit; `data-change` in the HTML. */
  id: string;
  /** Whether text was inserted or deleted. */
  type: 'insert' | 'delete';
  /** Name of the author; may be empty. */
  author: string;
  /** When the change was made, as an ISO 8601 string. */
  time: string;
  /** Inserted or deleted text. */
  text: string;
}
```

### DocumentComparison

```ts
interface DocumentComparison {
  /** Display HTML of the new version with insertions and deletions marked. */
  html: string;
  /** Number of inserted words, and of words in inserted blocks. */
  insertions: number;
  /** Number of deleted words, and of words in deleted blocks. */
  deletions: number;
}
```

### DocxSource

```ts
interface DocxSource {
  /** Clean document HTML as saved by the editor. */
  html: string;
  /** Document title, stored in the file properties and used by the `{title}` token. */
  title: string;
  /** Page size, orientation, margins, running texts, watermark and page numbering. */
  page: PageSettings;
}
```

### DocxImport

```ts
interface DocxImport {
  /** Document content as HTML. */
  html: string;
  /** Page setup of the document's first section; further sections arrive as section breaks. */
  page: PageSettings;
}
```

### OutlineHeading

```ts
interface OutlineHeading {
  /** Heading level, 1 to 6. */
  level: number;
  /** Heading text with collapsed whitespace. */
  text: string;
  /** The heading element. */
  element: HTMLElement;
}
```

### TableOfContentsEntry

```ts
interface TableOfContentsEntry {
  /** Heading level, 1 to 6; deeper levels are indented. */
  level: number;
  /** Heading text. */
  text: string;
  /** Page the heading starts on, or `null` when the document is not laid out in pages. */
  page: number | null;
}
```

### TableOfContentsOptions

```ts
interface TableOfContentsOptions {
  /** Title written above the entries. */
  title: string;
  /** Text shown instead of the entries when there are no headings. */
  emptyText: string;
  /** Width of the text column in pixels; the table spans it plus the page number column. */
  width?: number;
}
```

### SlashCommand

```ts
interface SlashCommand {
  /** Unique id; also matched by the typed filter. */
  id: string;
  /** Name shown in the menu. */
  label: string;
  /** Icon from the editor's icon set; `plus` when omitted. */
  icon?: IconName;
  /** More words the filter finds the command by, for example in other languages. */
  keywords?: readonly string[];
  /** Runs the command; the typed `/filter` has already been removed. */
  run: (engine: DocumentEngine) => void;
}
```

### Collaborator, SelectionOffsets

**New in 0.6.0.** See [Editing together](/docs/collaboration).

```ts
/** A selection as character positions through the document; equal positions are a caret. */
interface SelectionOffsets {
  /** Where selecting started. */
  anchor: number;
  /** Where the caret is. */
  focus: number;
}

/** Someone else editing the same document. */
interface Collaborator {
  /** Stable id of the person or connection. */
  id: string;
  /** Name shown next to the caret. */
  name: string;
  /** CSS colour of the caret and the selection; one is picked from the id when it is left out. */
  color?: string;
  /** Where the person's caret or selection is, or `null` while they are not in the document. */
  selection: SelectionOffsets | null;
}
```

### IconName

A union of the names of the editor's built-in icons, such as `'braces'`, `'calendar-days'`, `'file-text'`, `'signature'` or `'table-of-contents'`. Your editor's type hints list all of them.

### DocumentEngine

The editing engine behind `DocumentEditor`, exported as a type only. You get an instance from the `engine` member of a template ref, from the `toolbar` slot and in `SlashCommand.run`. Commonly used methods:

| Method | Description |
| --- | --- |
| `insertText(text: string)` | Inserts plain text at the selection. |
| `insertContent(html: string, options?: { asBlocks?: boolean })` | Inserts sanitized HTML as one undo step; with `asBlocks` it starts on a line of its own. |
| `insertVariable(name: string)` | Inserts a template variable. |
| `getSelectedText()` | Plain text of the selection. |
| `toggleMark(mark)` | Toggles `'bold'`, `'italic'`, `'underline'`, `'strike'`, `'code'`, `'subscript'` or `'superscript'`. |
| `setBlockType(tag)` | Turns the current block into `'P'` or `'H1'` … `'H6'`. |
| `toggleList(kind)` | Toggles a `'bulletList'`, `'orderedList'` or `'taskList'`. |
| `setListNumbering(style)` | Switches the numbered list at the caret between `'default'` and `'legal'` numbering. |
| `insertTable(rows, cols, withHeaderRow)` | Inserts a table. |
| `insertPageBreak()`, `insertHorizontalRule()` | Insert a page break or a horizontal line. |
| `insertSectionBreak(orientation: 'portrait' \| 'landscape')` | **New in 0.6.0.** Inserts a section break; the pages after it are turned to `orientation`. See [Word files and long documents](/docs/word-files#pages-in-different-orientations). |
| `insertFootnote(text: string)` | Inserts a footnote reference with its note at the selection; returns the reference element, or `null` when nothing could be inserted. |
| `setFootnoteText(element, text: string)` | Changes the note of a footnote (up to 2000 characters). |
| `removeFootnote(element)` | Removes a footnote reference together with its note. |
| `getFootnotes()` | Footnote references with their texts, `{ element, text }[]`, in document order. |
| `setTrackChanges(enabled: boolean, author?: string)` | Starts or stops recording edits as tracked changes. `DocumentEditor` calls it from `v-model:trackChanges` and `author`, so use the binding there. |
| `tracksChanges` | Whether edits are being tracked (read-only property). |
| `getChanges()` | Tracked changes in document order, `TrackedChange[]`. |
| `resolveChanges(accept: boolean, id?: string)` | Accepts (`true`) or rejects the change with the id, or every change without one. |
| `selectChange(id: string)` | Selects the text of a tracked change and scrolls to it. |
| `undo()`, `redo()` | Undo and redo. |
| `focus(position?: 'start' \| 'end')` | Focuses the document. |
| `getHTML()` | Clean HTML of the document. |
| `setContent(html: string, options?: { keepSelection?: boolean })` | Replaces the document and clears the undo history. **New in 0.6.0:** with `keepSelection` the caret stays at the same character position while the editor has focus; `v-model` uses it. |
| `getSelectionOffsets()` | **New in 0.6.0.** The selection as `SelectionOffsets`, or `null`. |
| `getOffsetRects(offsets: SelectionOffsets)` | **New in 0.6.0.** Viewport rectangles (`DOMRect[]`) of the text between two positions; a caret gives one rectangle with no width. |

Each command is one undo step and updates `v-model` like typing does.

### EditorUiState

A flat snapshot of the formatting at the selection, as the toolbar shows it. Among its fields: `bold`, `italic`, `underline`, `headingLevel`, `fontFamily`, `fontSize`, `align`, `bulletList`, `orderedList`, `legalNumbering`, `link`, `canUndo`, `canRedo`, `tableOfContents` (the document has one), `textSelected` (non-empty text is selected) and `comment` (id of the comment at the caret, or `''`).

### TemplateVariable

```ts
interface TemplateVariable {
  /** Name used in the saved HTML and in `{{name}}`: letters, digits, `_`, `.` and `-`. */
  name: string;
  /** Text the chip shows in the editor and the variable menu lists. */
  label: string;
}
```

### TemplateValues

```ts
type TemplateValues = Readonly<Record<string, string | number | null | undefined>>;
```

### FillTemplateOptions

```ts
interface FillTemplateOptions {
  /** A variable without a value: kept (default), removed, or written as `{{name}}` text. */
  missing?: 'keep' | 'empty' | 'name';
}
```

### DocumentTemplate, DocumentTemplateId

```ts
type DocumentTemplateId = 'letter' | 'order' | 'application' | 'certificate' | 'act';

interface DocumentTemplate {
  id: DocumentTemplateId;
  /** Document HTML with template variables. */
  html: string;
  /** Variables the template uses, with labels in the requested language. */
  variables: TemplateVariable[];
}
```

### NumberWordsLocale, TransliterationDirection

```ts
type NumberWordsLocale = 'uz' | 'uz-Cyrl' | 'ru' | 'en';
type TransliterationDirection = 'toCyrillic' | 'toLatin';
```

### EditorLocale

```ts
interface EditorLocale {
  /** Language code. */
  readonly code: EditorLocaleCode;
  /** Name of the language in that language, for language pickers. */
  readonly name: string;
}
```

### EditorLocaleCode

```ts
type EditorLocaleCode = 'uz' | 'uz-Cyrl' | 'en' | 'ru';
```

### EditorLocaleInput

```ts
/** A locale object, or just its code. */
type EditorLocaleInput = EditorLocale | EditorLocaleCode;
```
