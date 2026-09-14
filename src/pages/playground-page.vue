<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect } from 'vue';
import {
  type DocumentComment,
  DocumentEditor,
  type DocumentViewMode,
  type EditorLocaleCode,
  editorLocales
} from 'nuvra';

import CopyButton from '../components/copy-button.vue';
import { DEFAULT_EDITOR_HEIGHT, buildPlaygroundSnippet } from '../components/playground-snippet';
import { locale, messages } from '../i18n';
import type { SiteMessages } from '../i18n/messages/en';

/**
 * Playground: a live `DocumentEditor` next to a panel of its main props and bindings, with the code of the chosen
 * setup below it.
 */
defineOptions({ name: 'PlaygroundPage' });

/** Height limits of the height field, in pixels. */
const MIN_HEIGHT = 240;
const MAX_HEIGHT = 1600;
const VIEW_MODES: readonly DocumentViewMode[] = ['page', 'web'];

/** The sample comment of the demo document, anchored as `<span data-comment="demo-comment">`. */
const sampleComments = (site: SiteMessages): DocumentComment[] => [
  { id: 'demo-comment', createdAt: '2026-09-14T09:30:00.000Z', replies: [], ...site.demo.comment }
];

const options = reactive({
  defaultViewMode: 'page' as DocumentViewMode,
  height: 640,
  autoHeight: false,
  locale: locale.value as EditorLocaleCode,
  disabled: false,
  ruler: true,
  maxLength: 0,
  placeholder: messages.value.playground.placeholderValue,
  title: messages.value.demo.fileName,
  author: messages.value.demo.author,
  bindComments: true,
  bindTrackChanges: false,
  passVariables: true
});
const html = ref(messages.value.demo.sample);
const comments = ref<DocumentComment[]>(sampleComments(messages.value));
const trackChanges = ref(false);

/** Whole, non-negative numbers for the number fields, whatever was typed. */
const height = computed(() =>
  Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.round(Number(options.height) || DEFAULT_EDITOR_HEIGHT)))
);
const maxLength = computed(() => Math.max(0, Math.round(Number(options.maxLength) || 0)));
const variables = computed(() => (options.passVariables ? messages.value.demo.variables : undefined));

/**
 * The editor reads the first view and the ruler when it mounts, and a model is either bound or not for its whole life,
 * so changing any of them mounts a fresh editor; the document itself lives in `html` and survives.
 */
const editorKey = computed(() =>
  [options.defaultViewMode, options.ruler, options.bindComments, options.bindTrackChanges].join('|')
);

/** The optional models, bound only while their switches are on; an unbound model keeps its tools off. */
const modelBindings = computed(() => ({
  ...(options.bindComments && {
    comments: comments.value,
    'onUpdate:comments': (value: DocumentComment[] | undefined) => {
      comments.value = value ?? [];
    }
  }),
  ...(options.bindTrackChanges && {
    trackChanges: trackChanges.value,
    'onUpdate:trackChanges': (value: boolean) => {
      trackChanges.value = value;
    }
  })
}));

const snippet = computed(() =>
  buildPlaygroundSnippet({
    ...options,
    height: height.value,
    maxLength: maxLength.value,
    variables: variables.value
  })
);

/** Puts the sample document and its comment back. */
const loadSample = () => {
  html.value = messages.value.demo.sample;
  comments.value = sampleComments(messages.value);
};

/** Empties the document, which shows the placeholder. */
const clearDocument = () => {
  html.value = '';
  comments.value = [];
};

// Texts that still hold the previous language's defaults follow the site language; edited ones stay.
watch(messages, (next, previous) => {
  if (options.placeholder === previous.playground.placeholderValue)
    options.placeholder = next.playground.placeholderValue;
  if (options.title === previous.demo.fileName) options.title = next.demo.fileName;
  if (options.author === previous.demo.author) options.author = next.demo.author;
  if (html.value === previous.demo.sample) loadSample();
});

watch(locale, (next, previous) => {
  if (options.locale === previous) options.locale = next;
});

watchEffect(() => {
  document.title = messages.value.meta.playgroundTitle;
});
</script>

