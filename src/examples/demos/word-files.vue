<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor } from 'nuvra';

// Only these tools appear in the toolbar; leave `tools` out to show every tool.
const TOOLS = ['history', 'blockStyle', 'marks', 'align', 'lists', 'table', 'image', 'more'] as const;

const html = ref(
  '<h1>Letter of intent</h1><p>Open any <strong>.docx</strong> file, or download this one as Word, PDF or HTML. ' +
    'Tables, images, lists, headers, footers, footnotes and tracked changes survive the round trip.</p>'
);
const editor = ref<InstanceType<typeof DocumentEditor>>();
const fileInput = ref<HTMLInputElement>();
const message = ref('');

const openWord = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  message.value = '';
  await editor.value?.importWord(file);
};
</script>

<template>
  <div class="example-stage">
    <div class="example-bar">
      <button type="button" class="example-button example-button--primary" @click="fileInput?.click()">
        Open .docx
      </button>
      <button type="button" class="example-button" @click="editor?.exportWord()">Download .docx</button>
      <button type="button" class="example-button" @click="editor?.exportPdf()">Download PDF</button>
      <button type="button" class="example-button" @click="editor?.exportHtml()">Download HTML</button>
      <button type="button" class="example-button" @click="editor?.print()">Print</button>
      <input
        ref="fileInput"
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        hidden
        @change="openWord"
      />
    </div>
    <p v-if="message" class="example-error">{{ message }}</p>

    <DocumentEditor default-view-mode="web"
      :tools="TOOLS"
      ref="editor"
      v-model="html"
      :height="560"
      title="Letter of intent"
      @import-error="message = 'This file could not be read as a Word document.'"
      @export-error="message = 'The PDF could not be drawn in this browser.'"
    />
  </div>
</template>
