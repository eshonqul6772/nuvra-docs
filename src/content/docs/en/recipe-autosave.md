# Autosave

This recipe loads a document from your backend, saves it automatically while the user works and shows whether the latest changes have reached the server. It needs nothing but Vue and `fetch`: the HTML, the page settings and the comments travel together as one JSON payload.

## The payload and the server

The client and the server agree on one shape, kept here in `document-payload.ts`:

```ts
import type { DocumentComment, PageSettings } from 'nuvra';

export interface DocumentPayload {
  html: string;
  page: PageSettings;
  comments: DocumentComment[];
}
```

The server needs two endpoints:

- `GET /api/documents/:id` returns `200` with a `DocumentPayload`.
- `PUT /api/documents/:id` receives a `DocumentPayload` as JSON, replaces the stored document and answers `204` (any `2xx` works).

A `PUT` replaces the whole document, so sending the same payload twice is harmless. Do not trust the HTML only because the editor sanitized it in the browser: check the size and sanitize it on the server as well. If several people edit one document, add a version number to the payload and answer `409` to an outdated one.

## The component

```vue
<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { DocumentEditor, type DocumentComment, type PageSettings, createPageSettings } from 'nuvra';
import type { DocumentPayload } from './document-payload';

const props = defineProps<{ documentId: string }>();

const SAVE_DELAY = 1000;
const url = () => `/api/documents/${props.documentId}`;

const html = ref('');
const page = ref<PageSettings>(createPageSettings());
const comments = ref<DocumentComment[]>([]);
const editor = ref<InstanceType<typeof DocumentEditor>>();

const ready = ref(false); // true once the loaded document is in place
const loadFailed = ref(false);
const status = ref<'saved' | 'saving' | 'error'>('saved');

let lastSaved = ''; // JSON of the last payload the server accepted
let timer: ReturnType<typeof setTimeout> | undefined;
let inFlight: Promise<void> | null = null;
let queued = false;

const snapshot = () => {
  // getHTML() writes edits the editor has not put into v-model yet
  const payload: DocumentPayload = { html: editor.value?.getHTML() ?? html.value, page: page.value, comments: comments.value };
  return JSON.stringify(payload);
};

const save = async (): Promise<void> => {
  clearTimeout(timer);
  if (!ready.value) return;
  if (inFlight) {
    queued = true; // one more save runs when the current request finishes
    return inFlight;
  }
  const body = snapshot();
  if (body === lastSaved) {
    status.value = 'saved';
    return;
  }
  status.value = 'saving';
  inFlight = fetch(url(), { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body })
    .then(response => {
      if (!response.ok) throw new Error(`Save failed: ${response.status}`);
      lastSaved = body;
      status.value = 'saved';
    })
    .catch(() => {
      status.value = 'error';
    })
    .finally(() => {
      inFlight = null;
    });
  await inFlight;
  if (queued) {
    queued = false;
    await save();
  }
};

// a tiny debounce: every change restarts the timer
const schedule = () => {
  if (!ready.value) return;
  status.value = 'saving';
  clearTimeout(timer);
  timer = setTimeout(save, SAVE_DELAY);
};

watch(html, schedule);
watch([page, comments], schedule, { deep: true });

const warnIfUnsaved = (event: BeforeUnloadEvent) => {
  if (!ready.value || (!inFlight && snapshot() === lastSaved)) return;
  void save();
  event.preventDefault();
  event.returnValue = '';
};

onMounted(async () => {
  window.addEventListener('beforeunload', warnIfUnsaved);
  try {
    const response = await fetch(url());
    if (!response.ok) throw new Error(`Load failed: ${response.status}`);
    const stored: DocumentPayload = await response.json();
    html.value = stored.html;
    page.value = stored.page ?? createPageSettings();
    comments.value = stored.comments ?? [];
    await nextTick(); // the editor shows the loaded document
    lastSaved = snapshot();
    await nextTick(); // the watchers have seen the loaded values and ignored them
    ready.value = true;
  } catch {
    loadFailed.value = true;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', warnIfUnsaved);
  void save();
});
</script>

<template>
  <p v-if="loadFailed" role="alert">The document could not be loaded.</p>
  <div v-else>
    <p v-if="ready" class="save-status" role="status">
      <template v-if="status === 'saving'">Saving…</template>
      <template v-else-if="status === 'saved'">All changes saved</template>
      <template v-else>Not saved <button type="button" @click="save">Retry</button></template>
    </p>
    <DocumentEditor
      ref="editor"
      v-model="html"
      v-model:page="page"
      v-model:comments="comments"
      :disabled="!ready"
      author="Aziz Karimov"
      @blur="save"
    />
  </div>
</template>
```

## How it works

- **No save after loading.** Assigning the loaded values triggers the watchers, but `ready` is still `false`, so they do nothing. `lastSaved` starts as the loaded document, and a save is skipped whenever the payload has not changed, for example after typing and undoing.
- **Debounce.** `v-model` itself is updated about 200 ms after the user stops typing; the watch then waits one more second. Page settings and comments are objects, so they are watched with `deep: true`.
- **No overlapping requests.** While a `PUT` is running, another call only sets `queued`. When the request finishes, one more save sends the latest payload, so the server never receives an older document after a newer one. An `AbortController` that cancels the running request is an alternative, but the server may already have written it.
- **Blur.** The editor writes pending edits before it emits `blur`, so `@blur="save"` stores the document right away when the user leaves it.
- **Leaving the page.** `beforeunload` asks the browser to warn while changes are not stored and starts a save, which completes if the user stays. When the component is unmounted by your router, the last changes are sent as well.
- **Errors.** A failed request sets `'error'`; the next change or the **Retry** button tries again.

`disabled` keeps the document read-only until it is loaded, so nothing typed before that can be lost.

## See also

- [Comments and comparison](/docs/review) — the comment list and tracked changes stored in the payload.
- [Usage](/docs/usage) — the document value and page settings.
- [Forms and validation](/docs/recipe-forms) — `Editor` as a field of a form.
