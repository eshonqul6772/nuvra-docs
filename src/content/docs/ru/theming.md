# Оформление

Цвета редактора задаются пользовательскими свойствами CSS. Переопределите их под свой дизайн или включите встроенную тёмную палитру.

## Как работают переменные

Все переменные объявлены на элементе `.document-editor` — корневом элементе каждого редактора. Меню, всплывающие окна и плавающие панели инструментов отрисовываются внутри этого элемента, поэтому используют те же значения.

Значения по умолчанию имеют нулевую специфичность (начиная с nuvra 0.2.1 они объявляются через `:where()`), поэтому любое правило для `.document-editor` переопределяет их независимо от порядка загрузки таблиц стилей. Задавайте переменные на самом элементе редактора: значения на предке, например на `body`, не применятся, потому что редактор объявляет собственные.

```css
.document-editor {
  --nuvra-color-primary: #7c3aed;
  --nuvra-color-primary-hover: #8b5cf6;
  --nuvra-color-primary-border: #c4b5fd;
  --nuvra-color-primary-muted: #ddd6fe;
  --nuvra-color-primary-soft: #f5f3ff;
}
```

Чтобы оформить отдельный редактор, задайте ему класс — он применяется к корневому элементу редактора:

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

## Переменные

| Переменная | Светлая палитра по умолчанию | Тёмная палитра | Где используется |
| --- | --- | --- | --- |
| `--nuvra-color-primary` | `#409eff` | то же | Активные кнопки, фокус, основные кнопки |
| `--nuvra-color-primary-hover` | `#79bbff` | `#66b1ff` | Основные кнопки при наведении |
| `--nuvra-color-primary-border` | `#a0cfff` | `#2a598a` | Рамка редактора в фокусе, неактивные основные кнопки |
| `--nuvra-color-primary-muted` | `#c6e2ff` | `#213d5b` | Предпросмотр размера таблицы, границы кнопок при наведении |
| `--nuvra-color-primary-soft` | `#ecf5ff` | `#18222c` | Фон активных кнопок и пунктов меню |
| `--nuvra-color-on-primary` | `#fff` | то же | Текст на основных кнопках |
| `--nuvra-color-danger` | `#f56c6c` | то же | Опасные действия, достигнутый лимит символов |
| `--nuvra-color-danger-soft` | `#fef0f0` | `#2b1d1d` | Опасные действия при наведении |
| `--nuvra-text-strong` | `#303133` | `#e5eaf3` | Заголовки в формах |
| `--nuvra-text` | `#606266` | `#cfd3dc` | Обычный текст и значки |
| `--nuvra-text-muted` | `#909399` | `#a3a6ad` | Метки, подписи, строка состояния |
| `--nuvra-text-placeholder` | `#a8abb2` | `#8d9095` | Плейсхолдеры, подсказки сочетаний клавиш |
| `--nuvra-text-disabled` | `#c0c4cc` | `#6c6e72` | Неактивные кнопки |
| `--nuvra-border` | `#dcdfe6` | `#4c4d4f` | Рамка редактора, поля ввода |
| `--nuvra-border-hover` | `#c0c4cc` | `#6c6e72` | Поля ввода при наведении |
| `--nuvra-border-light` | `#e4e7ed` | `#414243` | Всплывающие окна и плавающие панели |
| `--nuvra-border-lighter` | `#ebeef5` | `#363637` | Разделители |
| `--nuvra-fill` | `#f5f7fa` | `#262727` | Кнопки при наведении, сегментированные переключатели |
| `--nuvra-bg` | `#fff` | `#141414` | Панель инструментов, строка состояния, поля ввода |
| `--nuvra-bg-overlay` | `#fff` | `#1d1e1f` | Всплывающие окна, меню, панель поиска |
| `--nuvra-shadow` | `0 0 12px rgb(0 0 0 / 12%)` | `0 0 12px rgb(0 0 0 / 72%)` | Всплывающие окна и плавающие панели |
| `--nuvra-fullscreen-z-index` | `2000` | то же | Порядок наложения редактора в полноэкранном режиме |

Сам лист документа всегда белый, как бумага, поэтому печатный результат и страничный режим выглядят одинаково.

## Тёмная тема

Тёмная палитра применяется, когда у предка редактора, обычно у `html`, есть класс `dark` или атрибут `data-theme="dark"`:

```html
<!-- либо -->
<html class="dark">
<!-- либо -->
<html data-theme="dark">
```

```ts
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.classList.toggle('dark', prefersDark);
```

Простое правило для `.document-editor` переопределяет переменную в обеих палитрах. Чтобы изменить только значение для тёмной палитры, используйте селектор `.dark .document-editor` (или `[data-theme="dark"] .document-editor`).

## Следование теме Element Plus

nuvra не зависит от Element Plus, но его палитра по умолчанию совпадает с палитрой Element Plus. Если в приложении настроена тема Element Plus, свяжите переменные с её переменными:

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

## Порядок наложения в полноэкранном режиме

В полноэкранном режиме редактор — фиксированный элемент с `z-index: var(--nuvra-fullscreen-z-index)`. Увеличьте значение, если другие фиксированные элементы приложения, например шапка или уведомления, оказываются поверх него:

```css
.document-editor {
  --nuvra-fullscreen-z-index: 5000;
}
```

Меню и всплывающие окна, открытые из редактора, показываются в верхнем слое браузера (top layer), поэтому отображаются поверх полноэкранного редактора независимо от этого значения. См. [Поддержка браузеров](/docs/browser-support).
