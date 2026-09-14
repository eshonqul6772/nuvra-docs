# Word fayllari va katta hujjatlar

Bu sahifada Word fayllarini ochish va saqlash, PDF yuklab olish hamda katta hujjatlar uchun vositalar tushuntiriladi: snoskalar, ko‘p darajali raqamlash, sahifa raqamlash sozlamalari, turli yo‘nalishdagi sahifalar, mundarija va navigatsiya paneli.

## Word fayllari (.docx)

### Word sifatida saqlash

“Yana” menyusidagi “Word (.docx) sifatida yuklab olish” bandi yoki template ref’dagi `exportWord()` Office Open XML formatidagi haqiqiy Word faylini yuklab beradi. Uni Word, LibreOffice, Google Docs va boshqa ofis dasturlari tahrirlash uchun ochadi. Fayl nomi `title` propidan olinadi.

Faylda saqlanadi:

- paragraf va sarlavhalar: tekislash, chekinishlar, paragraf oralig‘i, qator oralig‘i va matn yo‘nalishi bilan;
- qalin, kursiv, tagiga va ustidan chizilgan, pastki va yuqori indeks, matn rangi, belgilash rangi, shrift va shrift o‘lchami;
- havolalar, iqtiboslar va kod bloklari;
- belgili va raqamli ro‘yxatlar: ichma-ichligi, boshlang‘ich raqami va ko‘p darajali raqamlash bilan; vazifalar ro‘yxati bandlariga ☐ va ☑ belgilari qo‘yiladi;
- birlashtirilgan kataklar va ustun kengliklari bilan jadvallar; imzo bloklari va mundarija chegarasiz;
- PNG, JPEG, GIF va BMP rasmlar;
- snoskalar — Word’ning o‘z snoskalari sifatida;
- kuzatilgan o‘zgarishlar — muallif va vaqti bilan Word tuzatishlari sifatida;
- sahifa uzilishlari, bo‘lim uzilishlari (Word bo‘limlari sifatida) va gorizontal chiziqlar;
- qog‘oz o‘lchami, yo‘nalishi va hoshiyalar, PAGE va NUMPAGES maydonli kolontitullar, suv belgisi va sahifa raqamlash sozlamalari.

Shablon o‘zgaruvchilari `{{name}}` matni sifatida yoziladi, izohlar esa tushib qoladi: izoh qoldirilgan matn joyida qoladi.

Veb-manzildagi rasmlar fayl yasalayotganda yuklab olinadi, shuning uchun server bunday so‘rovga ruxsat berishi (CORS) kerak. O‘qib bo‘lmagan yoki WebP, SVG kabi boshqa formatdagi rasm tashlab ketiladi.

`buildDocx` xuddi shu faylni o‘z kodingizda yasaydi, masalan uni yuklab olish o‘rniga serverga yuborish uchun:

```ts
import { buildDocx } from 'nuvra';

const blob = await buildDocx({ html, title: 'Shartnoma', page });
await fetch('/api/documents/42/docx', { method: 'PUT', body: blob });
```

### Word faylini ochish

