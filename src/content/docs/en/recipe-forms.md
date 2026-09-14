# Forms and validation

`Editor` is a rich text field that fits into an ordinary form. Its value is an HTML string, so validation is the same as for any other field, with two details to know: an empty document is `''`, and a character limit counts the text, not the HTML.

## A form with plain Vue

The example keeps the errors in a reactive object, checks a field when it loses focus and checks everything on submit.

```vue
<script setup lang="ts">
import { reactive, watch } from 'vue';
import { Editor } from 'nuvra';

const MAX_LENGTH = 2000;

const form = reactive({ title: '', description: '' });
const errors = reactive<{ title?: string; description?: string }>({});

const validateTitle = () => {
  errors.title = form.title.trim() === '' ? 'Enter a title' : undefined;
};

const validateDescription = () => {
  // an empty document is always ''
  errors.description = form.description === '' ? 'Describe the role' : undefined;
};

// once an error is shown, clear it as soon as the value is fixed
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
      Title
      <input v-model="form.title" @blur="validateTitle" />
    </label>
    <p v-if="errors.title" class="field-error">{{ errors.title }}</p>

    <div class="field-label">Description</div>
    <Editor
      v-model="form.description"
      placeholder="Describe the role"
      :max-length="MAX_LENGTH"
      @blur="validateDescription"
    />
    <p v-if="errors.description" class="field-error">{{ errors.description }}</p>

    <button type="submit">Publish</button>
  </form>
</template>
```

- **Required.** `form.description === ''` is enough for an untouched or cleared field. A document that holds only spaces or several empty paragraphs is not `''`; if that matters, also check the text on the server.
- **The value is current on blur.** While the user types, `v-model` is updated after a short pause (about 200 ms). The editor writes pending edits before it emits `blur`, and pressing the submit button normally takes the focus out of the editor first, so the submit handler sees the latest value. If a form is submitted while the focus stays in the editor (for example by your own keyboard shortcut), the characters typed in the last moment may not be in the value yet.
- **Character limit.** `:max-length` stops typing, pasting and insertions that would exceed the limit, and the status bar shows the counter. There is no need for a “too long” message in the browser.

## Checking on the server

The browser is not the last line of defence: repeat the checks on the server.

- `maxLength` counts the characters of the document text. The HTML string is always longer because of its tags and attributes, so do not compare `description.length` with the limit. Strip the tags (and decode entities) with your HTML library and count the remaining text, allowing a small margin, since line breaks between paragraphs are not counted by the editor.
- Treat a description whose text is empty after stripping the tags as missing, unless an image alone is a valid value for you.
- Sanitize the HTML before storing or showing it elsewhere.

## With Element Plus

nuvra does not depend on any UI library, and any form library works with `Editor`. With Element Plus, for example, wrap it in an `el-form-item` with a `prop` and describe the rule as usual:

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { Editor } from 'nuvra';

const formRef = ref<FormInstance>();
const form = reactive({ description: '' });

const rules: FormRules = {
  description: [{ required: true, message: 'Describe the role', trigger: 'blur' }]
};

const submit = async () => {
  const valid = await formRef.value?.validate().catch(() => false);
  if (valid) await fetch('/api/vacancies', { method: 'POST', body: JSON.stringify(form) });
};
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
    <el-form-item label="Description" prop="description">
      <Editor v-model="form.description" @blur="formRef?.validateField('description')" />
    </el-form-item>
    <el-button type="primary" @click="submit">Publish</el-button>
  </el-form>
</template>
```

- `required: true` fails for `''`, so the empty document is caught without a custom validator.
- Element Plus runs `blur` and `change` rules when its own input components report those events; `Editor` is not one of them, so the form item does not notice its focus on its own. `formRef.validate()` on submit is the reliable path. To validate on blur as well, call `validateField` from `@blur` of `Editor`, as above.

## See also

- [Getting started](/docs/getting-started) — `Editor` as a form field.
- [Usage](/docs/usage) — the document value, the character limit and the placeholder.
- [Image upload](/docs/recipe-image-upload) — storing images of the field on your server.
