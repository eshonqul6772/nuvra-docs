# O‘zgarishlar tarixi

nuvra’ning har bir versiyasidagi muhim o‘zgarishlar, eng yangisidan boshlab.

## Chiqarilmagan

### Tillar

- **Moslik buziladi:** kirill yozuvidagi o‘zbek interfeysi olib tashlandi: `uzCyrl` locale’i hamda `EditorLocaleCode` va `NumberWordsLocale` dagi `'uz-Cyrl'` kodi endi yo‘q. Interfeys o‘zbek, ingliz va rus tillarida keladi; `transliterate` va hujjat matnini lotin / kirill yozuviga o‘girish saqlanib qoladi.

### PDF import

- “Yana” menyusidagi “PDF faylini ochish (.pdf)” va template ref’dagi `importPdf(file)` PDF’ni tahrirlanadigan hujjatga aylantiradi: paragraflar, sarlavhalar, ro‘yxatlar, jadvallar, rasmlar, kolontitullar va sahifa sozlamalari sahifalardagi joylashuvdan qayta tiklanadi. “Word faylini ochish (.docx)” ham PDF fayllarni qabul qiladi. Skanerlangan sahifalar rasm bo‘lib keladi. Fayl brauzerda o‘qiladi, o‘quvchi kod esa birinchi ishlatilganda yuklanadi. Batafsil: [PDF faylini ochish](/docs/word-files#pdf-faylini-ochish).
- `readPdf` PDF’ni o‘z kodingizda o‘qiydi; ochib bo‘lmagan faylni `PdfImportError` (`reason`: `'invalid'`, `'encrypted'` yoki `'empty'`) bildiradi, `importError` hodisasi orqali ham.

### Tuzatishlar

- Veb ko‘rinish to‘liq ekranda ayrim oyna o‘lchamlari va masshtablarda scrollbar’lari chiqib-yo‘qolib, tinimsiz miltillab turardi; endi bunday bo‘lmaydi.

## 0.6.0

### Eksport va katta hujjatlar

- “Yana” menyusidagi “PDF sifatida yuklab olish” va template ref’dagi `exportPdf()` PDF’ni chop etish oynasisiz saqlaydi. Har bir sahifa rasmga chiziladi, shuning uchun PDF chop etilgan nusxaga o‘xshaydi, lekin uning matnini belgilab yoki qidirib bo‘lmaydi; CORS ruxsati bermagan serverlardagi rasmlar tushib qoladi. Yangi `exportError` hodisasi chizib bo‘lmagan PDF haqida xabar beradi. Batafsil: [Word fayllari va katta hujjatlar](/docs/word-files#pdf-yuklab-olish).
- Bo‘lim uzilishlari keyingi sahifalarni albom yoki kitob yo‘nalishiga buradi: qo‘shish menyusi va `/` menyusidagi “Bo‘lim uzilishi: albom sahifalar” va “Bo‘lim uzilishi: kitob sahifalar”, `<div data-type="section-break" data-orientation="landscape">` sifatida saqlanadi; `engine.insertSectionBreak()`. Burilgan sahifalar burilgan qog‘ozda chiziladi, chop etiladi va PDF’ga yoziladi, har bir bo‘lim Word bo‘limiga aylanadi, bir nechta bo‘limli Word fayllari esa bo‘lim uzilishlari bilan ochiladi. Batafsil: [Turli yo‘nalishdagi sahifalar](/docs/word-files#turli-yonalishdagi-sahifalar).
- Navigatsiya panelida **Sarlavhalar** va **Sahifalar** varaqlari bor; sahifalar varag‘i sahifa ko‘rinishida o‘z sahifasiga aylantiradigan kichik rasmlarni ko‘rsatadi.

### Birgalikda tahrirlash

- `collaborators` propi boshqa odamlarning kursorlari va belgilashlarini ismlari bilan chizadi, `selectionChange` hodisasi esa sizning belgilashingizni belgi pozitsiyalari ko‘rinishida xabar qiladi. `Collaborator`, `SelectionOffsets` va `collaboratorColor` eksport qilinadi, dvigatelda esa `getSelectionOffsets()`, `getOffsetRects()` va `setContent(html, { keepSelection })` bor. Batafsil: [Birgalikda tahrirlash](/docs/collaboration).
- Tashqaridan kelgan yangi `v-model` qiymati muharrir fokusda bo‘lsa, kursorni o‘sha belgi pozitsiyasida qoldiradi.

### Asboblar paneli

- Izoh va o‘zgarishlarni kuzatish tugmalari bitta **Taqriz** menyusiga birlashtirildi: “O‘zgarishlarni kuzatish”, “O‘zgarishlar”, “Izoh qo‘shish” (`Ctrl+Alt+M`) va “Izohlar”.

### Word importi

- `readDocx` va “Word faylini ochish (.docx)” sahifa sozlamalarini hujjatning oxirgi emas, birinchi bo‘limidan oladi.

## 0.5.0

### Word fayllari va katta hujjatlar

- Word eksporti HTML asosidagi `.doc` o‘rniga haqiqiy `.docx` faylni (Office Open XML) yozadi: sahifa sozlamalari, sahifa maydonli kolontitullar, suv belgisi, ro‘yxatlar, birlashtirilgan katakli jadvallar va rasmlar bilan. Batafsil: [Word fayllari va katta hujjatlar](/docs/word-files).
- “Yana” menyusidagi “Word faylini ochish (.docx)”, template ref’dagi `importWord(file)` va `importError` hodisasi Word faylini muharrirga yuklaydi.
- `buildDocx` va `readDocx` o‘z kodingizda Word fayllarini yozadi va o‘qiydi.
- Raqamli ro‘yxat tugmasi yonidagi strelkadan ko‘p darajali raqamlash (1., 1.1., 1.1.1.), `<ol data-numbering="legal">` sifatida saqlanadi; `engine.setListNumbering()`.
- Kolontitul oynasida sahifa raqamlash sozlamalari: `PageSettings` dagi `differentFirstPage` va `firstPageNumber`.
- Qo‘shish menyusi va `/` menyusidan qo‘shiladigan, joyida yangilanadigan mundarija; template ref’dagi `updateTableOfContents()`, `buildTableOfContents` va `readOutline`.
- “Yana” menyusida hujjat sarlavhalari va ularning sahifa raqamlari ko‘rinadigan navigatsiya paneli.
- Qo‘shish menyusi va `/` menyusidan qo‘shiladigan snoskalar: `<sup data-footnote>` sifatida saqlanadi, o‘z varag‘ining pastida chiziladi, chop etiladi va Word’ga Word snoskalari sifatida yoziladi; `engine.insertFootnote()`, `setFootnoteText()`, `removeFootnote()` va `getFootnotes()`.

### Tekshirish

- O‘zgarishlarni kuzatish: `v-model:trackChanges`, asboblar panelidagi “O‘zgarishlarni kuzatish” va “O‘zgarishlar” tugmalari — qabul qilish va rad etish bilan, `<ins data-change>` va `<del data-change>` sifatida saqlanadi, Word tuzatishlari bilan ikki tomonga almashadi; `engine.getChanges()`, `resolveChanges()`, `selectChange()` va `TrackedChange` tipi.
- `author` propi: yangi izohlar, javoblar va kuzatilgan o‘zgarishlarga yoziladigan ism.
- Izohlar: `v-model:comments`, asboblar panelidagi “Izoh qo‘shish” (`Ctrl+Alt+M`) va “Izohlar” tugmalari — javob, hal qilish va o‘chirish bilan; `createCommentId` hamda `DocumentComment` va `DocumentCommentReply` tiplari. Batafsil: [Izohlar va solishtirish](/docs/review).
- `DocumentCompare` va `compareDocuments` hujjatning ikki versiyasi orasidagi farqni ko‘rsatadi.

### Shablonlar

- Shablon o‘zgaruvchilari: `DocumentEditor` va `Editor` dagi `variables` propi, **{ }** menyusi, `{{name}}` yozish, `insertVariable`, `fillTemplate` va `getTemplateVariables`. Batafsil: [Shablonlar va imzolar](/docs/templates).
- `DocumentForm` shablonni forma kabi to‘ldiradi, `validate()` va `getHTML()` bilan.
- Imzo bloklari: imzo qatori, TASDIQLAYMAN va KELISHILDI griflari, tomonlarning imzolari.
- Hujjat shablonlari: xizmat xati, buyruq, ariza, ma’lumotnoma va dalolatnoma; `getDocumentTemplate`.
- Summani so‘z bilan yozish, bugungi sananing qisqa va to‘liq shakli; `numberToWords`, `formatAmountInWords`, `parseAmount`, `formatShortDate` va `formatLongDate`.
- O‘zbekcha matnni lotin va kirill yozuvlari o‘rtasida o‘girish; `transliterate`.

### Muharrir

- `/` buyruqlar menyusi va o‘z buyruqlaringiz uchun `slashCommands` propi.
- Asboblar paneliga o‘z tugmalaringiz uchun `toolbar` sloti.
- `DocumentEngine`, `EditorUiState`, `SlashCommand`, `IconName` va `TrackedChange` tiplari eksport qilinadi.
- Kirill yozuvidagi o‘zbek interfeysi: `uzCyrl`, kodi `'uz-Cyrl'`.

### 0.4 dan o‘tish

API’da mos kelmaydigan o‘zgarishlar yo‘q. `exportWord()` va menyudagi Word bandi endi `.docx` faylni yuklab beradi; serveringiz yoki foydalanuvchilaringiz `.doc` kutgan bo‘lsa, qabul qilinadigan fayl turlarini yangilang. Menyu bandi “Word (.doc) sifatida yuklab olish” o‘rniga “Word (.docx) sifatida yuklab olish” deb nomlanadi.

## 0.4.1

- Sahifa aylantirilganda asboblar paneli oynalari o‘z tugmalariga yopishgan holda qoladi.

## 0.4.0

- Interfeys o‘zbek, ingliz va rus tillarida keladi, til `locale` propi yoki `setEditorLocale` bilan tanlanadi.
- Hujjat aylantirilganda chizg‘ich asboblar paneli ostida qoladi.

### 0.3 dan o‘tish

`setEditorTranslator`, `editorMessages` hamda `EditorTranslator` va `EditorLabelKey` tiplari olib tashlandi. Tarjimalar endi paket ichida va ularni tashqaridan o‘zgartirib bo‘lmaydi; ilova faqat tilni tanlaydi.

Avval:

```ts
import { setEditorTranslator } from 'nuvra';
import { i18n } from './i18n';

setEditorTranslator((key, named) => (i18n.global.te(key) ? i18n.global.t(key, named ?? {}) : undefined));
```

Endi:

```ts
import { en, setEditorLocale } from 'nuvra';

setEditorLocale(en);
```

Ilovangiz tiliga ergashish uchun til o‘zgarganda `setEditorLocale` ni qayta chaqiring yoki bitta muharrirga `locale` propini bering. O‘z tarjima fayllaringizdan `editor.*` kalitlarini olib tashlang. Batafsil: [Tillar](/docs/translations).

## 0.3.0

- Asboblar paneli: format bo‘yoqchasi, harf registri, qo‘lda yoziladigan shrift o‘lchami, paragraf oralig‘i, formatlash belgilari va kontekst menyusi; `Ctrl` va sichqoncha g‘ildiragi bilan masshtab.
- Sahifa raqami, sahifalar soni, sana va nom tokenlari bilan kolontitullar; hoshiya va paragraf chekinishlari uchun chizg‘ich; suv belgisi.
- Chop etish va eksport hujjatni muharrirdagi varaqlarga aynan bo‘ladi.

## 0.2.1

- `Ctrl+Shift+H` almashtirish oynasini ochmasdan, yana belgilash rangini qo‘llaydi.
- Mavzu o‘zgaruvchilari nol spetsifiklikka ega, shuning uchun istalgan `.document-editor` qoidasi ularni almashtiradi.

## 0.2.0

- Element Plus va Lucide olib tashlandi: native boshqaruv elementlari, ichki SVG ikonkalar va `--nuvra-*` CSS o‘zgaruvchilari. Yagona peer bog‘liqlik — Vue.
