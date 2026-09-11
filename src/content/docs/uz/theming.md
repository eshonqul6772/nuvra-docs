# Ranglar va mavzu

Muharrir ranglari CSS o‘zgaruvchilaridan olinadi. Ularni dizayningizga moslab o‘zgartiring yoki o‘rnatilgan qorong‘i palitrani yoqing.

## O‘zgaruvchilar qanday ishlaydi

Barcha o‘zgaruvchilar har bir muharrirning ildiz elementi — `.document-editor` da e’lon qilingan. Menyular, popoverlar va suzuvchi panellar shu element ichida chiziladi, shuning uchun ular ham xuddi shu qiymatlardan foydalanadi.

Standart qiymatlar `.document-editor` ning o‘zida e’lon qilingani uchun o‘zgaruvchini `body` kabi ota elementda belgilash natija bermaydi. Uni muharrir elementining o‘zida, `nuvra/style.css` dan keyin yuklanadigan qoida yoki aniqroq selektor bilan qayta belgilang:

```css
.app .document-editor {
  --nuvra-color-primary: #7c3aed;
  --nuvra-color-primary-hover: #8b5cf6;
  --nuvra-color-primary-border: #c4b5fd;
  --nuvra-color-primary-muted: #ddd6fe;
  --nuvra-color-primary-soft: #f5f3ff;
}
```

Faqat bitta muharrirni bezash uchun unga klass bering; klass muharrirning ildiz elementiga qo‘llanadi:

```vue
<template>
  <DocumentEditor v-model="html" class="contract-editor" />
</template>

<style>
.document-editor.contract-editor {
  --nuvra-color-primary: #0f766e;
  --nuvra-color-primary-soft: #f0fdfa;
}
</style>
```

## O‘zgaruvchilar ro‘yxati

| O‘zgaruvchi | Yorug‘ (standart) | Qorong‘i palitra | Qayerda ishlatiladi |
| --- | --- | --- | --- |
| `--nuvra-color-primary` | `#409eff` | o‘zgarmaydi | Faol tugmalar, fokus, asosiy tugmalar |
| `--nuvra-color-primary-hover` | `#79bbff` | `#66b1ff` | Sichqoncha ustidagi asosiy tugmalar |
| `--nuvra-color-primary-border` | `#a0cfff` | `#2a598a` | Fokusdagi muharrir ramkasi, o‘chirilgan asosiy tugmalar |
| `--nuvra-color-primary-muted` | `#c6e2ff` | `#213d5b` | Jadval o‘lchami ko‘rinishi, tugma chegaralari |
| `--nuvra-color-primary-soft` | `#ecf5ff` | `#18222c` | Faol tugma va menyu bandi foni |
| `--nuvra-color-on-primary` | `#fff` | o‘zgarmaydi | Asosiy tugmalardagi matn |
| `--nuvra-color-danger` | `#f56c6c` | o‘zgarmaydi | O‘chirish amallari, belgilar chegarasiga yetilgani |
| `--nuvra-color-danger-soft` | `#fef0f0` | `#2b1d1d` | Sichqoncha ustidagi o‘chirish amallari |
| `--nuvra-text-strong` | `#303133` | `#e5eaf3` | Formalardagi sarlavhalar |
| `--nuvra-text` | `#606266` | `#cfd3dc` | Oddiy matn va ikonkalar |
| `--nuvra-text-muted` | `#909399` | `#a3a6ad` | Yorliqlar, izohlar, holat paneli |
| `--nuvra-text-placeholder` | `#a8abb2` | `#8d9095` | Placeholder, tezkor tugma izohlari |
| `--nuvra-text-disabled` | `#c0c4cc` | `#6c6e72` | O‘chirilgan tugmalar |
| `--nuvra-border` | `#dcdfe6` | `#4c4d4f` | Muharrir ramkasi, kiritish maydonlari |
| `--nuvra-border-hover` | `#c0c4cc` | `#6c6e72` | Sichqoncha ustidagi maydonlar |
| `--nuvra-border-light` | `#e4e7ed` | `#414243` | Popoverlar va suzuvchi panellar |
| `--nuvra-border-lighter` | `#ebeef5` | `#363637` | Ajratuvchi chiziqlar |
| `--nuvra-fill` | `#f5f7fa` | `#262727` | Sichqoncha ustidagi tugmalar, segmentli boshqaruv |
| `--nuvra-bg` | `#fff` | `#141414` | Asboblar paneli, holat paneli, maydonlar |
| `--nuvra-bg-overlay` | `#fff` | `#1d1e1f` | Popoverlar, menyular, qidiruv paneli |
| `--nuvra-shadow` | `0 0 12px rgb(0 0 0 / 12%)` | `0 0 12px rgb(0 0 0 / 72%)` | Popoverlar va suzuvchi panellar |
| `--nuvra-fullscreen-z-index` | `2000` | o‘zgarmaydi | To‘liq ekrandagi muharrirning qatlam tartibi |

