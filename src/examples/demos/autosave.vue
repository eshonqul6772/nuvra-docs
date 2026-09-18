<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import { DocumentEditor } from 'nuvra';

// Only these tools appear in the toolbar; leave `tools` out to show every tool.
const TOOLS = ['history', 'blockStyle', 'marks', 'lists'] as const;

const STORAGE_KEY = 'nuvra-example:autosave';
const SAVE_DELAY = 1000;

const readSaved = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const saved = readSaved();
const html = ref(saved ?? '<p>Type something, then reload the page: the text comes back.</p>');
const status = ref(saved ? 'Restored from the last visit' : 'Not saved yet');

let timer: ReturnType<typeof setTimeout> | undefined;

// The model updates shortly after typing stops; wait a little more and save once.
watch(html, value => {
  status.value = 'Unsaved changes…';
  clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
      status.value = `Saved at ${new Date().toLocaleTimeString()}`;
    } catch {
      status.value = 'Could not save (storage is unavailable)';
    }
  }, SAVE_DELAY);
});

const forget = () => {
  clearTimeout(timer);
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing was stored.
  }
  status.value = 'Saved copy removed';
};

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div class="example-stage">
    <div class="example-bar example-bar--spread">
      <span class="example-note" role="status">{{ status }}</span>
      <button type="button" class="example-button" @click="forget">Forget the saved copy</button>
    </div>

    <DocumentEditor :tools="TOOLS" v-model="html" :height="460" />
  </div>
</template>
