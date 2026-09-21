<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  type Collaborator,
  type DocumentComment,
  DocumentEditor,
  type DocumentImageUploadHandler,
  type EditorLocaleCode,
  type PageSettings,
  type SelectionOffsets,
  type SlashCommand,
  TOOLBAR_TOOLS,
  type ToolbarTool,
  createPageSettings,
  editorLocales
} from 'nuvra';

import {
  NUMBER_LIMITS,
  ORIENTATIONS,
  PAGE_SIZES,
  type PlaygroundOptions,
  TOOLBAR_LAYOUTS,
  VIEW_MODES,
  clampNumber,
  createDefaultOptions,
  optionsToQuery,
  readOptionsFromQuery
} from '../components/playground-options';
import PlaygroundOutput, { type PlaygroundEvent, type PlaygroundOutputTab } from '../components/playground-output.vue';
import { buildPlaygroundSnippet } from '../components/playground-snippet';
import { locale, messages } from '../i18n';
import type { SiteMessages } from '../i18n/messages/en';

/**
 * Playground: a live `DocumentEditor` next to a panel of its props and bindings, with the code of the chosen setup, the
 * values the editor emits and its events below it. The chosen setup is kept in the address, so a link reopens it.
 */
defineOptions({ name: 'PlaygroundPage' });

/** Events kept on the events tab; older ones drop off. */
const MAX_EVENTS = 60;
/** How long the simulated upload takes, in milliseconds. */
const UPLOAD_DELAY = 1200;
/** Wait before the address follows the panel, so typing in a field does not add a history step per key. */
const QUERY_DELAY = 300;

const route = useRoute();
const router = useRouter();

/** The sample comment of the demo document, anchored as `<span data-comment="demo-comment">`. */
const sampleComments = (site: SiteMessages): DocumentComment[] => [
  { id: 'demo-comment', createdAt: '2026-09-14T09:30:00.000Z', replies: [], ...site.demo.comment }
];

const localeCodes = editorLocales.map(item => item.code);

/** The panel as it opens in the current site language. */
const defaults = computed(() =>
  createDefaultOptions({
    locale: locale.value as EditorLocaleCode,
    placeholder: messages.value.playground.placeholderValue,
    title: messages.value.demo.fileName,
    author: messages.value.demo.author
  })
);

const options = reactive<PlaygroundOptions>(readOptionsFromQuery(route.query, defaults.value, localeCodes));
const html = ref(messages.value.demo.sample);
const comments = ref<DocumentComment[]>(sampleComments(messages.value));
const trackChanges = ref(false);
const page = ref<PageSettings>({
  ...createPageSettings(),
  size: options.pageSize,
  orientation: options.orientation
});

/* Props */

const height = computed(() => clampNumber('height', options.height, defaults.value.height));
const minHeight = computed(() => clampNumber('minHeight', options.minHeight, defaults.value.minHeight));
const maxHeight = computed(() => Math.max(minHeight.value, clampNumber('maxHeight', options.maxHeight, 600)));
const canvasPadding = computed(() => clampNumber('canvasPadding', options.canvasPadding, 50));
const maxLength = computed(() => clampNumber('maxLength', options.maxLength, 0));
const maxImageSizeMb = computed(() => clampNumber('maxImageSizeMb', options.maxImageSizeMb, 10));

/** Options with every number field clamped, as the editor and the snippet receive them. */
const effectiveOptions = computed<PlaygroundOptions>(() => ({
  ...options,
  height: height.value,
  minHeight: minHeight.value,
  maxHeight: maxHeight.value,
  canvasPadding: canvasPadding.value,
  maxLength: maxLength.value,
  maxImageSizeMb: maxImageSizeMb.value
}));

const variables = computed(() => (options.variables ? messages.value.demo.variables : undefined));

const slashCommands = computed<SlashCommand[] | undefined>(() =>
  options.slashCommands
    ? [
        {
          id: 'today',
          label: messages.value.playground.slashCommandLabel,
          icon: 'calendar-days',
          run: engine => engine.insertText(new Date().toLocaleDateString(locale.value))
        }
      ]
    : undefined
);

