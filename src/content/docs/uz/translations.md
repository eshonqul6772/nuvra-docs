# Tarjimalar

Muharrirning o‘rnatilgan yorliqlari o‘zbek tilida. Asboblar paneli, menyular, holat paneli va xabarlarni boshqa tilda ko‘rsatish uchun tarjimon funksiyasini ro‘yxatdan o‘tkazing.

## Qanday ishlaydi

Har bir yorliqning kaliti bor, masalan `editor.bold`. Yorliqni ko‘rsatishdan oldin muharrir `setEditorTranslator` bilan ro‘yxatdan o‘tkazilgan tarjimondan so‘raydi:

```ts
type EditorTranslator = (key: EditorLabelKey, named?: Record<string, unknown>) => string | undefined;

function setEditorTranslator(next?: EditorTranslator): void;
```

- Satr qaytarsangiz, u yorliq sifatida ishlatiladi.
- `undefined` qaytarsangiz, shu kalit uchun o‘rnatilgan o‘zbekcha matn qoladi, shuning uchun qisman tarjima ham bemalol ishlaydi.
- O‘rnatilgan matnlarga qaytish uchun `setEditorTranslator()` ni argumentsiz chaqiring.

Tarjimon global: u sahifadagi barcha muharrirlarga ta’sir qiladi. Uni ilova ishga tushishidan oldin bir marta ro‘yxatdan o‘tkazing.

## O‘rin to‘ldiruvchilar

Ba’zi yorliqlarda `{level}`, `{size}`, `{count}`, `{current}` va `{total}` kabi o‘rin to‘ldiruvchilar bor. Ularning qiymatlari tarjimonga `named` orqali beriladi, masalan `editor.heading` uchun `{ level: 2 }`. Kalit o‘rnatilgan matnga qaytsa, o‘rin to‘ldiruvchilarni muharrirning o‘zi to‘ldiradi.

## Oddiy lug‘at

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

## vue-i18n bilan

Yorliqlar `vue-i18n` dan olinsa, faqat u biladigan kalitlar uchun tarjima qaytaring. Shunda yorliqlar faol tilga mos ravishda o‘zgaradi:

```ts
import { setEditorTranslator } from 'nuvra';

import { i18n } from './i18n';

setEditorTranslator((key, named) => (i18n.global.te(key) ? i18n.global.t(key, named ?? {}) : undefined));
```

## O‘rnatilgan matnlar

`editorMessages` barcha kalitlarni o‘rnatilgan o‘zbekcha matni bilan saqlaydi, `EditorLabelKey` esa barcha kalitlarning birlashmasi (union). Ulardan lug‘atlaringizni tiplash yoki tarjima faylini yaratish uchun foydalaning:

```ts
import { type EditorLabelKey, editorMessages } from 'nuvra';

const keys = Object.keys(editorMessages) as EditorLabelKey[];
```

## Barcha yorliq kalitlari

