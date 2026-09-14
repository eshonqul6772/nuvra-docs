# API

nuvra eksport qiladigan hamma narsaning to‘liq ma’lumotnomasi: komponentlar, funksiyalar, konstantalar va tiplar.

**0.6.0 versiyada yangi** deb belgilangan bandlar 0.6.0 versiyada qo‘shilgan; batafsil: [O‘zgarishlar tarixi](/docs/changelog).

## Eksportlar

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

Asboblar paneli, sahifa yoki veb ko‘rinishi, holat paneli, qidirish va almashtirish, izohlar, o‘zgarishlarni kuzatish, snoskalar, chop etish, import va eksportga ega to‘liq Word uslubidagi muharrir.

### Props

| Prop | Tip | Standart | Tavsif |
| --- | --- | --- | --- |
| `author` | `string` | `''` | Yangi izohlar, javoblar va kuzatilgan o‘zgarishlarga muallif sifatida yoziladigan ism; batafsil: [Izohlar va solishtirish](/docs/review). |
| `autofocus` | `boolean` | `false` | Muharrir tayyor bo‘lishi bilan kursorni hujjat oxiriga qo‘yadi. |
| `canvasPadding` | `number \| string` | `50` | Sahifa yoki veb varaq atrofidagi kulrang bo‘shliq. |
| `collaborators` | `Collaborator[]` | `[]` | **0.6.0 versiyada yangi.** Hujjatni tahrirlayotgan boshqa odamlar; ularning kursorlari va belgilashlari hujjat ustida chiziladi. Batafsil: [Birgalikda tahrirlash](/docs/collaboration). |
| `defaultViewMode` | `DocumentViewMode` | `'page'` | Birinchi ko‘rsatiladigan ko‘rinish; foydalanuvchi uni holat panelida almashtira oladi. |
| `disabled` | `boolean` | `false` | Hujjatni faqat o‘qiladigan qiladi va barcha tahrirlash tugmalarini o‘chiradi. |
| `height` | `number \| string` | `760` | Butun muharrir balandligi yoki `minHeight` va `maxHeight` oralig‘ida o‘sishi uchun `'auto'`. |
| `locale` | `EditorLocaleInput` | — | Interfeys tili: `uz`, `uzCyrl`, `en`, `ru` yoki ularning kodi; berilmasa ilova bo‘yicha til olinadi. |
| `maxHeight` | `number \| string` | `600` | O‘suvchi muharrirning eng katta balandligi; uzun hujjatlar ichida aylantiriladi. |
| `maxImageSizeMb` | `number` | `10` | Qabul qilinadigan rasm faylining eng katta hajmi, megabaytda. |
| `maxLength` | `number` | `0` | Belgilarning eng ko‘p soni; `0` — cheklovsiz. |
| `minHeight` | `number \| string` | `240` | O‘suvchi muharrirning eng kichik balandligi. |
| `placeholder` | `string` | `''` | Hujjat bo‘sh bo‘lganda ko‘rinadigan matn; berilmasa `editor.placeholder` yorlig‘i olinadi. |
| `ruler` | `boolean` | `true` | Sahifa ko‘rinishida varaq ustidagi chizg‘ichni ko‘rsatadi; foydalanuvchi uni “Yana” menyusidan ham yoqib-o‘chiradi. |
| `slashCommands` | `SlashCommand[]` | `[]` | Ilovangiz buyruqlari, `/` menyusining boshida chiqadi; batafsil: [Foydalanish](/docs/usage). |
| `title` | `string` | `''` | Chop etish sarlavhasi va eksport fayli nomi; berilmasa `editor.document` yorlig‘i olinadi. |
| `uploadImage` | `DocumentImageUploadHandler` | — | Qo‘shilgan rasmni yuklaydi va manzilini qaytaradi; berilmasa rasmlar data URL sifatida joylanadi. |
| `variables` | `TemplateVariable[]` | `[]` | Foydalanuvchi qo‘sha oladigan shablon o‘zgaruvchilari; batafsil: [Shablonlar va imzolar](/docs/templates). |

Sonlar piksel hisoblanadi; satrlar CSS uzunligi sifatida ishlatiladi. Boshqa atributlar, masalan `class` va `style`, muharrirning ildiz elementiga qo‘llanadi.

### v-model

