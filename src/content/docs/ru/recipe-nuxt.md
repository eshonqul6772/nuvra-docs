# Nuxt 3

nuvra работает в Nuxt 3 без дополнительных настроек сборки: это обычный ESM-пакет, а его единственная peer-зависимость — Vue. Редактор документов измеряет страницы и правит DOM, поэтому отрисовываться он должен в браузере; обычные функции вроде `fillTemplate` работают и на сервере.

## Установка и стили

```sh
pnpm add nuvra
```

Подключите файл стилей один раз в `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['nuvra/style.css']
});
```

Добавлять что-либо в `build.transpile` не нужно.

## Отрисовка редактора на клиенте

Импортировать `nuvra` на сервере безопасно, но сам редактор там отрисовываться не должен. Оберните его в `ClientOnly` и передайте в слот `#fallback` заглушку той же высоты, чтобы вёрстка не прыгала при появлении редактора:

```vue
<!-- pages/documents/[id].vue -->
<script setup lang="ts">
import { DocumentEditor } from 'nuvra';

const route = useRoute();
const { data: html } = await useFetch<string>(`/api/documents/${route.params.id}`, { default: () => '' });
</script>

<template>
  <ClientOnly>
    <DocumentEditor v-model="html" title="Договор" />
    <template #fallback>
      <div style="height: 760px">Загрузка редактора…</div>
    </template>
  </ClientOnly>
</template>
```

Документ по-прежнему загружается при серверном рендеринге; браузера ждёт только редактор.

### Клиентский компонент

Если редактор нужен на многих страницах, вынесите небольшую обёртку в файл с суффиксом `.client.vue`. Nuxt импортирует его автоматически и отрисовывает только в браузере. Выберите имя, которое не совпадает с компонентами nuvra:

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
  <NuvraEditor v-model="html" title="Договор" />
</template>
```

Если методы редактора, например `print()` или `getHTML()`, нужны через ref шаблона, используйте `DocumentEditor` напрямую внутри `ClientOnly`: иначе обёртке придётся пробрасывать их самой.

## Язык интерфейса

Задайте язык всех редакторов в клиентском плагине. Файлы из `plugins/` регистрируются автоматически, а суффикс `.client` не пускает этот плагин в серверную сборку:

```ts
// plugins/nuvra.client.ts
import { ru, setEditorLocale } from 'nuvra';

export default defineNuxtPlugin(() => {
  setEditorLocale(ru);
});
```

`setEditorLocale` реактивна, поэтому переключатель языка может вызвать её снова. Пропс `locale` отдельного редактора по-прежнему важнее. Подробнее — в статье [Языки](/docs/translations).

## Заполнение шаблонов в серверном маршруте

`fillTemplate` не нужен DOM, поэтому маршрут Nitro может заполнить сохранённый шаблон, например перед сохранением письма или передачей его в сервис PDF:

```ts
// server/api/letters.post.ts
import { fillTemplate, getTemplateVariables } from 'nuvra';

export default defineEventHandler(async event => {
  const { values } = await readBody<{ values: Record<string, string> }>(event);
  const template = await loadTemplate('letter'); // ваше хранилище

  const missing = getTemplateVariables(template).filter(name => !values[name]?.trim());
  if (missing.length) {
    throw createError({ statusCode: 422, statusMessage: `Missing: ${missing.join(', ')}` });
  }

  return { html: fillTemplate(template, values, { missing: 'empty' }) };
});
```

Печать, экспорт в Word через `buildDocx` и все компоненты редактора остаются в браузере.

## См. также

- [Начало работы](/docs/getting-started)
- [Письма по шаблону](/docs/recipe-letters)
- [Автосохранение](/docs/recipe-autosave)
- [Загрузка изображений](/docs/recipe-image-upload)
- [API](/docs/api)
