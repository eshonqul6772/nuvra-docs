<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import { colorScheme, toggleColorScheme } from '../composables/use-color-scheme';
import { IS_APPLE, isSearchShortcut, openSearch } from '../composables/use-search';
import { LOCALES, locale, messages, setLocale } from '../i18n';
import { GITHUB_URL, NPM_URL } from '../site';
import SearchDialog from './search-dialog.vue';
import SiteIcon from './site-icon.vue';
import SiteLogo from './site-logo.vue';

/** Sticky site header: logo, main links, search, language switch, colour scheme toggle and the GitHub link. */
defineOptions({ name: 'SiteHeader' });

const route = useRoute();

/**
 * Opens the search with Ctrl+K or ⌘K. Inside editable content the shortcut belongs to that content, such as the link
 * command of the nuvra editors in the demo.
 */
const onKeydown = (event: KeyboardEvent) => {
  if (event.defaultPrevented || !isSearchShortcut(event)) return;
  const target = event.target;
  if (target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select'))) return;
  event.preventDefault();
  openSearch();
};

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
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
        <RouterLink
          to="/playground"
          class="header__link header__link--medium"
          :class="{ 'is-active': route.path === '/playground' }"
        >
          {{ messages.nav.playground }}
        </RouterLink>
        <RouterLink :to="{ path: '/', hash: '#demo' }" class="header__link header__link--wide">
          {{ messages.nav.demo }}
        </RouterLink>
        <a :href="NPM_URL" class="header__link header__link--wide" target="_blank" rel="noopener noreferrer">npm</a>
      </nav>

      <div class="header__actions">
        <button
          type="button"
          class="header__search"
          aria-haspopup="dialog"
          :aria-label="messages.search.title"
          :aria-keyshortcuts="IS_APPLE ? 'Meta+K' : 'Control+K'"
          @click="openSearch"
        >
          <SiteIcon name="search" :size="17" />
          <span class="header__search-label">{{ messages.nav.search }}</span>
          <kbd class="header__search-keys" aria-hidden="true">{{ IS_APPLE ? '⌘K' : 'Ctrl K' }}</kbd>
        </button>
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
          class="icon-button header__github"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="messages.nav.github"
          :title="messages.nav.github"
        >
          <SiteIcon name="github" />
        </a>
      </div>
    </div>
    <SearchDialog />
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
  white-space: nowrap;
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

/* Search: a field-like button on wide screens, an icon button on narrow ones. */
.header__search {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  margin-right: 6px;
  padding: 0 8px 0 12px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-text-faint);
  background: var(--color-bg-muted);
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  transition:
    color 140ms ease,
    border-color 140ms ease;
}

.header__search:hover {
  border-color: var(--color-border-strong);
  color: var(--color-text);
}

.header__search:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.header__search-label {
  min-width: 72px;
  text-align: left;
}

.header__search-keys {
  padding: 2px 6px;
  border: 1px solid var(--color-border-strong);
  border-radius: 6px;
  color: var(--color-text-soft);
  background: var(--color-bg-elevated);
  font-family: var(--font-sans);
  font-size: 11.5px;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .header__search {
    width: 38px;
    justify-content: center;
    margin-right: 0;
    padding: 0;
    border-color: transparent;
    color: var(--color-text-soft);
    background: transparent;
  }

  .header__search:hover {
    background: var(--color-bg-muted);
  }

  .header__search-label,
  .header__search-keys {
    display: none;
  }
}

@media (max-width: 720px) {
  .header__inner {
    gap: 12px;
  }

  .header__link {
    padding-inline: 8px;
  }

  .header__link--wide {
    display: none;
  }

  .header__actions {
    gap: 2px;
  }
}

@media (max-width: 600px) {
  .header__link--medium,
  .header__github {
    display: none;
  }
}

@media (max-width: 480px) {
  .header__nav {
    display: none;
  }
}
</style>
