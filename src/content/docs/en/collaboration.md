# Editing together

nuvra has hooks for several people working on one document at the same time: the editor reports where your caret is, draws the carets and selections of the others with their names, and keeps your caret in place when a newer version of the document arrives. Sending the document and the selections between people is up to your application, over a WebSocket, WebRTC or any other channel.

> New in 0.6.0: `collaborators`, `selectionChange`, `collaboratorColor` and the engine methods on this page.

## What the editor does and does not do

| The editor | Your application |
| --- | --- |
| Emits `selectionChange` with your selection as character positions. | Sends it to the others, together with your name. |
| Draws the `collaborators` you pass: a caret with a name label and a tinted selection for each. | Keeps the list up to date and removes people who left. |
| Keeps your caret at the same character position when `v-model` receives someone else's HTML. | Sends the document after edits and applies the documents it receives. |

This is **not** a CRDT and does not merge edits:

- The document travels as a whole. If two people type at the same moment, the document sent last wins and the other person's latest edits are overwritten.
- Positions are character offsets through the text. An edit someone else makes before your caret shifts the text, not your offset, so your caret ends up a few characters away from where it was; the same happens to the carets drawn for others until they send their next selection.
- It works well when people edit different parts of a document in turns, such as a reviewer following the author, and badly for two people typing in the same paragraph at once.

## A WebSocket example

The component below joins a room, broadcasts the document a moment after the edits stop, sends every selection change and draws the people in the room.

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import { type Collaborator, DocumentEditor, type SelectionOffsets } from 'nuvra';

const props = defineProps<{ documentId: string; user: { id: string; name: string } }>();

type Message =
  | { type: 'document'; from: string; html: string }
  | { type: 'selection'; from: string; name: string; selection: SelectionOffsets | null }
  | { type: 'leave'; from: string };

const SEND_DELAY = 300;

const html = ref('');
const collaborators = ref<Collaborator[]>([]);
const socket = new WebSocket(`wss://example.com/documents/${props.documentId}`);

let received = ''; // the last document that came from someone else
let timer: ReturnType<typeof setTimeout> | undefined;

const send = (message: Message) => {
  if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
};

// Send the document once the edits pause, but never echo a document that just arrived.
watch(html, value => {
  if (value === received) return;
  clearTimeout(timer);
  timer = setTimeout(() => send({ type: 'document', from: props.user.id, html: value }), SEND_DELAY);
});

const onSelectionChange = (selection: SelectionOffsets | null) =>
  send({ type: 'selection', from: props.user.id, name: props.user.name, selection });

socket.addEventListener('message', event => {
  const message: Message = JSON.parse(event.data);
  if (message.from === props.user.id) return;
  if (message.type === 'document') {
    received = message.html;
    html.value = message.html; // your caret stays at the same character position
  } else if (message.type === 'selection') {
    const others = collaborators.value.filter(person => person.id !== message.from);
    collaborators.value = [...others, { id: message.from, name: message.name, selection: message.selection }];
  } else {
    collaborators.value = collaborators.value.filter(person => person.id !== message.from);
  }
});

onBeforeUnmount(() => {
  clearTimeout(timer);
  send({ type: 'leave', from: props.user.id });
  socket.close();
});
</script>

<template>
  <DocumentEditor
    v-model="html"
    :collaborators="collaborators"
    :author="user.name"
    @selection-change="onSelectionChange"
  />
</template>
```

- `v-model` itself is updated about 200 ms after typing stops, so the document leaves roughly half a second after the last key press. A shorter delay sends more often, but it does not make simultaneous typing safe.
- Each collaborator gets a colour derived from their `id`; pass `color` to choose it. `collaboratorColor(person)` returns the same colour, for example for a list of avatars next to the editor.
- `selection: null` means the person is connected but not in the document; no caret is drawn for them.
- Load the document from your server as usual when the component opens, and save it there as well (see [Autosave](/docs/recipe-autosave)); the socket only carries live changes.

The server only relays messages to the other clients of the same room and remembers the latest document for people who join later. A minimal relay with the `ws` package:

```js
import { WebSocket, WebSocketServer } from 'ws';

