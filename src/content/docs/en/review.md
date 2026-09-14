# Comments and comparison

Documents are rarely written by one person. nuvra lets reviewers leave **comments** on parts of the text, records edits as **tracked changes** to accept or reject, and shows what changed between two **versions** of a document.

## Comments

### Turning comments on

Bind a list to `v-model:comments`. The comment tools appear only while the binding is there, so an editor without it looks as before. `author` is the name written on new comments, replies and tracked changes.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, type DocumentComment } from 'nuvra';

const html = ref('');
const comments = ref<DocumentComment[]>([]);
</script>

<template>
  <DocumentEditor v-model="html" v-model:comments="comments" author="Aziz Karimov" />
</template>
```

Start with an empty array: `undefined` keeps the tools hidden.

### Working with comments

The comment tools are in the **Review** menu at the right side of the toolbar (the speech bubble with an arrow), below the tracked changes entries:

- **Add comment** anchors a comment to the selected text and opens the form. It needs selected text; the shortcut is `Ctrl+Alt+M`. `Ctrl+Enter` saves the comment, `Escape` or **Cancel** drops it together with its anchor.
- **Comments** opens and closes the panel with every comment in the order of its text.

In the panel:

| Action | Result |
| --- | --- |
| Click a comment | Selects its text in the document and scrolls to it. |
| **Reply** | Adds a reply to the thread. |
| **Resolve** / **Reopen** | Closes or reopens the discussion. A resolved comment keeps its anchor, but its text is no longer highlighted. |
| Delete (trash button) | Removes the comment and its anchor; the text itself stays. |

Placing the caret in commented text highlights that comment in the panel. When the commented text is deleted, the comment stays in the list with the note "The commented text was deleted"; undo brings the text and the link back.

In a `disabled` editor comments can be read, but not added or changed.

### How comments are saved

The document HTML keeps only the anchors:

```html
<p>The Contractor delivers the work <span data-comment="cmfz3k1a9x2b7q">within 30 days</span>.</p>
```

The comments themselves are plain data in your list:

```json
[
  {
    "id": "cmfz3k1a9x2b7q",
    "text": "Should this be working days?",
    "author": "Aziz Karimov",
    "createdAt": "2026-09-14T09:30:00.000Z",
    "resolved": false,
    "replies": [
      { "id": "cmfz3m8d0p1k2c", "text": "Yes, 30 working days.", "author": "Dilnoza Rahimova", "createdAt": "2026-09-14T10:05:00.000Z" }
    ]
  }
]
```

The highlight is drawn only inside the editor. Printing and HTML export show the text without it, and the Word export writes the text without comments.

### Saving to a backend

Store the comment list next to the document and load both together:

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { DocumentEditor, type DocumentComment, type PageSettings, createPageSettings } from 'nuvra';

interface StoredDocument {
  html: string;
  page: PageSettings;
  comments: DocumentComment[];
}

const html = ref('');
const page = ref<PageSettings>(createPageSettings());
const comments = ref<DocumentComment[]>([]);
const editor = ref<InstanceType<typeof DocumentEditor>>();

onMounted(async () => {
  const response = await fetch('/api/documents/42');
  const stored: StoredDocument = await response.json();
  html.value = stored.html;
  page.value = stored.page;
  comments.value = stored.comments ?? [];
});

const save = async () => {
  const body: StoredDocument = {
    html: editor.value?.getHTML() ?? html.value,
    page: page.value,
    comments: comments.value
  };
  await fetch('/api/documents/42', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
};
</script>

<template>
  <DocumentEditor
    ref="editor"
    v-model="html"
    v-model:page="page"
    v-model:comments="comments"
    author="Aziz Karimov"
  />
  <button type="button" @click="save">Save</button>
</template>
```

On the server the comments fit in a JSON column of the documents table, or in a table of their own keyed by the document and the comment `id`.

- `getHTML()` writes the latest edits before saving, so the anchors in the HTML match the list.
- The list changes on every add, reply, resolve and delete. Save it with the document, or watch it with `watch(comments, save, { deep: true })`.
- Comments whose text was deleted are not removed automatically, because undo can restore the text. To drop them when a document is finished, keep only the ids the HTML still contains:

```ts
const anchored = new Set(Array.from(html.matchAll(/data-comment="([\w-]+)"/g), match => match[1]));
const kept = comments.filter(comment => anchored.has(comment.id));
```

`createCommentId()` creates ids in the same format, for comments added by your own code.

## Tracked changes

### Turning tracking on

Bind `v-model:trackChanges`, or let users choose "Track changes" in the **Review** menu of the toolbar. While it is on, typed text is marked as inserted and deleted text stays in the document, marked as deleted, until someone accepts or rejects the change. `author` is written on every change.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor } from 'nuvra';

const html = ref('');
const trackChanges = ref(true);
</script>

