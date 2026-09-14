# Image upload

Without an upload handler, images inserted into a document are embedded into the HTML as data URLs, which makes the document heavy. This recipe stores them on your server instead, shows the upload progress and reports failures to the user. It works the same for `DocumentEditor` and `Editor`.

## The upload handler

`uploadImage` receives the `File` and resolves with the URL of the stored image. `fetch` cannot report the progress of a request body, so the handler below uses `XMLHttpRequest`:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, type DocumentImageUploadHandler } from 'nuvra';

const html = ref('');
const progress = ref<number | null>(null); // percent of the current file, null when idle
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
      if (xhr.status < 200 || xhr.status >= 300) reject(new Error(`The image could not be uploaded (${xhr.status}).`));
      else if (typeof url !== 'string' || !url) reject(new Error('The server did not return an image address.'));
      else resolve(url);
    };
    xhr.onerror = () => reject(new Error('Network error while uploading the image.'));
    xhr.ontimeout = () => reject(new Error('The upload took too long.'));
    xhr.onabort = () => reject(new Error('The upload was cancelled.'));
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
  message.value = error instanceof Error ? error.message : 'The image could not be uploaded.';
};
</script>

<template>
  <div v-if="progress !== null" class="upload-progress">
    <progress max="100" :value="progress" />
    <span>{{ progress }}%</span>
    <button type="button" @click="cancelUpload">Cancel</button>
  </div>
  <p v-if="message" class="upload-error" role="alert">
    {{ message }}
    <button type="button" @click="message = ''">Close</button>
  </p>

  <DocumentEditor
    v-model="html"
    :upload-image="uploadImage"
    :max-image-size-mb="5"
    @upload-error="onUploadError"
  />
</template>
```

- The editor shows its own “uploading” indicator while the handler runs. The progress bar above is an extra for large files, outside the editor.
- Several images (pasted or dropped together) are uploaded one after another, so `progress` always belongs to the current file.
- `timeout` and `abort()` end a stuck upload. The promise is rejected, the image is not inserted, and the editor emits `uploadError`.

## Errors

`uploadError` receives an `unknown`, because it reports two kinds of failures:

- **Validation by the editor.** A file whose type is not `image/*`, or which is larger than `maxImageSizeMb` (10 MB by default), is rejected before the handler is called. These are `Error` objects with a message in the editor's interface language, ready to show.
- **Your handler.** Whatever the promise rejects with is passed on as it is. Reject with `Error` objects whose message you want the user to see, as above. A handler that resolves with an empty string is reported as an error by the editor as well.

The other images of the same paste or drop are still inserted when one of them fails.

## The server

The endpoint receives `multipart/form-data` with the image in the `file` field and answers with JSON:

```json
{ "url": "/files/images/2026/09/5f1c2a.png" }
```

- Check the size and the real type of the file on the server: the browser checks are a convenience, and `file.type` comes from the client.
- `image/*` includes SVG, which can contain scripts. Reject it, or serve uploaded files from a separate domain.
- Return an `https://` (or `http://`) address or a relative one such as `/files/…`. An address with any other scheme is ignored: no image is inserted and no error is emitted.
- Images deleted from a document stay on the server. To clean them up, compare the stored files with the `src` addresses of the saved HTML from time to time.

Images inserted from a web address in the toolbar are not passed to `uploadImage`; the HTML keeps the address as typed.

## See also

- [Usage](/docs/usage#images) — how images are inserted, validated and embedded.
- [API](/docs/api) — `uploadImage`, `maxImageSizeMb` and `uploadError`.
- [Autosave](/docs/recipe-autosave) — saving the document once its images are uploaded.
