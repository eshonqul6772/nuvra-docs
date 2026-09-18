<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor } from 'nuvra';

// Only these tools appear in the toolbar; leave `tools` out to show every tool.
const TOOLS = ['history', 'blockStyle', 'marks', 'color', 'highlight', 'align', 'lists', 'link', 'table'] as const;

const ACCENTS = ['#409eff', '#7c3aed', '#0e9f8e', '#e5484d', '#d97706'];

const html = ref('<p>Pick an accent. Buttons, focus rings, menus and the selection take the colour.</p>');
const accent = ref(ACCENTS[1]);
</script>

<template>
  <div class="example-stage">
    <div class="example-bar">
      <button
        v-for="color in ACCENTS"
        :key="color"
        type="button"
        class="example-button"
        :class="{ 'is-active': accent === color }"
        @click="accent = color"
      >
        <span class="swatch" :style="{ background: color }" />
        {{ color }}
      </button>
    </div>

    <div class="themed" :style="{ '--accent': accent }">
      <DocumentEditor :tools="TOOLS" v-model="html" :height="420" />
    </div>
  </div>
</template>

<style scoped>
/* The editor declares its colours on .document-editor, so set the variables on that element. */
.themed :deep(.document-editor) {
  --nuvra-color-primary: var(--accent);
  --nuvra-color-primary-hover: color-mix(in srgb, var(--accent) 80%, #fff);
  --nuvra-color-primary-border: color-mix(in srgb, var(--accent) 45%, #fff);
  --nuvra-color-primary-muted: color-mix(in srgb, var(--accent) 25%, #fff);
  --nuvra-color-primary-soft: color-mix(in srgb, var(--accent) 10%, #fff);
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
</style>
