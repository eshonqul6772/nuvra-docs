# Foydalanish

Bu sahifada `DocumentEditor` va `Editor` bilan kundalik ish tushuntiriladi: qiymat, sahifa sozlamalari, ko‘rinishlar, o‘lchamlar, rasmlar, chop etish va eksport. Barcha parametrlar ro‘yxati [API](/docs/api) sahifasida.

## Hujjat qiymati

`v-model` hujjatni HTML ko‘rinishida saqlaydi.

- Bo‘sh hujjat bo‘sh satr `''` sifatida yoziladi.
- Foydalanuvchi yozayotganda qiymat qisqa pauzadan (taxminan 200 ms) keyin yangilanadi, chunki har bir tugma bosilganda butun hujjatni HTML’ga aylantirish qimmatga tushadi. Muharrir fokusni yo‘qotganda va o‘chirilishidan oldin kutilayotgan o‘zgarishlar darhol yoziladi.
- Template ref orqali `getHTML()` kutilayotgan o‘zgarishlarni yozib, joriy HTML’ni qaytaradi, shuning uchun uni saqlashdan oldin chaqirish xavfsiz.
- Qiymat tashqaridan o‘zgartirilsa, hujjat almashtiriladi. HTML avval tozalanadi va faqat muharrir qo‘llaydigan belgilash qoladi.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor } from 'nuvra';

const html = ref('<p>Serverdan yuklangan matn</p>');

const save = () => fetch('/api/documents/1', { method: 'PUT', body: html.value });
</script>

<template>
  <DocumentEditor v-model="html" @blur="save" />
</template>
```

## Sahifa sozlamalari

Qog‘oz o‘lchami, yo‘nalishi va hoshiyalar `v-model:page` bilan bog‘lanadi. `createPageSettings()` standart qiymatlarni qaytaradi: A4, kitob (portrait) yo‘nalishi, oddiy hoshiyalar.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, type PageSettings, createPageSettings } from 'nuvra';

const html = ref('');
const page = ref<PageSettings>(createPageSettings());
</script>

<template>
  <DocumentEditor v-model="html" v-model:page="page" />
</template>
```

Foydalanuvchi sozlamalarni asboblar panelidagi “Sahifa sozlamalari” oynasida o‘zgartiradi. Hoshiyalar millimetrda (aniq qiymat maydonlarida 0–100).

### Qog‘oz o‘lchamlari

| Kalit | Nomi | O‘lcham (kitob, mm) |
| --- | --- | --- |
| `a3` | A3 | 297 × 420 |
| `a4` | A4 | 210 × 297 |
| `a5` | A5 | 148 × 210 |
| `letter` | Letter | 215.9 × 279.4 |
| `legal` | Legal | 215.9 × 355.6 |

### Hoshiya shablonlari

| Shablon | Yuqori | O‘ng | Pastki | Chap |
| --- | --- | --- | --- | --- |
| Oddiy (standart) | 25.4 | 25.4 | 25.4 | 25.4 |
| Tor | 12.7 | 12.7 | 12.7 | 12.7 |
| O‘rtacha | 25.4 | 19.1 | 25.4 | 19.1 |
| Keng | 25.4 | 50.8 | 25.4 | 50.8 |
| Rasmiy hujjat (O‘zDSt 1.14) | 20 | 15 | 20 | 30 |

Chop etish, HTML va Word eksporti ham shu sozlamalardan foydalanadi.

## Kolontitullar

Asboblar panelidagi kolontitul tugmasi yuqori va pastki kolontitulni sozlaydi; har birida chap, markaz va o‘ng qism bor. Matnlar sahifa sozlamalari ichida `header` va `footer` sifatida saqlanadi, ya’ni ular ham `v-model:page` orqali saqlanadi va tiklanadi.

| Token | Natija |
| --- | --- |
| `{page}` | Joriy sahifa raqami |
| `{pages}` | Hujjatdagi sahifalar soni |
| `{date}` | Bugungi sana (kk.oo.yyyy) |
| `{title}` | `title` propidagi hujjat nomi |

