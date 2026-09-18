<script setup lang="ts">
import { computed, ref } from 'vue';
import { type Collaborator, DocumentEditor, type SelectionOffsets } from 'nuvra';

// Only these tools appear in the toolbar; leave `tools` out to show every tool.
const TOOLS = ['history', 'marks', 'lists'] as const;

// Two people on one document. In a real app the HTML and the selections travel over your WebSocket;
// here both editors share the same refs.
const html = ref(
  '<h2>Meeting notes</h2><p>Click or select text in one editor: the other shows that person’s caret, ' +
    'name and selection. Typing in either updates both.</p><p>Agenda: budget, hiring, office move.</p>'
);
const azizaSelection = ref<SelectionOffsets | null>(null);
const boburSelection = ref<SelectionOffsets | null>(null);

const seenByAziza = computed<Collaborator[]>(() => [{ id: 'bobur', name: 'Bobur', selection: boburSelection.value }]);
const seenByBobur = computed<Collaborator[]>(() => [{ id: 'aziza', name: 'Aziza', selection: azizaSelection.value }]);
</script>

<template>
  <div class="example-columns">
    <section class="example-panel">
      <h3>Aziza</h3>
      <DocumentEditor
        :tools="TOOLS"
        v-model="html"
        default-view-mode="web"
        :height="380"
        :canvas-padding="12"
        :collaborators="seenByAziza"
        @selection-change="azizaSelection = $event"
      />
    </section>
    <section class="example-panel">
      <h3>Bobur</h3>
      <DocumentEditor
        :tools="TOOLS"
        v-model="html"
        default-view-mode="web"
        :height="380"
        :canvas-padding="12"
        :collaborators="seenByBobur"
        @selection-change="boburSelection = $event"
      />
    </section>
  </div>
</template>