“Yana” menyusidagi “Word faylini ochish (.docx)” bandi fayl tanlatadi va hujjatni uning mazmuni bilan almashtiradi. Qog‘oz o‘lchami, yo‘nalishi, hoshiyalar, kolontitul matnlari va sahifa raqamlash ham fayldan olinadi; joriy suv belgisi saqlanib qoladi. Bir nechta bo‘limli faylda har bir keyingi bo‘lim boshiga bo‘lim uzilishi qo‘yiladi; [Turli yo‘nalishdagi sahifalar](#turli-yonalishdagi-sahifalar) bo‘limiga qarang. Mazmun almashtirilishi bitta bekor qilinadigan qadam bo‘ladi. Muharrir `disabled` bo‘lsa, band o‘chirilgan.

Koddan esa `importWord(file)` bilan ochiladi. O‘qib bo‘lmagan fayl hujjatni o‘zgartirmaydi va `importError` hodisasini chiqaradi:

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

Import paragraf va sarlavhalarni (Heading 1–6 va Title uslublari hamda outline darajasi berilgan uslublar), paragraf va belgi formatini, havolalarni, ko‘p darajali raqamlash bilan ro‘yxatlarni, birlashtirilgan katakli jadvallarni, rasmlarni, sahifa uzilishlarini, snoskalarni, tuzatishlarni va kontent boshqaruv elementlarini o‘qiydi. Word’dagi qo‘shish va o‘chirish tuzatishlari muharrirning kuzatilgan o‘zgarishlariga aylanadi, shuning uchun Word’da ko‘rib chiqilgan hujjat o‘zgarishlari ochiq holda qaytadi. Rasmlar data URL sifatida joylanadi va `uploadImage` orqali o‘tmaydi. Chegarasiz jadval imzo blokidagidek chegarasiz jadvalga aylanadi.

`readDocx` natijani muharrirsiz qaytaradi:

```ts
import { readDocx } from 'nuvra';

const { html, page } = await readDocx(await file.arrayBuffer());
```

### Cheklovlar

| Word imkoniyati | Nima bo‘ladi |
| --- | --- |
| Snoskalar (footnote) | Ikki tomonga ham saqlanadi; importda faqat snoska matni o‘qiladi, formati tushib qoladi. |
| Hujjat oxiridagi izohlar (endnote) | Import qilinmaydi. |
| Tuzatishlar (revisions) | Matn qo‘shish va o‘chirish ikki tomonga ham saqlanadi. Ko‘chirilgan deb belgilangan matn eski joyida o‘chirish, yangi joyida qo‘shish bo‘lib keladi. Format tuzatishi yangi format sifatida, tuzatishsiz keladi. |
| Word izohlari | Import qilinmaydi. |
| Bir nechta bo‘lim (section) | Birinchisidan keyingi har bir bo‘lim o‘sha bo‘lim yo‘nalishidagi bo‘lim uzilishi bilan boshlanadi. Hujjat qog‘oz o‘lchami, yo‘nalishi, hoshiyalari, titul varag‘i sozlamasi va birinchi sahifa raqamini birinchi bo‘limdan oladi; keyingi bo‘limlarning boshqacha qog‘oz o‘lchami yoki hoshiyalari saqlanmaydi, uzluksiz (continuous) bo‘lim esa yangi sahifadan boshlanadi. |
| Birinchi sahifa uchun alohida kolontitul | Sozlama saqlanadi, lekin birinchi sahifa kolontitulining mazmuni import qilinmaydi. |
| Kolontitullar | Faqat matni chap, markaz va o‘ng qismlarga bo‘lib olinadi; format va rasmlar tushib qoladi. |
| Suv belgisi, matn maydonlari, shakllar | Import qilinmaydi. |
| Maydonlar (fields) | Kolontituldagi PAGE va NUMPAGES `{page}` va `{pages}` ga aylanadi; boshqa maydonlarning ko‘rsatgan matni qoladi. |

## PDF yuklab olish

> 0.6.0 versiyada qo‘shilgan: “PDF sifatida yuklab olish”, `exportPdf()` va `exportError`.

“Yana” menyusidagi “PDF sifatida yuklab olish” bandi yoki template ref’dagi `exportPdf()` hujjatni chop etish oynasisiz, darhol PDF fayl sifatida saqlaydi. Fayl nomi `title` propidan olinadi.

Har bir varaq rasmga chiziladi (SVG `foreignObject` va canvas orqali, JPEG sifatida kodlanadi), rasmlar esa PDF’ga har sahifaga bittadan yoziladi. Shuning uchun PDF chop etilgan nusxaga o‘xshaydi — kolontitullar, suv belgisi, snoskalar va burilgan sahifalar bilan, lekin:

- uning matnini belgilab, qidirib yoki ovoz chiqarib o‘qitib bo‘lmaydi, fayl esa haqiqiy matnli PDF’dan kattaroq bo‘ladi;
- boshqa serverdagi rasmlar faqat o‘sha server so‘rovga ruxsat bersa (CORS) qo‘shiladi; qolganlari PDF’ga tushmaydi;
- kompyuterda o‘rnatilmagan veb-shrift rasmda zaxira shrift bilan almashtirilishi mumkin.

PDF sahifa ko‘rinishidagi varaqlardan chiziladi. Veb ko‘rinishda muharrir eksport paytida sahifa ko‘rinishiga o‘tadi va keyin qaytadi.

Sahifalarni chizib bo‘lmasa, masalan brauzer canvas’ni qayta o‘qishga ruxsat bermasa, muharrir `exportError` hodisasini chiqaradi va fayl yuklanmaydi. Belgilanadigan matnli PDF olish uchun chop etish oynasidagi “PDF sifatida saqlash” (Save as PDF) orqali chop etish yo‘li qoladi:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor } from 'nuvra';

