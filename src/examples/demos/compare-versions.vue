<script setup lang="ts">
import { ref } from 'vue';
import { DocumentCompare, Editor } from 'nuvra';

// Only these tools appear in the toolbar; leave `tools` out to show every tool.
const TOOLS = ['history', 'marks', 'lists'] as const;

const BEFORE =
  '<h3>Payment terms</h3>' +
  '<p>The buyer pays the full price within thirty days of delivery.</p>' +
  '<p>Late payments are charged 0.1% per day.</p>';

const after = ref(
  '<h3>Payment terms</h3>' +
    '<p>The buyer pays half of the price in advance and the rest within ten days of delivery.</p>' +
    '<p>Late payments are charged 0.1% per day, but no more than 10% of the price.</p>'
);
</script>

<template>
  <div class="example-stage">
    <div class="example-bar">
      <button type="button" class="example-button" @click="after = BEFORE">Reset to the first version</button>
      <span class="example-note">Edit the new version on the left; the comparison updates as you type.</span>
    </div>

    <div class="example-columns">
      <section class="example-panel">
        <h3>New version</h3>
        <Editor :tools="TOOLS" v-model="after" :min-height="260" :max-height="420" />
      </section>
      <section class="example-panel">
        <h3>DocumentCompare</h3>
        <DocumentCompare :before="BEFORE" :after="after" :height="420" />
      </section>
    </div>
  </div>
</template>
