<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

import { messages } from '../i18n';
import SiteIcon from './site-icon.vue';

/** Install command for the chosen package manager, with a copy button. */
defineOptions({ name: 'InstallCommand' });

const MANAGERS = [
  { name: 'pnpm', command: 'pnpm add nuvra' },
  { name: 'npm', command: 'npm install nuvra' },
  { name: 'yarn', command: 'yarn add nuvra' },
  { name: 'bun', command: 'bun add nuvra' }
] as const;
/** How long the copy button shows its confirmation, in milliseconds. */
const COPIED_DURATION = 1600;

type ManagerName = (typeof MANAGERS)[number]['name'];

const selected = ref<ManagerName>('pnpm');
const copied = ref(false);
let resetTimer: ReturnType<typeof setTimeout> | undefined;

const command = computed(
  () => MANAGERS.find(manager => manager.name === selected.value)?.command ?? MANAGERS[0].command
);

/** Copies the command and briefly shows a check mark. */
const copy = async () => {
  try {
    await navigator.clipboard.writeText(command.value);
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
  <div class="install">
    <div class="install__managers" role="tablist" :aria-label="messages.hero.managers">
      <button
        v-for="manager in MANAGERS"
        :key="manager.name"
        type="button"
        role="tab"
        class="install__manager"
        :class="{ 'is-active': selected === manager.name }"
        :aria-selected="selected === manager.name"
        @click="selected = manager.name"
      >
        {{ manager.name }}
      </button>
    </div>
    <div class="install__command">
      <code><span class="install__prompt" aria-hidden="true">$</span>{{ command }}</code>
      <button
        type="button"
        class="install__copy"
        :aria-label="copied ? messages.hero.copied : messages.hero.copy"
        :title="copied ? messages.hero.copied : messages.hero.copy"
        @click="copy"
      >
        <SiteIcon :name="copied ? 'check' : 'copy'" :size="17" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.install {
  display: inline-flex;
  width: min(100%, 380px);
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--color-bg-elevated) 82%, transparent);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(10px);
  text-align: left;
}

.install__managers {
  display: flex;
  gap: 2px;
  padding: 6px 6px 0;
}

.install__manager {
  padding: 5px 10px;
  border: 0;
  border-radius: 8px 8px 0 0;
  color: var(--color-text-faint);
  background: transparent;
  font-family: var(--font-mono);
  font-size: 12.5px;
  cursor: pointer;
  transition: color 140ms ease;
}

.install__manager:hover {
  color: var(--color-text);
}

.install__manager.is-active {
  color: var(--color-text);
  background: var(--color-bg-muted);
}

.install__command {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 8px 8px 18px;
  background: var(--color-bg-muted);
}

.install__command code {
  flex: 1 1 auto;
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.install__prompt {
  margin-right: 10px;
  color: var(--color-text-faint);
  user-select: none;
}

.install__copy {
  display: inline-grid;
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 0;
  border-radius: 10px;
  color: var(--color-text-soft);
  background: transparent;
  cursor: pointer;
  transition:
    color 140ms ease,
    background-color 140ms ease;
}

.install__copy:hover {
  color: var(--color-text);
  background: var(--color-bg-elevated);
}
</style>
