# Совместное редактирование

В nuvra есть точки подключения для работы нескольких людей над одним документом одновременно: редактор сообщает, где находится ваш курсор, рисует курсоры и выделения остальных с их именами и сохраняет положение вашего курсора, когда приходит более новая версия документа. Передачу документа и выделений между людьми берёт на себя ваше приложение — через WebSocket, WebRTC или любой другой канал.

> Новое в 0.6.0: `collaborators`, `selectionChange`, `collaboratorColor` и методы движка, описанные на этой странице.

## Что делает и чего не делает редактор

| Редактор | Ваше приложение |
| --- | --- |
| Генерирует событие `selectionChange` с вашим выделением в виде позиций символов. | Отправляет его остальным вместе с вашим именем. |
| Рисует переданных `collaborators`: для каждого — курсор с подписью имени и подкрашенное выделение. | Поддерживает список в актуальном состоянии и удаляет ушедших. |
| Оставляет ваш курсор на той же позиции символа, когда `v-model` получает HTML от другого человека. | Отправляет документ после правок и применяет полученные документы. |

Это **не** CRDT, и правки не объединяются:

- Документ передаётся целиком. Если два человека печатают одновременно, побеждает документ, отправленный последним, а последние правки другого человека перезаписываются.
- Позиции — это смещения символов по тексту. Правка, которую другой человек вносит перед вашим курсором, сдвигает текст, но не ваше смещение, поэтому курсор оказывается на несколько символов в стороне от прежнего места; то же происходит с курсорами, нарисованными для других, пока они не пришлют следующее выделение.
- Это хорошо работает, когда люди по очереди правят разные части документа — например, рецензент идёт следом за автором, — и плохо, когда двое печатают в одном абзаце одновременно.

## Пример с WebSocket

Компонент ниже подключается к комнате, рассылает документ вскоре после того, как правки прекратились, отправляет каждое изменение выделения и рисует людей, находящихся в комнате.

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

let received = ''; // последний документ, полученный от другого человека
let timer: ReturnType<typeof setTimeout> | undefined;

const send = (message: Message) => {
  if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
};

// Отправляем документ, когда правки приостановились, но никогда не отправляем обратно только что полученный.
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
    html.value = message.html; // ваш курсор остаётся на той же позиции символа
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

- Сам `v-model` обновляется примерно через 200 мс после того, как ввод прекратился, поэтому документ уходит примерно через полсекунды после последнего нажатия клавиши. Меньшая задержка означает более частую отправку, но не делает одновременный ввод безопасным.
- Каждый участник получает цвет, вычисленный из его `id`; чтобы выбрать цвет самостоятельно, передайте `color`. `collaboratorColor(person)` возвращает тот же цвет — например, для списка аватаров рядом с редактором.
- `selection: null` означает, что человек подключён, но находится не в документе; курсор для него не рисуется.
- Загружайте документ со своего сервера как обычно при открытии компонента и сохраняйте его туда же (см. [Автосохранение](/docs/recipe-autosave)); сокет передаёт только изменения в реальном времени.

Сервер лишь пересылает сообщения другим клиентам той же комнаты и запоминает последний документ для тех, кто подключится позже. Минимальный ретранслятор на пакете `ws`:

```js
import { WebSocket, WebSocketServer } from 'ws';

const server = new WebSocketServer({ port: 8080 });
const rooms = new Map(); // комната → { clients: Set, html: string }

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

Проверяйте на сервере, кто имеет право редактировать комнату, и очищайте HTML перед сохранением.

## Точки подключения

| Точка подключения | Описание |
| --- | --- |
| Пропс `collaborators` | `Collaborator[]`: люди, чьи курсоры и выделения рисуются. |
| Событие `selectionChange` | `SelectionOffsets \| null`: ваш курсор или выделение переместились; `null`, когда они покинули документ. Повторяющиеся позиции повторно не передаются. |
| `engine.getSelectionOffsets()` | Текущее выделение в виде `{ anchor, focus }` или `null`. |
| `engine.getOffsetRects(offsets)` | Прямоугольники во вьюпорте для текста между двумя позициями — чтобы рисовать выделение самостоятельно. Для курсора — один прямоугольник нулевой ширины. |
| `engine.setContent(html, { keepSelection: true })` | Заменяет документ и оставляет курсор на той же позиции символа. `v-model` делает это за вас. |

```ts
interface SelectionOffsets {
  /** Где началось выделение. */
  anchor: number;
  /** Где находится курсор. */
  focus: number;
}

interface Collaborator {
  /** Постоянный идентификатор человека или подключения. */
  id: string;
  /** Имя, показываемое рядом с курсором. */
  name: string;
  /** CSS-цвет курсора и выделения; если не задан, выбирается по идентификатору. */
  color?: string;
  /** Где находится курсор или выделение человека, или `null`, пока его нет в документе. */
  selection: SelectionOffsets | null;
}
```

Отметки измеряются заново при изменении документа, при прокрутке холста и при смене масштаба, режима просмотра или параметров страницы. В режиме исходного HTML они скрыты. Курсор сохраняется, только пока редактор в фокусе; редактор без фокуса просто показывает новый документ.

## Ограничения

- Побеждает последний документ, как описано выше. Если нужно обнаруживать, что документ был перезаписан, храните номер версии в сообщениях и на сервере.
- История отмены у каждого человека своя и очищается, когда приходит документ от другого человека.
- Комментарии (`v-model:comments`), параметры страницы (`v-model:page`) и отслеживаемые изменения — отдельные значения: если они должны быть общими, передавайте их по тому же каналу.
- Смещения относятся к собственной копии документа у каждого человека. Пока копии различаются, курсор может рисоваться немного не на своём месте, пока не придёт следующий документ или выделение.

## Yjs поверх редактора

CRDT-библиотека, например [Yjs](https://yjs.dev), может служить транспортом и слоем присутствия: храните HTML документа в общем `Y.Map` или `Y.Text`, подписывайтесь на его изменения, чтобы обновлять `v-model`, и публикуйте имя и `SelectionOffsets` каждого человека через протокол awareness, чтобы заполнять `collaborators`.

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

Так вы получаете переподключение, офлайн-изменения и присутствие, но документ по-прежнему заменяется целиком: редактор не превращает свои правки в операции Yjs, поэтому двое, печатающие одновременно, всё так же перезаписывают последние правки друг друга.

## См. также

- [Комментарии и сравнение](/docs/review) — комментарии и отслеживаемые изменения, которые могут рецензировать несколько человек.
- [Автосохранение](/docs/recipe-autosave) — хранение документа на вашем сервере.
- [API](/docs/api) — `Collaborator`, `SelectionOffsets` и методы движка.