| Bog‘lash | Tip | Standart | Tavsif |
| --- | --- | --- | --- |
| `v-model` | `string` | `''` | Hujjat HTML’i. Bo‘sh hujjat `''`; yozilganda qiymat qisqa pauzadan keyin yangilanadi. |
| `v-model:page` | `PageSettings` | `createPageSettings()` | Qog‘oz o‘lchami, yo‘nalishi, hoshiyalar, kolontitullar, suv belgisi va sahifa raqamlash. |
| `v-model:comments` | `DocumentComment[]` | — | Hujjatdagi izohlar. Bog‘langanda izoh vositalari yoqiladi; HTML’da faqat ularning langarlari saqlanadi. |
| `v-model:trackChanges` | `boolean` | `false` | Tahrirlar kuzatilgan o‘zgarish sifatida yozilsinmi. Asboblar panelidagi “Taqriz” menyusidagi “O‘zgarishlarni kuzatish” bandi ham uni almashtiradi. |

### Hodisalar

| Hodisa | Ma’lumot | Tavsif |
| --- | --- | --- |
| `focus` | — | Tahrirlash maydoni fokus oldi. |
| `blur` | — | Tahrirlash maydoni fokusni yo‘qotdi; kutilayotgan o‘zgarishlar modelga yozib bo‘lingan. |
| `uploadError` | `error: unknown` | Rasm tekshiruvdan o‘tmadi yoki yuklanmadi. |
| `importError` | `error: unknown` | Word faylini o‘qib bo‘lmadi; hujjat o‘zgarishsiz qoladi. |
| `exportError` | `error: unknown` | **0.6.0 versiyada yangi.** PDF’ni chizib bo‘lmadi, masalan brauzer bunga ruxsat bermadi; fayl yuklanmaydi. |
| `selectionChange` | `selection: SelectionOffsets \| null` | **0.6.0 versiyada yangi.** Kursor yoki belgilash joyi o‘zgardi; kursor hujjatdan chiqsa `null`. Uni tahrirlayotgan boshqa odamlarga yuboring. |

### Slotlar

| Slot | Props | Tavsif |
| --- | --- | --- |
| `toolbar` | `{ engine: DocumentEngine; state: EditorUiState; disabled: boolean }` | Ilovangiz tugmalari, asboblar panelining o‘ng guruhi boshiga joylashadi. Hujjat faqat o‘qish uchun bo‘lsa yoki HTML kod ochiq bo‘lsa, `disabled` — `true`. |

### Taqdim etiladigan a’zolar

Template ref orqali mavjud.

