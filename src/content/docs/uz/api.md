# API

nuvra eksport qiladigan hamma narsaning to‘liq ma’lumotnomasi: komponentlar, funksiyalar, konstantalar va tiplar.

## Eksportlar

```ts
import {
  DocumentEditor,
  Editor,
  createPageSettings,
  editorLocales,
  en,
  ru,
  setEditorLocale,
  uz,
  type DocumentImageUploadHandler,
  type DocumentViewMode,
  type EditorLocale,
  type EditorLocaleCode,
  type EditorLocaleInput,
  type PageMargins,
  type PageOrientation,
  type PageSettings,
  type PageSizeKey
} from 'nuvra';
import 'nuvra/style.css';
```

## DocumentEditor

Asboblar paneli, sahifa yoki veb ko‘rinishi, holat paneli, qidirish va almashtirish, chop etish va eksportga ega to‘liq Word uslubidagi muharrir.

### Props

| Prop | Tip | Standart | Tavsif |
| --- | --- | --- | --- |
| `autofocus` | `boolean` | `false` | Muharrir tayyor bo‘lishi bilan kursorni hujjat oxiriga qo‘yadi. |
| `canvasPadding` | `number \| string` | `50` | Sahifa yoki veb varaq atrofidagi kulrang bo‘shliq. |
| `defaultViewMode` | `DocumentViewMode` | `'page'` | Birinchi ko‘rsatiladigan ko‘rinish; foydalanuvchi uni holat panelida almashtira oladi. |
| `disabled` | `boolean` | `false` | Hujjatni faqat o‘qiladigan qiladi va barcha tahrirlash tugmalarini o‘chiradi. |
| `height` | `number \| string` | `760` | Butun muharrir balandligi yoki `minHeight` va `maxHeight` oralig‘ida o‘sishi uchun `'auto'`. |
| `locale` | `EditorLocaleInput` | — | Interfeys tili: `uz`, `en`, `ru` yoki ularning kodi; berilmasa ilova bo‘yicha til olinadi. |
| `maxHeight` | `number \| string` | `600` | O‘suvchi muharrirning eng katta balandligi; uzun hujjatlar ichida aylantiriladi. |
| `maxImageSizeMb` | `number` | `10` | Qabul qilinadigan rasm faylining eng katta hajmi, megabaytda. |
| `maxLength` | `number` | `0` | Belgilarning eng ko‘p soni; `0` — cheklovsiz. |
| `minHeight` | `number \| string` | `240` | O‘suvchi muharrirning eng kichik balandligi. |
| `placeholder` | `string` | `''` | Hujjat bo‘sh bo‘lganda ko‘rinadigan matn; berilmasa `editor.placeholder` yorlig‘i olinadi. |
| `title` | `string` | `''` | Chop etish sarlavhasi va eksport fayli nomi; berilmasa `editor.document` yorlig‘i olinadi. |
| `uploadImage` | `DocumentImageUploadHandler` | — | Qo‘shilgan rasmni yuklaydi va manzilini qaytaradi; berilmasa rasmlar data URL sifatida joylanadi. |

Sonlar piksel hisoblanadi; satrlar CSS uzunligi sifatida ishlatiladi. Boshqa atributlar, masalan `class` va `style`, muharrirning ildiz elementiga qo‘llanadi.

### v-model

| Bog‘lash | Tip | Standart | Tavsif |
| --- | --- | --- | --- |
| `v-model` | `string` | `''` | Hujjat HTML’i. Bo‘sh hujjat `''`; yozilganda qiymat qisqa pauzadan keyin yangilanadi. |
| `v-model:page` | `PageSettings` | `createPageSettings()` | Sahifa ko‘rinishi, chop etish va eksport uchun qog‘oz o‘lchami, yo‘nalishi va hoshiyalar. |

### Hodisalar

| Hodisa | Ma’lumot | Tavsif |
| --- | --- | --- |
| `focus` | — | Tahrirlash maydoni fokus oldi. |
| `blur` | — | Tahrirlash maydoni fokusni yo‘qotdi; kutilayotgan o‘zgarishlar modelga yozib bo‘lingan. |
| `uploadError` | `error: unknown` | Rasm tekshiruvdan o‘tmadi yoki yuklanmadi. |

### Taqdim etiladigan a’zolar

Template ref orqali mavjud.

