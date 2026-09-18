<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, type DocumentImageUploadHandler } from 'nuvra';

// Only these tools appear in the toolbar; leave `tools` out to show every tool.
const TOOLS = ['history', 'marks', 'image'] as const;

const html = ref('<p>Insert, paste or drop an image. It is “uploaded” first, and the document keeps only its URL.</p>');
const uploads = ref<string[]>([]);
const error = ref('');

// Resolve with the URL of the stored file. Here a short delay and an object URL stand in for your server:
//   const body = new FormData(); body.append('file', file);
//   return (await (await fetch('/api/files', { method: 'POST', body })).json()).url;
const uploadImage: DocumentImageUploadHandler = async file => {
  error.value = '';
  await new Promise(resolve => setTimeout(resolve, 800));
  uploads.value.push(`${file.name} — ${Math.round(file.size / 1024)} KB`);
  return URL.createObjectURL(file);
};

const onUploadError = (reason: unknown) => {
  error.value = reason instanceof Error ? reason.message : 'The image was rejected.';
};
</script>

<template>
  <div class="example-stage">
    <DocumentEditor
      :tools="TOOLS"
      v-model="html"
      :upload-image="uploadImage"
      :max-image-size-mb="2"
      :height="460"
      @upload-error="onUploadError"
    />
    <p v-if="error" class="example-error">{{ error }}</p>

    <section class="example-panel">
      <h3>Uploaded files (max. 2 MB each)</h3>
      <ul v-if="uploads.length" class="example-list">
        <li v-for="upload in uploads" :key="upload">{{ upload }}</li>
      </ul>
      <p v-else class="example-note">Nothing yet.</p>
    </section>
  </div>
</template>
