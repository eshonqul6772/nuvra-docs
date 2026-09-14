# Формы и валидация

`Editor` — поле форматированного текста, которое встраивается в обычную форму. Его значение — строка HTML, поэтому валидация устроена так же, как для любого другого поля. Важно помнить две вещи: пустой документ равен `''`, а ограничение длины считает символы текста, а не HTML.

## Форма на чистом Vue

В примере ошибки хранятся в реактивном объекте, поле проверяется при потере фокуса, а при отправке проверяется вся форма.

```vue
<script setup lang="ts">
import { reactive, watch } from 'vue';
import { Editor } from 'nuvra';

const MAX_LENGTH = 2000;

const form = reactive({ title: '', description: '' });
const errors = reactive<{ title?: string; description?: string }>({});

const validateTitle = () => {
  errors.title = form.title.trim() === '' ? 'Введите заголовок' : undefined;
};

const validateDescription = () => {
  // пустой документ всегда равен ''
  errors.description = form.description === '' ? 'Опишите должность' : undefined;
};

// когда ошибка уже показана, убираем её, как только значение исправлено
watch(() => form.description, () => errors.description && validateDescription());

const submit = async () => {
  validateTitle();
  validateDescription();
  if (errors.title || errors.description) return;
  await fetch('/api/vacancies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
  });
};
</script>

<template>
  <form novalidate @submit.prevent="submit">
    <label>
      Заголовок
      <input v-model="form.title" @blur="validateTitle" />
    </label>
    <p v-if="errors.title" class="field-error">{{ errors.title }}</p>

    <div class="field-label">Описание</div>
    <Editor
      v-model="form.description"
      placeholder="Опишите должность"
      :max-length="MAX_LENGTH"
      @blur="validateDescription"
    />
    <p v-if="errors.description" class="field-error">{{ errors.description }}</p>

    <button type="submit">Опубликовать</button>
  </form>
</template>
```

- **Обязательное поле.** Для нетронутого или очищенного поля достаточно `form.description === ''`. Документ, в котором только пробелы или несколько пустых абзацев, не равен `''`; если это важно, дополнительно проверяйте текст на сервере.
- **При потере фокуса значение актуально.** Во время набора `v-model` обновляется после короткой паузы (около 200 мс). Редактор записывает отложенные правки до события `blur`, а нажатие кнопки отправки обычно сначала уводит фокус из редактора, поэтому обработчик отправки видит последнее значение. Если форма отправляется, пока фокус остаётся в редакторе (например, по вашему собственному сочетанию клавиш), символы, набранные в последний момент, могут ещё не попасть в значение.
- **Ограничение длины.** `:max-length` отклоняет ввод, вставку и добавление содержимого, которые превысили бы лимит, а в строке состояния показывается счётчик. Сообщение «слишком длинно» в браузере не нужно.

## Проверка на сервере

Браузер — не последний рубеж: повторяйте проверки на сервере.

- `maxLength` считает символы текста документа. Строка HTML всегда длиннее из-за тегов и атрибутов, поэтому не сравнивайте `description.length` с лимитом. Удалите теги (и раскодируйте сущности) с помощью вашей HTML-библиотеки, посчитайте оставшийся текст и оставьте небольшой запас: переносы строк между абзацами редактор не считает.
- Считайте описание незаполненным, если после удаления тегов текст пуст, — кроме случаев, когда одно изображение для вас допустимое значение.
- Очищайте HTML перед сохранением и перед показом в других местах.

## С Element Plus

nuvra не зависит ни от какой UI-библиотеки, и `Editor` работает с любой библиотекой форм. Например, в Element Plus оберните его в `el-form-item` с `prop` и опишите правило как обычно:

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { Editor } from 'nuvra';

const formRef = ref<FormInstance>();
const form = reactive({ description: '' });

const rules: FormRules = {
  description: [{ required: true, message: 'Опишите должность', trigger: 'blur' }]
};

const submit = async () => {
  const valid = await formRef.value?.validate().catch(() => false);
  if (valid) await fetch('/api/vacancies', { method: 'POST', body: JSON.stringify(form) });
};
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
    <el-form-item label="Описание" prop="description">
      <Editor v-model="form.description" @blur="formRef?.validateField('description')" />
    </el-form-item>
    <el-button type="primary" @click="submit">Опубликовать</el-button>
  </el-form>
</template>
```

- `required: true` не пропускает `''`, поэтому пустой документ отлавливается без собственного валидатора.
- Element Plus запускает правила с `blur` и `change`, когда об этих событиях сообщают его собственные компоненты ввода; `Editor` к ним не относится, поэтому элемент формы сам не замечает потерю фокуса. Надёжный путь — `formRef.validate()` при отправке. Чтобы проверять поле и при потере фокуса, вызывайте `validateField` из `@blur` у `Editor`, как в примере.

## См. также

- [Начало работы](/docs/getting-started) — `Editor` как поле формы.
- [Использование](/docs/usage) — значение документа, ограничение длины и placeholder.
- [Загрузка изображений](/docs/recipe-image-upload) — хранение изображений из поля на вашем сервере.
