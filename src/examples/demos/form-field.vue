<script setup lang="ts">
import { ref } from 'vue';
import { Editor } from 'nuvra';

// Only these tools appear in the toolbar; leave `tools` out to show every tool.
const TOOLS = ['history', 'marks', 'lists', 'link'] as const;

const name = ref('Content editor');
// `Editor` is the same engine in the lighter web view: it grows with its content, like a textarea.
const description = ref('');
const error = ref('');
const submitted = ref('');

/** An editor that holds only empty paragraphs still produces markup, so validate its text. */
const isBlank = (html: string) =>
  !html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();

const submit = () => {
  if (isBlank(description.value)) {
    error.value = 'Describe what this role does.';
    submitted.value = '';
    return;
  }
  error.value = '';
  submitted.value = JSON.stringify({ name: name.value, description: description.value }, null, 2);
};
</script>

<template>
  <form class="example-stage" @submit.prevent="submit">
    <label class="example-field">
      Role name
      <input v-model="name" class="example-input" type="text" />
    </label>

    <div class="example-field">
      Description
      <Editor
        :tools="TOOLS"
        v-model="description"
        placeholder="What does this role do?"
        :max-length="500"
        :min-height="160"
        :max-height="320"
      />
    </div>
    <p v-if="error" class="example-error">{{ error }}</p>

    <div class="example-bar">
      <button type="submit" class="example-button example-button--primary">Save role</button>
    </div>
    <pre v-if="submitted" class="example-output">{{ submitted }}</pre>
  </form>
</template>
