# Tillar

Muharrir interfeysi — asboblar paneli, menyular, oynalar, holat paneli va xabarlar — o‘zbek (lotin va kirill), ingliz va rus tillarida tayyor. Tarjimalar paketning ichida, shuning uchun har bir ilova bir xil, tekshirilgan matnlarni ko‘rsatadi.

| Locale | Kod | Til |
| --- | --- | --- |
| `uz` | `'uz'` | O‘zbekcha (standart) |
| `uzCyrl` | `'uz-Cyrl'` | Ўзбекча |
| `en` | `'en'` | English |
| `ru` | `'ru'` | Русский |

Til muharrir hujjatga yozadigan matnlarni ham belgilaydi: imzo bloklari, hujjat shablonlari, so‘z bilan yozilgan summalar va to‘liq sanalar.

## Bitta muharrir

Tilni import qiling va `locale` propiga bering:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, ru } from 'nuvra';

const html = ref('');
</script>

<template>
  <DocumentEditor v-model="html" :locale="ru" />
</template>
```

Til kodi ham ishlaydi: `locale="en"`. `Editor` ham shu propni qabul qiladi.

## Butun ilova

`setEditorLocale` ni bir marta chaqiring, masalan `main.ts` da. O‘z `locale` propi berilmagan barcha muharrirlar shu tilda ishlaydi:

```ts
import { en, setEditorLocale } from 'nuvra';

setEditorLocale(en);
```

Sozlama reaktiv: `setEditorLocale` qayta chaqirilsa (masalan, til almashtirgichdan), sahifadagi muharrirlar darhol yangilanadi.

## Til tanlash

`editorLocales` o‘rnatilgan tillarni nomlari bilan qaytaradi, tanlash ro‘yxati uchun qulay:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, type EditorLocaleCode, editorLocales } from 'nuvra';

const locale = ref<EditorLocaleCode>('uz');
</script>

<template>
  <select v-model="locale">
    <option v-for="item in editorLocales" :key="item.code" :value="item.code">{{ item.name }}</option>
  </select>
  <DocumentEditor :locale="locale" />
</template>
```

## Ustuvorlik

1. Muharrirning `locale` propi.
2. `setEditorLocale` bilan o‘rnatilgan til.
3. O‘zbek tili.

Noma’lum qiymat, masalan `locale="de"`, keyingi bosqichga o‘tadi.
