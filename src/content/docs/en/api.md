# API

A complete reference of everything nuvra exports: components, functions, constants and types.

## Exports

```ts
import {
  DocumentEditor,
  Editor,
  createPageSettings,
  editorMessages,
  setEditorTranslator,
  type DocumentImageUploadHandler,
  type DocumentViewMode,
  type EditorLabelKey,
  type EditorTranslator,
  type PageMargins,
  type PageOrientation,
  type PageSettings,
  type PageSizeKey
} from 'nuvra';
import 'nuvra/style.css';
```

## DocumentEditor

The full Word-style editor with toolbar, page or web view, status bar, find and replace, printing and export.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `autofocus` | `boolean` | `false` | Places the caret at the end of the document as soon as the editor is ready. |
| `canvasPadding` | `number \| string` | `50` | Gray space around the page or web sheet. |
| `defaultViewMode` | `DocumentViewMode` | `'page'` | View shown first; the user can switch it in the status bar. |
| `disabled` | `boolean` | `false` | Makes the document read-only and disables every editing control. |
| `height` | `number \| string` | `760` | Height of the whole editor, or `'auto'` to grow with the content between `minHeight` and `maxHeight`. |
| `maxHeight` | `number \| string` | `600` | Largest height of an auto-height editor; longer documents scroll inside it. |
| `maxImageSizeMb` | `number` | `10` | Largest accepted image file, in megabytes. |
| `maxLength` | `number` | `0` | Largest number of characters; `0` means unlimited. |
| `minHeight` | `number \| string` | `240` | Smallest height of an auto-height editor. |
| `placeholder` | `string` | `''` | Text shown while the document is empty; falls back to the `editor.placeholder` label. |
| `title` | `string` | `''` | Print title and exported file name; falls back to the `editor.document` label. |
| `uploadImage` | `DocumentImageUploadHandler` | — | Uploads an inserted image and resolves with its URL; without it images are embedded as data URLs. |

Numbers are pixels; strings are used as CSS lengths. Other attributes, such as `class` and `style`, are applied to the editor root.

### v-model

| Binding | Type | Default | Description |
| --- | --- | --- | --- |
| `v-model` | `string` | `''` | Document HTML. An empty document is `''`; typing updates the value after a short pause. |
| `v-model:page` | `PageSettings` | `createPageSettings()` | Paper size, orientation and margins used by the page view, printing and export. |

### Events

| Event | Payload | Description |
| --- | --- | --- |
| `focus` | — | The editing surface received focus. |
| `blur` | — | The editing surface lost focus; pending model updates have already been written. |
| `uploadError` | `error: unknown` | An image was rejected by validation or its upload failed. |

### Exposed members

Available through a template ref.

| Member | Type | Description |
| --- | --- | --- |
| `focus` | `() => void` | Moves keyboard focus into the document. |
| `getHTML` | `() => string` | Writes pending edits into the model and returns the document HTML. |
| `print` | `() => Promise<void>` | Opens the browser print dialog. |
| `exportHtml` | `() => Promise<void>` | Downloads the document as an HTML page. |
| `exportWord` | `() => Promise<void>` | Downloads the document as a Word-compatible `.doc` file. |
| `engine` | internal engine or `null` | The editing engine, for advanced integrations; `null` until the editor is mounted. Its type is not exported. |

## Editor

A rich text field for forms: `DocumentEditor` in the web view with `height: 'auto'`, growing with its content between `minHeight` and `maxHeight`.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `autofocus` | `boolean` | `false` | Places the caret at the end of the content once the editor is ready. |
| `canvasPadding` | `number \| string` | `50` | Gray space around the sheet. |
| `disabled` | `boolean` | `false` | Makes the content read-only and disables the toolbar. |
| `maxHeight` | `number \| string` | `600` | Height at which the field stops growing and starts scrolling. |
| `maxImageSizeMb` | `number` | `10` | Largest accepted image file, in megabytes. |
| `maxLength` | `number` | `0` | Character limit; `0` means unlimited. |
| `minHeight` | `number \| string` | `240` | Smallest height of the field, including the gray space around the sheet. |
| `placeholder` | `string` | `''` | Text shown while the field is empty. |
| `uploadImage` | `DocumentImageUploadHandler` | — | Uploads an image and resolves with its URL; without it images are embedded as data URLs. |

### v-model and events

| Name | Type | Description |
| --- | --- | --- |
| `v-model` | `string` | Field value as sanitized HTML; an empty field is `''`. |
| `focus` | event | The editable area received focus. |
| `blur` | event | The editable area lost focus. |
| `uploadError` | event, `error: unknown` | An image was rejected or could not be uploaded. |

`Editor` has no `v-model:page`, `defaultViewMode`, `height` or `title`, and exposes no methods.

## Functions

### createPageSettings

```ts
function createPageSettings(): PageSettings;
```

Returns new default page settings: A4, portrait, margins of 25.4 mm on every side. Each call returns a new object.

### setEditorTranslator

```ts
function setEditorTranslator(next?: EditorTranslator): void;
```

Registers the translator used for every editor label on the page. The translator returns a string for a translated label or `undefined` to keep the built-in Uzbek text. Calling it without arguments restores the built-in texts. See [Translations](/docs/translations).

## Constants

### editorMessages

```ts
const editorMessages: Readonly<Record<EditorLabelKey, string>>;
```

Every label key with its built-in Uzbek text. `{name}` marks a placeholder that is filled in at translation time.

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

### EditorTranslator

```ts
/** Translates an editor label; returning `undefined` keeps the built-in text. */
type EditorTranslator = (key: EditorLabelKey, named?: Record<string, unknown>) => string | undefined;
```

### EditorLabelKey

```ts
/** Union of every label key, such as 'editor.bold' or 'editor.table.insert'. */
type EditorLabelKey = keyof typeof editorMessages;
```

The full list of keys is on the [Translations](/docs/translations#all-label-keys) page.
