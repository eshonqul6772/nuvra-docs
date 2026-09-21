<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { messages } from '../i18n';
import CopyButton from './copy-button.vue';

/**
 * Output of the playground in a dark panel: the code of the chosen setup and the values the editor emits, one tab each.
 * Code shows as plain text at once and is highlighted once shiki, loaded on first use, is ready.
 */
defineOptions({ name: 'PlaygroundOutput' });

/** An event the editor emitted, as listed on the events tab. */
export interface PlaygroundEvent {
  id: number;
  /** Time of day it was emitted, already formatted. */
  time: string;
  name: string;
  /** Payload written as JSON, or empty when the event has none. */
  detail: string;
}

/** A tab showing code. `code` is `null` while its binding is off, and `note` then explains how to turn it on. */
export interface PlaygroundOutputTab {
  id: string;
  label: string;
  lang: 'vue' | 'html' | 'json';
  code: string | null;
  note?: string;
  /** Short text on the right of the bar, such as a character count. */
  meta?: string;
}

interface Props {
  tabs: readonly PlaygroundOutputTab[];
  events: readonly PlaygroundEvent[];
}

const props = defineProps<Props>();
const emit = defineEmits<{ clearEvents: [] }>();

const EVENTS_TAB = 'events';

const activeId = ref(props.tabs[0]?.id ?? EVENTS_TAB);
const activeTab = computed(() => props.tabs.find(tab => tab.id === activeId.value));

/** Highlighted HTML of the active tab, or empty while shiki is still loading. */
const highlighted = ref('');

watch(
  () => [activeTab.value?.code, activeTab.value?.lang] as const,
  async ([code, lang]) => {
    highlighted.value = '';
    if (!code || !lang) return;
    const { codeToHtml } = await import('shiki');
    // The panel is dark in both colour schemes, so both theme slots get the dark theme.
    const html = await codeToHtml(code, {
      lang,
      themes: { light: 'github-dark', dark: 'github-dark' },
      defaultColor: false
    });
    // The tab or the code may have changed while this one was highlighted.
    if (code === activeTab.value?.code) highlighted.value = html;
  },
  { immediate: true }
);

/** Moves between the tabs with the arrow keys, as a tab list does. */
const onTabKeydown = (event: KeyboardEvent) => {
  const ids = [...props.tabs.map(tab => tab.id), EVENTS_TAB];
  const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
  if (!step) return;
  event.preventDefault();
  const next = ids[(ids.indexOf(activeId.value) + step + ids.length) % ids.length] ?? EVENTS_TAB;
  activeId.value = next;
  document.getElementById(`playground-tab-${next}`)?.focus();
};
</script>

<template>
  <div class="playground-output">
    <div class="playground-output__bar">
      <div class="playground-output__tabs" role="tablist" :aria-label="messages.playground.output" @keydown="onTabKeydown">
        <button
          v-for="tab in tabs"
          :id="`playground-tab-${tab.id}`"
          :key="tab.id"
          type="button"
          role="tab"
          class="playground-output__tab"
          :class="{ 'is-active': activeId === tab.id }"
          :aria-selected="activeId === tab.id"
          :tabindex="activeId === tab.id ? 0 : -1"
          aria-controls="playground-output-panel"
          @click="activeId = tab.id"
        >
          {{ tab.label }}
        </button>
        <button
          :id="`playground-tab-${EVENTS_TAB}`"
          type="button"
          role="tab"
          class="playground-output__tab"
          :class="{ 'is-active': activeId === EVENTS_TAB }"
          :aria-selected="activeId === EVENTS_TAB"
          :tabindex="activeId === EVENTS_TAB ? 0 : -1"
          aria-controls="playground-output-panel"
          @click="activeId = EVENTS_TAB"
        >
          {{ messages.playground.events }}
          <span v-if="events.length" class="playground-output__badge">{{ events.length }}</span>
        </button>
      </div>

      <span class="playground-output__actions">
        <template v-if="activeTab">
          <span v-if="activeTab.meta" class="playground-output__meta">{{ activeTab.meta }}</span>
          <CopyButton v-if="activeTab.code" :source="activeTab.code" />
        </template>
        <button
          v-else-if="events.length"
          type="button"
          class="playground-output__clear"
          @click="emit('clearEvents')"
        >
          {{ messages.playground.clearEvents }}
        </button>
      </span>
    </div>

    <div
      id="playground-output-panel"
      class="playground-output__scroll"
      role="tabpanel"
      :aria-labelledby="`playground-tab-${activeId}`"
      tabindex="0"
    >
      <template v-if="activeTab">
        <p v-if="activeTab.code === null" class="playground-output__note">{{ activeTab.note }}</p>
        <div v-else-if="highlighted" class="playground-output__body" v-html="highlighted" />
        <pre v-else class="playground-output__body playground-output__plain"><code>{{ activeTab.code }}</code></pre>
      </template>

      <template v-else>
        <p v-if="!events.length" class="playground-output__note">{{ messages.playground.eventsEmpty }}</p>
        <ol v-else class="playground-output__events" aria-live="polite">
          <li v-for="event in events" :key="event.id" class="playground-output__event">
            <span class="playground-output__time">{{ event.time }}</span>
            <code class="playground-output__name">@{{ event.name }}</code>
            <code v-if="event.detail" class="playground-output__detail">{{ event.detail }}</code>
          </li>
        </ol>
      </template>
    </div>
  </div>
