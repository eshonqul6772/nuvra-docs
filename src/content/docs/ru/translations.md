# Языки

Интерфейс редактора — панель инструментов, меню, диалоги, строка состояния и сообщения — поставляется на узбекском (латиница и кириллица), английском и русском языках. Переводы входят в пакет, поэтому каждое приложение показывает одни и те же выверенные тексты.

| Локаль | Код | Язык |
| --- | --- | --- |
| `uz` | `'uz'` | O‘zbekcha (по умолчанию) |
| `uzCyrl` | `'uz-Cyrl'` | Ўзбекча |
| `en` | `'en'` | English |
| `ru` | `'ru'` | Русский |

Язык также определяет тексты, которые редактор записывает в документ: блоки подписи, шаблоны документов, суммы прописью и даты в полной форме.

## Один редактор

Импортируйте локаль и передайте её в пропс `locale`:

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

Код тоже подходит: `locale="en"`. `Editor` принимает тот же пропс.

## Всё приложение

Вызовите `setEditorLocale` один раз, например в `main.ts`. Все редакторы без собственного пропса `locale` будут использовать этот язык:

```ts
import { en, setEditorLocale } from 'nuvra';

setEditorLocale(en);
```

Настройка реактивна: повторный вызов `setEditorLocale`, например из переключателя языка, обновляет редакторы, которые уже есть на странице.

## Выбор языка

`editorLocales` содержит встроенные локали с их названиями — готовый список для выбора языка:

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

## Приоритет

1. Пропс `locale` редактора.
2. Язык, заданный через `setEditorLocale`.
3. Узбекский.

Неизвестное значение, например `locale="de"`, приводит к переходу на следующий шаг.
