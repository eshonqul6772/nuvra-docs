# Автосохранение

В этом рецепте документ загружается с сервера, автоматически сохраняется, пока пользователь работает, а рядом с редактором видно, дошли ли последние изменения до сервера. Кроме Vue и `fetch` ничего не нужно: HTML, параметры страницы и комментарии передаются вместе, одним JSON-объектом.

## Данные и сервер

Клиент и сервер договариваются об одной структуре, здесь она лежит в `document-payload.ts`:

```ts
import type { DocumentComment, PageSettings } from 'nuvra';

export interface DocumentPayload {
  html: string;
  page: PageSettings;
  comments: DocumentComment[];
}
```

Серверу нужны два эндпоинта:

- `GET /api/documents/:id` отвечает `200` и возвращает `DocumentPayload`.
- `PUT /api/documents/:id` принимает `DocumentPayload` в формате JSON, заменяет сохранённый документ и отвечает `204` (подойдёт любой `2xx`).

`PUT` заменяет документ целиком, поэтому повторная отправка тех же данных ничего не ломает. Не доверяйте HTML только потому, что редактор очистил его в браузере: проверяйте размер и очищайте HTML и на сервере. Если один документ правят несколько человек, добавьте в данные номер версии и отвечайте `409` на устаревшую.

## Компонент

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

const ready = ref(false); // true, когда загруженный документ на месте
const loadFailed = ref(false);
const status = ref<'saved' | 'saving' | 'error'>('saved');

let lastSaved = ''; // JSON последних данных, которые принял сервер
let timer: ReturnType<typeof setTimeout> | undefined;
let inFlight: Promise<void> | null = null;
let queued = false;

const snapshot = () => {
  // getHTML() записывает и правки, которые редактор ещё не передал в v-model
  const payload: DocumentPayload = { html: editor.value?.getHTML() ?? html.value, page: page.value, comments: comments.value };
  return JSON.stringify(payload);
};

const save = async (): Promise<void> => {
  clearTimeout(timer);
  if (!ready.value) return;
  if (inFlight) {
    queued = true; // ещё одно сохранение после завершения текущего запроса
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

// маленький debounce: каждое изменение перезапускает таймер
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
    await nextTick(); // редактор показывает загруженный документ
    lastSaved = snapshot();
    await nextTick(); // наблюдатели увидели загруженные значения и пропустили их
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
  <p v-if="loadFailed" role="alert">Не удалось загрузить документ.</p>
  <div v-else>
    <p v-if="ready" class="save-status" role="status">
      <template v-if="status === 'saving'">Сохранение…</template>
      <template v-else-if="status === 'saved'">Все изменения сохранены</template>
      <template v-else>Не сохранено <button type="button" @click="save">Повторить</button></template>
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

## Как это работает

- **Нет сохранения сразу после загрузки.** Присваивание загруженных значений запускает наблюдатели (`watch`), но `ready` ещё `false`, и они ничего не делают. `lastSaved` изначально равен загруженному документу, а сохранение пропускается всякий раз, когда данные не изменились, например после ввода и отмены.
- **Debounce.** Сам `v-model` обновляется примерно через 200 мс после паузы в наборе; watch ждёт ещё секунду. Параметры страницы и комментарии — объекты, поэтому они отслеживаются с `deep: true`.
- **Запросы не пересекаются.** Пока выполняется `PUT`, новый вызов только выставляет `queued`. Когда запрос завершится, ещё одно сохранение отправит самые свежие данные, так что сервер никогда не получит старый документ после нового. Альтернатива — `AbortController`, отменяющий текущий запрос, но сервер мог уже успеть его записать.
- **Потеря фокуса.** Редактор записывает отложенные правки до события `blur`, поэтому `@blur="save"` сохраняет документ, как только пользователь из него выходит.
- **Уход со страницы.** Пока изменения не сохранены, обработчик `beforeunload` просит браузер предупредить пользователя и запускает сохранение, которое завершится, если пользователь останется. При размонтировании компонента роутером последние изменения тоже отправляются.
- **Ошибки.** Неудачный запрос выставляет `'error'`; следующее изменение или кнопка **Повторить** пробуют снова.

`disabled` делает документ доступным только для чтения до окончания загрузки, поэтому ничего введённое раньше не потеряется.

## См. также

- [Комментарии и сравнение](/docs/review) — список комментариев и отслеживаемые изменения, которые хранятся в данных.
- [Использование](/docs/usage) — значение документа и параметры страницы.
- [Формы и валидация](/docs/recipe-forms) — `Editor` как поле формы.
