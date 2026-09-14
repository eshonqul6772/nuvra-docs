<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import {
  DocumentEditor,
  type DocumentTemplateId,
  Editor,
  type EditorLocaleCode,
  type PageSettings,
  createPageSettings,
  editorLocales,
  getDocumentTemplate
} from 'nuvra';

import { locale, messages } from '../i18n';
import { type SiteMessages, en } from '../i18n/messages/en';
import { ru } from '../i18n/messages/ru';
import { uz } from '../i18n/messages/uz';

/**
 * Live nuvra editors: a full document in the page view with a gallery of sample documents, and the same engine as a
 * form field.
 */
defineOptions({ name: 'EditorDemo' });

type DemoTab = 'document' | 'field';
/** A sample of the gallery: the site's own contract, or one of nuvra's built-in document templates. */
type SampleId = 'contract' | Exclude<DocumentTemplateId, 'act'>;

/** Samples offered above the document, in gallery order. */
const SAMPLES: readonly SampleId[] = ['contract', 'letter', 'order', 'application', 'certificate'];

/** Accent colours offered for the editors; the first one is nuvra's default. */
const ACCENTS = [
  { name: 'Blue', value: '#409eff' },
  { name: 'Violet', value: '#6b4dff' },
  { name: 'Teal', value: '#0e9f8e' },
  { name: 'Rose', value: '#e5484d' },
  { name: 'Amber', value: '#d97706' }
] as const;

const tab = ref<DemoTab>('document');
const accent = ref<string>(ACCENTS[0].value);
const page = ref<PageSettings>(createPageSettings());
/** Sample document per language, so each keeps its own edits when the language changes. */
const documents = reactive({ en: en.demo.sample, uz: uz.demo.sample, ru: ru.demo.sample });
/**
 * The sample comment, anchored in the sample document as `<span data-comment="demo-comment">`. It has the shape of
 * nuvra's `DocumentComment`, which the published package the site type-checks against does not export yet.
 */
const sampleComments = (site: SiteMessages) => [
  { id: 'demo-comment', createdAt: '2026-09-14T09:30:00.000Z', replies: [], ...site.demo.comment }
];
/** Comments per language, next to the document they belong to. */
const comments = reactive({ en: sampleComments(en), uz: sampleComments(uz), ru: sampleComments(ru) });
/** Sample shown in each language's document. */
const samples = reactive<Record<keyof typeof documents, SampleId>>({ en: 'contract', uz: 'contract', ru: 'contract' });
/** Tracked changes start off; visitors switch them on with the toolbar button. */
const trackChanges = ref(false);
const description = ref('');
/** Interface language of the editors; it follows the site language until the visitor picks another one. */
const editorLocale = ref<EditorLocaleCode>(locale.value);
watch(locale, value => {
  editorLocale.value = value;
});

const sample = computed(() => samples[locale.value]);
/** Variables of the shown sample; the built-in templates label theirs in the editor's language. */
const variables = computed(() =>
  sample.value === 'contract'
    ? messages.value.demo.variables
    : getDocumentTemplate(sample.value, editorLocale.value).variables
);
const fileName = computed(() => messages.value.demo.samples[sample.value]);

/**
 * Loads a sample into the document of the site language. Built-in templates arrive in the editor's language with
 * their variables kept as chips, ready to be filled; only the contract carries the sample comment.
 */
const loadSample = (id: SampleId) => {
  const site = { en, uz, ru }[locale.value];
  samples[locale.value] = id;
  documents[locale.value] = id === 'contract' ? site.demo.sample : getDocumentTemplate(id, editorLocale.value).html;
  comments[locale.value] = id === 'contract' ? sampleComments(site) : [];
};
</script>

<template>
  <div class="demo" :style="{ '--demo-accent': accent }">
    <div class="demo__toolbar">
      <div class="segmented" role="tablist" :aria-label="messages.demo.tabs">
        <button
          type="button"
          role="tab"
          class="segmented__option"
          :class="{ 'is-active': tab === 'document' }"
          :aria-selected="tab === 'document'"
          @click="tab = 'document'"
        >
          {{ messages.demo.documentTab }}
        </button>
        <button
          type="button"
          role="tab"
          class="segmented__option"
          :class="{ 'is-active': tab === 'field' }"
          :aria-selected="tab === 'field'"
          @click="tab = 'field'"
        >
          {{ messages.demo.fieldTab }}
        </button>
      </div>

      <div class="segmented" role="radiogroup" :aria-label="messages.demo.editorLanguage">
        <button
          v-for="option in editorLocales"
          :key="option.code"
          type="button"
          role="radio"
          class="segmented__option"
          :class="{ 'is-active': editorLocale === option.code }"
          :aria-checked="editorLocale === option.code"
          :title="option.name"
          @click="editorLocale = option.code"
        >
          {{ option.code.toUpperCase() }}
        </button>
      </div>

      <div class="demo__accents" role="radiogroup" :aria-label="messages.demo.accent">
        <span class="demo__accents-label">{{ messages.demo.accent }}</span>
        <button
          v-for="option in ACCENTS"
          :key="option.value"
          type="button"
          role="radio"
          class="demo__swatch"
          :class="{ 'is-active': accent === option.value }"
          :style="{ background: option.value }"
          :aria-checked="accent === option.value"
          :aria-label="option.name"
          :title="option.name"
          @click="accent = option.value"
        />
      </div>
    </div>

    <div class="demo__window">
      <div class="demo__chrome" aria-hidden="true">
        <span />
        <span />
        <span />
        <em>{{ tab === 'document' ? `${fileName}.docx` : messages.demo.fieldTitle }}</em>
      </div>

      <div v-if="tab === 'document'" class="demo__samples" role="group" :aria-label="messages.demo.samples.label">
        <span class="demo__samples-label" aria-hidden="true">{{ messages.demo.samples.label }}</span>
        <button
          v-for="id in SAMPLES"
          :key="id"
          type="button"
          class="demo__sample"
          :class="{ 'is-active': sample === id }"
          :aria-pressed="sample === id"
          @click="loadSample(id)"
        >
          {{ messages.demo.samples[id] }}
        </button>
      </div>

      <div v-if="tab === 'document'" class="demo__body demo__body--document">
        <DocumentEditor v-model="documents[locale]" v-model:page="page" v-model:comments="comments[locale]" v-model:track-changes="trackChanges" :author="messages.demo.author" :height="640" :locale="editorLocale" :variables="variables" :title="fileName" />
      </div>

      <form v-else class="demo__body demo__form" @submit.prevent>
        <label class="demo__field">
          <span>{{ messages.demo.nameLabel }}</span>
          <input class="demo__input" type="text" :value="messages.demo.nameValue" />
        </label>
        <div class="demo__field">
          <span>{{ messages.demo.descriptionLabel }}</span>
          <Editor v-model="description" :locale="editorLocale" :max-length="500" :placeholder="messages.demo.descriptionPlaceholder" />
        </div>
        <p class="demo__hint">{{ messages.demo.fieldHint }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 16px;
}