<template>
  <DocumentEditor v-model="html" v-model:track-changes="trackChanges" author="Aziz Karimov" />
</template>
```

Tracking is off by default. The "Track changes" entry is disabled while the editor is `disabled`. The Review button is highlighted while tracking is on or one of the review panels is open.

### How changes are saved

Changes are part of the document HTML, so `v-model` saves them with nothing else to store:

```html
<p>The Contractor delivers the work within
  <del data-change="tmfz3k1a9x2b" data-author="Aziz Karimov" data-time="2026-09-14T09:30:00Z">30</del><ins data-change="tmfz3k1a9x2b" data-author="Aziz Karimov" data-time="2026-09-14T09:30:00Z">45</ins>
  days.</p>
```

- Inserted text is green and underlined, deleted text red and struck through, in the editor, in print and in HTML export.
- Typing keeps adding to one change until the caret moves, so a typed word is one change, not one per letter.
- The deleted text stays in the HTML. Accept or reject the changes before the document is used as final.
- Pasted `<ins>` and `<del>` without `data-change` are ordinary underline and strikethrough.

### Reviewing changes

"Changes" in the **Review** menu opens a panel with every change in document order: whether text was inserted or deleted, the author, the time and the text.

| Action | Result |
| --- | --- |
| Click a change | Selects its text in the document and scrolls to it. |
| **Accept** | Keeps an insertion as ordinary text, or removes deleted text for good. |
| **Reject** | Removes an insertion, or restores deleted text. |
| **Accept all** / **Reject all** | Does the same for every change in the document. |

Every accept or reject is an undo step. In a `disabled` editor changes can be reviewed, but not accepted or rejected.

### From code

The engine of a template ref reads and resolves changes, for example to accept everything before publishing:

```ts
const editor = ref<InstanceType<typeof DocumentEditor>>();

const publish = async () => {
  const engine = editor.value?.engine;
  if (!engine) return;
  const changes = engine.getChanges(); // TrackedChange[]: id, type, author, time, text
  if (changes.length && !confirm(`Accept ${changes.length} changes?`)) return;
  engine.resolveChanges(true);
  await fetch('/api/documents/42/publish', { method: 'POST', body: editor.value?.getHTML() });
};
```

`resolveChanges(accept, id)` resolves one change, `selectChange(id)` shows it in the document.

### What is tracked

| Tracked | Not tracked |
| --- | --- |
| Typing, including input methods (IME) | Formatting: bold, colours, fonts, alignment |
| Backspace and Delete of characters, words and lines | Block changes: headings, lists, tables, page breaks |
| Deleting or replacing a selection | Joining two paragraphs with Backspace or Delete at their edge |
| Cut, paste, drag and drop | Enter |
| Text inserted by commands that insert text or content, such as dates, signature blocks and document templates | Find and replace, footnotes and template variables |

Deleting text that the same author inserted while tracking removes it for real, as Word does, and Backspace steps over text that is already marked deleted.

### Word round trip

The Word export writes tracked changes as Word revisions, with their author and time, and opening a Word file reads Word's revisions back as tracked changes. A document can go to Word for review and come back with its changes still open. Only insertions and deletions of text make the trip: text Word marked as moved comes back as a deletion at its old place and an insertion at the new one, and a formatting change recorded in Word arrives as the new formatting without a revision.

## Comparing versions

`DocumentCompare` shows what changed between two versions of a document on one sheet: the new version, with inserted words underlined in green and deleted words struck through in red. Above it are the counts, such as "Words inserted: 12" and "Words deleted: 3", or "The versions are identical".

```vue
<script setup lang="ts">
import { DocumentCompare } from 'nuvra';

defineProps<{ previous: string; current: string }>();
</script>

<template>
  <DocumentCompare :before="previous" :after="current" :height="600" />
</template>
```

Keep the HTML of each saved version on your server, for example on every approval, and pass two of them to the component. It is read-only.

### How versions are compared

| Change | Shown as |
| --- | --- |
| A block that did not change | As it is, with its formatting. |
| A paragraph, heading or code block whose text changed | Compared word by word; the changed words are marked. |
| A block that was added or removed | The whole block, with a green or red bar at its side. |
| A list, table, quote or image that changed | The old block as removed and the new one as added. |

- A changed paragraph keeps its kind and alignment, but its inline formatting (bold, colours, links) is not shown.
- A change of formatting only marks no words and is not counted.
- A paragraph that became a heading, or the other way round, is shown as a removed and an added block.

### Your own view

`compareDocuments(before, after)` returns the same result for your own layout: `html` with the marks, and the `insertions` and `deletions` counts. Words are marked with `<ins class="doc-diff-ins">` and `<del class="doc-diff-del">`, whole blocks are wrapped in `<div class="doc-diff-block doc-diff-block--ins">` or `doc-diff-block--del`. The HTML is built from sanitized blocks and escaped text. The function needs a DOM, so it runs in the browser.
