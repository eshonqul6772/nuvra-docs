# Письма по шаблону

Рассылка, пачка уведомлений или набор справок — это один шаблон, заполненный много раз. Шаблон пишется один раз в `DocumentEditor` и сохраняется как HTML; в этом рецепте он заполняется для каждого получателя на сервере, все письма печатаются разом в браузере, а одно письмо заполняется через форму.

## Исходный шаблон

Подойдёт любой документ, сохранённый редактором, с переменными шаблона. Встроенное служебное письмо — готовая отправная точка на нужном языке:

```ts
import { getDocumentTemplate } from 'nuvra';

const { html, variables } = getDocumentTemplate('letter', 'ru');
// variables: org_name, org_address, doc_date, doc_number, recipient,
// subject, signer_position, signer_name, executor
```

Сохраните `html` как шаблон или сначала загрузите его в `DocumentEditor`, чтобы написать текст письма. Как хранятся переменные, описано в статье [Шаблоны и подписи](/docs/templates).

## На сервере

`fillTemplate` и `getTemplateVariables` — обычные строковые функции, поэтому письма может сформировать скрипт на Node. Точка входа `nuvra` импортирует `vue` (peer-зависимость), так что установите `vue` рядом; ни DOM, ни загрузчик CSS для импорта не нужны.

```js
// letters.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fillTemplate, getTemplateVariables } from 'nuvra';

const template = await readFile('templates/letter.html', 'utf8');

const common = {
  org_name: 'ООО «Пример»',
  org_address: 'г. Ташкент, ул. Мустакиллик, д. 12',
  doc_date: '14.09.2026',
  subject: 'О годовом собрании',
  signer_position: 'Директор',
  signer_name: 'А. Каримов',
  executor: 'Н. Рашидова'
};

const recipients = [
  { doc_number: '01-12/345', recipient: 'Иванову И. И.' },
  { doc_number: '01-12/346', recipient: 'Петровой А. С.' }
];

// Проверяем все письма до того, как записать хотя бы одно.
const names = getTemplateVariables(template);
const problems = recipients.flatMap((person, index) => {
  const values = { ...common, ...person };
  return names.filter(name => !String(values[name] ?? '').trim()).map(name => `#${index + 1} ${name}`);
});
if (problems.length) throw new Error(`Не хватает значений: ${problems.join(', ')}`);

await mkdir('out', { recursive: true });

for (const [index, person] of recipients.entries()) {
  const body = fillTemplate(template, { ...common, ...person }, { missing: 'empty' });
  const page = `<!doctype html><html><head><meta charset="utf-8"><title>Письмо</title></head><body>${body}</body></html>`;
  await writeFile(`out/letter-${index + 1}.html`, page);
}
```

- Проверяйте заранее: наполовину отправленную рассылку исправить сложнее, чем упавший скрипт.
- `missing: 'empty'` — страховка: переменная, добавленная в шаблон позже, не попадёт на бумагу чипом.
- `fillTemplate` экранирует значения для HTML, поэтому названия вроде `Иванов & партнёры` безопасны.
- Вместо записи файлов передайте `body` своему почтовому сервису или сервису PDF. У простой страницы выше нет стилей редактора; если результат должен совпадать с разметкой страниц редактора, используйте способ для браузера ниже.

## В браузере: все письма в одной печати

Разрыв страницы редактор сохраняет как пустой `div` с атрибутом `data-type="page-break"`. Если соединить им заполненные письма, получится один документ, где каждое письмо на отдельном листе, а `DocumentEditor` напечатает его со своими настройками страницы:

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
  <button type="button" @click="printAll">Напечатать все письма</button>
  <DocumentEditor ref="editor" v-model="html" title="Письма" disabled />
</template>
```

`disabled` оставляет сформированный документ только для чтения. Из того же объединённого HTML функция `buildDocx` соберёт один файл Word — она тоже работает в браузере:

```ts
import { buildDocx, createPageSettings } from 'nuvra';

const blob = await buildDocx({ html: html.value, title: 'Письма', page: createPageSettings() });
await fetch('/api/letters/docx', { method: 'PUT', body: blob });
```

## Одно письмо как форма

Когда сотрудник заполняет одно письмо, `DocumentForm` показывает шаблон так, как он будет напечатан, с полем ввода на месте каждой переменной:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentForm, getDocumentTemplate } from 'nuvra';

const { html: template, variables } = getDocumentTemplate('letter', 'ru');

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
  <DocumentForm ref="form" v-model="values" :template="template" :variables="variables" locale="ru" />
  <button type="button" @click="submit">Отправить</button>
</template>
```

- `validate()` возвращает имена пустых переменных, подсвечивает их поля и ставит фокус в первое.
- Если отправить `values` вместе с HTML, сервер сможет заново заполнить тот же шаблон или сохранить данные отдельно.

## См. также

- [Шаблоны и подписи](/docs/templates)
- [Формы и валидация](/docs/recipe-forms)
- [Автосохранение](/docs/recipe-autosave)
- [API](/docs/api)