| A’zo | Tip | Tavsif |
| --- | --- | --- |
| `focus` | `() => void` | Klaviatura fokusini hujjatga o‘tkazadi. |
| `getHTML` | `() => string` | Kutilayotgan o‘zgarishlarni modelga yozadi va hujjat HTML’ini qaytaradi. |
| `insertVariable` | `(name: string) => void` | Belgilangan joyga shablon o‘zgaruvchisini qo‘shadi. |
| `updateTableOfContents` | `() => Promise<void>` | Belgilangan joyga mundarija qo‘shadi yoki mavjud mundarijani yangilaydi. |
| `importWord` | `(file: File) => Promise<void>` | Hujjat va sahifa sozlamalarini `.docx` fayl mazmuni bilan bitta bekor qilinadigan qadamda almashtiradi. Xatolar `importError` bilan chiqadi. |
| `print` | `() => Promise<void>` | Brauzerning chop etish oynasini ochadi. |
| `exportHtml` | `() => Promise<void>` | Hujjatni HTML sahifa sifatida yuklab beradi. |
| `exportWord` | `() => Promise<void>` | Hujjatni Word fayli (`.docx`) sifatida yuklab beradi. |
| `exportPdf` | `() => Promise<void>` | **0.6.0 versiyada yangi.** Hujjatni chop etish oynasisiz, sahifalaridan chizilgan PDF sifatida yuklab beradi; PDF matnini belgilab bo‘lmaydi. Xatolar `exportError` bilan chiqadi. Batafsil: [Word fayllari va katta hujjatlar](/docs/word-files#pdf-yuklab-olish). |
| `engine` | `DocumentEngine \| null` | Murakkab integratsiyalar uchun tahrirlash dvigateli; muharrir yuklanmaguncha `null`. |

## Editor

Formalar uchun matn maydoni: veb ko‘rinishdagi va `height: 'auto'` bo‘lgan `DocumentEditor`, matn ko‘paygan sari `minHeight` va `maxHeight` oralig‘ida o‘sadi.

### Props

| Prop | Tip | Standart | Tavsif |
| --- | --- | --- | --- |
| `autofocus` | `boolean` | `false` | Muharrir tayyor bo‘lganda kursorni matn oxiriga qo‘yadi. |
| `canvasPadding` | `number \| string` | `50` | Varaq atrofidagi kulrang bo‘shliq. |
| `disabled` | `boolean` | `false` | Matnni faqat o‘qiladigan qiladi va asboblar panelini o‘chiradi. |
| `locale` | `EditorLocaleInput` | — | Interfeys tili: `uz`, `uzCyrl`, `en`, `ru` yoki ularning kodi; berilmasa ilova bo‘yicha til olinadi. |
| `maxHeight` | `number \| string` | `600` | Maydon o‘sishdan to‘xtab, aylantirila boshlaydigan balandlik. |
| `maxImageSizeMb` | `number` | `10` | Qabul qilinadigan rasm faylining eng katta hajmi, megabaytda. |
| `maxLength` | `number` | `0` | Belgilar chegarasi; `0` — cheklovsiz. |
| `minHeight` | `number \| string` | `240` | Maydonning eng kichik balandligi, varaq atrofidagi bo‘shliq bilan birga. |
| `placeholder` | `string` | `''` | Maydon bo‘sh bo‘lganda ko‘rinadigan matn. |
| `uploadImage` | `DocumentImageUploadHandler` | — | Rasmni yuklaydi va manzilini qaytaradi; berilmasa rasmlar data URL sifatida joylanadi. |
| `variables` | `TemplateVariable[]` | `[]` | Foydalanuvchi qo‘sha oladigan shablon o‘zgaruvchilari. |

### v-model va hodisalar

| Nomi | Tip | Tavsif |
| --- | --- | --- |
| `v-model` | `string` | Tozalangan HTML ko‘rinishidagi maydon qiymati; bo‘sh maydon `''`. |
| `focus` | hodisa | Tahrirlash maydoni fokus oldi. |
| `blur` | hodisa | Tahrirlash maydoni fokusni yo‘qotdi. |
| `uploadError` | hodisa, `error: unknown` | Rasm rad etildi yoki yuklanmadi. |

`Editor` da `v-model:page`, `v-model:comments`, `v-model:trackChanges`, `author`, `defaultViewMode`, `height`, `title`, `ruler`, `slashCommands` va `toolbar` sloti yo‘q, u metodlarni ham taqdim etmaydi. `/` menyusi unda o‘rnatilgan buyruqlar bilan ishlaydi.

## DocumentCompare

Hujjatning ikki versiyasini faqat o‘qish uchun solishtirish: yangi versiya, unda qo‘shilgan so‘zlar yashil rangda tagiga chizilgan, o‘chirilganlari qizil rangda ustidan chizilgan, tepada esa o‘zgarishlar soni. Batafsil: [Izohlar va solishtirish](/docs/review).

### Props

| Prop | Tip | Standart | Tavsif |
| --- | --- | --- | --- |
| `before` | `string` | — | Oldingi versiya HTML’i. Majburiy. |
| `after` | `string` | — | Keyingi versiya HTML’i. Majburiy. |
| `locale` | `EditorLocaleInput` | — | Interfeys tili; berilmasa ilova bo‘yicha til olinadi. |
| `height` | `number \| string` | `'auto'` | Komponent balandligi; `'auto'` hujjat bilan o‘sadi, aniq balandlikda ichida aylantiriladi. |

Uning hodisalari va taqdim etiladigan a’zolari yo‘q.

## DocumentForm

Forma kabi to‘ldiriladigan shablon: hujjat chop etilganda qanday bo‘lsa, shunday ko‘rinadi, faqat o‘zgaruvchilari kiritish maydoniga aylanadi. Batafsil: [Shablonlar va imzolar](/docs/templates).

### Props

| Prop | Tip | Standart | Tavsif |
| --- | --- | --- | --- |
| `template` | `string` | — | Muharrir saqlagan shablon HTML’i. Majburiy. |
| `variables` | `TemplateVariable[]` | `[]` | Bo‘sh maydonlarda ko‘rinadigan yorliqlar; o‘rnatilgan hujjat shablonlarining o‘zgaruvchilari bu ro‘yxatsiz ham yorliq bilan chiqadi. |
| `locale` | `EditorLocaleInput` | — | O‘rnatilgan o‘zgaruvchi yorliqlarining tili; berilmasa ilova bo‘yicha til olinadi. |
| `readonly` | `boolean` | `false` | Qiymatlarni o‘zgartirib bo‘lmaydigan qilib ko‘rsatadi. |

### v-model

| Bog‘lash | Tip | Standart | Tavsif |
| --- | --- | --- | --- |
| `v-model` | `Record<string, string>` | `{}` | O‘zgaruvchi nomi bo‘yicha qiymatlar. Bir xil o‘zgaruvchining barcha maydonlari bitta qiymatga ega. |

### Taqdim etiladigan a’zolar

| A’zo | Tip | Tavsif |
| --- | --- | --- |
| `getHTML` | `(options?: FillTemplateOptions) => string` | `fillTemplate` bilan to‘ldirilgan hujjat HTML’i. |
| `validate` | `() => string[]` | Bo‘sh qolgan o‘zgaruvchilar nomlari. Ularning maydonlarini belgilaydi va birinchisiga fokus beradi; bo‘sh ro‘yxat forma to‘liq to‘ldirilganini bildiradi. |

## Funksiyalar

### createPageSettings

```ts
function createPageSettings(): PageSettings;
```

Yangi standart sahifa sozlamalarini qaytaradi: A4, kitob yo‘nalishi, har tomondan 25.4 mm hoshiya. Har bir chaqiruv yangi obyekt qaytaradi.

### createHeaderFooter, createWatermark

```ts
function createHeaderFooter(): PageHeaderFooter;
function createWatermark(): PageWatermark;
```

Bo‘sh kolontitul (`{ left: '', center: '', right: '' }`) va standart rangdagi bo‘sh suv belgisi: `{ text: '', color: '#9ca3af', diagonal: true }`.

### setEditorLocale

```ts
function setEditorLocale(locale: EditorLocaleInput): void;
```

O‘z `locale` propi berilmagan barcha muharrirlarning interfeys tilini o‘rnatadi. Reaktiv: sahifadagi muharrirlar darhol yangilanadi. Batafsil: [Tillar](/docs/translations).

### fillTemplate

```ts
function fillTemplate(html: string, values: TemplateValues, options?: FillTemplateOptions): string;
```

Saqlangan HTML’dagi shablon o‘zgaruvchilarini ekranlangan qiymatlar bilan almashtiradi. `options.missing` `'empty'` yoki `'name'` bo‘lmasa, qiymatsiz o‘zgaruvchilar joyida qoladi. DOM’siz ishlaydi, shuning uchun Node serverida ham ishlatiladi. Batafsil: [Shablonlar va imzolar](/docs/templates).

### getTemplateVariables

```ts
function getTemplateVariables(html: string): string[];
```

Saqlangan HTML ishlatgan shablon o‘zgaruvchilari nomlari: har biri bir marta, hujjatdagi tartibda.

### getDocumentTemplate

```ts
function getDocumentTemplate(id: DocumentTemplateId, locale?: EditorLocaleCode): DocumentTemplate;
```

Berilgan tildagi (standart — o‘zbek) o‘rnatilgan hujjat shabloni va uning o‘zgaruvchilari.

### numberToWords, formatAmountInWords, parseAmount

```ts
function numberToWords(value: number, locale?: NumberWordsLocale): string;
function formatAmountInWords(value: number, locale?: NumberWordsLocale): string;
function parseAmount(text: string): number | null;
```

`numberToWords` sonning butun qismini trillionlargacha so‘z bilan yozadi. `formatAmountInWords` guruhlangan raqamlarni ham qo‘shadi: `15 000 000 (o‘n besh million)`. `parseAmount` `15 000 000`, `1 250,50` yoki `1,250.50` kabi yozilgan summalarni o‘qiydi.

### formatShortDate, formatLongDate

```ts
function formatShortDate(date: Date): string;
function formatLongDate(date: Date, locale?: NumberWordsLocale): string;
```

`14.09.2026` va berilgan tilda rasmiy hujjatlardagi yozma shakl.

### transliterate

```ts
function transliterate(text: string, direction: TransliterationDirection, previous?: string): string;
```

O‘zbekcha matnni lotin va kirill yozuvlari o‘rtasida o‘giradi; `{placeholder}` va `{{o‘zgaruvchi}}` joyida qoladi.

### buildDocx

```ts
function buildDocx(source: DocxSource): Promise<Blob>;
```

Hujjat HTML’i, nomi va sahifa sozlamalaridan Word faylini (Office Open XML) yasaydi. Rasmlar data URL’dan olinadi yoki manzili bo‘yicha yuklab olinadi. Brauzerda ishlaydi. Batafsil: [Word fayllari va katta hujjatlar](/docs/word-files).

### readDocx

```ts
function readDocx(data: ArrayBuffer | Uint8Array): Promise<DocxImport>;
```

`.docx` faylni muharrir HTML’i va sahifa sozlamalariga o‘qiydi. Fayl Word hujjati bo‘lmasa, xato bilan tugaydi. Brauzerda ishlaydi.

### compareDocuments

```ts
function compareDocuments(before: string, after: string): DocumentComparison;
```

Hujjatning ikki versiyasini solishtiradi: yangi versiyaning `<ins>` va `<del>` bilan belgilangan HTML’ini hamda qo‘shilgan va o‘chirilgan so‘zlar sonini qaytaradi. `DocumentCompare` shu funksiyaga asoslangan. DOM talab qiladi.

### createCommentId

```ts
function createCommentId(): string;
```

Izoh yoki javob uchun yangi tasodifiy identifikator, HTML atributida ishlatsa bo‘ladi, masalan `cmfz3k1a9x2b7q`.

### collaboratorColor

```ts
function collaboratorColor(collaborator: Pick<Collaborator, 'id' | 'color'>): string;
```

**0.6.0 versiyada yangi.** Muharrir hamkorni chizadigan rang: uning o‘z `color` qiymati yoki `id` bo‘yicha tanlanadigan sakkiz rangdan biri — bir xil id uchun doim bir xil. Muharrir yonidagi odamlar ro‘yxati uchun qulay.

### readOutline

```ts
function readOutline(root: HTMLElement, depth?: number): OutlineHeading[];
```

`root` ichida bevosita yozilgan (jadval, ro‘yxat yoki iqtibos ichida bo‘lmagan) `depth` darajagacha (standart — 6) sarlavhalar. Bo‘sh sarlavhalar tashlab ketiladi.

### buildTableOfContents

```ts
function buildTableOfContents(entries: TableOfContentsEntry[], options: TableOfContentsOptions): string;
```

Mundarija HTML’i: sarlavha, so‘ng har bir band uchun bitta qator, sahifa raqami o‘ng tomonda. Eng yuqori darajadagi bandlar qalin yoziladi, chuqurroq darajalar ichkariga suriladi. Natija — chegarasiz `<table data-type="toc">`.

## Konstantalar

### uz, uzCyrl, en, ru

```ts
const uz: EditorLocale;
const uzCyrl: EditorLocale;
const en: EditorLocale;
const ru: EditorLocale;
```

O‘rnatilgan interfeys tillari: lotin (standart) va kirill yozuvidagi o‘zbek, ingliz va rus.

### editorLocales

```ts
const editorLocales: ReadonlyArray<EditorLocale>;
```

Barcha o‘rnatilgan tillar, til tanlash ro‘yxatlari uchun.

## Tiplar

### PageSettings

```ts
interface PageSettings {
  /** Qog‘oz formati. */
  size: PageSizeKey;
  /** Qog‘oz yo‘nalishi. */
  orientation: PageOrientation;
  /** Hoshiyalar, millimetrda. */
  margins: PageMargins;
  /** Har sahifaning yuqori hoshiyasida takrorlanadigan matn; kolontitul bo‘lmasa, maydon yo‘q. */
  header?: PageHeaderFooter;
  /** Har sahifaning pastki hoshiyasida takrorlanadigan matn; kolontitul bo‘lmasa, maydon yo‘q. */
  footer?: PageHeaderFooter;
  /** Har sahifada matn ortida chiziladigan suv belgisi; bo‘lmasa, maydon yo‘q. */
  watermark?: PageWatermark;
  /** Birinchi sahifada kolontitul va sahifa raqami ko‘rsatilmasinmi. */
  differentFirstPage?: boolean;
  /** Birinchi sahifaga yoziladigan raqam; keyingi sahifalar undan davom etadi. Standart — 1. */
  firstPageNumber?: number;
}
```

### PageMargins

```ts
/** Sahifa hoshiyalari, millimetrda. */
interface PageMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
```

### PageHeaderFooter

```ts
/** Har sahifaning yuqori yoki pastki hoshiyasida takrorlanadigan uch qismli matn. */
interface PageHeaderFooter {
  left: string;
  center: string;
  right: string;
}
```

Matnlarda `{page}`, `{pages}`, `{date}` va `{title}` tokenlari bo‘lishi mumkin; batafsil: [Foydalanish](/docs/usage).

### PageWatermark

```ts
interface PageWatermark {
  /** Suv belgisi matni, masalan NUSXA yoki CHERNOVIK. */
  text: string;
  /** Matn rangi; u xira chiziladi. */
  color: string;
  /** Matn sahifa bo‘ylab qiya joylashadimi. */
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
/** `page` — matn protsessoridagidek varaqlar, `web` — uzluksiz sirt. */
type DocumentViewMode = 'page' | 'web';
```

### DocumentImageUploadHandler

```ts
/** Rasmni yuklaydi va uning ochiq manzilini qaytaradi. */
type DocumentImageUploadHandler = (file: File) => Promise<string>;
```

### DocumentComment

```ts
interface DocumentComment {
  /** Noyob identifikator; HTML’dagi langar — `<span data-comment="id">`. */
  id: string;
  /** Izoh matni. */
  text: string;
  /** Muallif ismi, muharrirda `author` berilgan bo‘lsa. */
  author?: string;
  /** Yozilgan vaqti, ISO 8601 satri. */
  createdAt: string;
  /** Muhokama yopilganmi; hal qilingan izoh langari qoladi, lekin ajratib ko‘rsatilmaydi. */
  resolved?: boolean;
  /** Javoblar, yozilgan tartibda. */
  replies?: DocumentCommentReply[];
}
```

### DocumentCommentReply

```ts
interface DocumentCommentReply {
  id: string;
  text: string;
  author?: string;
  /** ISO 8601 satri. */
  createdAt: string;
}
```

### TrackedChange

```ts
/** Kuzatilgan qo‘shish yoki o‘chirish; bitta tahrirning qismlari birlashtiriladi. */
interface TrackedChange {
  /** Tahrir qismlari uchun umumiy identifikator; HTML’da `data-change`. */
  id: string;
  /** Matn qo‘shilganmi yoki o‘chirilganmi. */
  type: 'insert' | 'delete';
  /** Muallif ismi; bo‘sh bo‘lishi mumkin. */
  author: string;
  /** O‘zgarish qilingan vaqt, ISO 8601 satri. */
  time: string;
  /** Qo‘shilgan yoki o‘chirilgan matn. */
  text: string;
}
```

### DocumentComparison

```ts
interface DocumentComparison {
  /** Qo‘shilgan va o‘chirilgan joylari belgilangan yangi versiya HTML’i. */
  html: string;
  /** Qo‘shilgan so‘zlar va qo‘shilgan bloklardagi so‘zlar soni. */
  insertions: number;
  /** O‘chirilgan so‘zlar va o‘chirilgan bloklardagi so‘zlar soni. */
  deletions: number;
}
```

### DocxSource

```ts
interface DocxSource {
  /** Muharrir saqlagan toza hujjat HTML’i. */
  html: string;
  /** Hujjat nomi; fayl xususiyatlariga yoziladi va `{title}` tokeni uchun ishlatiladi. */
  title: string;
  /** Qog‘oz o‘lchami, yo‘nalishi, hoshiyalar, kolontitullar, suv belgisi va sahifa raqamlash. */
  page: PageSettings;
}
```

### DocxImport

```ts
interface DocxImport {
  /** Hujjat mazmuni, HTML ko‘rinishida. */
  html: string;
  /** Hujjat birinchi bo‘limining sahifa sozlamalari; keyingi bo‘limlar bo‘lim uzilishlari sifatida keladi. */
  page: PageSettings;
}
```

### OutlineHeading

```ts
interface OutlineHeading {
  /** Sarlavha darajasi, 1 dan 6 gacha. */
  level: number;
  /** Bo‘shliqlari qisqartirilgan sarlavha matni. */
  text: string;
  /** Sarlavha elementi. */
  element: HTMLElement;
}
```

### TableOfContentsEntry

```ts
interface TableOfContentsEntry {
  /** Sarlavha darajasi, 1 dan 6 gacha; chuqurroq darajalar ichkariga suriladi. */
  level: number;
  /** Sarlavha matni. */
  text: string;
  /** Sarlavha boshlanadigan sahifa yoki hujjat sahifalarga bo‘linmagan bo‘lsa `null`. */
  page: number | null;
}
```

### TableOfContentsOptions

```ts
interface TableOfContentsOptions {
  /** Bandlar ustidagi sarlavha. */
  title: string;
  /** Sarlavhalar bo‘lmasa, bandlar o‘rnida ko‘rinadigan matn. */
  emptyText: string;
  /** Matn ustunining kengligi, pikselda; jadval shu kenglik va sahifa raqami ustunini egallaydi. */
  width?: number;
}
```

### SlashCommand

```ts
interface SlashCommand {
  /** Noyob identifikator; yozilgan filtr unga ham mos keladi. */
  id: string;
  /** Menyuda ko‘rinadigan nom. */
  label: string;
  /** Muharrirning ikonkalar to‘plamidan ikonka; berilmasa `plus`. */
  icon?: IconName;
  /** Filtr buyruqni topadigan qo‘shimcha so‘zlar, masalan boshqa tillarda. */
  keywords?: readonly string[];
  /** Buyruqni bajaradi; yozilgan `/filtr` bu paytda olib tashlangan bo‘ladi. */
  run: (engine: DocumentEngine) => void;
}
```

### Collaborator, SelectionOffsets

**0.6.0 versiyada yangi.** Batafsil: [Birgalikda tahrirlash](/docs/collaboration).

```ts
/** Hujjat bo‘ylab belgi pozitsiyalari ko‘rinishidagi belgilash; teng pozitsiyalar — kursor. */
interface SelectionOffsets {
  /** Belgilash boshlangan joy. */
  anchor: number;
  /** Kursor turgan joy. */
  focus: number;
}

/** Xuddi shu hujjatni tahrirlayotgan boshqa odam. */
interface Collaborator {
  /** Odam yoki ulanishning o‘zgarmas identifikatori. */
  id: string;
  /** Kursor yonida ko‘rinadigan ism. */
  name: string;
  /** Kursor va belgilashning CSS rangi; berilmasa, id bo‘yicha tanlanadi. */
  color?: string;
  /** Odamning kursori yoki belgilashi qayerda, hujjatda bo‘lmasa `null`. */
  selection: SelectionOffsets | null;
}
```

### IconName

Muharrirning o‘rnatilgan ikonkalari nomlari birlashmasi, masalan `'braces'`, `'calendar-days'`, `'file-text'`, `'signature'` yoki `'table-of-contents'`. Kod muharriringizning tip maslahatlari hammasini ko‘rsatadi.

### DocumentEngine

`DocumentEditor` ortidagi tahrirlash dvigateli, faqat tip sifatida eksport qilinadi. Uning nusxasini template ref’ning `engine` a’zosidan, `toolbar` slotidan va `SlashCommand.run` ichida olasiz. Ko‘p ishlatiladigan metodlar:

| Metod | Tavsif |
| --- | --- |
| `insertText(text: string)` | Belgilangan joyga oddiy matn qo‘shadi. |
| `insertContent(html: string, options?: { asBlocks?: boolean })` | Tozalangan HTML’ni bitta bekor qilinadigan qadamda qo‘shadi; `asBlocks` bilan u alohida qatordan boshlanadi. |
| `insertVariable(name: string)` | Shablon o‘zgaruvchisini qo‘shadi. |
| `getSelectedText()` | Belgilangan qismning oddiy matni. |
| `toggleMark(mark)` | `'bold'`, `'italic'`, `'underline'`, `'strike'`, `'code'`, `'subscript'` yoki `'superscript'` ni yoqadi yoki o‘chiradi. |
| `setBlockType(tag)` | Joriy blokni `'P'` yoki `'H1'` … `'H6'` ga aylantiradi. |
| `toggleList(kind)` | `'bulletList'`, `'orderedList'` yoki `'taskList'` ni yoqadi yoki o‘chiradi. |
| `setListNumbering(style)` | Kursor turgan raqamli ro‘yxatni `'default'` va `'legal'` raqamlash o‘rtasida almashtiradi. |
| `insertTable(rows, cols, withHeaderRow)` | Jadval qo‘shadi. |
| `insertPageBreak()`, `insertHorizontalRule()` | Sahifa uzilishi yoki gorizontal chiziq qo‘shadi. |
| `insertSectionBreak(orientation: 'portrait' \| 'landscape')` | **0.6.0 versiyada yangi.** Bo‘lim uzilishi qo‘shadi; undan keyingi sahifalar `orientation` yo‘nalishiga buriladi. Batafsil: [Word fayllari va katta hujjatlar](/docs/word-files#turli-yonalishdagi-sahifalar). |
| `insertFootnote(text: string)` | Belgilangan joyga snoska havolasini matni bilan qo‘shadi; havola elementini yoki hech narsa qo‘shilmasa `null` qaytaradi. |
| `setFootnoteText(element, text: string)` | Snoska matnini o‘zgartiradi (2000 belgigacha). |
| `removeFootnote(element)` | Snoska havolasini matni bilan birga olib tashlaydi. |
| `getFootnotes()` | Snoska havolalari va matnlari, `{ element, text }[]`, hujjatdagi tartibda. |
| `setTrackChanges(enabled: boolean, author?: string)` | Tahrirlarni kuzatilgan o‘zgarish sifatida yozishni boshlaydi yoki to‘xtatadi. `DocumentEditor` uni `v-model:trackChanges` va `author` dan o‘zi chaqiradi, shuning uchun u yerda bog‘lashdan foydalaning. |
| `tracksChanges` | Tahrirlar kuzatilyaptimi (faqat o‘qiladigan xususiyat). |
| `getChanges()` | Kuzatilgan o‘zgarishlar hujjatdagi tartibda, `TrackedChange[]`. |
| `resolveChanges(accept: boolean, id?: string)` | Berilgan identifikatorli o‘zgarishni yoki id berilmasa barcha o‘zgarishlarni qabul qiladi (`true`) yoki rad etadi. |
| `selectChange(id: string)` | Kuzatilgan o‘zgarish matnini belgilaydi va o‘sha joyga aylantiradi. |
| `undo()`, `redo()` | Bekor qilish va qaytarish. |
| `focus(position?: 'start' \| 'end')` | Hujjatga fokus beradi. |
| `getHTML()` | Hujjatning toza HTML’i. |
| `setContent(html: string, options?: { keepSelection?: boolean })` | Hujjatni almashtiradi va bekor qilish tarixini tozalaydi. **0.6.0 versiyada yangi:** `keepSelection` bilan muharrir fokusda bo‘lsa, kursor o‘sha belgi pozitsiyasida qoladi; `v-model` shundan foydalanadi. |
| `getSelectionOffsets()` | **0.6.0 versiyada yangi.** Belgilash `SelectionOffsets` ko‘rinishida yoki `null`. |
| `getOffsetRects(offsets: SelectionOffsets)` | **0.6.0 versiyada yangi.** Ikki pozitsiya orasidagi matnning viewport’dagi to‘rtburchaklari (`DOMRect[]`); kursor uchun kengligi nol bo‘lgan bitta to‘rtburchak qaytadi. |

Har bir buyruq bitta bekor qilinadigan qadam bo‘ladi va yozishdagidek `v-model` ni yangilaydi.

### EditorUiState

Belgilangan joydagi formatning asboblar paneli ko‘rsatadigan tekis surati. Maydonlaridan ba’zilari: `bold`, `italic`, `underline`, `headingLevel`, `fontFamily`, `fontSize`, `align`, `bulletList`, `orderedList`, `legalNumbering`, `link`, `canUndo`, `canRedo`, `tableOfContents` (hujjatda mundarija bor), `textSelected` (bo‘sh bo‘lmagan matn belgilangan) va `comment` (kursor turgan izoh identifikatori yoki `''`).

### TemplateVariable

```ts
interface TemplateVariable {
  /** Saqlangan HTML’da va `{{name}}` da ishlatiladigan nom: harflar, raqamlar, `_`, `.` va `-`. */
  name: string;
  /** Muharrirdagi chip va o‘zgaruvchilar menyusida ko‘rinadigan matn. */
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
  /** Qiymatsiz o‘zgaruvchi: qoladi (standart), olib tashlanadi yoki `{{name}}` matni sifatida yoziladi. */
  missing?: 'keep' | 'empty' | 'name';
}
```

### DocumentTemplate, DocumentTemplateId

```ts
type DocumentTemplateId = 'letter' | 'order' | 'application' | 'certificate' | 'act';

interface DocumentTemplate {
  id: DocumentTemplateId;
  /** Shablon o‘zgaruvchilari bor hujjat HTML’i. */
  html: string;
  /** Shablon ishlatadigan o‘zgaruvchilar, so‘ralgan tildagi yorliqlari bilan. */
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
  /** Til kodi. */
  readonly code: EditorLocaleCode;
  /** Tilning o‘z tilidagi nomi, til tanlash ro‘yxatlari uchun. */
  readonly name: string;
}
```

### EditorLocaleCode

```ts
type EditorLocaleCode = 'uz' | 'uz-Cyrl' | 'en' | 'ru';
```

### EditorLocaleInput

```ts
/** Til obyekti yoki uning kodi. */
type EditorLocaleInput = EditorLocale | EditorLocaleCode;
```
