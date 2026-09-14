# Boshlash

nuvra — Vue 3 uchun Word uslubidagi hujjat muharriri. Bu sahifa o‘rnatishdan tortib ishlaydigan muharrirgacha bo‘lgan yo‘lni bir necha daqiqada ko‘rsatadi.

## Talablar

- Vue 3.5 yoki undan yangi versiya. Vue — yagona peer dependency, nuvra hech qanday UI kutubxonasini talab qilmaydi.
- Zamonaviy brauzer (Chrome, Edge, Safari yoki Firefox). Batafsil: [Brauzerlarni qo‘llab-quvvatlash](/docs/browser-support).

## O‘rnatish

Paketni o‘zingiz ishlatadigan paket menejeri bilan o‘rnating:

```sh
pnpm add nuvra
# yoki
npm install nuvra
# yoki
yarn add nuvra
```

## Stillarni ulash

Muharrir stillari alohida faylda keladi. Uni bir marta, masalan `main.ts` faylida import qiling:

```ts
import { createApp } from 'vue';
import 'nuvra/style.css';

import App from './App.vue';

createApp(App).mount('#app');
```

## Birinchi hujjat muharriri

`DocumentEditor` — to‘liq muharrir: asboblar paneli, qog‘oz o‘lchami va hoshiyalari bilan sahifa ko‘rinishi, holat paneli, qidirish va almashtirish, chop etish va eksport. Hujjat HTML’ini `v-model` bilan bog‘lang:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor } from 'nuvra';

const html = ref('<p>Salom, <strong>nuvra</strong>!</p>');
</script>

<template>
  <DocumentEditor v-model="html" title="Birinchi hujjatim" />
</template>
```

Standart holatda muharrir balandligi 760 px. `height` orqali son (piksel) yoki istalgan CSS uzunligini bering, masalan balandligi belgilangan konteyner ichida `height="100%"`.

## Formalar uchun matn maydoni

`Editor` — xuddi shu muharrir, lekin yengilroq veb ko‘rinishda. U matn ko‘paygan sari `minHeight` (240 px) va `maxHeight` (600 px) oralig‘ida o‘sadi, shuning uchun forma maydonlari uchun juda qulay:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Editor } from 'nuvra';

const description = ref('');
</script>

<template>
  <Editor v-model="description" placeholder="Rol tavsifini yozing" :max-length="2000" />
</template>
```

Bo‘sh maydonning qiymati `''` bo‘ladi, shuning uchun odatiy “majburiy maydon” tekshiruvi qo‘shimcha shartlarsiz ishlaydi.

## Keyingi qadamlar

- [Foydalanish](/docs/usage) — sahifa sozlamalari, ko‘rinishlar, o‘lchamlar, rasmlar, chop etish va eksport.
- [Tillar](/docs/translations) — interfeysni o‘zbek, ingliz yoki rus tilida ko‘rsatish.
- [Ranglar va mavzu](/docs/theming) — ranglarni o‘zgartirish va qorong‘i mavzuni yoqish.
- [API](/docs/api) — barcha props, hodisalar, metodlar va tiplar.
- [Tezkor tugmalar](/docs/keyboard-shortcuts) — klaviatura buyruqlari va Markdown uslubidagi qoidalar.
