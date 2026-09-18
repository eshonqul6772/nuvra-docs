<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  DocumentEditor,
  type PageOrientation,
  type PageSettings,
  type PageSizeKey,
  createHeaderFooter,
  createPageSettings,
  createWatermark
} from 'nuvra';

// Only these tools appear in the toolbar; leave `tools` out to show every tool.
const TOOLS = ['history', 'blockStyle', 'marks', 'align', 'headerFooter', 'pageSetup'] as const;

const html = ref(
  '<h1>Order No. 17</h1><p>Change the paper, the header, the footer and the watermark with the controls above — or ' +
    'open “Page setup” in the toolbar. Both edit the same <code>v-model:page</code> object.</p>'
);
const page = ref<PageSettings>({
  ...createPageSettings(),
  header: { ...createHeaderFooter(), right: '{date}' },
  footer: { ...createHeaderFooter(), center: 'Page {page} of {pages}' }
});

/** Replaces the settings object, so the editor and the controls stay in step. */
const update = (patch: Partial<PageSettings>) => {
  page.value = { ...page.value, ...patch };
};

const size = computed({
  get: () => page.value.size,
  set: (value: PageSizeKey) => update({ size: value })
});
const orientation = computed({
  get: () => page.value.orientation,
  set: (value: PageOrientation) => update({ orientation: value })
});
// Headers and footers take the {page}, {pages}, {date} and {title} tokens.
const headerText = computed({
  get: () => page.value.header?.left ?? '',
  set: (left: string) => update({ header: { ...(page.value.header ?? createHeaderFooter()), left } })
});
const watermark = computed({
  get: () => page.value.watermark?.text ?? '',
  set: (text: string) => update({ watermark: text ? { ...createWatermark(), text } : undefined })
});
</script>

<template>
  <div class="example-stage">
    <div class="example-grid">
      <label class="example-field">
        Paper
        <select v-model="size" class="example-input">
          <option value="a4">A4</option>
          <option value="a5">A5</option>
          <option value="a3">A3</option>
          <option value="letter">Letter</option>
          <option value="legal">Legal</option>
        </select>
      </label>
      <label class="example-field">
        Orientation
        <select v-model="orientation" class="example-input">
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </label>
      <label class="example-field">
        Header (left)
        <input v-model="headerText" class="example-input" placeholder="Company name" />
      </label>
      <label class="example-field">
        Watermark
        <input v-model="watermark" class="example-input" placeholder="DRAFT" />
      </label>
    </div>

    <DocumentEditor :tools="TOOLS" v-model="html" v-model:page="page" :height="560" title="Order No. 17" />
  </div>
</template>