const collaborators = computed<Collaborator[] | undefined>(() =>
  options.collaborators
    ? [{ id: 'guest', name: messages.value.playground.collaboratorName, selection: { anchor: 12, focus: 40 } }]
    : undefined
);

/** Reads the image as a data URL after a pause, so the editor's upload state can be seen. */
const simulateUpload: DocumentImageUploadHandler = file =>
  new Promise((resolve, reject) => {
    logEvent('uploadImage', { name: file.name, size: file.size, type: file.type });
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => setTimeout(() => resolve(String(reader.result)), UPLOAD_DELAY);
    reader.readAsDataURL(file);
  });

/**
 * The editor reads the first view, the ruler and `autofocus` when it mounts, and a model is either bound or not for its
 * whole life, so changing any of them mounts a fresh editor; the document itself lives in `html` and survives.
 */
const editorKey = computed(() =>
  [
    options.defaultViewMode,
    options.ruler,
    options.autofocus,
    options.bindComments,
    options.bindTrackChanges,
    options.bindPage
  ].join('|')
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
  }),
  ...(options.bindPage && {
    page: page.value,
    'onUpdate:page': (value: PageSettings) => {
      page.value = value;
      // The page setup dialog of the editor changes them as well.
      options.pageSize = value.size;
      options.orientation = value.orientation;
    }
  })
}));

watch(
  () => [options.pageSize, options.orientation] as const,
  ([size, orientation]) => {
    if (page.value.size !== size || page.value.orientation !== orientation)
      page.value = { ...page.value, size, orientation };
  }
);

/* Toolbar tools */

const toolsEnabled = computed({
  get: () => options.tools !== null,
  set: enabled => {
    options.tools = enabled ? [...TOOLBAR_TOOLS] : null;
  }
});

const toggleTool = (tool: ToolbarTool, shown: boolean) => {
  const current = new Set(options.tools ?? TOOLBAR_TOOLS);
  if (shown) current.add(tool);
  else current.delete(tool);
  // The prop keeps the toolbar's own order, whatever order the tools were ticked in.
  options.tools = TOOLBAR_TOOLS.filter(item => current.has(item));
};

/* Events */

const events = ref<PlaygroundEvent[]>([]);
let eventId = 0;

const logEvent = (name: string, detail?: unknown) => {
  const entry: PlaygroundEvent = {
    id: ++eventId,
    time: new Date().toLocaleTimeString(locale.value, { hour12: false }),
    name,
    detail: detail === undefined ? '' : describe(detail)
  };
  events.value = [entry, ...events.value].slice(0, MAX_EVENTS);
};

/** A payload as short JSON; errors keep their message, which `JSON.stringify` would drop. */
const describe = (value: unknown): string =>
  value instanceof Error ? `${value.name}: ${value.message}` : (JSON.stringify(value) ?? String(value));

/** The caret moves on every key and click; consecutive moves replace one another instead of flooding the list. */
const onSelectionChange = (selection: SelectionOffsets | null) => {
  const [latest] = events.value;
  if (latest?.name === 'selectionChange') events.value = events.value.slice(1);
  logEvent('selectionChange', selection);
};

/* Output */

const snippet = computed(() =>
  buildPlaygroundSnippet(effectiveOptions.value, {
    variables: messages.value.demo.variables,
    slashCommandLabel: messages.value.playground.slashCommandLabel,
    collaboratorName: messages.value.playground.collaboratorName
  })
);

/** One block per line, so the HTML tab reads like the document. */
const formatHtml = (source: string) =>
  source.replace(/(<\/(?:p|h[1-6]|li|ul|ol|blockquote|pre|table|thead|tbody|tr|div)>|<hr>)(?!\n)/g, '$1\n').trim();

