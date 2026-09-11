<script setup lang="ts">
import { RouterView } from 'vue-router';

import SiteFooter from './components/site-footer.vue';
import SiteHeader from './components/site-header.vue';

/** Page frame: header, the routed page and footer. */
defineOptions({ name: 'App' });
</script>

<template>
  <SiteHeader />
  <RouterView />
  <SiteFooter />
</template>
