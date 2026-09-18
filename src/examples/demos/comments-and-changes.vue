<script setup lang="ts">
import { ref } from 'vue';
import { type DocumentComment, DocumentEditor } from 'nuvra';

// Only these tools appear in the toolbar; leave `tools` out to show every tool.
const TOOLS = ['history', 'marks', 'review'] as const;

const AUTHORS = ['Aziza Rahimova', 'Bobur Aliyev'];

// The HTML keeps only the anchor <span data-comment="id">; tracked changes are <ins> and <del> in the HTML itself.
const html = ref(
  '<h2>Supply agreement</h2>' +
    '<p>The supplier delivers the goods within <span data-comment="c1">ten working days</span> of the payment.</p>' +
    '<p>The price is fixed for <del data-change="t1" data-author="Bobur Aliyev" data-time="2026-09-14T10:00:00.000Z">six</del>' +
    '<ins data-change="t1" data-author="Bobur Aliyev" data-time="2026-09-14T10:00:00.000Z">twelve</ins> months.</p>'
);

// Comments are plain data; store them next to the document.
const comments = ref<DocumentComment[]>([
  {
    id: 'c1',
    author: 'Aziza Rahimova',
    text: 'Can we make it seven?',
    createdAt: '2026-09-14T09:30:00.000Z',
    replies: []
  }
]);
const trackChanges = ref(true);
const author = ref(AUTHORS[0]);
</script>

<template>
  <div class="example-stage">
    <div class="example-bar example-bar--spread">
      <div class="example-bar">
        <span class="example-note">Author:</span>
        <button
          v-for="name in AUTHORS"
          :key="name"
          type="button"
          class="example-button"
          :class="{ 'is-active': author === name }"
          @click="author = name"
        >
          {{ name }}
        </button>
      </div>
      <label class="example-field example-field--inline">
        <input v-model="trackChanges" type="checkbox" />
        Track changes
      </label>
    </div>

    <DocumentEditor
      :tools="TOOLS"
      v-model="html"
      v-model:comments="comments"
      v-model:track-changes="trackChanges"
      :author="author"
      :height="520"
    />

    <details>
      <summary class="example-note">v-model:comments — {{ comments.length }} comment(s)</summary>
      <pre class="example-output">{{ JSON.stringify(comments, null, 2) }}</pre>
    </details>
  </div>
</template>