| Kalit | O‘rnatilgan matn (o‘zbekcha) |
| --- | --- |
| `editor.align` | Tekislash |
| `editor.align.center` | Markazga |
| `editor.align.justify` | Ikki tomonga |
| `editor.align.left` | Chapga |
| `editor.align.right` | O‘ngga |
| `editor.apply` | Qo‘llash |
| `editor.bold` | Qalin |
| `editor.bulletList` | Belgili ro‘yxat |
| `editor.clearFormatting` | Formatni tozalash |
| `editor.close` | Yopish |
| `editor.codeBlock` | Kod bloki |
| `editor.colors.automatic` | Avtomatik |
| `editor.colors.custom` | Boshqa rang… |
| `editor.colors.none` | Rangsiz |
| `editor.defaultFont` | Standart shrift |
| `editor.defaultLineHeight` | Standart |
| `editor.defaultSize` | Standart o‘lcham |
| `editor.delete` | O‘chirish |
| `editor.direction.auto` | Avtomatik yo‘nalish |
| `editor.direction.ltr` | Chapdan o‘ngga |
| `editor.direction.rtl` | O‘ngdan chapga |
| `editor.document` | Hujjat |
| `editor.editLink` | Havolani tahrirlash |
| `editor.enterFullscreen` | To‘liq ekran |
| `editor.exitFullscreen` | To‘liq ekrandan chiqish |
| `editor.exportHtml` | HTML sifatida yuklab olish |
| `editor.exportWord` | Word (.doc) sifatida yuklab olish |
| `editor.fitWidth` | Kenglikka moslash |
| `editor.fontFamily` | Shrift |
| `editor.fontSize` | Shrift o‘lchami |
| `editor.heading` | `Sarlavha {level}` |
| `editor.highlight` | Belgilash rangi |
| `editor.horizontalRule` | Gorizontal chiziq |
| `editor.image` | Rasm |
| `editor.imageAlt` | Muqobil matn (alt) |
| `editor.imageReadError` | Rasmni o‘qib bo‘lmadi |
| `editor.imageSizeError` | `Rasm hajmi {size} MB dan oshmasligi kerak` |
| `editor.imageTypeError` | Faqat rasm fayllarini qo‘shish mumkin |
| `editor.imageUploadError` | Rasmni yuklab bo‘lmadi |
| `editor.indent` | Chekinishni oshirish |
| `editor.inlineCode` | Kod |
| `editor.insert` | Qo‘shish |
| `editor.insertDate` | Bugungi sana |
| `editor.insertMore` | Boshqa elementlar |
| `editor.italic` | Kursiv |
| `editor.lineHeight` | Qator oralig‘i |
| `editor.link` | Havola |
| `editor.linkNewTab` | Yangi oynada ochish |
| `editor.linkText` | Matn |
| `editor.linkUrl` | Manzil (URL) |
| `editor.more` | Yana |
| `editor.moreFormatting` | Boshqa formatlar |
| `editor.or` | yoki havola orqali |
| `editor.orderedList` | Raqamli ro‘yxat |
| `editor.outdent` | Chekinishni kamaytirish |
| `editor.page.customMargins` | Aniq qiymatlar (mm) |
| `editor.page.landscape` | Albom |
| `editor.page.marginBottom` | Pastki |
| `editor.page.marginLeft` | Chap |
| `editor.page.marginRight` | O‘ng |
| `editor.page.marginTop` | Yuqori |
| `editor.page.margins` | Hoshiyalar |
| `editor.page.margins.moderate` | O‘rtacha |
| `editor.page.margins.narrow` | Tor |
| `editor.page.margins.normal` | Oddiy |
| `editor.page.margins.official` | Rasmiy hujjat |
| `editor.page.margins.wide` | Keng |
| `editor.page.orientation` | Yo‘nalish |
| `editor.page.portrait` | Kitob |
| `editor.page.setup` | Sahifa sozlamalari |
| `editor.page.size` | Qog‘oz o‘lchami |
| `editor.pageBreak` | Sahifa uzilishi |
| `editor.paragraph` | Oddiy matn |
| `editor.placeholder` | Hujjat matnini kiriting… |
| `editor.print` | Chop etish / PDF |
| `editor.quote` | Iqtibos |
| `editor.redo` | Qaytarish |
| `editor.replace.all` | Barchasini |
| `editor.replace.one` | Almashtirish |
| `editor.replace.placeholder` | Almashtirish |
| `editor.replace.toggle` | Almashtirishni ko‘rsatish |
| `editor.search.caseSensitive` | Katta-kichik harfni farqlash |
| `editor.search.next` | Keyingisi |
| `editor.search.placeholder` | Qidirish |
| `editor.search.previous` | Oldingisi |
| `editor.search.title` | Qidirish va almashtirish |
| `editor.search.wholeWord` | Butun so‘z |
| `editor.source` | HTML kod |
| `editor.specialCharacters` | Maxsus belgilar |
| `editor.status.characters` | `{count} belgi` |
| `editor.status.page` | `Sahifa {current} / {total}` |
| `editor.status.words` | `{count} so‘z` |
| `editor.strike` | Ustidan chizilgan |
| `editor.subscript` | Pastki indeks |
| `editor.superscript` | Yuqori indeks |
| `editor.table.addColumnAfter` | O‘ngga ustun qo‘shish |
| `editor.table.addColumnBefore` | Chapga ustun qo‘shish |
| `editor.table.addRowAfter` | Pastga qator qo‘shish |
| `editor.table.addRowBefore` | Yuqoriga qator qo‘shish |
| `editor.table.delete` | Jadvalni o‘chirish |
| `editor.table.deleteColumn` | Ustunni o‘chirish |
| `editor.table.deleteRow` | Qatorni o‘chirish |
| `editor.table.headerRow` | Sarlavha qatori |
| `editor.table.insert` | Jadval qo‘shish |
| `editor.table.mergeCells` | Kataklarni birlashtirish |
| `editor.table.pickSize` | O‘lchamni tanlang |
| `editor.table.splitCell` | Katakni ajratish |
| `editor.table.title` | Jadval |
| `editor.taskList` | Vazifalar ro‘yxati |
| `editor.textColor` | Matn rangi |
| `editor.textDirection` | Matn yo‘nalishi |
| `editor.textStyle` | Matn uslubi |
| `editor.toolbar` | Muharrir asboblari |
| `editor.underline` | Tagiga chizilgan |
| `editor.undo` | Bekor qilish |
| `editor.unlink` | Havolani olib tashlash |
| `editor.uploadImage` | Kompyuterdan yuklash |
| `editor.uploading` | Rasm yuklanmoqda… |
| `editor.view.page` | Sahifa ko‘rinishi |
| `editor.view.web` | Veb ko‘rinish |
| `editor.zoom` | Masshtab |
| `editor.zoomIn` | Kattalashtirish |
| `editor.zoomOut` | Kichraytirish |
| `editor.zoomReset` | 100% ga qaytarish |
