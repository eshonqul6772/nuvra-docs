# Changelog

Notable changes of each nuvra version, newest first.

## 0.5.0 (unreleased)

### Word files and long documents

- The Word export writes a real `.docx` file (Office Open XML) instead of the HTML-based `.doc` file: page setup, headers and footers with page fields, the watermark, lists, tables with merged cells and images. See [Word files and long documents](/docs/word-files).
- "Open Word file (.docx)" in the "More" menu, `importWord(file)` on a template ref and the `importError` event load a Word file into the editor.
- `buildDocx` and `readDocx` write and read Word files in your own code.
- Multilevel numbering (1., 1.1., 1.1.1.) from the arrow next to the numbered list button, saved as `<ol data-numbering="legal">`; `engine.setListNumbering()`.
- Page numbering options in the header and footer popover: `differentFirstPage` and `firstPageNumber` in `PageSettings`.
- A table of contents from the insert menu and the `/` menu, refreshed in place; `updateTableOfContents()` on a template ref, `buildTableOfContents` and `readOutline`.
- A navigation pane with the headings of the document and their page numbers, in the "More" menu.
- Footnotes from the insert menu and the `/` menu, saved as `<sup data-footnote>`, drawn at the bottom of their sheet, printed and written to Word as Word footnotes; `engine.insertFootnote()`, `setFootnoteText()`, `removeFootnote()` and `getFootnotes()`.

### Review

- Tracked changes: `v-model:trackChanges`, the "Track changes" and "Changes" toolbar buttons with accepting and rejecting, saved as `<ins data-change>` and `<del data-change>`, and a round trip with Word revisions; `engine.getChanges()`, `resolveChanges()`, `selectChange()` and the `TrackedChange` type.
- The `author` prop: the name written on new comments, replies and tracked changes.
- Comments: `v-model:comments`, the "Add comment" (`Ctrl+Alt+M`) and "Comments" toolbar buttons with replies, resolving and deleting; `createCommentId` and the `DocumentComment` and `DocumentCommentReply` types. See [Comments and comparison](/docs/review).
- `DocumentCompare` and `compareDocuments` show what changed between two versions of a document.

### Templates

- Template variables: the `variables` prop on `DocumentEditor` and `Editor`, the **{ }** menu, `{{name}}` typing, `insertVariable`, `fillTemplate` and `getTemplateVariables`. See [Templates and signatures](/docs/templates).
- `DocumentForm` fills a template in like a form, with `validate()` and `getHTML()`.
- Signature blocks: a signature line, “Approved” and “Agreed” blocks and the signatures of the parties.
- Document templates: an official letter, an order, an application, a certificate of employment and an act; `getDocumentTemplate`.
- Amounts in words, today's date in the short and the long form; `numberToWords`, `formatAmountInWords`, `parseAmount`, `formatShortDate` and `formatLongDate`.
- Conversion of Uzbek text between the Latin and the Cyrillic alphabet; `transliterate`.

### Editor

- The `/` command menu, and the `slashCommands` prop for your own commands.
- The `toolbar` slot for your own toolbar buttons.
- The `DocumentEngine`, `EditorUiState`, `SlashCommand`, `IconName` and `TrackedChange` types are exported.
- The Uzbek Cyrillic interface: `uzCyrl`, code `'uz-Cyrl'`.

### Upgrading from 0.4

There are no breaking API changes. `exportWord()` and the Word menu entry now download a `.docx` file; if your server or your users expected `.doc`, update the accepted file types. The menu label changed from "Download as Word (.doc)" to "Download as Word (.docx)".

## 0.4.1

- Toolbar panels stay attached to their buttons while the page scrolls.

## 0.4.0

- The interface ships in Uzbek, English and Russian, chosen with the `locale` prop or `setEditorLocale`.
- The ruler stays right under the toolbar while the document scrolls.

### Upgrading from 0.3

`setEditorTranslator`, `editorMessages` and the `EditorTranslator` and `EditorLabelKey` types were removed. The translations are now part of the package and cannot be changed from outside; an app only picks the language.

Before:

```ts
import { setEditorTranslator } from 'nuvra';
import { i18n } from './i18n';

setEditorTranslator((key, named) => (i18n.global.te(key) ? i18n.global.t(key, named ?? {}) : undefined));
```

After:

```ts
import { en, setEditorLocale } from 'nuvra';

setEditorLocale(en);
```

To follow the language of your app, call `setEditorLocale` again when it changes, or pass the `locale` prop to a single editor. Remove the `editor.*` keys from your own translation files. See [Languages](/docs/translations).

## 0.3.0

- Toolbar: format painter, letter case, an editable font size field, paragraph spacing, formatting marks and a context menu; `Ctrl` with the mouse wheel zooms.
- Headers and footers with page, page count, date and title tokens; a ruler for the margins and paragraph indents; a watermark.
- Printing and export lay the document out in the same sheets as the editor.

## 0.2.1

- `Ctrl+Shift+H` applies the highlight again instead of also opening replace.
- Theme variables have zero specificity, so any `.document-editor` rule overrides them.

## 0.2.0

- Element Plus and Lucide were dropped: native controls, inline SVG icons and `--nuvra-*` CSS variables. Vue is the only peer dependency.