Hujjat varag‘ining o‘zi qog‘ozdek doim oq, shuning uchun chop etilgan natija va sahifa ko‘rinishi bir xil ko‘rinadi.

## Qorong‘i mavzu

Qorong‘i palitra muharrirning ota elementlaridan birida, odatda `html` da, `dark` klassi yoki `data-theme="dark"` atributi bo‘lganda qo‘llanadi:

```html
<!-- yoki -->
<html class="dark">
<!-- yoki -->
<html data-theme="dark">
```

```ts
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.classList.toggle('dark', prefersDark);
```

Qorong‘i qiymatlarni ham yorug‘ qiymatlar kabi qayta belgilash mumkin, masalan `.dark .document-editor` selektori bilan. `nuvra/style.css` dan keyin yuklanadigan oddiy `.document-editor` qoidasi o‘zgaruvchini ikkala palitrada ham almashtiradi.

## Element Plus mavzusiga moslash

nuvra Element Plus’ga bog‘liq emas, lekin standart palitrasi unga mos. Ilovangizda Element Plus mavzusi o‘zgartirilgan bo‘lsa, o‘zgaruvchilarni uning o‘zgaruvchilariga bog‘lang:

```css
.document-editor {
  --nuvra-color-primary: var(--el-color-primary);
  --nuvra-color-primary-hover: var(--el-color-primary-light-3);
  --nuvra-color-primary-border: var(--el-color-primary-light-5);
  --nuvra-color-primary-muted: var(--el-color-primary-light-8);
  --nuvra-color-primary-soft: var(--el-color-primary-light-9);
  --nuvra-color-danger: var(--el-color-danger);
  --nuvra-text-strong: var(--el-text-color-primary);
  --nuvra-text: var(--el-text-color-regular);
  --nuvra-text-muted: var(--el-text-color-secondary);
  --nuvra-text-placeholder: var(--el-text-color-placeholder);
  --nuvra-text-disabled: var(--el-text-color-disabled);
  --nuvra-border: var(--el-border-color);
  --nuvra-border-light: var(--el-border-color-light);
  --nuvra-border-lighter: var(--el-border-color-lighter);
  --nuvra-fill: var(--el-fill-color-light);
  --nuvra-bg: var(--el-bg-color);
  --nuvra-bg-overlay: var(--el-bg-color-overlay);
  --nuvra-shadow: var(--el-box-shadow-light);
}
```

## To‘liq ekrandagi qatlam tartibi

To‘liq ekranda muharrir `z-index: var(--nuvra-fullscreen-z-index)` qiymatli fixed element bo‘ladi. Ilovangizdagi boshqa fixed elementlar (masalan, sarlavha yoki bildirishnomalar) uning ustida chiqsa, qiymatni oshiring:

```css
.document-editor {
  --nuvra-fullscreen-z-index: 5000;
}
```

Muharrirdan ochiladigan menyu va popoverlar brauzerning yuqori qatlamida (top layer) ko‘rsatiladi, shuning uchun bu qiymatdan qat’i nazar to‘liq ekrandagi muharrir ustida chiqadi. Batafsil: [Brauzerlarni qo‘llab-quvvatlash](/docs/browser-support).
