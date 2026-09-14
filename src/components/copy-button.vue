<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

import { messages } from '../i18n';
import SiteIcon from './site-icon.vue';

/** Copy button placed over the top-right corner of a code block; it confirms a copy for two seconds. */
defineOptions({ name: 'CopyButton' });

interface Props {
  /** Text to copy, or a function reading it at the moment of the click. */
  source: string | (() => string);
}

const props = defineProps<Props>();

/** How long the button shows its confirmation, in milliseconds. */
const COPIED_DURATION = 2000;

const copied = ref(false);
let resetTimer: ReturnType<typeof setTimeout> | undefined;

/** Copies the code and briefly shows a check mark. */
const copy = async () => {
  const text = typeof props.source === 'function' ? props.source() : props.source;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    return;
  }
  copied.value = true;
  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    copied.value = false;
  }, COPIED_DURATION);
};

onBeforeUnmount(() => clearTimeout(resetTimer));
</script>

<template>
  <button
    type="button"
    class="copy-button"
    :class="{ 'is-copied': copied }"
    :aria-label="copied ? messages.docs.copied : messages.docs.copyCode"
    :title="copied ? messages.docs.copied : messages.docs.copyCode"
    @click="copy"
  >
    <SiteIcon :name="copied ? 'check' : 'copy'" :size="15" />
    <span class="copy-button__label" aria-hidden="true">{{ copied ? messages.docs.copied : messages.docs.copy }}</span>
    <span class="visually-hidden" aria-live="polite">{{ copied ? messages.docs.copied : '' }}</span>
  </button>
</template>

<style scoped>
.copy-button {
  position: absolute;
  z-index: 1;
  top: 10px;
  right: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-soft);
  background: var(--color-bg-elevated);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  opacity: 0;
  cursor: pointer;
  transition:
    opacity 140ms ease,
    color 140ms ease,
    border-color 140ms ease;
}

.copy-button:focus-visible,
.copy-button.is-copied {
  opacity: 1;
}

.copy-button:hover {
  border-color: var(--color-border-strong);
  color: var(--color-text);
}

.copy-button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.copy-button.is-copied {
  color: var(--color-teal);
}

/* Touch screens have no hover: the button stays visible, as a compact icon that covers little of the code. */
@media (hover: none) {
  .copy-button {
    top: 6px;
    right: 6px;
    width: 30px;
    justify-content: center;
    padding: 0;
    background: color-mix(in srgb, var(--color-bg-elevated) 88%, transparent);
    opacity: 1;
  }

  .copy-button__label {
    display: none;
  }
}
</style>