<template>
  <main class="page playground container">
    <header class="playground__header">
      <p class="eyebrow">{{ messages.playground.eyebrow }}</p>
      <h1 class="playground__title">{{ messages.playground.title }}</h1>
      <p class="playground__lead">{{ messages.playground.lead }}</p>
    </header>

    <div class="playground__layout">
      <section class="playground__stage" :aria-label="messages.playground.editor">
        <DocumentEditor
          :key="editorKey"
          v-model="html"
          v-bind="modelBindings"
          :default-view-mode="options.defaultViewMode"
          :height="options.autoHeight ? 'auto' : height"
          :locale="options.locale"
          :disabled="options.disabled"
          :ruler="options.ruler"
          :max-length="maxLength"
          :placeholder="options.placeholder"
          :title="options.title"
          :author="options.author"
          :variables="variables"
        />
      </section>

      <aside class="playground__panel" :aria-label="messages.playground.controls">
        <fieldset class="panel-group">
          <legend class="panel-group__title">{{ messages.playground.controls }}</legend>

          <div class="control">
            <span id="control-view-mode" class="control__text">
              <code>defaultViewMode</code>
              <small>{{ messages.playground.viewMode }}</small>
            </span>
            <div class="segmented" role="radiogroup" aria-labelledby="control-view-mode">
              <button
                v-for="mode in VIEW_MODES"
                :key="mode"
                type="button"
                role="radio"
                class="segmented__option"
                :class="{ 'is-active': options.defaultViewMode === mode }"
                :aria-checked="options.defaultViewMode === mode"
                @click="options.defaultViewMode = mode"
              >
                {{ mode === 'page' ? messages.playground.viewPage : messages.playground.viewWeb }}
              </button>
            </div>
          </div>

          <label class="control">
            <span class="control__text">
              <code>height</code>
              <small>{{ messages.playground.height }}</small>
            </span>
            <input
              v-model.number="options.height"
              class="control__input"
              type="number"
              inputmode="numeric"
              :min="MIN_HEIGHT"
              :max="MAX_HEIGHT"
              step="20"
              :disabled="options.autoHeight"
            />
          </label>
          <label class="control control--check control--nested">
            <input v-model="options.autoHeight" type="checkbox" />
            <span class="control__text">
              <code>height="auto"</code>
              <small>{{ messages.playground.heightAuto }}</small>
            </span>
          </label>

          <label class="control">
            <span class="control__text">
              <code>locale</code>
              <small>{{ messages.playground.locale }}</small>
            </span>
            <select v-model="options.locale" class="control__input">
              <option v-for="item in editorLocales" :key="item.code" :value="item.code">
                {{ item.name }} ({{ item.code }})
              </option>
            </select>
          </label>

          <label class="control">
            <span class="control__text">
              <code>maxLength</code>
              <small>{{ messages.playground.maxLength }}</small>
            </span>
            <input
              v-model.number="options.maxLength"
              class="control__input"
              type="number"
              inputmode="numeric"
              min="0"
              step="100"
            />
          </label>

          <label class="control">
            <span class="control__text">
              <code>placeholder</code>
              <small>{{ messages.playground.placeholder }}</small>
            </span>
            <input v-model="options.placeholder" class="control__input" type="text" />
          </label>

          <label class="control">
            <span class="control__text">
              <code>title</code>
              <small>{{ messages.playground.printTitle }}</small>
            </span>
            <input v-model="options.title" class="control__input" type="text" />
          </label>

          <label class="control">
            <span class="control__text">
              <code>author</code>
              <small>{{ messages.playground.author }}</small>
            </span>
            <input v-model="options.author" class="control__input" type="text" />
          </label>

          <label class="control control--check">
            <input v-model="options.disabled" type="checkbox" />
            <span class="control__text">
              <code>disabled</code>
              <small>{{ messages.playground.disabled }}</small>
            </span>
          </label>

          <label class="control control--check">
            <input v-model="options.ruler" type="checkbox" />
            <span class="control__text">
              <code>ruler</code>
              <small>{{ messages.playground.ruler }}</small>
            </span>
          </label>

          <label class="control control--check">
            <input v-model="options.passVariables" type="checkbox" />
            <span class="control__text">
              <code>variables</code>
              <small>{{ messages.playground.variables }}</small>
            </span>
          </label>
        </fieldset>

        <fieldset class="panel-group">
          <legend class="panel-group__title">{{ messages.playground.bindings }}</legend>

          <label class="control control--check">
            <input v-model="options.bindComments" type="checkbox" />
            <span class="control__text">
              <code>v-model:comments</code>
              <small>{{ messages.playground.comments }} — {{ messages.playground.commentsHint }}</small>
            </span>
          </label>

          <label class="control control--check">
            <input v-model="options.bindTrackChanges" type="checkbox" />
            <span class="control__text">
              <code>v-model:trackChanges</code>
              <small>{{ messages.playground.trackChanges }}</small>
            </span>
          </label>
          <label class="control control--check control--nested">
            <input v-model="trackChanges" type="checkbox" :disabled="!options.bindTrackChanges" />
            <span class="control__text">
              <code>trackChanges = {{ trackChanges }}</code>
              <small>{{ messages.playground.trackChangesOn }}</small>
            </span>
          </label>
        </fieldset>

        <fieldset class="panel-group">
          <legend class="panel-group__title">{{ messages.playground.content }}</legend>
          <div class="panel-group__actions">
            <button type="button" class="panel-button" @click="loadSample">{{ messages.playground.loadSample }}</button>
            <button type="button" class="panel-button" @click="clearDocument">{{ messages.playground.clear }}</button>
          </div>
        </fieldset>
      </aside>
    </div>

    <section class="playground__code" aria-labelledby="playground-code-title">
      <h2 id="playground-code-title" class="playground__code-title">{{ messages.playground.code }}</h2>
      <div class="code-block">
        <pre class="playground__pre"><code>{{ snippet }}</code></pre>
        <CopyButton :source="snippet" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.playground.container {
  max-width: 1320px;
  padding-block: 48px 104px;
}

