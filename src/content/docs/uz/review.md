# Izohlar va solishtirish

Hujjatni kamdan-kam hollarda bir kishi yozadi. nuvra’da tekshiruvchilar matnning qismlariga **izoh** qoldira oladi, tahrirlar qabul yoki rad etiladigan **kuzatilgan o‘zgarishlar** sifatida yoziladi, hujjatning ikki **versiyasi** orasidagi farqni esa alohida komponent ko‘rsatadi.

## Izohlar

### Izohlarni yoqish

`v-model:comments` ga ro‘yxat bog‘lang. Izoh vositalari faqat shu bog‘lash bor paytda ko‘rinadi, usiz muharrir avvalgidek qoladi. `author` — yangi izohlar, javoblar va kuzatilgan o‘zgarishlarga yoziladigan muallif ismi.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, type DocumentComment } from 'nuvra';

const html = ref('');
const comments = ref<DocumentComment[]>([]);
</script>

<template>
  <DocumentEditor v-model="html" v-model:comments="comments" author="Aziz Karimov" />
</template>
```

Bo‘sh massivdan boshlang: `undefined` bo‘lsa, vositalar yashirin qoladi.

### Izohlar bilan ishlash

Asboblar panelining o‘ng tomonida ikkita tugma paydo bo‘ladi:

- **Izoh qo‘shish** belgilangan matnga izoh bog‘laydi va izoh formasini ochadi. Buning uchun matn belgilangan bo‘lishi kerak; tezkor tugmasi `Ctrl+Alt+M`. `Ctrl+Enter` izohni saqlaydi, `Escape` yoki **Bekor qilish** esa izohni langari bilan birga olib tashlaydi.
- **Izohlar** barcha izohlar matndagi tartibda ko‘rinadigan panelni ochadi.

Panelda:

| Amal | Natija |
| --- | --- |
| Izohni bosish | Uning matnini hujjatda belgilaydi va o‘sha joyga aylantiradi. |
| **Javob** | Muhokamaga javob qo‘shadi. |
| **Hal qilindi** / **Qayta ochish** | Muhokamani yopadi yoki qayta ochadi. Hal qilingan izohning langari qoladi, lekin matni endi ajratib ko‘rsatilmaydi. |
| O‘chirish (savat tugmasi) | Izohni langari bilan olib tashlaydi; matnning o‘zi qoladi. |

Kursor izohli matnga qo‘yilsa, paneldagi o‘sha izoh ajratib ko‘rsatiladi. Izoh qoldirilgan matn o‘chirilsa, izoh ro‘yxatda “Izoh qoldirilgan matn o‘chirilgan” belgisi bilan qoladi; bekor qilish matnni ham, bog‘lanishni ham qaytaradi.

`disabled` muharrirda izohlarni o‘qish mumkin, lekin qo‘shib ham, o‘zgartirib ham bo‘lmaydi.

### Izohlar qanday saqlanadi

Hujjat HTML’ida faqat langarlar saqlanadi:

```html
<p>Ijrochi ishni <span data-comment="cmfz3k1a9x2b7q">30 kun ichida</span> topshiradi.</p>
```

Izohlarning o‘zi ro‘yxatingizdagi oddiy ma’lumot:

```json
[
  {
    "id": "cmfz3k1a9x2b7q",
    "text": "Ish kunlari nazarda tutilganmi?",
    "author": "Aziz Karimov",
    "createdAt": "2026-09-14T09:30:00.000Z",
    "resolved": false,
    "replies": [
      { "id": "cmfz3m8d0p1k2c", "text": "Ha, 30 ish kuni.", "author": "Dilnoza Rahimova", "createdAt": "2026-09-14T10:05:00.000Z" }
    ]
  }
]
```

Ajratib ko‘rsatish faqat muharrir ichida chiziladi. Chop etish va HTML eksportida matn usiz chiqadi, Word eksporti esa matnni izohlarsiz yozadi.

### Backendga saqlash

Izohlar ro‘yxatini hujjat bilan yonma-yon saqlang va ikkalasini birga yuklang:

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { DocumentEditor, type DocumentComment, type PageSettings, createPageSettings } from 'nuvra';

interface StoredDocument {
  html: string;
  page: PageSettings;
  comments: DocumentComment[];
}

const html = ref('');
const page = ref<PageSettings>(createPageSettings());
const comments = ref<DocumentComment[]>([]);
const editor = ref<InstanceType<typeof DocumentEditor>>();

onMounted(async () => {
  const response = await fetch('/api/documents/42');
  const stored: StoredDocument = await response.json();
  html.value = stored.html;
  page.value = stored.page;
  comments.value = stored.comments ?? [];
});

const save = async () => {
  const body: StoredDocument = {
    html: editor.value?.getHTML() ?? html.value,
    page: page.value,
    comments: comments.value
  };
  await fetch('/api/documents/42', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
};
</script>

<template>
  <DocumentEditor
    ref="editor"
    v-model="html"
    v-model:page="page"
    v-model:comments="comments"
    author="Aziz Karimov"
  />
  <button type="button" @click="save">Saqlash</button>
</template>
```

