```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor } from 'nuvra';
import 'nuvra/style.css';

const html = ref('<p>Hello, nuvra!</p>');
</script>

<template>
  <DocumentEditor v-model="html" height="600px" />
</template>
```