.playground__header {
  max-width: 760px;
  margin-bottom: 32px;
}

.playground__title {
  margin: 10px 0 0;
  font-family: var(--font-display);
  font-size: clamp(34px, 5vw, 52px);
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.08;
}

.playground__lead {
  margin: 16px 0 0;
  color: var(--color-text-soft);
  font-size: 17px;
}

.playground__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  align-items: start;
  gap: 24px;
}

.playground__stage {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-elevated);
  box-shadow: var(--shadow-lg);
}

.playground__stage :deep(.document-editor:not(.is-fullscreen)) {
  border: 0;
  border-radius: 0;
}

/* Panel */
.playground__panel {
  position: sticky;
  top: calc(var(--header-height) + 24px);
  display: grid;
  gap: 16px;
  max-height: calc(100vh - var(--header-height) - 48px);
  overflow-y: auto;
  padding: 18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-elevated);
}

.panel-group {
  display: grid;
  gap: 14px;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.panel-group + .panel-group {
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.panel-group__title {
  margin-bottom: 12px;
  padding: 0;
  color: var(--color-text-faint);
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.panel-group__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.control {
  display: grid;
  gap: 6px;
}

.control--check {
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: 10px;
  cursor: pointer;
}

.control--check input {
  width: 16px;
  height: 16px;
  margin: 2px 0 0;
  accent-color: var(--color-accent);
  cursor: pointer;
}

.control--check input:disabled {
  cursor: not-allowed;
}

.control--nested {
  margin-top: -6px;
  padding-left: 12px;
  border-left: 2px solid var(--color-border);
}

.control__text {
  display: grid;
  gap: 1px;
  min-width: 0;
}

.control__text code {
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  overflow-wrap: anywhere;
}

.control__text small {
  color: var(--color-text-faint);
  font-size: 12.5px;
  line-height: 1.4;
}

.control__input {
  box-sizing: border-box;
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--color-border-strong);
  border-radius: 9px;
  color: var(--color-text);
  background: var(--color-bg);
  font: inherit;
  font-size: 14px;
}

.control__input:focus {
  border-color: var(--color-accent);
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 20%, transparent);
}

.control__input:disabled {
  opacity: 0.55;
}

.control .segmented {
  justify-self: start;
}

.panel-button {
  height: 34px;
  padding: 0 14px;
  border: 1px solid var(--color-border-strong);
  border-radius: 999px;
  color: var(--color-text);
  background: var(--color-bg);
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 140ms ease;
}

.panel-button:hover {
  border-color: var(--color-text-faint);
}

.panel-button:focus-visible,
.control--check input:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Code */
.playground__code {
  margin-top: 40px;
}

.playground__code-title {
  margin: 0 0 14px;
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 500;
  letter-spacing: -0.015em;
}

.playground__pre {
  margin: 0;
  padding: 18px 20px;
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text);
  background: var(--color-code-bg);
  font-family: var(--font-mono);
  font-size: 13.5px;
  line-height: 1.7;
  tab-size: 2;
}

.playground__pre code {
  font-family: inherit;
}

@media (max-width: 1024px) {
  .playground__layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .playground__panel {
    position: static;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    align-items: start;
    max-height: none;
    overflow: visible;
  }

  .panel-group + .panel-group {
    padding-top: 0;
    border-top: 0;
  }
}

@media (max-width: 640px) {
  .playground.container {
    padding-top: 32px;
  }

  .playground__panel {
    grid-template-columns: minmax(0, 1fr);
  }

  .panel-group + .panel-group {
    padding-top: 16px;
    border-top: 1px solid var(--color-border);
  }
}
</style>
