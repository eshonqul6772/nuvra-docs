# Shablonlar va imzolar

Xat, buyruq va shartnomalar odatda bir marta shablon sifatida yoziladi, keyin har bir qabul qiluvchi uchun to‘ldiriladi. nuvra buning uchun **shablon o‘zgaruvchilari** va tayyor **imzo bloklarini** taqdim etadi.

## Shablon o‘zgaruvchilari

Shablonda ishlatiladigan o‘zgaruvchilarni `variables` propiga bering. Asboblar panelida ularni qo‘shadigan **{ }** menyusi paydo bo‘ladi, ma’lum o‘zgaruvchining `{{name}}` ko‘rinishini yozish ham uni o‘zgaruvchiga aylantiradi.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, type TemplateVariable } from 'nuvra';

const html = ref('');

const variables: TemplateVariable[] = [
  { name: 'fio', label: 'F.I.Sh.' },
  { name: 'lavozim', label: 'Lavozim' },
  { name: 'xat_raqami', label: 'Xat raqami' },
  { name: 'xat_sanasi', label: 'Xat sanasi' }
];
</script>

<template>
  <DocumentEditor v-model="html" :variables="variables" />
</template>
```

Muharrirda o‘zgaruvchi yorlig‘i yozilgan bitta “chip” bo‘lib ko‘rinadi va bitta belgidek ishlaydi: Backspace va Delete uni butunligicha o‘chiradi, atrofiga qo‘llangan qalin, kursiv, rang yoki shrift o‘lchami keyinchalik qiymatga ham qo‘llanadi.

`Editor` ham shu propni qabul qiladi. `DocumentEditor` ning template ref’i `insertVariable(name)` metodini ham beradi, masalan o‘zgaruvchilar ro‘yxati bo‘lgan o‘z yon panelingiz uchun.

### O‘zgaruvchilar qanday saqlanadi

Saqlangan HTML har bir o‘zgaruvchini ichida oddiy matni bor kichik element sifatida saqlaydi:

```html
<p>Hurmatli <strong><span data-variable="fio">{{fio}}</span></strong>!</p>
```

Nomi `variables` ro‘yxatida bo‘lmagan chip hujjatda qoladi va to‘q sariq rangda ko‘rsatiladi, shuning uchun eskirgan ro‘yxat bilan ochilgan shablon buzilmaydi.

### Shablonni to‘ldirish

`fillTemplate` o‘zgaruvchilarni qiymatlar bilan almashtiradi. Qiymatlar HTML uchun ekranlanadi, shuning uchun foydalanuvchi kiritgan matn belgilash qo‘sha olmaydi; qator uzilishlari `<br>` ga aylanadi.

```ts
import { fillTemplate } from 'nuvra';

const xat = fillTemplate(shablon, {
  fio: 'Aziz Karimov',
  lavozim: 'Direktor',
  xat_raqami: '01-12/345',
  xat_sanasi: '14.09.2026'
});
```

Qiymati berilmagan o‘zgaruvchi standart holatda qoladi, natija hali ham shablon bo‘ladi. Boshqa xatti-harakatni `missing` bilan tanlang:

| `missing` | Natija |
| --- | --- |
| `'keep'` (standart) | O‘zgaruvchi joyida qoladi. |
| `'empty'` | O‘zgaruvchi olib tashlanadi. |
| `'name'` | Oddiy matn sifatida `{{name}}` yoziladi. |

`getTemplateVariables(html)` shablonda ishlatilgan o‘zgaruvchilar ro‘yxatini qaytaradi, masalan ularning qiymatini so‘raydigan formani yasash uchun.

### Serverda to‘ldirish

`fillTemplate` DOM’ga murojaat qilmaydigan oddiy satr funksiyasi, shuning uchun Node’da ham ishlaydi. Boshqa har qanday backend shablonni butun elementni almashtirish orqali to‘ldira oladi:

```java
String result = template.replaceAll(
    "<span[^>]*data-variable=\"fio\"[^>]*>[^<]*</span>",
    Matcher.quoteReplacement(HtmlUtils.htmlEscape(fio))
);
```

## Shablonni forma sifatida to‘ldirish

`DocumentForm` saqlangan shablonni chop etilganda qanday bo‘lsa, shunday ko‘rsatadi, faqat har bir o‘zgaruvchi o‘rnida kiritish maydoni turadi. Boshqa hech narsani tahrirlab bo‘lmaydi, shuning uchun u hujjatni faqat to‘ldiradigan xodimlarga mos keladi, shablonning o‘zi esa `DocumentEditor` da yoziladi.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentForm, type TemplateVariable } from 'nuvra';

const props = defineProps<{ template: string; variables: TemplateVariable[] }>();

const values = ref<Record<string, string>>({ xat_sanasi: '14.09.2026' });
const form = ref<InstanceType<typeof DocumentForm>>();

const submit = async () => {
  if (form.value?.validate().length) return;
  const html = form.value?.getHTML();
  await fetch('/api/letters', { method: 'POST', body: html });
};
</script>

<template>
  <DocumentForm ref="form" v-model="values" :template="props.template" :variables="props.variables" />
  <button type="button" @click="submit">Yuborish</button>
</template>
```

