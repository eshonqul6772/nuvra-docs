# Shablondan xatlar

Ommaviy xatlar, bir turkum bildirishnomalar yoki ma’lumotnomalar — bu bitta shablonning ko‘p marta to‘ldirilishi. Shablon bir marta `DocumentEditor` da yoziladi va HTML sifatida saqlanadi; bu retseptda u serverda har bir qabul qiluvchi uchun to‘ldiriladi, brauzerda barcha xatlar birdaniga chop etiladi, bitta xat esa forma orqali to‘ldiriladi.

## Boshlang‘ich shablon

Muharrir saqlagan va shablon o‘zgaruvchilari bor istalgan hujjat mos keladi. O‘rnatilgan xizmat xati so‘ralgan tilda tayyor boshlang‘ich nuqta bo‘ladi:

```ts
import { getDocumentTemplate } from 'nuvra';

const { html, variables } = getDocumentTemplate('letter', 'uz');
// variables: org_name, org_address, doc_date, doc_number, recipient,
// subject, signer_position, signer_name, executor
```

`html` ni shablon sifatida saqlang yoki avval xat matnini yozish uchun uni `DocumentEditor` ga yuklang. O‘zgaruvchilar qanday saqlanishi haqida: [Shablonlar va imzolar](/docs/templates).

## Serverda

`fillTemplate` va `getTemplateVariables` oddiy satr funksiyalari, shuning uchun xatlarni Node skripti yarata oladi. `nuvra` kirish fayli `vue` ni (peer dependency) import qiladi, shuning uchun `vue` ni ham yoniga o‘rnating; import uchun DOM ham, CSS yuklovchisi ham kerak emas.

```js
// letters.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fillTemplate, getTemplateVariables } from 'nuvra';

const template = await readFile('templates/letter.html', 'utf8');

const common = {
  org_name: '“Namuna” MChJ',
  org_address: 'Toshkent sh., Mustaqillik ko‘chasi, 12-uy',
  doc_date: '14.09.2026',
  subject: 'Yillik yig‘ilish haqida',
  signer_position: 'Direktor',
  signer_name: 'A. Karimov',
  executor: 'N. Rashidova'
};

const recipients = [
  { doc_number: '01-12/345', recipient: 'Aziz Karimovga' },
  { doc_number: '01-12/346', recipient: 'Dilnoza Yusupovaga' }
];

// Birortasini yozishdan oldin barcha xatlarni tekshiramiz.
const names = getTemplateVariables(template);
const problems = recipients.flatMap((person, index) => {
  const values = { ...common, ...person };
  return names.filter(name => !String(values[name] ?? '').trim()).map(name => `#${index + 1} ${name}`);
});
if (problems.length) throw new Error(`Qiymatlar yetishmaydi: ${problems.join(', ')}`);

await mkdir('out', { recursive: true });

for (const [index, person] of recipients.entries()) {
  const body = fillTemplate(template, { ...common, ...person }, { missing: 'empty' });
  const page = `<!doctype html><html><head><meta charset="utf-8"><title>Xat</title></head><body>${body}</body></html>`;
  await writeFile(`out/letter-${index + 1}.html`, page);
}
```

- Oldindan tekshiring: yarmi jo‘natilgan xatlarni tuzatish ishlamay qolgan skriptdan qiyinroq.
- `missing: 'empty'` sug‘urta vazifasini bajaradi: shablonga keyinroq qo‘shilgan o‘zgaruvchi qog‘ozga chip bo‘lib chiqmaydi.
- `fillTemplate` qiymatlarni HTML uchun ekranlaydi, shuning uchun `Aka & Uka` kabi nomlar xavfsiz.
- Fayl yozish o‘rniga `body` ni pochta yoki PDF xizmatingizga bering. Yuqoridagi oddiy sahifada muharrir stillari yo‘q; natija muharrirdagi sahifa ko‘rinishiga mos bo‘lishi kerak bo‘lsa, quyidagi brauzer usulidan foydalaning.

## Brauzerda: barcha xatlar bitta chop etishda

Muharrir sahifa uzilishini `data-type="page-break"` atributli bo‘sh `div` sifatida saqlaydi. To‘ldirilgan xatlarni u bilan birlashtirsangiz, har bir xat alohida varaqda turgan bitta hujjat hosil bo‘ladi, `DocumentEditor` esa uni sahifa sozlamalari bilan chop etadi:

```vue
<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { DocumentEditor, fillTemplate } from 'nuvra';

const props = defineProps<{ template: string; recipients: Record<string, string>[] }>();

const PAGE_BREAK = '<div data-type="page-break" class="doc-page-break"></div>';

const html = ref('');
const editor = ref<InstanceType<typeof DocumentEditor>>();

const printAll = async () => {
  html.value = props.recipients
    .map(values => fillTemplate(props.template, values, { missing: 'empty' }))
    .join(PAGE_BREAK);
  await nextTick();
  await editor.value?.print();
};
</script>

<template>
  <button type="button" @click="printAll">Barcha xatlarni chop etish</button>
  <DocumentEditor ref="editor" v-model="html" title="Xatlar" disabled />
</template>
```

`disabled` yaratilgan hujjatni faqat o‘qish uchun qoldiradi. Xuddi shu birlashtirilgan HTML’dan `buildDocx` bilan bitta Word fayl ham yasash mumkin, u ham brauzerda ishlaydi:

```ts
import { buildDocx, createPageSettings } from 'nuvra';

const blob = await buildDocx({ html: html.value, title: 'Xatlar', page: createPageSettings() });
await fetch('/api/letters/docx', { method: 'PUT', body: blob });
```

## Bitta xat forma sifatida

Xodim bitta xatni to‘ldirganda `DocumentForm` shablonni chop etilganda qanday bo‘lsa, shunday ko‘rsatadi, har bir o‘zgaruvchi o‘rnida esa kiritish maydoni turadi:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentForm, getDocumentTemplate } from 'nuvra';

const { html: template, variables } = getDocumentTemplate('letter', 'uz');

const values = ref<Record<string, string>>({ doc_date: '14.09.2026' });
const form = ref<InstanceType<typeof DocumentForm>>();

const submit = async () => {
  if (form.value?.validate().length) return;
  const html = form.value?.getHTML({ missing: 'empty' });
  await fetch('/api/letters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, values: values.value })
  });
};
</script>

<template>
  <DocumentForm ref="form" v-model="values" :template="template" :variables="variables" locale="uz" />
  <button type="button" @click="submit">Yuborish</button>
</template>
```

- `validate()` bo‘sh o‘zgaruvchilar nomlarini qaytaradi, ularning maydonlarini belgilaydi va birinchisiga fokus beradi.
- HTML bilan birga `values` ni ham yuborsangiz, server o‘sha shablonni qayta to‘ldira oladi yoki ma’lumotlarni alohida saqlaydi.

## Shuningdek

- [Shablonlar va imzolar](/docs/templates)
- [Formalar va tekshiruv](/docs/recipe-forms)
- [Avtosaqlash](/docs/recipe-autosave)
- [API](/docs/api)
