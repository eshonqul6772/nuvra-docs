# Загрузка изображений

Без обработчика загрузки изображения, вставленные в документ, встраиваются в HTML как data URL, и документ становится тяжёлым. В этом рецепте изображения сохраняются на вашем сервере, пользователь видит ход загрузки и узнаёт об ошибках. Рецепт одинаково работает для `DocumentEditor` и `Editor`.

## Обработчик загрузки

`uploadImage` получает `File` и возвращает адрес сохранённого изображения. `fetch` не сообщает о ходе отправки тела запроса, поэтому обработчик ниже использует `XMLHttpRequest`:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, type DocumentImageUploadHandler } from 'nuvra';

const html = ref('');
const progress = ref<number | null>(null); // процент для текущего файла, null без загрузки
const message = ref('');
let request: XMLHttpRequest | null = null;

const uploadImage: DocumentImageUploadHandler = file =>
  new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    request = xhr;
    progress.value = 0;

    xhr.open('POST', '/api/images');
    xhr.responseType = 'json';
    xhr.timeout = 60_000;

    xhr.upload.onprogress = event => {
      if (event.lengthComputable) progress.value = Math.round((event.loaded / event.total) * 100);
    };
    xhr.onload = () => {
      const url = (xhr.response as { url?: unknown } | null)?.url;
      if (xhr.status < 200 || xhr.status >= 300) reject(new Error(`Не удалось загрузить изображение (${xhr.status}).`));
      else if (typeof url !== 'string' || !url) reject(new Error('Сервер не вернул адрес изображения.'));
      else resolve(url);
    };
    xhr.onerror = () => reject(new Error('Ошибка сети при загрузке изображения.'));
    xhr.ontimeout = () => reject(new Error('Загрузка заняла слишком много времени.'));
    xhr.onabort = () => reject(new Error('Загрузка отменена.'));
    xhr.onloadend = () => {
      progress.value = null;
      request = null;
    };

    const body = new FormData();
    body.append('file', file);
    xhr.send(body);
  });

const cancelUpload = () => request?.abort();

const onUploadError = (error: unknown) => {
  message.value = error instanceof Error ? error.message : 'Не удалось загрузить изображение.';
};
</script>

<template>
  <div v-if="progress !== null" class="upload-progress">
    <progress max="100" :value="progress" />
    <span>{{ progress }}%</span>
    <button type="button" @click="cancelUpload">Отмена</button>
  </div>
  <p v-if="message" class="upload-error" role="alert">
    {{ message }}
    <button type="button" @click="message = ''">Закрыть</button>
  </p>

  <DocumentEditor
    v-model="html"
    :upload-image="uploadImage"
    :max-image-size-mb="5"
    @upload-error="onUploadError"
  />
</template>
```

- Пока работает обработчик, редактор показывает собственный индикатор «загрузка». Полоса прогресса выше — дополнение для больших файлов, расположенное вне редактора.
- Несколько изображений (вставленных или перетащенных вместе) загружаются по очереди, поэтому `progress` всегда относится к текущему файлу.
- `timeout` и `abort()` прерывают зависшую загрузку. Promise отклоняется, изображение не вставляется, а редактор генерирует событие `uploadError`.

## Ошибки

`uploadError` получает значение типа `unknown`, потому что сообщает о двух видах ошибок:

- **Проверка в редакторе.** Файл, тип которого не `image/*` или размер больше `maxImageSizeMb` (по умолчанию 10 МБ), отклоняется ещё до вызова обработчика. Это объекты `Error` с сообщением на языке интерфейса редактора, их можно сразу показывать.
- **Ваш обработчик.** То, с чем отклонён promise, передаётся без изменений. Отклоняйте его объектами `Error` с сообщением, которое должен увидеть пользователь, как в примере. Если обработчик вернёт пустую строку, редактор тоже сообщит об ошибке.

Если одно изображение не загрузилось, остальные изображения из той же вставки или перетаскивания всё равно вставляются.

## Сервер

Эндпоинт принимает `multipart/form-data` с изображением в поле `file` и отвечает JSON:

```json
{ "url": "/files/images/2026/09/5f1c2a.png" }
```

- Проверяйте размер и реальный тип файла на сервере: проверки в браузере — лишь удобство, а `file.type` приходит от клиента.
- В `image/*` входит SVG, который может содержать скрипты. Отклоняйте его или отдавайте загруженные файлы с отдельного домена.
- Возвращайте адрес `https://` (или `http://`) либо относительный, например `/files/…`. Адрес с любой другой схемой игнорируется: изображение не вставляется, и ошибка не генерируется.
- Изображения, удалённые из документа, остаются на сервере. Чтобы их убирать, время от времени сравнивайте сохранённые файлы с адресами `src` в сохранённом HTML.

Изображения, вставленные на панели инструментов по веб-адресу, в `uploadImage` не передаются; в HTML остаётся введённый адрес.

## См. также

- [Использование](/docs/usage#изображения) — как изображения вставляются, проверяются и встраиваются.
- [API](/docs/api) — `uploadImage`, `maxImageSizeMb` и `uploadError`.
- [Автосохранение](/docs/recipe-autosave) — сохранение документа после загрузки изображений.
