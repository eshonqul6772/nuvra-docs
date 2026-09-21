<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, type SlashCommand, formatLongDate } from 'nuvra';

// Only these tools appear in the toolbar; leave `tools` out to show every tool.
const TOOLS = ['history', 'blockStyle', 'marks', 'lists'] as const;

const html = ref(
  '<p>Type <strong>/</strong> at the start of a line to see your own commands on top of the menu.</p><p></p>'
);

// Your commands come first in the "/" menu; `run` receives the editing engine.
const slashCommands: SlashCommand[] = [
  {
    id: 'director',
    label: 'Director’s name',
    icon: 'pencil',
    keywords: ['direktor', 'директор'],
    run: engine => engine.insertText('A. Karimov, Director')
  },
  {
    id: 'today',
    label: 'Today’s date',
    icon: 'calendar-days',
    run: engine => engine.insertText(formatLongDate(new Date(), 'en'))
  },
  {
    id: 'approved',
    label: '“Approved” stamp',
    icon: 'check',
    run: engine => engine.insertText('APPROVED ✓')
  }
];
</script>

<template>
  <DocumentEditor default-view-mode="web" :tools="TOOLS" v-model="html" :slash-commands="slashCommands" :height="460">
    <!-- Buttons of your app, at the start of the toolbar's right-hand group. -->
    <template #toolbar="{ engine, disabled }">
      <button
        type="button"
        class="doc-tb-button"
        title="Insert a check mark"
        :disabled="disabled"
        @mousedown.prevent
        @click="engine.insertText('✓')"
      >
        ✓
      </button>
      <button
        type="button"
        class="doc-tb-button"
        title="Insert the director’s name"
        :disabled="disabled"
        @mousedown.prevent
        @click="engine.insertText('A. Karimov')"
      >
        A. K.
      </button>
    </template>
  </DocumentEditor>
</template>
