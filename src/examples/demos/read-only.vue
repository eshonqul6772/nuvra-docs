<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor } from 'nuvra';

// Only these tools appear in the toolbar; leave `tools` out to show every tool.
const TOOLS = ['history', 'marks', 'search', 'more'] as const;

const html = ref(
  '<h2>Signed contract</h2><p>Once a document is signed, show it read-only: the text cannot change, the toolbar ' +
    'is disabled, but people can still select, copy, search and print it.</p>'
);
const locked = ref(true);
</script>

<template>
  <div class="example-stage">
    <div class="example-bar example-bar--spread">
      <label class="example-field example-field--inline">
        <input v-model="locked" type="checkbox" />
        disabled
      </label>
      <span class="example-note">{{ locked ? 'Read-only' : 'Editable' }}</span>
    </div>

    <DocumentEditor :tools="TOOLS" v-model="html" :disabled="locked" :height="420" />
  </div>
</template>