Serverda izohlar hujjatlar jadvalidagi JSON ustuniga yoki hujjat va izoh `id` si bo‘yicha alohida jadvalga joylashadi.

- `getHTML()` saqlashdan oldin so‘nggi o‘zgarishlarni yozadi, shuning uchun HTML’dagi langarlar ro‘yxat bilan mos keladi.
- Ro‘yxat har bir qo‘shish, javob, hal qilish va o‘chirishda o‘zgaradi. Uni hujjat bilan birga saqlang yoki `watch(comments, save, { deep: true })` bilan kuzating.
- Matni o‘chirilgan izohlar avtomatik o‘chirilmaydi, chunki bekor qilish matnni qaytarishi mumkin. Hujjat yakunlanganda ularni olib tashlash uchun faqat HTML’da hali bor identifikatorlarni qoldiring:

```ts
const anchored = new Set(Array.from(html.matchAll(/data-comment="([\w-]+)"/g), match => match[1]));
const kept = comments.filter(comment => anchored.has(comment.id));
```

O‘z kodingiz qo‘shadigan izohlar uchun `createCommentId()` shu formatdagi identifikator yaratadi.

## O‘zgarishlarni kuzatish

### Kuzatishni yoqish

`v-model:trackChanges` ni bog‘lang yoki foydalanuvchi asboblar panelidagi “O‘zgarishlarni kuzatish” tugmasini bossin. Kuzatish yoqilganda yozilgan matn qo‘shilgan deb belgilanadi, o‘chirilgan matn esa kimdir o‘zgarishni qabul yoki rad etmaguncha hujjatda o‘chirilgan belgisi bilan qoladi. Har bir o‘zgarishga `author` yoziladi.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor } from 'nuvra';

const html = ref('');
const trackChanges = ref(true);
</script>

<template>
  <DocumentEditor v-model="html" v-model:track-changes="trackChanges" author="Aziz Karimov" />
</template>
```

Standart holatda kuzatish o‘chiq. Muharrir `disabled` bo‘lsa, “O‘zgarishlarni kuzatish” tugmasi o‘chirilgan.

### O‘zgarishlar qanday saqlanadi

O‘zgarishlar hujjat HTML’ining bir qismi, shuning uchun ularni `v-model` saqlaydi, alohida hech narsa saqlash shart emas:

```html
<p>Ijrochi ishni
  <del data-change="tmfz3k1a9x2b" data-author="Aziz Karimov" data-time="2026-09-14T09:30:00Z">30</del><ins data-change="tmfz3k1a9x2b" data-author="Aziz Karimov" data-time="2026-09-14T09:30:00Z">45</ins>
  kun ichida topshiradi.</p>
```

- Qo‘shilgan matn yashil rangda tagiga chizilgan, o‘chirilgani qizil rangda ustidan chizilgan holda ko‘rinadi — muharrirda, chop etishda va HTML eksportida.
- Kursor joyidan siljimaguncha yozilgan matn bitta o‘zgarishga qo‘shilib boradi: yozilgan so‘z har bir harf uchun alohida emas, bitta o‘zgarish bo‘ladi.
- O‘chirilgan matn HTML’da qoladi. Hujjatni yakuniy sifatida ishlatishdan oldin o‘zgarishlarni qabul yoki rad eting.
- `data-change` atributisiz qo‘yilgan `<ins>` va `<del>` oddiy tagiga va ustidan chizish formatiga aylanadi.

### O‘zgarishlarni ko‘rib chiqish

“O‘zgarishlar” tugmasi hujjatdagi barcha o‘zgarishlar tartib bilan ko‘rinadigan panelni ochadi: matn qo‘shilgani yoki o‘chirilgani, muallif, vaqt va matnning o‘zi.

| Amal | Natija |
| --- | --- |
| O‘zgarishni bosish | Uning matnini hujjatda belgilaydi va o‘sha joyga aylantiradi. |
| **Qabul qilish** | Qo‘shilgan matnni oddiy matnga aylantiradi yoki o‘chirilgan matnni butunlay olib tashlaydi. |
| **Rad etish** | Qo‘shilgan matnni olib tashlaydi yoki o‘chirilgan matnni qaytaradi. |
| **Hammasini qabul qilish** / **Hammasini rad etish** | Hujjatdagi barcha o‘zgarishlar uchun xuddi shuni bajaradi. |

Har bir qabul yoki rad etish bitta bekor qilinadigan qadam bo‘ladi. `disabled` muharrirda o‘zgarishlarni ko‘rib chiqish mumkin, lekin qabul ham, rad ham etib bo‘lmaydi.

### Koddan

Template ref’dagi dvigatel o‘zgarishlarni o‘qiydi va hal qiladi, masalan e’lon qilishdan oldin hammasini qabul qilish uchun:

```ts
const editor = ref<InstanceType<typeof DocumentEditor>>();