| A’zo | Tip | Tavsif |
| --- | --- | --- |
| `focus` | `() => void` | Klaviatura fokusini hujjatga o‘tkazadi. |
| `getHTML` | `() => string` | Kutilayotgan o‘zgarishlarni modelga yozadi va hujjat HTML’ini qaytaradi. |
| `print` | `() => Promise<void>` | Brauzerning chop etish oynasini ochadi. |
| `exportHtml` | `() => Promise<void>` | Hujjatni HTML sahifa sifatida yuklab beradi. |
| `exportWord` | `() => Promise<void>` | Hujjatni Word bilan mos `.doc` fayl sifatida yuklab beradi. |
| `engine` | ichki dvigatel yoki `null` | Murakkab integratsiyalar uchun tahrirlash dvigateli; muharrir yuklanmaguncha `null`. Uning tipi eksport qilinmaydi. |

## Editor

Formalar uchun matn maydoni: veb ko‘rinishdagi va `height: 'auto'` bo‘lgan `DocumentEditor`, matn ko‘paygan sari `minHeight` va `maxHeight` oralig‘ida o‘sadi.

### Props

| Prop | Tip | Standart | Tavsif |
| --- | --- | --- | --- |
| `autofocus` | `boolean` | `false` | Muharrir tayyor bo‘lganda kursorni matn oxiriga qo‘yadi. |
| `canvasPadding` | `number \| string` | `50` | Varaq atrofidagi kulrang bo‘shliq. |
| `disabled` | `boolean` | `false` | Matnni faqat o‘qiladigan qiladi va asboblar panelini o‘chiradi. |
| `locale` | `EditorLocaleInput` | — | Interfeys tili: `uz`, `en`, `ru` yoki ularning kodi; berilmasa ilova bo‘yicha til olinadi. |
| `maxHeight` | `number \| string` | `600` | Maydon o‘sishdan to‘xtab, aylantirila boshlaydigan balandlik. |
| `maxImageSizeMb` | `number` | `10` | Qabul qilinadigan rasm faylining eng katta hajmi, megabaytda. |
| `maxLength` | `number` | `0` | Belgilar chegarasi; `0` — cheklovsiz. |
| `minHeight` | `number \| string` | `240` | Maydonning eng kichik balandligi, varaq atrofidagi bo‘shliq bilan birga. |
| `placeholder` | `string` | `''` | Maydon bo‘sh bo‘lganda ko‘rinadigan matn. |
| `uploadImage` | `DocumentImageUploadHandler` | — | Rasmni yuklaydi va manzilini qaytaradi; berilmasa rasmlar data URL sifatida joylanadi. |

### v-model va hodisalar

| Nomi | Tip | Tavsif |
| --- | --- | --- |
| `v-model` | `string` | Tozalangan HTML ko‘rinishidagi maydon qiymati; bo‘sh maydon `''`. |
| `focus` | hodisa | Tahrirlash maydoni fokus oldi. |
| `blur` | hodisa | Tahrirlash maydoni fokusni yo‘qotdi. |
| `uploadError` | hodisa, `error: unknown` | Rasm rad etildi yoki yuklanmadi. |

`Editor` da `v-model:page`, `defaultViewMode`, `height` va `title` yo‘q, u metodlarni ham taqdim etmaydi.

## Funksiyalar

### createPageSettings

```ts
function createPageSettings(): PageSettings;
```

Yangi standart sahifa sozlamalarini qaytaradi: A4, kitob yo‘nalishi, har tomondan 25.4 mm hoshiya. Har bir chaqiruv yangi obyekt qaytaradi.

### setEditorLocale

```ts
function setEditorLocale(locale: EditorLocaleInput): void;
```

O‘z `locale` propi berilmagan barcha muharrirlarning interfeys tilini o‘rnatadi. Reaktiv: sahifadagi muharrirlar darhol yangilanadi. Batafsil: [Tillar](/docs/translations).

## Konstantalar

### uz, en, ru

```ts
const uz: EditorLocale;
const en: EditorLocale;
const ru: EditorLocale;
```

O‘rnatilgan interfeys tillari: o‘zbek (standart), ingliz va rus.

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
type EditorLocaleCode = 'uz' | 'en' | 'ru';
```

### EditorLocaleInput

```ts
/** Til obyekti yoki uning kodi. */
type EditorLocaleInput = EditorLocale | EditorLocaleCode;
```
