<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import { DocumentEditor, type OutlineHeading, readOutline } from 'nuvra';

// Only these tools appear in the toolbar; leave `tools` out to show every tool.
const TOOLS = ['history', 'blockStyle', 'lists', 'insert'] as const;

const html = ref(`
  <p></p>
  <h1>1. General provisions</h1>
  <p>The table of contents lists the headings with the pages they are on.</p>
  <h2>1.1. Scope</h2>
  <p>It is refreshed with one call after the headings change.</p>
  <div data-type="page-break"></div>
  <h1>2. Rights and duties</h1>
  <h2>2.1. Of the employer</h2>
  <p>Add a heading and press “Update” — the new line appears in the table.</p>
  <h2>2.2. Of the employee</h2>
  <div data-type="page-break"></div>
  <h1>3. Final provisions</h1>
  <p>Every heading of the outline on the right scrolls the document to itself.</p>
`);
const editor = ref<InstanceType<typeof DocumentEditor>>();
const outline = ref<OutlineHeading[]>([]);

const refreshOutline = () => {
  const root = editor.value?.engine?.root;
  outline.value = root ? readOutline(root, 3) : [];
};

/** The table goes to the caret; focus() puts one in the document when it has none yet. */
const insertTableOfContents = () => {
  editor.value?.focus();
  editor.value?.updateTableOfContents();
};

onMounted(() => nextTick(refreshOutline));
watch(html, refreshOutline);
</script>

<template>
  <div class="example-stage">
    <div class="example-bar">
      <button
        type="button"
        class="example-button example-button--primary"
        @mousedown.prevent
        @click="insertTableOfContents"
      >
        Insert / update table of contents
      </button>
      <span class="example-note">It is inserted at the caret, or refreshed where it already is.</span>
    </div>

    <div class="example-columns layout">
      <DocumentEditor default-view-mode="web" :tools="TOOLS" ref="editor" v-model="html" :height="560" />
      <nav class="example-panel">
        <h3>readOutline()</h3>
        <ul class="example-list">
          <li v-for="(heading, index) in outline" :key="index" :style="{ paddingLeft: `${(heading.level - 1) * 14}px` }">
            <a href="#" @click.prevent="heading.element.scrollIntoView({ block: 'center', behavior: 'smooth' })">
              {{ heading.text }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.layout {
  grid-template-columns: minmax(0, 1fr) 220px;
}

@media (max-width: 760px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