const html = ref('');
const editor = ref<InstanceType<typeof DocumentEditor>>();

const onExportError = (error: unknown) => {
  console.error(error);
  void editor.value?.print(); // chop etish oynasiga qaytish
};
</script>

<template>
  <DocumentEditor ref="editor" v-model="html" title="Shartnoma" @export-error="onExportError" />
  <button type="button" @click="editor?.exportPdf()">PDF</button>
</template>
```

## Snoskalar

Qo‘shish menyusidagi (**+** tugmasi) yoki `/` menyusidagi “Snoska (sahifa osti izohi)” bandi kursor turgan joyga raqamli havola qo‘yadi va izoh matni uchun kichik forma ochadi. `Ctrl+Enter` yoki **Saqlash** uni saqlaydi; **Bekor qilish** yoki `Escape` formadan chiqaradi, bo‘sh qoldirilgan yangi snoska esa olib tashlanadi. Havola bosilsa, izohni o‘zgartirish yoki snoskani **O‘chirish** uchun forma ochiladi.

Havolalar hujjatdagi tartibda raqamlanadi va snoska qo‘shilganda, ko‘chirilganda yoki o‘chirilganda qayta raqamlanadi. Snoska havolaning o‘zida, joriy raqami bilan saqlanadi:

```html
<p>Dalolatnoma ikki tomon tomonidan imzolandi<sup data-footnote="Imzolangan nusxalar arxivda saqlanadi.">1</sup>.</p>
```

Izohlar qayerda chiqadi:

| Joy | Izohlar |
| --- | --- |
| Sahifa ko‘rinishi | Havola turgan varaqning pastida, qisqa chiziq ostida; joylashuv ular uchun joy qoldiradi. |
| Veb ko‘rinish | Barcha izohlar hujjatdan keyin. |
| Sahifa ko‘rinishidan chop etish va HTML eksport | Har bir varaqning pastida, ekrandagidek. |
| Veb ko‘rinishdan chop etish va HTML eksport | Barcha izohlar hujjatdan keyin. |
| Word eksporti | Word’ning o‘z snoskalari, raqamlarini Word qo‘yadi. |

- Izoh — formatsiz oddiy matn, 2000 belgigacha.
- Paragraf varaqlarga bo‘linmaydi, shuning uchun uning izohlari paragraf boshlangan varaqda turadi. Sahifadan baland blok barcha izohlarini birinchi varag‘ida saqlaydi.
- Koddan: `engine.insertFootnote(text)`, `setFootnoteText(element, text)`, `removeFootnote(element)` va `getFootnotes()`.

## Ko‘p darajali raqamlash

Buyruq va nizom kabi rasmiy hujjatlarda bandlar 1., 1.1., 1.1.1. tarzida raqamlanadi. Raqamli ro‘yxat tugmasi yonidagi strelkani bosing va “Ko‘p darajali raqamlash (1.1, 1.2)” ni tanlang; “Oddiy raqamlash (1, 2, 3)” avvalgi holatga qaytaradi. Kursor raqamli ro‘yxatda bo‘lmasa, ro‘yxat yaratiladi.

Bandlarni `Tab` bilan ichkariga suring, `Shift+Tab` bilan tashqariga chiqaring: har bir ichki daraja ota bandning raqamini davom ettiradi.

```html
<ol data-numbering="legal">
  <li><p>Umumiy qoidalar</p>
    <ol>
      <li><p>Ushbu nizom barcha xodimlarga taalluqli.</p></li>
      <li><p>Nizom imzolangan kundan kuchga kiradi.</p></li>
    </ol>
  </li>
  <li><p>Majburiyatlar</p></li>