const server = new WebSocketServer({ port: 8080 });
const rooms = new Map(); // room → { clients: Set, html: string }

server.on('connection', (socket, request) => {
  const name = request.url ?? '/';
  const room = rooms.get(name) ?? { clients: new Set(), html: '' };
  rooms.set(name, room);
  room.clients.add(socket);
  if (room.html) socket.send(JSON.stringify({ type: 'document', from: 'server', html: room.html }));

  socket.on('message', data => {
    const message = JSON.parse(String(data));
    if (message.type === 'document') room.html = message.html;
    for (const client of room.clients) {
      if (client !== socket && client.readyState === WebSocket.OPEN) client.send(String(data));
    }
  });
  socket.on('close', () => room.clients.delete(socket));
});
```

Check on the server who may edit the room, and sanitize the HTML before you store it.

## The hooks

| Hook | Description |
| --- | --- |
| `collaborators` prop | `Collaborator[]`: the people whose carets and selections are drawn. |
| `selectionChange` event | `SelectionOffsets \| null`: your caret or selection moved; `null` when it left the document. Repeated positions are not emitted again. |
| `engine.getSelectionOffsets()` | The current selection as `{ anchor, focus }`, or `null`. |
| `engine.getOffsetRects(offsets)` | Viewport rectangles of the text between two positions, for drawing a selection yourself. A caret gives one rectangle with no width. |
| `engine.setContent(html, { keepSelection: true })` | Replaces the document and keeps the caret at the same character position. `v-model` does this for you. |

```ts
interface SelectionOffsets {
  /** Where selecting started. */
  anchor: number;
  /** Where the caret is. */
  focus: number;
}

interface Collaborator {
  /** Stable id of the person or connection. */
  id: string;
  /** Name shown next to the caret. */
  name: string;
  /** CSS colour of the caret and the selection; one is picked from the id when it is left out. */
  color?: string;
  /** Where the person's caret or selection is, or `null` while they are not in the document. */
  selection: SelectionOffsets | null;
}
```

The marks are measured again when the document changes, while the canvas scrolls and when the zoom, the view or the page setup changes. They are hidden in the HTML source view. The caret is kept only while the editor has focus; an editor without focus simply shows the new document.

## Limits

- Last document wins, as described above. Keep a version number in your messages and on the server if you need to detect that a document was overwritten.
- Undo history belongs to each person and is cleared when a document from someone else arrives.
- Comments (`v-model:comments`), page settings (`v-model:page`) and tracked changes are separate values: send them over the same channel if they should be shared.
- Offsets refer to each person's own copy of the document. While the copies differ, a caret may be drawn a little off until the next document or selection arrives.

## Yjs on top

A CRDT library such as [Yjs](https://yjs.dev) can serve as the transport and the presence layer: keep the document HTML in a shared `Y.Map` or `Y.Text`, observe it to update `v-model`, and publish each person's name and `SelectionOffsets` through the awareness protocol to fill `collaborators`.

```ts
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://example.com', documentId, doc);
const shared = doc.getMap<string>('document');

shared.observe(() => {
  html.value = shared.get('html') ?? '';
});
watch(html, value => {
  if (value !== shared.get('html')) shared.set('html', value);
});

const onSelectionChange = (selection: SelectionOffsets | null) =>
  provider.awareness.setLocalStateField('user', { id: user.id, name: user.name, selection });

provider.awareness.on('change', () => {
  collaborators.value = Array.from(provider.awareness.getStates().values())
    .map(state => state.user)
    .filter(person => person && person.id !== user.id);
});
```

This gives you reconnection, offline changes and presence, but the document is still replaced as a whole: the editor does not map its edits to Yjs operations, so two people typing at once still overwrite each other's latest edits.

## See also

- [Comments and comparison](/docs/review) — comments and tracked changes that several people can review.
- [Autosave](/docs/recipe-autosave) — storing the document on your server.
- [API](/docs/api) — `Collaborator`, `SelectionOffsets` and the engine methods.
