# Nuxt 3

nuvra Nuxt 3 da qo‘shimcha build sozlamalarisiz ishlaydi: bu oddiy ESM paket, yagona peer dependency esa Vue. Muharrir sahifalarni o‘lchaydi va DOM’ni tahrirlaydi, shuning uchun u brauzerda chizilishi kerak; `fillTemplate` kabi oddiy funksiyalar esa serverda ham ishlaydi.

## O‘rnatish va stillar

```sh
pnpm add nuvra
```

Stillar faylini `nuxt.config.ts` da bir marta ulang:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['nuvra/style.css']
});
```

`build.transpile` ga hech narsa qo‘shish shart emas.

## Muharrirni klientda chizish

`nuvra` ni serverda import qilish xavfsiz, lekin muharrirning o‘zi u yerda chizilmasligi kerak. Uni `ClientOnly` ichiga joylang va `#fallback` slotiga xuddi shu balandlikdagi o‘rinbosar bering, shunda muharrir paydo bo‘lganda sahifa sakramaydi:

```vue
<!-- pages/documents/[id].vue -->
<script setup lang="ts">
import { DocumentEditor } from 'nuvra';

const route = useRoute();
const { data: html } = await useFetch<string>(`/api/documents/${route.params.id}`, { default: () => '' });
</script>

<template>
  <ClientOnly>
    <DocumentEditor v-model="html" title="Shartnoma" />
    <template #fallback>
      <div style="height: 760px">Muharrir yuklanmoqda…</div>
    </template>
  </ClientOnly>
</template>
```

Hujjat server render paytida ham yuklanadi; faqat muharrir brauzerni kutadi.

### Faqat klient komponenti

Muharrir ko‘p sahifalarda ishlatilsa, nomi `.client.vue` bilan tugaydigan faylga kichik o‘ram yozing. Nuxt uni avtomatik import qiladi va faqat brauzerda chizadi. nuvra komponentlari bilan to‘qnashmaydigan nom tanlang:

```vue
<!-- components/NuvraEditor.client.vue -->
<script setup lang="ts">
import { DocumentEditor, type TemplateVariable } from 'nuvra';

defineProps<{ title?: string; variables?: TemplateVariable[] }>();
const html = defineModel<string>({ default: '' });
</script>

<template>
  <DocumentEditor v-model="html" :title="title" :variables="variables" />
</template>
```

```vue
<template>
  <NuvraEditor v-model="html" title="Shartnoma" />
</template>
```

Muharrir metodlari, masalan `print()` yoki `getHTML()`, template ref orqali kerak bo‘lsa, `DocumentEditor` ni to‘g‘ridan-to‘g‘ri `ClientOnly` ichida ishlating: aks holda o‘ram ularni qayta ochib berishi kerak bo‘ladi.

## Interfeys tili

Barcha muharrirlar tilini klient plaginida belgilang. `plugins/` papkasidagi fayllar avtomatik ro‘yxatdan o‘tadi, `.client` qo‘shimchasi esa bu plaginni server bundle’iga kiritmaydi:

```ts
// plugins/nuvra.client.ts
import { ru, setEditorLocale } from 'nuvra';

export default defineNuxtPlugin(() => {
  setEditorLocale(ru);
});
```

`setEditorLocale` reaktiv, shuning uchun til almashtirgich uni keyin yana chaqira oladi. Alohida muharrirning `locale` propi baribir ustun turadi. Batafsil: [Tillar](/docs/translations).

## Server marshrutida shablonni to‘ldirish

`fillTemplate` DOM talab qilmaydi, shuning uchun Nitro marshruti saqlangan shablonni to‘ldira oladi, masalan xatni saqlashdan yoki PDF xizmatiga berishdan oldin:

```ts
// server/api/letters.post.ts
import { fillTemplate, getTemplateVariables } from 'nuvra';

export default defineEventHandler(async event => {
  const { values } = await readBody<{ values: Record<string, string> }>(event);
  const template = await loadTemplate('letter'); // o‘z omboringiz

  const missing = getTemplateVariables(template).filter(name => !values[name]?.trim());
  if (missing.length) {
    throw createError({ statusCode: 422, statusMessage: `Missing: ${missing.join(', ')}` });
  }

  return { html: fillTemplate(template, values, { missing: 'empty' }) };
});
```

Chop etish, `buildDocx` bilan Word eksport va barcha muharrir komponentlari brauzerda qoladi.

## Shuningdek

- [Boshlash](/docs/getting-started)
- [Shablondan xatlar](/docs/recipe-letters)
- [Avtosaqlash](/docs/recipe-autosave)
- [Rasmlarni yuklash](/docs/recipe-image-upload)
- [API](/docs/api)
