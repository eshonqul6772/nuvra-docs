<script setup lang="ts">
import { watchEffect } from 'vue';
import { RouterLink } from 'vue-router';

import SiteIcon from '../components/site-icon.vue';
import { messages } from '../i18n';

/** Shown for addresses that match no page. */
defineOptions({ name: 'NotFoundPage' });

watchEffect(() => {
  document.title = `${messages.value.notFound.title} · nuvra`;
});
</script>

<template>
  <main class="page not-found container">
    <p class="not-found__code">404</p>
    <h1 class="not-found__title">{{ messages.notFound.title }}</h1>
    <p class="not-found__text">{{ messages.notFound.text }}</p>
    <RouterLink to="/" class="button button--primary">
      {{ messages.notFound.home }}
      <SiteIcon name="arrow-right" :size="18" />
    </RouterLink>
  </main>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-block: 120px;
  text-align: center;
}

.not-found__code {
  margin: 0;
  background: var(--gradient-brand);
  background-clip: text;
  color: transparent;
  font-family: var(--font-display);
  font-size: 120px;
  font-style: italic;
  font-weight: 500;
  line-height: 1;
}

.not-found__title {
  margin: 16px 0 8px;
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 500;
}

.not-found__text {
  margin: 0 0 32px;
  color: var(--color-text-soft);
}
</style>