const outputTabs = computed<PlaygroundOutputTab[]>(() => {
  const site = messages.value.playground;
  return [
    { id: 'code', label: site.code, lang: 'vue', code: snippet.value },
    {
      id: 'html',
      label: 'v-model',
      lang: 'html',
      code: formatHtml(html.value),
      meta: site.characters(html.value.length)
    },
    {
      id: 'comments',
      label: 'comments',
      lang: 'json',
      code: options.bindComments ? JSON.stringify(comments.value, null, 2) : null,
      note: site.notBound('v-model:comments')
    },
    {
      id: 'page',
      label: 'page',
      lang: 'json',
      code: options.bindPage ? JSON.stringify(page.value, null, 2) : null,
      note: site.notBound('v-model:page')
    }
  ];
});

/* Actions */

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

/** Brings every option and the document back to how the page opens. */
const resetAll = () => {
  Object.assign(options, defaults.value);
  trackChanges.value = false;
  page.value = createPageSettings();
  events.value = [];
  loadSample();
};

/** How long the link button shows its confirmation, in milliseconds. */
const LINK_COPIED_DURATION = 2000;
const linkCopied = ref(false);
let linkTimer: ReturnType<typeof setTimeout> | undefined;

/** Copies the address, which the panel keeps in sync with the chosen setup. */
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
  } catch {
    return;
  }
  linkCopied.value = true;
  clearTimeout(linkTimer);
  linkTimer = setTimeout(() => {
    linkCopied.value = false;
  }, LINK_COPIED_DURATION);
};

/* Address */

let queryTimer: ReturnType<typeof setTimeout> | undefined;

watch(
  () => optionsToQuery(options, defaults.value),
  query => {
    clearTimeout(queryTimer);
    queryTimer = setTimeout(() => {
      router.replace({ query, hash: route.hash });
    }, QUERY_DELAY);
  },
  { deep: true }
);

onBeforeUnmount(() => {
  clearTimeout(queryTimer);
  clearTimeout(linkTimer);
});

/* Language */

// Texts that still hold the previous language's defaults follow the site language; edited ones stay.
watch(messages, (next, previous) => {
  if (options.placeholder === previous.playground.placeholderValue)
    options.placeholder = next.playground.placeholderValue;
  if (options.title === previous.demo.fileName) options.title = next.demo.fileName;
  if (options.author === previous.demo.author) options.author = next.demo.author;
  if (html.value === previous.demo.sample) loadSample();
});

watch(locale, (next, previous) => {
  if (options.locale === previous) options.locale = next as EditorLocaleCode;
});

watchEffect(() => {
  document.title = messages.value.meta.playgroundTitle;
});
</script>

