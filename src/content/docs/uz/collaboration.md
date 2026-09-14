# Birgalikda tahrirlash

nuvra’da bir hujjat ustida bir vaqtda bir necha kishi ishlashi uchun ilgaklar bor: muharrir kursoringiz qayerdaligini xabar qiladi, boshqalarning kursorlari va belgilashlarini ismlari bilan chizadi va hujjatning yangiroq versiyasi kelganda kursoringizni joyida saqlaydi. Hujjat va belgilashlarni odamlar o‘rtasida yuborish — WebSocket, WebRTC yoki boshqa istalgan kanal orqali — ilovangiz zimmasida.

> 0.6.0 versiyada qo‘shilgan: `collaborators`, `selectionChange`, `collaboratorColor` va shu sahifadagi dvigatel metodlari.

## Muharrir nimani qiladi va nimani qilmaydi

| Muharrir | Ilovangiz |
| --- | --- |
| Belgilashingizni belgi pozitsiyalari ko‘rinishida `selectionChange` hodisasi bilan chiqaradi. | Uni ismingiz bilan birga boshqalarga yuboradi. |
| Siz bergan `collaborators` ni chizadi: har biri uchun ism yorlig‘i bilan kursor va rangli belgilash. | Ro‘yxatni dolzarb saqlaydi va chiqib ketganlarni olib tashlaydi. |
| `v-model` boshqa odamning HTML’ini olganda kursoringizni o‘sha belgi pozitsiyasida saqlaydi. | Tahrirlardan keyin hujjatni yuboradi va kelgan hujjatlarni qo‘llaydi. |

Bu CRDT **emas** va tahrirlarni birlashtirmaydi:

- Hujjat butunligicha yuboriladi. Ikki kishi bir paytda yozsa, oxirgi yuborilgan hujjat g‘olib chiqadi, ikkinchi odamning so‘nggi tahrirlari esa ustidan yozilib yo‘qoladi.
- Pozitsiyalar — matn bo‘ylab belgi siljishlari (offset). Boshqa odam kursoringizdan oldinroqda qilgan tahrir siljishingizni emas, matnni suradi, shuning uchun kursoringiz avvalgi joyidan bir necha belgi narida qoladi; boshqalar uchun chizilgan kursorlar bilan ham ular keyingi belgilashini yubormaguncha xuddi shunday bo‘ladi.
- Odamlar hujjatning turli qismlarini navbat bilan tahrirlaganda yaxshi ishlaydi, masalan tekshiruvchi muallif ortidan borsa; ikki kishi bir paragrafda bir vaqtda yozganda esa yomon ishlaydi.

## WebSocket misoli

Quyidagi komponent xonaga qo‘shiladi, tahrirlar to‘xtagandan bir oz keyin hujjatni tarqatadi, har bir belgilash o‘zgarishini yuboradi va xonadagi odamlarni chizadi.

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

let received = ''; // boshqa odamdan kelgan oxirgi hujjat
let timer: ReturnType<typeof setTimeout> | undefined;

const send = (message: Message) => {
  if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
};

// Hujjatni tahrirlar to‘xtaganda yuboring, lekin hozirgina kelgan hujjatni qaytarib yubormang.
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
    html.value = message.html; // kursoringiz o‘sha belgi pozitsiyasida qoladi
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

- `v-model` ning o‘zi yozish to‘xtagandan taxminan 200 ms keyin yangilanadi, shuning uchun hujjat oxirgi tugma bosilgandan taxminan yarim soniya o‘tib jo‘natiladi. Qisqaroq kechikish tez-tez yuboradi, lekin bir vaqtda yozishni xavfsiz qilmaydi.
- Har bir hamkor `id` sidan olingan rang oladi; rangni o‘zingiz tanlash uchun `color` bering. `collaboratorColor(person)` xuddi shu rangni qaytaradi, masalan muharrir yonidagi avatarlar ro‘yxati uchun.
- `selection: null` odam ulangan, lekin hujjatda emasligini bildiradi; uning kursori chizilmaydi.
- Komponent ochilganda hujjatni odatdagidek serveringizdan yuklang va u yerga saqlang ham (qarang: [Avtosaqlash](/docs/recipe-autosave)); soket faqat jonli o‘zgarishlarni tashiydi.

Server xabarlarni faqat o‘sha xonadagi boshqa mijozlarga uzatadi va keyinroq qo‘shiladiganlar uchun oxirgi hujjatni eslab qoladi. `ws` paketi bilan eng oddiy uzatuvchi:

```js
import { WebSocket, WebSocketServer } from 'ws';

const server = new WebSocketServer({ port: 8080 });
const rooms = new Map(); // xona → { clients: Set, html: string }

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

Xonani kim tahrirlashi mumkinligini serverda tekshiring va HTML’ni saqlashdan oldin tozalang.

## Ilgaklar

| Ilgak | Tavsif |
| --- | --- |
| `collaborators` propi | `Collaborator[]`: kursorlari va belgilashlari chiziladigan odamlar. |
| `selectionChange` hodisasi | `SelectionOffsets \| null`: kursoringiz yoki belgilashingiz siljidi; hujjatdan chiqsa `null`. Takrorlangan pozitsiyalar qayta chiqarilmaydi. |
| `engine.getSelectionOffsets()` | Joriy belgilash `{ anchor, focus }` ko‘rinishida yoki `null`. |
| `engine.getOffsetRects(offsets)` | Belgilashni o‘zingiz chizishingiz uchun ikki pozitsiya orasidagi matnning viewport’dagi to‘rtburchaklari. Kursor uchun kengligi nol bo‘lgan bitta to‘rtburchak qaytadi. |
| `engine.setContent(html, { keepSelection: true })` | Hujjatni almashtiradi va kursorni o‘sha belgi pozitsiyasida saqlaydi. `v-model` buni siz uchun bajaradi. |

```ts
interface SelectionOffsets {
  /** Belgilash boshlangan joy. */
  anchor: number;
  /** Kursor turgan joy. */
  focus: number;
}

interface Collaborator {
  /** Odam yoki ulanishning o‘zgarmas identifikatori. */
  id: string;
  /** Kursor yonida ko‘rinadigan ism. */
  name: string;
  /** Kursor va belgilashning CSS rangi; berilmasa, id bo‘yicha tanlanadi. */
  color?: string;
  /** Odamning kursori yoki belgilashi qayerda, hujjatda bo‘lmasa `null`. */
  selection: SelectionOffsets | null;
}
```

Belgilar hujjat o‘zgarganda, varaq aylantirilayotganda hamda masshtab, ko‘rinish yoki sahifa sozlamalari o‘zgarganda qayta o‘lchanadi. HTML kod ko‘rinishida ular yashiriladi. Kursor faqat muharrir fokusda bo‘lganda saqlanadi; fokussiz muharrir shunchaki yangi hujjatni ko‘rsatadi.

## Cheklovlar

- Yuqorida aytilganidek, oxirgi hujjat g‘olib chiqadi. Hujjat ustidan yozilganini aniqlash kerak bo‘lsa, xabarlaringizda va serverda versiya raqamini saqlang.
- Bekor qilish tarixi har bir odamniki alohida va boshqa odamdan hujjat kelganda tozalanadi.
- Izohlar (`v-model:comments`), sahifa sozlamalari (`v-model:page`) va kuzatilgan o‘zgarishlar alohida qiymatlar: ular ham umumiy bo‘lishi kerak bo‘lsa, ularni o‘sha kanal orqali yuboring.
- Siljishlar har bir odamning hujjatdagi o‘z nusxasiga tegishli. Nusxalar farq qilib turganda kursor keyingi hujjat yoki belgilash kelguncha biroz noto‘g‘ri joyda chizilishi mumkin.

## Ustidan Yjs

[Yjs](https://yjs.dev) kabi CRDT kutubxonasi transport va hozirlik (presence) qatlami bo‘lib xizmat qilishi mumkin: hujjat HTML’ini umumiy `Y.Map` yoki `Y.Text` da saqlang, `v-model` ni yangilash uchun uni kuzating, `collaborators` ni to‘ldirish uchun esa har bir odamning ismi va `SelectionOffsets` ini awareness protokoli orqali e’lon qiling.

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

Bu sizga qayta ulanish, oflayn o‘zgarishlar va hozirlikni beradi, lekin hujjat baribir butunligicha almashtiriladi: muharrir o‘z tahrirlarini Yjs amallariga aylantirmaydi, shuning uchun bir vaqtda yozayotgan ikki kishi baribir bir-birining so‘nggi tahrirlari ustidan yozadi.

## Yana qarang

- [Izohlar va solishtirish](/docs/review) — bir necha kishi ko‘rib chiqa oladigan izohlar va kuzatilgan o‘zgarishlar.
- [Avtosaqlash](/docs/recipe-autosave) — hujjatni serveringizda saqlash.
- [API](/docs/api) — `Collaborator`, `SelectionOffsets` va dvigatel metodlari.