</template>

<style scoped>
.playground-output {
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: #e6edf3;
  background: #0d0d12;
}

.playground-output__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0 12px;
  padding: 0 14px;
  border-bottom: 1px solid rgb(255 255 255 / 10%);
}

.playground-output__tabs {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}

.playground-output__tab {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 6px;
  padding: 12px 8px 10px;
  border: 0;
  border-bottom: 2px solid transparent;
  color: rgb(255 255 255 / 55%);
  background: none;
  font-family: var(--font-mono);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: color 140ms ease;
}

.playground-output__tab:hover {
  color: rgb(255 255 255 / 85%);
}

.playground-output__tab.is-active {
  border-bottom-color: #fff;
  color: #fff;
}

.playground-output__tab:focus-visible,
.playground-output__clear:focus-visible,
.playground-output__scroll:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

.playground-output__badge {
  min-width: 18px;
  padding: 1px 5px;
  border-radius: 999px;
  color: #0d0d12;
  background: rgb(255 255 255 / 85%);
  font-size: 11px;
  line-height: 16px;
  text-align: center;
}

.playground-output__actions {
  /* Holds the copy button's hidden announcement, which is absolutely positioned. */
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 42px;
}

.playground-output__meta {
  color: rgb(255 255 255 / 40%);
  font-size: 12px;
}

/* The copy button stays in the bar, always visible, instead of floating over the code. */
.playground-output__actions :deep(.copy-button),
.playground-output__clear {
  position: static;
  height: 28px;
  border: 1px solid rgb(255 255 255 / 16%);
  color: rgb(255 255 255 / 80%);
  background: transparent;
  opacity: 1;
}

.playground-output__clear {
  padding: 0 12px;
  border-radius: 999px;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}

.playground-output__actions :deep(.copy-button:hover),
.playground-output__clear:hover {
  border-color: rgb(255 255 255 / 40%);
  color: #fff;
}

.playground-output__scroll {
  height: 420px;
  overflow: auto;
}

/* Slim rounded thumb, as in the editor. Chromium and Safari take the pseudo-elements, Firefox the standard properties. */
.playground-output__scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.playground-output__scroll::-webkit-scrollbar-track,
.playground-output__scroll::-webkit-scrollbar-corner {
  background: transparent;
}

.playground-output__scroll::-webkit-scrollbar-thumb {
  border: 2px solid transparent;
  border-radius: 999px;
  background: rgb(255 255 255 / 22%) padding-box;
}

.playground-output__scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgb(255 255 255 / 40%);
}

@supports not selector(::-webkit-scrollbar) {
  .playground-output__scroll {
    scrollbar-color: rgb(255 255 255 / 22%) transparent;
    scrollbar-width: thin;
  }
}

.playground-output__body :deep(pre),
.playground-output__plain {
  margin: 0;
  padding: 16px 20px 20px;
  background: transparent !important;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.7;
  tab-size: 2;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.playground-output__body :deep(code),
.playground-output__plain code {
  font-family: inherit;
}

.playground-output__plain {
  color: #e6edf3;
}

.playground-output__note {
  margin: 0;
  padding: 20px;
  color: rgb(255 255 255 / 50%);
  font-size: 14px;
}

.playground-output__events {
  margin: 0;
  padding: 8px 0;
  list-style: none;
  font-family: var(--font-mono);
  font-size: 12.5px;
}

.playground-output__event {
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr);
  align-items: baseline;
  gap: 12px;
  padding: 5px 20px;
}

.playground-output__event + .playground-output__event {
  border-top: 1px solid rgb(255 255 255 / 6%);
}

.playground-output__time {
  color: rgb(255 255 255 / 35%);
}

.playground-output__name {
  color: #79c0ff;
}

.playground-output__detail {
  color: rgb(255 255 255 / 70%);
  overflow-wrap: anywhere;
}

@media (max-width: 640px) {
  .playground-output__scroll {
    height: 360px;
  }

  .playground-output__event {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .playground-output__detail {
    grid-column: 1 / -1;
  }
}
</style>