- Sahifa ko‘rinishida kolontitullar har bir varaqning hoshiyasida ko‘rinadi, tokenlar esa o‘sha sahifa uchun hisoblanadi. Pastki kolontitul qo‘yilganda muharrirning o‘z sahifa raqami ko‘rsatkichi yashiriladi.
- Chop etish va HTML eksportida hujjat muharrirdagidek varaqlarga bo‘linadi, shuning uchun sahifa raqamlari va sahifa uzilishlari ekrandagi bilan bir xil chiqadi.
- Word eksportida kolontitullar Word’ning o‘z kolontitullariga, `{page}` va `{pages}` esa Word maydonlariga (PAGE va NUMPAGES) aylanadi, shuning uchun hujjat Word’da tahrirlangandan keyin ham raqamlar to‘g‘ri qoladi.
- Veb ko‘rinishda eksport qilinsa, hujjat varaqlarga bo‘linmaydi: kolontitullar chop etishda har sahifada takrorlanadi, lekin `{page}` bo‘sh qoladi.

## Suv belgisi

“Sahifa sozlamalari” oynasidagi “Suv belgisi” bo‘limiga matn yozilsa (masalan `NUSXA` yoki `CHERNOVIK`), u har bir sahifada matn ortida xira ko‘rinadi. Rangi tanlanadi, “Qiya” belgisi esa matnni burchak bo‘ylab joylashtiradi.

- Matn qog‘ozga sig‘adigan qilib avtomatik kattalashtiriladi va 16% shaffoflik bilan chiziladi, shuning uchun o‘qishga xalaqit bermaydi.
- Sozlama sahifa sozlamalari ichida `watermark` sifatida saqlanadi, ya’ni `v-model:page` orqali saqlanadi va tiklanadi.
- Chop etish va HTML eksportida har bir varaqda takrorlanadi. Word eksportida esa Word’ning o‘z suv belgisi formatida (VML shakli sifatida kolontitul ichida) yoziladi.
- Matn o‘chirilsa, suv belgisi sozlamalardan butunlay olib tashlanadi.

## Chizg‘ich

Sahifa ko‘rinishida varaq ustida chizg‘ich turadi: u santimetrlarda o‘lchangan, matn maydonini hoshiyalardan ajratib ko‘rsatadi va beshta markerni sudrashga imkon beradi.

| Marker | Nimani o‘zgartiradi |
| --- | --- |
| Yuqoridagi uchburchak | Paragrafning birinchi qator chekinishi (`text-indent`) |
| Pastdagi chap uchburchak | Paragrafning chap chekinishi (`margin-left`) |
| Pastdagi o‘ng uchburchak | Paragrafning o‘ng chekinishi (`margin-right`) |
| O‘rtadagi chap chiziqcha | Sahifaning chap hoshiyasi |
| O‘rtadagi o‘ng chiziqcha | Sahifaning o‘ng hoshiyasi |

- Qiymatlar millimetrga yaxlitlanadi va sudrash tugagach qo‘llanadi, shuning uchun bitta sudrash bitta bekor qilish qadami bo‘ladi.
- Chekinish markerlari kursor turgan (yoki belgilangan) paragraflarga ta’sir qiladi, hoshiya markerlari esa `v-model:page` dagi hoshiyalarni o‘zgartiradi.
- `:ruler="false"` chizg‘ichni boshidanoq yashiradi; foydalanuvchi uni “Yana” menyusidagi “Chizg‘ich” bandi bilan yoqib-o‘chiradi. Veb ko‘rinishda va forma maydonida chizg‘ich ko‘rsatilmaydi.

## Ko‘rinishlar

Muharrirda ikki ko‘rinish bor, ular holat panelidan almashtiriladi:

- **Sahifa ko‘rinishi** (`'page'`) tanlangan qog‘oz o‘lchami va hoshiyalar bilan alohida varaqlarni, sahifalar hisoblagichini va 30% dan 200% gacha 10% qadamli masshtabni ko‘rsatadi. Tor konteynerlarda foydalanuvchi masshtabni o‘zi tanlamaguncha sahifa avtomatik kichraytiriladi.
- **Veb ko‘rinish** (`'web'`) veb-sahifadagidek bitta uzluksiz varaqni ko‘rsatadi.

`defaultViewMode` birinchi ko‘rsatiladigan ko‘rinishni belgilaydi. `DocumentEditor` sahifa ko‘rinishida ochiladi, `Editor` esa doim veb ko‘rinishda ishlaydi.

```vue
<template>
  <DocumentEditor v-model="html" default-view-mode="web" />
</template>
```

## Formatlash vositalari

Asboblar panelida ofis muharrirlaridagi vositalar bor:

- **Format bo‘yoqchasi** kursor turgan joydagi formatni oladi (shrift, o‘lcham, rang, belgilash, qalin/kursiv, sarlavha turi, tekislash, qator oralig‘i va chekinish), so‘ng uni sichqoncha bilan belgilangan matnga yoki bosilgan paragrafga qo‘llaydi. `Escape` bekor qiladi.
- **Harf registri** (Aa) belgilangan matnni BOSH HARFLAR, kichik harflar, Har So‘z Bosh Harf yoki gap boshi bosh harf ko‘rinishiga o‘tkazadi hamda registrni almashtiradi.
- **Shrift o‘lchami maydoni** ro‘yxatda yo‘q o‘lchamni (1–400 pt) qo‘lda yozishga imkon beradi; yonidagi A↑ va A↓ tugmalari o‘lchamni ro‘yxat bo‘yicha oshiradi yoki kamaytiradi.
- **Paragraf oralig‘i** “Qator oralig‘i” menyusidan qo‘shiladi: paragraf oldidan yoki keyin 12 pt bo‘sh joy. Oraliq hujjat HTML’ida `data-space-before` va `data-space-after` atributlari hamda `margin` sifatida saqlanadi, Word yoki Google Docs’dan ko‘chirilgan paragraflarning oralig‘i ham shu ko‘rinishga o‘tadi.
- **Formatlash belgilari** “Yana” menyusidan yoqiladi va har bir paragraf oxirida ¶ belgisini ko‘rsatadi. Belgilar faqat ekranda chiziladi: hujjat HTML’iga, chop etishga va eksportga tushmaydi.
- **Kontekst menyusi** hujjatda o‘ng tugma bosilganda ochiladi va bosilgan joyga moslashadi: kesish, nusxalash, joylashtirish, havola amallari, jadval qator va ustunlari, rasmni o‘chirish, formatni tozalash, barchasini tanlash.
- **Masshtab** `Ctrl` (macOS’da `⌘`) bilan sichqoncha g‘ildiragini aylantirganda o‘zgaradi.

## O‘lchamlar

| Prop | Standart | Tavsif |
| --- | --- | --- |
| `height` | `760` | Butun muharrir balandligi yoki matn bilan o‘sishi uchun `'auto'`. |
| `minHeight` | `240` | `height` qiymati `'auto'` bo‘lganda eng kichik balandlik. |
| `maxHeight` | `600` | `height` qiymati `'auto'` bo‘lganda eng katta balandlik; uzun hujjatlar aylantiriladi. |
| `canvasPadding` | `50` | Sahifa yoki veb varaq atrofidagi kulrang bo‘shliq. |

Sonlar piksel hisoblanadi; satrlar CSS uzunligi sifatida ishlatiladi, masalan `'100%'` yoki `'50vh'`. `Editor` doim `height: 'auto'` bilan ishlaydi.

Muharrirning ildiz elementi siz bergan boshqa atributlarni ham oladi, masalan `class` va `style`.

## Faqat o‘qish uchun

`disabled` hujjatni faqat o‘qiladigan qiladi va barcha tahrirlash tugmalarini o‘chiradi. Qidirish, sahifa sozlamalari, chop etish va eksport ishlashda davom etadi.

```vue
<template>
  <DocumentEditor :model-value="html" disabled />
</template>
```

## Belgilar chegarasi

`maxLength` belgilar sonini cheklaydi; `0` (standart) — cheklovsiz. Chegaradan oshib ketadigan yozish, qo‘yish va qo‘shish amallari bajarilmaydi, holat panelida esa hisoblagich `soni / chegara` ko‘rinishida chiqadi va chegaraga yetganda ajratib ko‘rsatiladi.

## Placeholder

`placeholder` hujjat bo‘sh bo‘lganda ko‘rinadigan matnni belgilaydi. U berilmasa, muharrir o‘zining `editor.placeholder` yorlig‘ini ko‘rsatadi.

## Rasmlar

Foydalanuvchi rasmni asboblar panelidan (kompyuterdan yuklash yoki veb-manzil), rasm faylini qo‘yish (paste) yoki hujjatga sudrab tashlash orqali qo‘shadi.

Yuklash funksiyasi berilmasa, rasmlar HTML ichiga data URL sifatida joylanadi. Ularni serverda saqlash uchun `uploadImage` bering: u `File` obyektini oladi va rasm manzilini qaytaradi.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, type DocumentImageUploadHandler } from 'nuvra';

const html = ref('');

const uploadImage: DocumentImageUploadHandler = async file => {
  const body = new FormData();
  body.append('file', file);
  const response = await fetch('/api/files', { method: 'POST', body });
  return (await response.json()).url;
};

const onUploadError = (error: unknown) => {
  console.error(error);
};
</script>

<template>
  <DocumentEditor v-model="html" :upload-image="uploadImage" :max-image-size-mb="5" @upload-error="onUploadError" />
