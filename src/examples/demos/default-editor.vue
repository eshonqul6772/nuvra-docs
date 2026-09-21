<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, type PageSettings, createPageSettings } from 'nuvra';

// The document is plain HTML; bind it with v-model and store it wherever you like.
const html = ref(`
  <h1>Quarterly report</h1>
  <p>This is a <strong>real page</strong> with margins. Type, paste from Word, add tables and images —
  everything you do here ends up in <code>html</code> below.</p>
  <h2>Highlights</h2>
  <ul>
    <li>Revenue grew by <strong>18%</strong></li>
    <li>Two new regional offices</li>
  </ul>
  <table>
    <tbody>
      <tr><th><p>Quarter</p></th><th><p>Revenue</p></th></tr>
      <tr><td><p>Q1</p></td><td><p>1 200 000</p></td></tr>
      <tr><td><p>Q2</p></td><td><p>1 416 000</p></td></tr>
    </tbody>
  </table>
`);

// Paper size, orientation, margins, headers and footers of the page view.
const page = ref<PageSettings>(createPageSettings());
</script>

<template>
  <DocumentEditor v-model="html" v-model:page="page" default-view-mode="page" :height="560" title="Quarterly report" />

  <details>
    <summary class="example-note">v-model — {{ html.length }} characters of HTML</summary>
    <pre class="example-output">{{ html }}</pre>
  </details>
</template>
