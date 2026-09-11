# Translations

The editor's built-in labels are in Uzbek. Register a translator to show the toolbar, menus, status bar and messages in any other language.

## How it works

Every label has a key, such as `editor.bold`. Before showing a label, the editor asks the translator registered with `setEditorTranslator`:

```ts
type EditorTranslator = (key: EditorLabelKey, named?: Record<string, unknown>) => string | undefined;

function setEditorTranslator(next?: EditorTranslator): void;
```

- Return a string to use it as the label.
- Return `undefined` to keep the built-in Uzbek text for that key, so a partial translation is fine.
- Call `setEditorTranslator()` without arguments to go back to the built-in texts.

The translator is global and applies to every editor on the page. Register it once, before the app mounts.

## Placeholders

Some labels contain placeholders such as `{level}`, `{size}`, `{count}`, `{current}` and `{total}`. Their values are passed to the translator in `named`, for example `{ level: 2 }` for `editor.heading`. When a key falls back to the built-in text, the editor fills the placeholders itself.

## A plain dictionary

```ts
import { type EditorLabelKey, setEditorTranslator } from 'nuvra';

const en: Partial<Record<EditorLabelKey, string>> = {
  'editor.bold': 'Bold',
  'editor.heading': 'Heading {level}',
  'editor.status.words': '{count} words'
};

setEditorTranslator((key, named) =>
  en[key]?.replace(/\{(\w+)\}/g, (_, name: string) => String(named?.[name] ?? ''))
);
```

## With vue-i18n

When the labels come from `vue-i18n`, return a translation only for keys it knows. Labels then follow the active locale:

```ts
import { setEditorTranslator } from 'nuvra';

import { i18n } from './i18n';

setEditorTranslator((key, named) => (i18n.global.te(key) ? i18n.global.t(key, named ?? {}) : undefined));
```

## Built-in texts

`editorMessages` contains every key with its built-in Uzbek text, and `EditorLabelKey` is the union of all keys. Use them to type your dictionaries or to generate a translation file:

```ts
import { type EditorLabelKey, editorMessages } from 'nuvra';

const keys = Object.keys(editorMessages) as EditorLabelKey[];
```

## All label keys