const publish = async () => {
  const engine = editor.value?.engine;
  if (!engine) return;
  const changes = engine.getChanges(); // TrackedChange[]: id, type, author, time, text
  if (changes.length && !confirm(`${changes.length} ta o‘zgarish qabul qilinsinmi?`)) return;
  engine.resolveChanges(true);
  await fetch('/api/documents/42/publish', { method: 'POST', body: editor.value?.getHTML() });
};
```

`resolveChanges(accept, id)` bitta o‘zgarishni hal qiladi, `selectChange(id)` esa uni hujjatda ko‘rsatadi.

### Nimalar kuzatiladi

| Kuzatiladi | Kuzatilmaydi |
| --- | --- |
| Yozish, kiritish usullari (IME) bilan ham | Format: qalin, ranglar, shriftlar, tekislash |
| Belgi, so‘z va qatorlarni Backspace va Delete bilan o‘chirish | Blok o‘zgarishlari: sarlavhalar, ro‘yxatlar, jadvallar, sahifa uzilishlari |
| Belgilangan qismni o‘chirish yoki almashtirish | Chekkada Backspace yoki Delete bilan ikki paragrafni birlashtirish |
| Kesish, qo‘yish, sudrab tashlash | Enter |
| Matn yoki kontent qo‘shadigan buyruqlar kiritgan matn: sanalar, imzo bloklari, hujjat shablonlari | Qidirish va almashtirish, snoskalar va shablon o‘zgaruvchilari |

Xuddi shu muallif kuzatish paytida qo‘shgan matnni o‘chirsa, u Word’dagidek butunlay o‘chadi, Backspace esa o‘chirilgan deb belgilangan matndan hatlab o‘tadi.

### Word bilan almashish

Word eksporti kuzatilgan o‘zgarishlarni muallif va vaqti bilan Word tuzatishlari sifatida yozadi, Word faylini ochganda esa Word tuzatishlari yana kuzatilgan o‘zgarishlarga aylanadi. Hujjatni ko‘rib chiqish uchun Word’ga yuborib, o‘zgarishlari ochiq holda qaytarib olish mumkin. Faqat matn qo‘shish va o‘chirish saqlanadi: Word ko‘chirilgan deb belgilagan matn eski joyida o‘chirish, yangi joyida qo‘shish bo‘lib keladi, Word’da yozilgan format tuzatishi esa yangi format sifatida, tuzatishsiz keladi.

## Versiyalarni solishtirish

`DocumentCompare` hujjatning ikki versiyasi orasidagi farqni bitta varaqda ko‘rsatadi: yangi versiyada qo‘shilgan so‘zlar yashil rangda tagiga chizilgan, o‘chirilganlari qizil rangda ustidan chizilgan. Tepada “Qo‘shilgan so‘zlar: 12” va “O‘chirilgan so‘zlar: 3” kabi hisob, farq bo‘lmasa “Versiyalar bir xil” yozuvi chiqadi.

```vue
<script setup lang="ts">
import { DocumentCompare } from 'nuvra';

defineProps<{ previous: string; current: string }>();
</script>

<template>
  <DocumentCompare :before="previous" :after="current" :height="600" />
</template>
```

Har bir saqlangan versiyaning HTML’ini serveringizda saqlang, masalan har tasdiqlashda, va ulardan ikkitasini komponentga bering. Komponent faqat o‘qish uchun.

### Versiyalar qanday solishtiriladi

| O‘zgarish | Qanday ko‘rsatiladi |
| --- | --- |
| O‘zgarmagan blok | Formati bilan, o‘z holicha. |
| Matni o‘zgargan paragraf, sarlavha yoki kod bloki | So‘zma-so‘z solishtiriladi; o‘zgargan so‘zlar belgilanadi. |
| Qo‘shilgan yoki o‘chirilgan blok | Butun blok, yonida yashil yoki qizil chiziq bilan. |
| O‘zgargan ro‘yxat, jadval, iqtibos yoki rasm | Eski blok o‘chirilgan, yangisi qo‘shilgan sifatida. |

- O‘zgargan paragraf turi va tekislanishini saqlaydi, lekin satr ichidagi formati (qalin, ranglar, havolalar) ko‘rsatilmaydi.
- Faqat format o‘zgargan bo‘lsa, hech bir so‘z belgilanmaydi va hisobga kirmaydi.
- Sarlavhaga aylangan paragraf yoki aksincha — o‘chirilgan va qo‘shilgan blok sifatida ko‘rsatiladi.

### O‘z ko‘rinishingiz

`compareDocuments(before, after)` o‘z sahifangiz uchun xuddi shu natijani qaytaradi: belgilangan `html` hamda `insertions` va `deletions` soni. So‘zlar `<ins class="doc-diff-ins">` va `<del class="doc-diff-del">` bilan belgilanadi, butun bloklar `<div class="doc-diff-block doc-diff-block--ins">` yoki `doc-diff-block--del` ichiga olinadi. HTML tozalangan bloklar va ekranlangan matndan yasaladi. Funksiya DOM talab qiladi, shuning uchun brauzerda ishlaydi.