<template>
  <main class="page playground container">
    <header class="playground__header">
      <div>
        <p class="eyebrow">{{ messages.playground.eyebrow }}</p>
        <h1 class="playground__title">{{ messages.playground.title }}</h1>
        <p class="playground__lead">{{ messages.playground.lead }}</p>
      </div>
      <div class="playground__header-actions">
        <button type="button" class="panel-button" @click="resetAll">{{ messages.playground.reset }}</button>
        <button type="button" class="panel-button panel-button--primary" aria-live="polite" @click="copyLink">
          {{ linkCopied ? messages.playground.linkCopied : messages.playground.copyLink }}
        </button>
      </div>
    </header>

    <div class="playground__layout">
      <div class="playground__main">
        <section class="playground__stage" :aria-label="messages.playground.editor">
          <DocumentEditor
            :key="editorKey"
            v-model="html"
            v-bind="modelBindings"
            :default-view-mode="options.defaultViewMode"
            :height="options.autoHeight ? 'auto' : height"
            :min-height="minHeight"
            :max-height="maxHeight"
            :canvas-padding="canvasPadding"
            :locale="options.locale"
            :disabled="options.disabled"
            :autofocus="options.autofocus"
            :ruler="options.ruler"
            :max-length="maxLength"
            :max-image-size-mb="maxImageSizeMb"
            :placeholder="options.placeholder"
            :title="options.title"
            :author="options.author"
            :tools="options.tools ?? undefined"
            :toolbar-layout="options.toolbarLayout"
            :variables="variables"
            :slash-commands="slashCommands"
            :collaborators="collaborators"
            :upload-image="options.uploadImage ? simulateUpload : undefined"
            @focus="logEvent('focus')"
            @blur="logEvent('blur')"
            @selection-change="onSelectionChange"
            @upload-error="logEvent('uploadError', $event)"
            @import-error="logEvent('importError', $event)"
            @export-error="logEvent('exportError', $event)"
          />
        </section>

        <section class="playground__output" :aria-label="messages.playground.output">
          <PlaygroundOutput :tabs="outputTabs" :events="events" @clear-events="events = []" />
        </section>
      </div>

      <aside class="playground__panel" :aria-label="messages.playground.controls">
        <details class="panel-group" open>
          <summary class="panel-group__title">{{ messages.playground.groupLayout }}</summary>
          <div class="panel-group__body">
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
                v-bind="NUMBER_LIMITS.height"
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
            <div v-if="options.autoHeight" class="control-row control--nested">
              <label class="control">
                <span class="control__text">
                  <code>minHeight</code>
                  <small>{{ messages.playground.minHeight }}</small>
                </span>
                <input
                  v-model.number="options.minHeight"
                  class="control__input"
                  type="number"
                  inputmode="numeric"
                  v-bind="NUMBER_LIMITS.minHeight"
                />
              </label>
              <label class="control">
                <span class="control__text">
                  <code>maxHeight</code>
                  <small>{{ messages.playground.maxHeight }}</small>
                </span>
                <input
                  v-model.number="options.maxHeight"
                  class="control__input"
                  type="number"
                  inputmode="numeric"
                  v-bind="NUMBER_LIMITS.maxHeight"
                />
              </label>
            </div>

            <label class="control">
              <span class="control__text">
                <code>canvasPadding</code>
                <small>{{ messages.playground.canvasPadding }} · {{ canvasPadding }}px</small>
              </span>
              <input
                v-model.number="options.canvasPadding"
                class="control__range"
                type="range"
                v-bind="NUMBER_LIMITS.canvasPadding"
              />
            </label>

            <label class="control control--check">
              <input v-model="options.ruler" type="checkbox" />
              <span class="control__text">
                <code>ruler</code>
                <small>{{ messages.playground.ruler }}</small>
              </span>
            </label>
          </div>
        </details>

        <details class="panel-group" open>
          <summary class="panel-group__title">{{ messages.playground.groupBehaviour }}</summary>
          <div class="panel-group__body">
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

            <div class="control-row">
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
                  v-bind="NUMBER_LIMITS.maxLength"
                />
              </label>
              <label class="control">
                <span class="control__text">
                  <code>maxImageSizeMb</code>
                  <small>{{ messages.playground.maxImageSizeMb }}</small>
                </span>
                <input
                  v-model.number="options.maxImageSizeMb"
                  class="control__input"
                  type="number"
                  inputmode="numeric"
                  v-bind="NUMBER_LIMITS.maxImageSizeMb"
                />
              </label>
            </div>

            <label class="control control--check">
              <input v-model="options.disabled" type="checkbox" />
              <span class="control__text">
                <code>disabled</code>
                <small>{{ messages.playground.disabled }}</small>
              </span>
            </label>

            <label class="control control--check">
              <input v-model="options.autofocus" type="checkbox" />
              <span class="control__text">
                <code>autofocus</code>
                <small>{{ messages.playground.autofocus }}</small>
              </span>
            </label>
          </div>
        </details>

        <details class="panel-group">
          <summary class="panel-group__title">{{ messages.playground.groupText }}</summary>
          <div class="panel-group__body">
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
          </div>
        </details>

        <details class="panel-group">
          <summary class="panel-group__title">{{ messages.playground.groupToolbar }}</summary>
          <div class="panel-group__body">
            <div class="control">
              <span id="control-toolbar-layout" class="control__text">
                <code>toolbarLayout</code>
                <small>{{ messages.playground.toolbarLayout }}</small>
              </span>
              <div class="segmented" role="radiogroup" aria-labelledby="control-toolbar-layout">
                <button
                  v-for="layout in TOOLBAR_LAYOUTS"
                  :key="layout"
                  type="button"
                  role="radio"
                  class="segmented__option"
                  :class="{ 'is-active': options.toolbarLayout === layout }"
                  :aria-checked="options.toolbarLayout === layout"
                  @click="options.toolbarLayout = layout"
                >
                  {{ layout === 'row' ? messages.playground.toolbarRow : messages.playground.toolbarTabs }}
                </button>
              </div>
            </div>

            <label class="control control--check">
              <input v-model="toolsEnabled" type="checkbox" />
              <span class="control__text">
                <code>tools</code>
                <small>{{ messages.playground.tools }} — {{ messages.playground.toolsHint }}</small>
              </span>
            </label>

            <template v-if="options.tools">
              <div class="panel-group__actions">
                <button type="button" class="chip-button" @click="options.tools = [...TOOLBAR_TOOLS]">
                  {{ messages.playground.toolsAll }}
                </button>
                <button type="button" class="chip-button" @click="options.tools = []">
                  {{ messages.playground.toolsNone }}
                </button>
                <span class="tool-count">{{ options.tools.length }} / {{ TOOLBAR_TOOLS.length }}</span>
              </div>
              <div class="tool-grid">
                <label v-for="tool in TOOLBAR_TOOLS" :key="tool" class="tool-chip">
                  <input
                    type="checkbox"
                    :checked="options.tools.includes(tool)"
                    @change="toggleTool(tool, ($event.target as HTMLInputElement).checked)"
                  />
                  <code>{{ tool }}</code>
                </label>
              </div>
            </template>
          </div>
        </details>

        <details class="panel-group" open>
          <summary class="panel-group__title">{{ messages.playground.groupData }}</summary>
          <div class="panel-group__body">
            <label class="control control--check">
              <input v-model="options.variables" type="checkbox" />
              <span class="control__text">
                <code>variables</code>
                <small>{{ messages.playground.variables }}</small>
              </span>
            </label>

            <label class="control control--check">
              <input v-model="options.slashCommands" type="checkbox" />
              <span class="control__text">
                <code>slashCommands</code>
                <small>{{ messages.playground.slashCommands }}</small>
              </span>
            </label>

            <label class="control control--check">
              <input v-model="options.collaborators" type="checkbox" />
              <span class="control__text">
                <code>collaborators</code>
                <small>{{ messages.playground.collaborators }}</small>
              </span>
            </label>

            <label class="control control--check">
              <input v-model="options.uploadImage" type="checkbox" />
              <span class="control__text">
                <code>uploadImage</code>
                <small>{{ messages.playground.uploadImage }}</small>
              </span>
            </label>
          </div>
        </details>

        <details class="panel-group" open>
          <summary class="panel-group__title">{{ messages.playground.bindings }}</summary>
          <div class="panel-group__body">
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

            <label class="control control--check">
              <input v-model="options.bindPage" type="checkbox" />
              <span class="control__text">
                <code>v-model:page</code>
                <small>{{ messages.playground.bindPage }}</small>
              </span>
            </label>
            <div class="control-row control--nested">
              <label class="control">
                <span class="control__text">
                  <code>size</code>
                  <small>{{ messages.playground.pageSize }}</small>
                </span>
                <select v-model="options.pageSize" class="control__input" :disabled="!options.bindPage">
                  <option v-for="size in PAGE_SIZES" :key="size" :value="size">{{ size.toUpperCase() }}</option>
                </select>
              </label>
              <label class="control">
                <span class="control__text">
                  <code>orientation</code>
                  <small>{{ messages.playground.orientation }}</small>
                </span>
                <select v-model="options.orientation" class="control__input" :disabled="!options.bindPage">
                  <option v-for="item in ORIENTATIONS" :key="item" :value="item">
                    {{ messages.playground[item] }}
                  </option>
                </select>
              </label>
            </div>
          </div>
        </details>

        <div class="panel-group panel-group--static">
          <p class="panel-group__title">{{ messages.playground.content }}</p>
          <div class="panel-group__actions">
            <button type="button" class="panel-button" @click="loadSample">{{ messages.playground.loadSample }}</button>
            <button type="button" class="panel-button" @click="clearDocument">{{ messages.playground.clear }}</button>
          </div>
        </div>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.playground.container {
  max-width: 1360px;
  padding-block: 48px 104px;
}

