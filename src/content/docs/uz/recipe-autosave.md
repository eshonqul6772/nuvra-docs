# Avtosaqlash

Bu retsept hujjatni backenddan yuklaydi, foydalanuvchi ishlayotganda uni avtomatik saqlaydi va oxirgi o‘zgarishlar serverga yetib borgan-bormaganini ko‘rsatadi. Vue va `fetch` dan boshqa hech narsa kerak emas: HTML, sahifa sozlamalari va izohlar bitta JSON ma’lumot sifatida birga yuboriladi.

## Ma’lumot shakli va server

Mijoz va server bitta shaklga kelishadi, bu yerda u `document-payload.ts` faylida:

```ts
import type { DocumentComment, PageSettings } from 'nuvra';

export interface DocumentPayload {
  html: string;
  page: PageSettings;
  comments: DocumentComment[];
}
```

Serverga ikkita endpoint kerak:

- `GET /api/documents/:id` `200` va `DocumentPayload` qaytaradi.
- `PUT /api/documents/:id` JSON ko‘rinishidagi `DocumentPayload` ni oladi, saqlangan hujjatni almashtiradi va `204` javob beradi (istalgan `2xx` bo‘ladi).

`PUT` butun hujjatni almashtiradi, shuning uchun bir xil ma’lumotni ikki marta yuborish zarar qilmaydi. HTML brauzerda muharrir tomonidan tozalangani uchungina unga ishonmang: serverda ham hajmini tekshiring va uni tozalang. Bitta hujjatni bir necha kishi tahrirlasa, ma’lumotga versiya raqamini qo‘shing va eskirgan versiyaga `409` javob bering.

## Komponent

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

const ready = ref(false); // yuklangan hujjat joyiga qo‘yilgach true bo‘ladi
const loadFailed = ref(false);
const status = ref<'saved' | 'saving' | 'error'>('saved');

let lastSaved = ''; // server qabul qilgan oxirgi ma’lumotning JSON’i
let timer: ReturnType<typeof setTimeout> | undefined;
let inFlight: Promise<void> | null = null;
let queued = false;

const snapshot = () => {
  // getHTML() muharrir hali v-model ga yozmagan o‘zgarishlarni ham yozadi
  const payload: DocumentPayload = { html: editor.value?.getHTML() ?? html.value, page: page.value, comments: comments.value };
  return JSON.stringify(payload);
};

const save = async (): Promise<void> => {
  clearTimeout(timer);
  if (!ready.value) return;
  if (inFlight) {
    queued = true; // joriy so‘rov tugagach yana bir marta saqlanadi
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

// kichik debounce: har bir o‘zgarish taymerni qaytadan boshlaydi
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
    await nextTick(); // muharrir yuklangan hujjatni ko‘rsatadi
    lastSaved = snapshot();
    await nextTick(); // watcher’lar yuklangan qiymatlarni ko‘rib, e’tiborsiz qoldiradi
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
  <p v-if="loadFailed" role="alert">Hujjatni yuklab bo‘lmadi.</p>
  <div v-else>
    <p v-if="ready" class="save-status" role="status">
      <template v-if="status === 'saving'">Saqlanmoqda…</template>
      <template v-else-if="status === 'saved'">Barcha o‘zgarishlar saqlandi</template>
      <template v-else>Saqlanmadi <button type="button" @click="save">Qayta urinish</button></template>
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

## Qanday ishlaydi

- **Yuklangandan keyin saqlanmaydi.** Yuklangan qiymatlar berilganda watcher’lar ishga tushadi, lekin `ready` hali `false`, shuning uchun ular hech narsa qilmaydi. `lastSaved` yuklangan hujjatdan boshlanadi va ma’lumot o‘zgarmagan bo‘lsa (masalan, yozib, keyin bekor qilinganda) saqlash o‘tkazib yuboriladi.
- **Debounce.** Foydalanuvchi yozishni to‘xtatgach, `v-model` ning o‘zi taxminan 200 ms dan keyin yangilanadi; watch esa yana bir soniya kutadi. Sahifa sozlamalari va izohlar obyekt bo‘lgani uchun `deep: true` bilan kuzatiladi.
- **So‘rovlar ustma-ust tushmaydi.** `PUT` bajarilayotganda yangi chaqiruv faqat `queued` ni belgilaydi. So‘rov tugagach, yana bir saqlash eng oxirgi ma’lumotni yuboradi, shuning uchun server hech qachon yangi hujjatdan keyin eskisini olmaydi. Joriy so‘rovni bekor qiladigan `AbortController` ham muqobil yo‘l, lekin server uni allaqachon yozib qo‘ygan bo‘lishi mumkin.
- **Fokus yo‘qolganda.** Muharrir `blur` ni chiqarishdan oldin kutilayotgan o‘zgarishlarni yozadi, shuning uchun `@blur="save"` foydalanuvchi hujjatdan chiqishi bilan uni saqlaydi.
- **Sahifadan chiqish.** O‘zgarishlar saqlanmagan bo‘lsa, `beforeunload` brauzerdan ogohlantirishni so‘raydi va saqlashni boshlaydi; foydalanuvchi sahifada qolsa, saqlash tugaydi. Komponentni router o‘chirganda ham oxirgi o‘zgarishlar yuboriladi.
- **Xatolar.** Muvaffaqiyatsiz so‘rov `'error'` holatini o‘rnatadi; keyingi o‘zgarish yoki **Qayta urinish** tugmasi yana urinib ko‘radi.

`disabled` hujjat yuklanguncha uni faqat o‘qiladigan qilib turadi, shuning uchun undan oldin yozilgan hech narsa yo‘qolmaydi.

## Yana qarang

- [Izohlar va solishtirish](/docs/review) — ma’lumotda saqlanadigan izohlar ro‘yxati va kuzatiladigan o‘zgarishlar.
- [Foydalanish](/docs/usage) — hujjat qiymati va sahifa sozlamalari.
- [Formalar va tekshiruv](/docs/recipe-forms) — `Editor` forma maydoni sifatida.