</ol>
```

Atribut faqat eng tashqi ro‘yxatda turadi. Word eksporti Word o‘zi davom ettiradigan ko‘p darajali raqamlashni yozadi, import esa Word fayllaridagi bunday ro‘yxatlarni taniydi. Koddan: `engine.setListNumbering('legal')` yoki `'default'`.

## Sahifa raqamlash

Asboblar panelidagi kolontitul oynasida matnlar ostida ikkita sozlama bor:

| Sozlama | Maydon | Ta’siri |
| --- | --- | --- |
| “Birinchi sahifada ko‘rsatilmasin” | `differentFirstPage: true` | Birinchi sahifada kolontitul va sahifa raqami chiqmaydi — titul varag‘i va blankalar uchun. |
| “Raqamlash boshlanishi” | `firstPageNumber` | Birinchi sahifaga yoziladigan raqam (0–9999); keyingi sahifalar undan davom etadi. |

Ikkalasi ham `v-model:page` da saqlanadi va standart qiymatda bo‘lsa, yozilmaydi. Sahifa ko‘rinishi, chop etish, HTML va Word eksporti ularga amal qiladi; Word’da ular birinchi sahifa uchun alohida kolontitul (Different first page) sozlamasi va sahifa raqamlashning boshlang‘ich raqamiga aylanadi. `{pages}` baribir barcha varaqlarni sanaydi.

```ts
const page = ref<PageSettings>({
  ...createPageSettings(),
  footer: { left: '', center: '{page}', right: '' },
  differentFirstPage: true,
  firstPageNumber: 0
});
```

Bunday sozlamada titul varag‘ida raqam bo‘lmaydi, keyingi sahifa esa 1 raqamini oladi.

Word’da suv belgisi kolontitul ichida turadi, shuning uchun “Birinchi sahifada ko‘rsatilmasin” yoqilgan hujjatning birinchi sahifasida u yerda suv belgisi ham ko‘rinmaydi.

## Turli yo‘nalishdagi sahifalar

> 0.6.0 versiyada qo‘shilgan: bo‘lim uzilishlari.

Keng jadval yoki diagramma ko‘pincha kitob (portrait) yo‘nalishidagi hujjat ichida albom (landscape) sahifani talab qiladi. Qo‘shish menyusidagi (**+** tugmasi) yoki `/` menyusidagi “Bo‘lim uzilishi: albom sahifalar” bandi kursordan keyingi sahifalarni buradi; “Bo‘lim uzilishi: kitob sahifalar” keyingi sahifalarni qaytaradi. Koddan: `engine.insertSectionBreak('landscape')` yoki `'portrait'`.

Bo‘lim uzilishi sahifa uzilishi kabi yangi sahifa boshlaydi. Undan keyingi sahifalar keyingi bo‘lim uzilishigacha uzilish yo‘nalishini oladi; qog‘oz o‘lchami va hoshiyalar sahifa sozlamalaridagicha qoladi. Yo‘nalishi oldingi sahifalarniki bilan bir xil bo‘lgan uzilish oddiy sahifa uzilishi kabi ishlaydi.

U bo‘sh blok sifatida saqlanadi:

```html
<p>2. Ishlar jadvali quyidagi jadvalda keltirilgan.</p>
<div data-type="section-break" data-orientation="landscape"></div>
<table>…</table>
<div data-type="section-break" data-orientation="portrait"></div>
<h2>3. Yakuniy qoidalar</h2>
```

| Joy | Burilgan sahifalar |
| --- | --- |
| Sahifa ko‘rinishi | Chap tomonga tekislangan turli o‘lchamdagi varaqlar. Burilgan bo‘lim bloklari o‘z varag‘ining matn kengligini oladi; ustun kengliklari aniq berilgan jadval ularni saqlaydi, o‘ng chekinishli paragraf esa o‘ng chekkasini saqlaydi. Uzilish yo‘nalishi yozilgan qo‘sh chiziq bilan chiziladi. |
| Veb ko‘rinish | Yo‘nalish yozilgan uzilish chizig‘i bilan bitta uzluksiz varaq; veb ko‘rinishdan chop etish va HTML eksport sahifalarni burmaydi. |
| Sahifa ko‘rinishidan chop etish va HTML eksport | Burilgan varaqlar nomli `@page` qoidasidan foydalanadi, shuning uchun burilgan qog‘ozga chop etiladi. Nomli sahifalarni qo‘llamaydigan brauzer ularni hujjat yo‘nalishida chop etadi. |
| PDF | Burilgan sahifalar. |
| Word eksporti | Har bir bo‘lim o‘z yo‘nalishiga ega Word bo‘limi bo‘ladi. |
| Word importi | Birinchisidan keyingi har bir bo‘lim bo‘lim uzilishi bilan boshlanadi; [Cheklovlar](#cheklovlar) ga qarang. |

Kolontitul, suv belgisi va sahifa raqamlari burilgan sahifalarda ham davom etadi.

## Mundarija

Qo‘shish menyusidagi (**+** tugmasi) yoki `/` menyusidagi “Mundarija” bandi kursor turgan joyga mundarija qo‘shadi. Unda hujjatda bevosita yozilgan (jadval, ro‘yxat yoki iqtibos ichida bo‘lmagan) 1–3-darajali sarlavhalar va har biri boshlanadigan sahifa ko‘rsatiladi. Sahifa raqamlari uchun sahifa ko‘rinishi kerak; veb ko‘rinishda raqamlar ustuni bo‘sh qoladi.

Mundarija tahrirlarga o‘zi ergashmaydi. Hujjatda mundarija bo‘lsa, o‘sha band “Mundarijani yangilash” deb nomlanadi va kursor qayerda bo‘lishidan qat’i nazar, mundarijani joyida qayta quradi. Template ref’dagi `updateTableOfContents()` ham shuni bajaradi, masalan saqlashdan oldin.

Mundarija oddiy kontent — chegarasiz jadval sifatida saqlanadi:

```html
<table data-type="toc"><tbody>
  <tr><td colspan="2"><p style="text-align: center"><strong>Mundarija</strong></p></td></tr>
  <tr><td><p><strong>1. Umumiy qoidalar</strong></p></td><td><p style="text-align: right">2</p></td></tr>
  <tr><td><p style="margin-left: 24px">1.1. Qo‘llanish sohasi</p></td><td><p style="text-align: right">2</p></td></tr>