.playground__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px 32px;
  margin-bottom: 32px;
}

.playground__header > div:first-child {
  max-width: 760px;
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

.playground__header-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.playground__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  align-items: start;
  gap: 24px;
}

.playground__main {
  display: grid;
  gap: 24px;
  min-width: 0;
}

.playground__stage {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
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
  max-height: calc(100vh - var(--header-height) - 48px);
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-elevated);
  scrollbar-width: thin;
}

.panel-group {
  min-width: 0;
}

.panel-group + .panel-group {
  border-top: 1px solid var(--color-border);
}

.panel-group__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  padding: 14px 18px;
  color: var(--color-text-faint);
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  list-style: none;
  cursor: pointer;
  user-select: none;
}

.panel-group__title::-webkit-details-marker {
  display: none;
}

summary.panel-group__title::after {
  width: 7px;
  height: 7px;
  border-right: 1.5px solid currentcolor;
  border-bottom: 1.5px solid currentcolor;
  content: '';
  transform: rotate(-45deg);
  transition: transform 160ms ease;
}

details[open] > summary.panel-group__title::after {
  transform: rotate(45deg);
}

summary.panel-group__title:hover {
  color: var(--color-text-soft);
}

summary.panel-group__title:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

.panel-group--static .panel-group__title {
  cursor: default;
}