</template>
```

- Faqat `image/*` turidagi fayllar qabul qilinadi.
- `maxImageSizeMb` (standart 10 MB) dan katta fayllar rad etiladi.
- Bir nechta rasm ketma-ket qayta ishlanadi, bu vaqtda “yuklanmoqda” belgisi ko‘rinadi.
- Rad etilgan fayl, muvaffaqiyatsiz yuklash yoki funksiya bo‘sh manzil qaytarsa, `uploadError` hodisasi xato bilan chiqariladi; qolgan rasmlar baribir qo‘shiladi. Tekshiruv xatolari tarjima qilingan xabarli `Error` obyektlari.
- Asboblar panelida yoziladigan rasm manzili `http://`, `https://` yoki `/` bilan boshlanishi kerak.

## Template ref metodlari

`DocumentEditor` template ref orqali bir nechta metodni taqdim etadi:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor } from 'nuvra';

const html = ref('');
const editor = ref<InstanceType<typeof DocumentEditor>>();

const save = () => {
  const latest = editor.value?.getHTML();
  // `latest` ni serverga yuboring
};
</script>

<template>
  <DocumentEditor ref="editor" v-model="html" />
  <button type="button" @click="save">Saqlash</button>
  <button type="button" @click="editor?.print()">Chop etish</button>
</template>
```

| A’zo | Tavsif |
| --- | --- |
| `focus()` | Klaviatura fokusini hujjatga o‘tkazadi. |
| `getHTML()` | Kutilayotgan o‘zgarishlarni modelga yozadi va hujjat HTML’ini qaytaradi. |
| `print()` | Hujjat uchun brauzerning chop etish oynasini ochadi. |
| `exportHtml()` | Hujjatni mustaqil HTML sahifa sifatida yuklab beradi. |
| `exportWord()` | Hujjatni Word bilan mos `.doc` fayl sifatida yuklab beradi. |
| `engine` | Ichki tahrirlash dvigateli (muharrir yuklanmaguncha `null`), murakkab integratsiyalar uchun. |

`Editor` bu metodlarni taqdim etmaydi.

## Chop etish va eksport

Chop etish, HTML va Word eksporti asboblar panelidagi “Yana” menyusida ham bor; `Ctrl+P` chop etadi.

- **Chop etish** hujjatni sahifa sozlamalaridagi o‘lcham va hoshiyalar bilan yashirin freymda chizadi, rasmlar yuklanishini kutadi va brauzerning chop etish oynasini ochadi. PDF olish uchun u yerda “PDF sifatida saqlash”ni tanlang.
- **HTML eksport** hujjat stillari va sahifa o‘lchami bilan mustaqil HTML sahifani yuklab beradi.
- **Word eksport** Word “chop etish” ko‘rinishida ochadigan `.doc` faylni yuklab beradi; sahifa uzilishlari Word sahifa uzilishlariga aylanadi.

`title` prop chop etish sarlavhasi va fayl nomi sifatida ishlatiladi. U berilmasa, `editor.document` yorlig‘i olinadi. Fayl nomida ruxsat etilmagan belgilar almashtiriladi.

## HTML kod

“Yana” menyusi HTML kod ko‘rinishiga ham o‘tkazadi. Foydalanuvchi undan chiqqanda tahrirlangan HTML tozalanadi va hujjatga bitta bekor qilinadigan qadam sifatida qo‘llanadi.

## To‘liq ekran

Holat panelidagi tugma va “Yana” menyusi to‘liq ekranni yoqadi yoki o‘chiradi; `Escape` undan chiqaradi. Muharrir butun oynani egallaydi va sahifa aylantirilishi to‘xtatiladi. Dialog ichida (native `dialog` elementi yoki `role="dialog"` bo‘lgan element) muharrir o‘sha dialog ichida qoladi, shu sababli dialogning fokus boshqaruvi ishlashda davom etadi. Qatlam tartibi `--nuvra-fullscreen-z-index` o‘zgaruvchisi bilan belgilanadi, qarang: [Ranglar va mavzu](/docs/theming).

## Qo‘yilgan kontent

Word, Google Docs yoki veb-sahifalardan qo‘yilgan kontent tozalanadi: qo‘llanmaydigan elementlar, atributlar va xavfli havolalar olib tashlanadi, faqat muharrir qo‘llaydigan belgilash qoladi. Kod bloki ichiga faqat oddiy matn qo‘yiladi. Belgilangan matn ustiga bitta veb-manzil qo‘yilsa, belgilangan matn havolaga aylanadi.
