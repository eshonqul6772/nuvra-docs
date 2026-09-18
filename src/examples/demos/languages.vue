<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, type EditorLocaleCode, editorLocales } from 'nuvra';

// Only these tools appear in the toolbar; leave `tools` out to show every tool.
const TOOLS = [
  'history',
  'blockStyle',
  'fontFamily',
  'fontSize',
  'marks',
  'align',
  'lists',
  'insert',
  'review',
  'search',
  'more'
] as const;

const html = ref('<p>Switch the language: every label, menu, tooltip and message of the editor follows.</p>');
// `editorLocales` lists the built-in languages with their own names, ready for a picker.
const locale = ref<EditorLocaleCode>('uz');
</script>

<template>
  <div class="example-stage">
    <div class="example-bar">
      <button
        v-for="option in editorLocales"
        :key="option.code"
        type="button"
        class="example-button"
        :class="{ 'is-active': locale === option.code }"
        @click="locale = option.code"
      >
        {{ option.name }}
      </button>
    </div>

    <!-- For the whole app, call setEditorLocale(ru) once instead of passing the prop. -->
    <DocumentEditor :tools="TOOLS" v-model="html" :locale="locale" :height="420" />
  </div>
</template>