.panel-group__body {
  display: grid;
  gap: 14px;
  padding: 0 18px 18px;
}

.panel-group--static .panel-group__actions {
  padding: 0 18px 18px;
}

.panel-group__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.control {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.control-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.control--check {
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: 10px;
  cursor: pointer;
}

.control--check input,
.tool-chip input {
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

.control__range {
  width: 100%;
  margin: 4px 0 0;
  accent-color: var(--color-accent);
}

.control .segmented {
  justify-self: start;
}

/* Toolbar tools */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px;
}

.tool-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 5px 8px;
  border-radius: 8px;
  cursor: pointer;
}

.tool-chip:hover {
  background: var(--color-bg-muted);
}

.tool-chip input {
  flex: none;
  margin: 0;
}

.tool-chip code {
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tool-count {
  margin-left: auto;
  color: var(--color-text-faint);
  font-family: var(--font-mono);
  font-size: 12px;
}

.chip-button,
.panel-button {
  border: 1px solid var(--color-border-strong);
  border-radius: 999px;
  color: var(--color-text);
  background: var(--color-bg);
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 140ms ease;
}

.chip-button {
  height: 26px;
  padding: 0 10px;
  font-size: 12.5px;
}

.panel-button {
  height: 34px;
  padding: 0 14px;
  font-size: 13.5px;
}

.chip-button:hover,
.panel-button:hover {
  border-color: var(--color-text-faint);
}

.panel-button--primary {
  min-width: 150px;
  border-color: var(--color-text);
  color: var(--color-bg);
  background: var(--color-text);
}

.panel-button--primary:hover {
  opacity: 0.88;
}

.chip-button:focus-visible,
.panel-button:focus-visible,
.control--check input:focus-visible,
.tool-chip input:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

@media (max-width: 1100px) {
  .playground__layout {
    grid-template-columns: minmax(0, 1fr);
  }

  /* Below the editor the panel comes before the output, so the controls stay next to what they change. */
  .playground__main {
    display: contents;
  }

  .playground__stage {
    order: 1;
  }

  .playground__panel {
    position: static;
    order: 2;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    align-items: start;
    max-height: none;
    overflow: visible;
  }

  .playground__output {
    order: 3;
  }

  .panel-group + .panel-group {
    border-top: 0;
  }

  .panel-group {
    border-bottom: 1px solid var(--color-border);
  }
}

@media (max-width: 640px) {
  .playground.container {
    padding-top: 32px;
  }

  .playground__panel {
    grid-template-columns: minmax(0, 1fr);
  }

  .control-row {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
