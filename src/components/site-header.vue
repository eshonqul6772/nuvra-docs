<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';

import { colorScheme, toggleColorScheme } from '../composables/use-color-scheme';
import { LOCALES, locale, messages, setLocale } from '../i18n';
import { GITHUB_URL, NPM_URL } from '../site';
import SiteIcon from './site-icon.vue';
import SiteLogo from './site-logo.vue';

/** Sticky site header: logo, main links, language switch, colour scheme toggle and the GitHub link. */
defineOptions({ name: 'SiteHeader' });

const route = useRoute();
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <RouterLink to="/" class="header__brand" aria-label="nuvra">
        <SiteLogo />
      </RouterLink>

      <nav class="header__nav" :aria-label="messages.nav.main">
        <RouterLink
          to="/docs/getting-started"
          class="header__link"
          :class="{ 'is-active': route.path.startsWith('/docs') }"
        >
          {{ messages.nav.docs }}
        </RouterLink>
        <RouterLink :to="{ path: '/', hash: '#demo' }" class="header__link header__link--wide">
          {{ messages.nav.demo }}
        </RouterLink>
        <a :href="NPM_URL" class="header__link header__link--wide" target="_blank" rel="noopener noreferrer">npm</a>
      </nav>

      <div class="header__actions">
        <div class="segmented" role="group" :aria-label="messages.nav.language">
          <button
            v-for="option in LOCALES"
            :key="option.value"
            type="button"
            class="segmented__option"
            :class="{ 'is-active': locale === option.value }"
            :aria-pressed="locale === option.value"
            @click="setLocale(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
        <button
          type="button"
          class="icon-button"
          :aria-label="messages.nav.theme"
          :title="messages.nav.theme"
          @click="toggleColorScheme"
        >
          <SiteIcon :name="colorScheme === 'dark' ? 'sun' : 'moon'" />
        </button>
        <a
          :href="GITHUB_URL"
          class="icon-button"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="messages.nav.github"
          :title="messages.nav.github"
        >
          <SiteIcon name="github" />
        </a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  z-index: 50;
  top: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 75%, transparent);
  background: color-mix(in srgb, var(--color-bg) 80%, transparent);
  backdrop-filter: saturate(160%) blur(14px);
}

.header__inner {
  display: flex;
  align-items: center;
  gap: 28px;
  height: var(--header-height);
}

.header__brand {
  display: inline-flex;
  border-radius: 10px;
  text-decoration: none;
}

.header__nav {
  display: flex;
  gap: 2px;
}

.header__link {
  padding: 6px 12px;
  border-radius: 8px;
  color: var(--color-text-soft);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition:
    color 140ms ease,
    background-color 140ms ease;
}

.header__link:hover {
  color: var(--color-text);
  background: var(--color-bg-muted);
}

.header__link.is-active {
  color: var(--color-text);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

@media (max-width: 720px) {
  .header__inner {
    gap: 12px;
  }

  .header__link--wide {
    display: none;
  }
}

@media (max-width: 420px) {
  .header__nav {
    display: none;
  }
}
</style>
