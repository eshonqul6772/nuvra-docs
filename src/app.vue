<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';

import SiteFooter from './components/site-footer.vue';
import SiteHeader from './components/site-header.vue';

/** Page frame: header, the routed page and footer; full-height pages such as the examples leave the footer out. */
defineOptions({ name: 'App' });

const route = useRoute();
</script>

<template>
  <SiteHeader />
  <RouterView />
  <SiteFooter v-if="!route.meta.appShell" />
</template>
