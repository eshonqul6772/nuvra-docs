<script setup lang="ts">
import { SITE_ICONS, type SiteIconName } from './site-icons';

/** Inline SVG icon of the site, drawn in the current text colour. */
defineOptions({ name: 'SiteIcon' });

interface Props {
  /** Icon to draw. */
  name: SiteIconName;
  /** Width and height in pixels. */
  size?: number;
}

withDefaults(defineProps<Props>(), { size: 20 });
</script>

<template>
  <svg
    class="site-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    :width="size"
    :height="size"
  >
    <component :is="tag" v-for="([tag, attributes], index) in SITE_ICONS[name]" :key="index" v-bind="attributes" />
  </svg>
</template>

<style scoped>
.site-icon {
  flex: 0 0 auto;
}
</style>