</tbody></table>
```

Shuning uchun u boshqa jadvallar kabi chop etiladi, HTML va Word’ga eksport qilinadi va solishtiriladi. Unga qo‘lda yozilgan matn keyingi yangilashda almashtiriladi. `buildTableOfContents` va `readOutline` o‘z kodingizda xuddi shu belgilashni yasaydi.

## Navigatsiya paneli

“Yana” menyusidagi “Navigatsiya paneli” chap tomonda ikki varaqli panel ochadi: **Sarlavhalar** va **Sahifalar**.

- **Sarlavhalar** hujjatdagi barcha sarlavhalarni darajasi bo‘yicha surib ko‘rsatadi. Sahifa ko‘rinishida har bir sarlavha yonida u boshlanadigan sahifa ko‘rsatiladi. Sarlavha bosilsa, hujjat o‘sha joyga aylantiriladi va kursor sarlavha boshiga qo‘yiladi. Sarlavhasiz hujjatda sarlavha uslubini qo‘llash haqida maslahat chiqadi.
- **Sahifalar** har bir sahifaning kichik rasmini raqami bilan ko‘rsatadi; burilgan sahifa burilgan rasm oladi. Rasm bosilsa, hujjat o‘sha sahifaga aylantiriladi. Kichik rasmlar uchun sahifa ko‘rinishi kerak; veb ko‘rinishda varaqda “Sahifalar faqat sahifa ko‘rinishida chiqadi.” degan yozuv chiqadi. (0.6.0 versiyada yangi.)

Ikkala ro‘yxat ham tahrirlardan qisqa pauzadan keyin yangilanadi.