- `v-model` o‘zgaruvchi nomi bo‘yicha qiymatlarni saqlaydi. Bir necha marta ishlatilgan o‘zgaruvchi bir marta yoziladi: uning barcha maydonlari bitta qiymatga ega.
- Bo‘sh maydonda `variables` dagi o‘zgaruvchi yorlig‘i ko‘rinadi. O‘rnatilgan hujjat shablonlarining o‘zgaruvchilari bu ro‘yxatsiz ham `locale` tilidagi yorliq bilan chiqadi.
- Maydonlar o‘zgaruvchi atrofidagi formatni, masalan qalin yoki kattaroq shriftni saqlaydi va matn uzaygan sari kengayadi.
- `validate()` bo‘sh qolgan o‘zgaruvchilar nomlarini qaytaradi, ularning maydonlarini qizil rangda belgilaydi va birinchisiga fokus beradi. Bo‘sh ro‘yxat forma to‘liq to‘ldirilganini bildiradi.
- `getHTML(options?)` `fillTemplate` bilan to‘ldirilgan hujjatni qaytaradi: qiymatlar ekranlanadi, qiymati yo‘q o‘zgaruvchilar bilan nima qilishni `options.missing` belgilaydi.
- `readonly` to‘ldirilgan qiymatlarni o‘zgartirib bo‘lmaydigan qilib ko‘rsatadi, masalan tasdiqlash sahifasida.

## Hujjat shablonlari

Asboblar panelidagi hujjat tugmasi muharrir tilida tayyor hujjatni qo‘shadi: xizmat xati, buyruq, ariza, ma’lumotnoma yoki dalolatnoma. Har biri shunday hujjatlar odatda qanday tuzilsa, shunday joylashtirilgan va `{{org_name}}`, `{{doc_number}}` kabi shablon o‘zgaruvchilaridan foydalanadi, shuning uchun uni darhol `fillTemplate` bilan to‘ldirish mumkin. Bu o‘zgaruvchilar `variables` ro‘yxatida bo‘lmasa ham, ularning chiplari yorliq bilan ko‘rinadi.

Shu shablonlarni koddan ham olish mumkin:

```ts
import { getDocumentTemplate } from 'nuvra';

const { html, variables } = getDocumentTemplate('order', 'uz');
```

## Summalar, sanalar va yozuvlar

**Boshqa elementlar** menyusida rasmiy matnlar uchun uchta yordamchi bor:

- **Summani so‘z bilan yozish** kursordan oldingi sonni yoki belgilangan summani qayta yozadi: `15 000 000 so‘m` → `15 000 000 (o‘n besh million) so‘m`. So‘zlar muharrir tilida yoziladi, tiyinlar raqamda qoladi.
- **Bugungi sana** `14.09.2026` ni, **Bugungi sana (to‘liq)** esa yozma shaklni qo‘shadi: `2026-yil 14-sentabr`, `2026 йил 14 сентябрь`, `14 сентября 2026 г.` yoki `14 September 2026`.

Harf registri menyusi o‘zbekcha matnni lotin va kirill yozuvlari o‘rtasida o‘giradi: belgilangan qismni yoki hech narsa belgilanmagan bo‘lsa, butun hujjatni. Formatlash saqlanadi, o‘zgaruvchilarga tegilmaydi.

Bu yordamchilar o‘z kodingiz uchun ham eksport qilinadi:

```ts
import { formatAmountInWords, formatLongDate, numberToWords, parseAmount, transliterate } from 'nuvra';

numberToWords(2500, 'ru'); // 'две тысячи пятьсот'
formatAmountInWords(1250.5, 'uz'); // '1 250,50 (bir ming ikki yuz ellik)'
parseAmount('1 250,50'); // 1250.5
formatLongDate(new Date(), 'uz-Cyrl'); // '2026 йил 14 сентябрь'
transliterate('O‘zbekiston', 'toCyrillic'); // 'Ўзбекистон'
```

## Imzo bloklari

Asboblar panelidagi ruchka tugmasi muharrir tilida yozilgan imzo blokini qo‘shadi:

| Blok | Tarkibi |
| --- | --- |
| Imzo qatori | Bir qatorda lavozim, imzo chizig‘i va F.I.Sh. |
| TASDIQLAYMAN grifi | O‘ng tomonda TASDIQLAYMAN, lavozim, imzo va F.I.Sh., sana. |
| KELISHILDI grifi | Chap tomonda KELISHILDI sarlavhali xuddi shunday blok. |
| Tomonlarning imzolari | Yonma-yon buyurtmachi va ijrochi: tashkilot, lavozim, imzo va muhr o‘rni. |

Imzo bloki chegarasiz jadvaldir. Tahrirlash paytida sahifada kataklari och uzuq chiziqlar bilan ko‘rsatiladi; chop etish, PDF va Word eksportda chegaralar bo‘lmaydi. Undagi har bir matn oddiy kontent: to‘ldiruvchi matnlarni almashtiring, jadval menyusi bilan qator qo‘shing yoki shablon o‘zgaruvchilarini qo‘ying, masalan imzo chizig‘i yoniga `{{fio}}`.