.demo__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.demo__accents {
  display: flex;
  align-items: center;
  gap: 8px;
}

.demo__accents-label {
  margin-right: 4px;
  color: var(--color-text-faint);
  font-size: 13px;
}

.demo__swatch {
  width: 22px;
  height: 22px;
  padding: 0;
  border: 2px solid var(--color-bg);
  border-radius: 999px;
  box-shadow: 0 0 0 1px var(--color-border-strong);
  cursor: pointer;
  transition:
    transform 140ms ease,
    box-shadow 140ms ease;
}

.demo__swatch:hover {
  transform: scale(1.12);
}

.demo__swatch.is-active {
  box-shadow: 0 0 0 2px var(--demo-accent);
}

.demo__window {
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-elevated);
  box-shadow: var(--shadow-lg);
}

.demo__chrome {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 16px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-muted);
}

.demo__chrome span {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--color-border-strong);
}

.demo__chrome em {
  overflow: hidden;
  margin-left: 10px;
  color: var(--color-text-faint);
  font-size: 13px;
  font-style: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Sample gallery: one row that scrolls sideways on phones instead of wrapping into several. */
.demo__samples {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding: 10px 16px;
  border-bottom: 1px solid var(--color-border);
  scrollbar-width: thin;
}

.demo__samples-label {
  flex: 0 0 auto;
  margin-right: 4px;
  color: var(--color-text-faint);
  font-size: 13px;
}

.demo__sample {
  flex: 0 0 auto;
  height: 30px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-text-soft);
  background: var(--color-bg-elevated);
  font-family: inherit;
  font-size: 13px;
  font-weight: 550;
  white-space: nowrap;
  cursor: pointer;
  transition:
    color 140ms ease,
    border-color 140ms ease,
    background-color 140ms ease;
}

.demo__sample:hover {
  border-color: var(--color-border-strong);
  color: var(--color-text);
}

.demo__sample:focus-visible {
  outline: 2px solid var(--demo-accent);
  outline-offset: 2px;
}

.demo__sample.is-active {
  border-color: color-mix(in srgb, var(--demo-accent) 55%, var(--color-border));
  color: var(--color-text);
  background: color-mix(in srgb, var(--demo-accent) 12%, var(--color-bg-elevated));
}

@media (max-width: 640px) {
  .demo__samples-label {
    display: none;
  }
}

/* The chosen accent drives nuvra's primary colours; tints mix with the editor background, so dark mode works too. */
.demo__body :deep(.document-editor) {
  --nuvra-color-primary: var(--demo-accent);
  --nuvra-color-primary-hover: color-mix(in srgb, var(--demo-accent) 78%, #fff);
  --nuvra-color-primary-border: color-mix(in srgb, var(--demo-accent) 45%, var(--nuvra-bg));
  --nuvra-color-primary-muted: color-mix(in srgb, var(--demo-accent) 24%, var(--nuvra-bg));
  --nuvra-color-primary-soft: color-mix(in srgb, var(--demo-accent) 10%, var(--nuvra-bg));
}

.demo__body--document :deep(.document-editor:not(.is-fullscreen)) {
  border: 0;
  border-radius: 0;
}

.demo__form {
  display: grid;
  gap: 20px;
  max-width: 760px;
  margin: 0 auto;
  padding: 36px 24px 40px;
}

.demo__field {
  display: grid;
  gap: 8px;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 550;
}

.demo__input {
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--color-border-strong);
  border-radius: 10px;
  color: var(--color-text);
  background: var(--color-bg-elevated);
  font: inherit;
  font-weight: 400;
}

.demo__input:focus {
  border-color: var(--demo-accent);
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--demo-accent) 20%, transparent);
}

.demo__hint {
  margin: 0;
  color: var(--color-text-faint);
  font-size: 13px;
}
</style>