| Key | Built-in (Uzbek) | English |
| --- | --- | --- |
| `editor.align` | Tekislash | Align |
| `editor.align.center` | Markazga | Center |
| `editor.align.justify` | Ikki tomonga | Justify |
| `editor.align.left` | Chapga | Left |
| `editor.align.right` | O‘ngga | Right |
| `editor.apply` | Qo‘llash | Apply |
| `editor.bold` | Qalin | Bold |
| `editor.bulletList` | Belgili ro‘yxat | Bulleted list |
| `editor.clearFormatting` | Formatni tozalash | Clear formatting |
| `editor.close` | Yopish | Close |
| `editor.codeBlock` | Kod bloki | Code block |
| `editor.colors.automatic` | Avtomatik | Automatic |
| `editor.colors.custom` | Boshqa rang… | More colors… |
| `editor.colors.none` | Rangsiz | No color |
| `editor.defaultFont` | Standart shrift | Default font |
| `editor.defaultLineHeight` | Standart | Default |
| `editor.defaultSize` | Standart o‘lcham | Default size |
| `editor.delete` | O‘chirish | Delete |
| `editor.direction.auto` | Avtomatik yo‘nalish | Automatic direction |
| `editor.direction.ltr` | Chapdan o‘ngga | Left to right |
| `editor.direction.rtl` | O‘ngdan chapga | Right to left |
| `editor.document` | Hujjat | Document |
| `editor.editLink` | Havolani tahrirlash | Edit link |
| `editor.enterFullscreen` | To‘liq ekran | Full screen |
| `editor.exitFullscreen` | To‘liq ekrandan chiqish | Exit full screen |
| `editor.exportHtml` | HTML sifatida yuklab olish | Download as HTML |
| `editor.exportWord` | Word (.doc) sifatida yuklab olish | Download as Word (.doc) |
| `editor.fitWidth` | Kenglikka moslash | Fit to width |
| `editor.fontFamily` | Shrift | Font |
| `editor.fontSize` | Shrift o‘lchami | Font size |
| `editor.heading` | `Sarlavha {level}` | `Heading {level}` |
| `editor.highlight` | Belgilash rangi | Highlight color |
| `editor.horizontalRule` | Gorizontal chiziq | Horizontal line |
| `editor.image` | Rasm | Image |
| `editor.imageAlt` | Muqobil matn (alt) | Alternative text (alt) |
| `editor.imageReadError` | Rasmni o‘qib bo‘lmadi | Could not read the image |
| `editor.imageSizeError` | `Rasm hajmi {size} MB dan oshmasligi kerak` | `The image must not be larger than {size} MB` |
| `editor.imageTypeError` | Faqat rasm fayllarini qo‘shish mumkin | Only image files can be added |
| `editor.imageUploadError` | Rasmni yuklab bo‘lmadi | Could not upload the image |
| `editor.indent` | Chekinishni oshirish | Increase indent |
| `editor.inlineCode` | Kod | Code |
| `editor.insert` | Qo‘shish | Insert |
| `editor.insertDate` | Bugungi sana | Today’s date |
| `editor.insertMore` | Boshqa elementlar | More elements |
| `editor.italic` | Kursiv | Italic |
| `editor.lineHeight` | Qator oralig‘i | Line spacing |
| `editor.link` | Havola | Link |
| `editor.linkNewTab` | Yangi oynada ochish | Open in a new tab |
| `editor.linkText` | Matn | Text |
| `editor.linkUrl` | Manzil (URL) | Address (URL) |
| `editor.more` | Yana | More |
| `editor.moreFormatting` | Boshqa formatlar | More formatting |
| `editor.or` | yoki havola orqali | or from a link |
| `editor.orderedList` | Raqamli ro‘yxat | Numbered list |
| `editor.outdent` | Chekinishni kamaytirish | Decrease indent |
| `editor.page.customMargins` | Aniq qiymatlar (mm) | Exact values (mm) |
| `editor.page.landscape` | Albom | Landscape |
| `editor.page.marginBottom` | Pastki | Bottom |
| `editor.page.marginLeft` | Chap | Left |
| `editor.page.marginRight` | O‘ng | Right |
| `editor.page.marginTop` | Yuqori | Top |
| `editor.page.margins` | Hoshiyalar | Margins |
| `editor.page.margins.moderate` | O‘rtacha | Moderate |
| `editor.page.margins.narrow` | Tor | Narrow |
| `editor.page.margins.normal` | Oddiy | Normal |
| `editor.page.margins.official` | Rasmiy hujjat | Official document |
| `editor.page.margins.wide` | Keng | Wide |
| `editor.page.orientation` | Yo‘nalish | Orientation |
| `editor.page.portrait` | Kitob | Portrait |
| `editor.page.setup` | Sahifa sozlamalari | Page setup |
| `editor.page.size` | Qog‘oz o‘lchami | Paper size |
| `editor.pageBreak` | Sahifa uzilishi | Page break |
| `editor.paragraph` | Oddiy matn | Normal text |
| `editor.placeholder` | Hujjat matnini kiriting… | Type the document text… |
| `editor.print` | Chop etish / PDF | Print / PDF |
| `editor.quote` | Iqtibos | Quote |
| `editor.redo` | Qaytarish | Redo |
| `editor.replace.all` | Barchasini | Replace all |
| `editor.replace.one` | Almashtirish | Replace |
| `editor.replace.placeholder` | Almashtirish | Replace with |
| `editor.replace.toggle` | Almashtirishni ko‘rsatish | Show replace |
| `editor.search.caseSensitive` | Katta-kichik harfni farqlash | Match case |
| `editor.search.next` | Keyingisi | Next |
| `editor.search.placeholder` | Qidirish | Find |
| `editor.search.previous` | Oldingisi | Previous |
| `editor.search.title` | Qidirish va almashtirish | Find and replace |
| `editor.search.wholeWord` | Butun so‘z | Whole word |
| `editor.source` | HTML kod | HTML source |
| `editor.specialCharacters` | Maxsus belgilar | Special characters |
| `editor.status.characters` | `{count} belgi` | `{count} characters` |
| `editor.status.page` | `Sahifa {current} / {total}` | `Page {current} of {total}` |
| `editor.status.words` | `{count} so‘z` | `{count} words` |
| `editor.strike` | Ustidan chizilgan | Strikethrough |
| `editor.subscript` | Pastki indeks | Subscript |
| `editor.superscript` | Yuqori indeks | Superscript |
| `editor.table.addColumnAfter` | O‘ngga ustun qo‘shish | Insert column right |
| `editor.table.addColumnBefore` | Chapga ustun qo‘shish | Insert column left |
| `editor.table.addRowAfter` | Pastga qator qo‘shish | Insert row below |
| `editor.table.addRowBefore` | Yuqoriga qator qo‘shish | Insert row above |
| `editor.table.delete` | Jadvalni o‘chirish | Delete table |
| `editor.table.deleteColumn` | Ustunni o‘chirish | Delete column |
| `editor.table.deleteRow` | Qatorni o‘chirish | Delete row |
| `editor.table.headerRow` | Sarlavha qatori | Header row |
| `editor.table.insert` | Jadval qo‘shish | Insert table |
| `editor.table.mergeCells` | Kataklarni birlashtirish | Merge cells |
| `editor.table.pickSize` | O‘lchamni tanlang | Choose a size |
| `editor.table.splitCell` | Katakni ajratish | Split cell |
| `editor.table.title` | Jadval | Table |
| `editor.taskList` | Vazifalar ro‘yxati | Checklist |
| `editor.textColor` | Matn rangi | Text color |
| `editor.textDirection` | Matn yo‘nalishi | Text direction |
| `editor.textStyle` | Matn uslubi | Text style |
| `editor.toolbar` | Muharrir asboblari | Editor toolbar |
| `editor.underline` | Tagiga chizilgan | Underline |
| `editor.undo` | Bekor qilish | Undo |
| `editor.unlink` | Havolani olib tashlash | Remove link |
| `editor.uploadImage` | Kompyuterdan yuklash | Upload from computer |
| `editor.uploading` | Rasm yuklanmoqda… | Uploading image… |
| `editor.view.page` | Sahifa ko‘rinishi | Page view |
| `editor.view.web` | Veb ko‘rinish | Web view |
| `editor.zoom` | Masshtab | Zoom |
| `editor.zoomIn` | Kattalashtirish | Zoom in |
| `editor.zoomOut` | Kichraytirish | Zoom out |
| `editor.zoomReset` | 100% ga qaytarish | Reset to 100% |
