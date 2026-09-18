<script setup lang="ts">
import { ref, watch } from 'vue';

import { messages } from '../i18n';
import CopyButton from './copy-button.vue';

/**
 * Source of an example in a dark panel under its demo: a file-name tab, the highlighted code in a scrolling area and
 * the file's path. The code shows as plain text at once and is highlighted once shiki, loaded on first use, is ready.
 */
defineOptions({ name: 'ExampleCode' });

interface Props {
  code: string;
  fileName: string;
  /** Path of the file in the documentation's repository. */
  path: string;
}

const props = defineProps<Props>();

/** Highlighted HTML of the current code, or empty while shiki is still loading. */
const highlighted = ref('');

watch(
  () => props.code,
  async code => {
    highlighted.value = '';
    if (!code) return;
    const { codeToHtml } = await import('shiki');
    // The panel is dark in both colour schemes, so both theme slots get the dark theme.
    const html = await codeToHtml(code, {
      lang: 'vue',
      themes: { light: 'github-dark', dark: 'github-dark' },
      defaultColor: false
    });
    // A newer example may have been opened while this one was highlighted.
    if (code === props.code) highlighted.value = html;
  },
  { immediate: true }
);
</script>

<template>
  <div class="example-code">
    <div class="example-code__bar">
      <span class="example-code__tab">{{ fileName }}</span>
      <span class="example-code__actions">
        <span class="example-code__lines">{{ messages.examples.lines(code ? code.split('\n').length : 0) }}</span>
        <CopyButton :source="code" />
      </span>
    </div>
    <div class="example-code__scroll">
      <div v-if="highlighted" class="example-code__body" v-html="highlighted" />
      <pre v-else class="example-code__body example-code__plain"><code>{{ code }}</code></pre>
    </div>
    <div class="example-code__footer">{{ path }}</div>
  </div>
</template>

<style scoped>
.example-code {
  color: #e6edf3;
  background: #0d0d12;
}

.example-code__bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 14px;
  border-bottom: 1px solid rgb(255 255 255 / 10%);
}

.example-code__tab {
  padding: 11px 4px 9px;
  border-bottom: 2px solid #fff;
  color: #fff;
  font-family: var(--font-mono);
  font-size: 12.5px;
  font-weight: 600;
}

.example-code__actions {
  /* Holds the copy button's hidden announcement, which is absolutely positioned. */
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 6px;
}

.example-code__lines {
  color: rgb(255 255 255 / 40%);
  font-size: 12px;
}

/* The copy button stays in the bar, always visible, instead of floating over the code. */
.example-code__actions :deep(.copy-button) {
  position: static;
  height: 28px;
  border-color: rgb(255 255 255 / 16%);
  color: rgb(255 255 255 / 80%);
  background: transparent;
  opacity: 1;
}

.example-code__actions :deep(.copy-button:hover) {
  border-color: rgb(255 255 255 / 40%);
  color: #fff;
}

.example-code__scroll {
  max-height: 520px;
  overflow: auto;
  scrollbar-color: rgb(255 255 255 / 22%) transparent;
  scrollbar-width: thin;
}

.example-code__body :deep(pre),
.example-code__plain {
  margin: 0;
  padding: 16px 20px 20px;
  background: transparent !important;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.7;
  tab-size: 2;
}

.example-code__body :deep(code),
.example-code__plain code {
  font-family: inherit;
}

.example-code__plain {
  color: #e6edf3;
}

.example-code__footer {
  padding: 10px 16px;
  border-top: 1px solid rgb(255 255 255 / 10%);
  color: rgb(255 255 255 / 40%);
  font-family: var(--font-mono);
  font-size: 12px;
}
</style>
