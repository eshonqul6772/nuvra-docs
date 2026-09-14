# Word fayllari va katta hujjatlar

Bu sahifada Word fayllarini ochish va saqlash hamda katta hujjatlar uchun vositalar tushuntiriladi: snoskalar, ko‘p darajali raqamlash, sahifa raqamlash sozlamalari, mundarija va navigatsiya paneli.

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
- sahifa uzilishlari va gorizontal chiziqlar;
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

“Yana” menyusidagi “Word faylini ochish (.docx)” bandi fayl tanlatadi va hujjatni uning mazmuni bilan almashtiradi. Qog‘oz o‘lchami, yo‘nalishi, hoshiyalar, kolontitul matnlari va sahifa raqamlash ham fayldan olinadi; joriy suv belgisi saqlanib qoladi. Mazmun almashtirilishi bitta bekor qilinadigan qadam bo‘ladi. Muharrir `disabled` bo‘lsa, band o‘chirilgan.

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
| Bir nechta bo‘lim (section) | Hujjat bitta sahifa sozlamasini oladi — oxirgi bo‘limnikini. |
| Birinchi sahifa uchun alohida kolontitul | Sozlama saqlanadi, lekin birinchi sahifa kolontitulining mazmuni import qilinmaydi. |
| Kolontitullar | Faqat matni chap, markaz va o‘ng qismlarga bo‘lib olinadi; format va rasmlar tushib qoladi. |
| Suv belgisi, matn maydonlari, shakllar | Import qilinmaydi. |
| Maydonlar (fields) | Kolontituldagi PAGE va NUMPAGES `{page}` va `{pages}` ga aylanadi; boshqa maydonlarning ko‘rsatgan matni qoladi. |

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

“Yana” menyusidagi “Navigatsiya paneli” chap tomonda hujjatdagi barcha sarlavhalar darajasi bo‘yicha surilgan panelni ochadi. Sahifa ko‘rinishida har bir sarlavha yonida u boshlanadigan sahifa ko‘rsatiladi. Sarlavha bosilsa, hujjat o‘sha joyga aylantiriladi va kursor sarlavha boshiga qo‘yiladi. Ro‘yxat tahrirlardan qisqa pauzadan keyin yangilanadi; sarlavhasiz hujjatda sarlavha uslubini qo‘llash haqida maslahat chiqadi.
