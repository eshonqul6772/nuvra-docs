<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';

import { searchOpen } from '../composables/use-search';
import { type SearchResult, type SearchSection, loadSearchIndex, searchSections } from '../content/docs/search-index';
import { locale, messages } from '../i18n';
import SiteIcon from './site-icon.vue';

/**
 * Search over every article of the active language, in a modal dialog: matches are listed with the article title,
 * the heading they belong to and a snippet, and the arrow keys, Enter and Escape drive the list.
 */
defineOptions({ name: 'SearchDialog' });

/** Selector of the controls the Tab key cycles through while the dialog is open. */
const FOCUSABLE = 'input, button, [href], [tabindex]:not([tabindex="-1"])';

const router = useRouter();
const dialogRef = ref<HTMLDialogElement>();
const inputRef = ref<HTMLInputElement>();
const query = ref('');
const sections = shallowRef<SearchSection[]>([]);
const loading = ref(false);
const activeIndex = ref(0);

const results = computed(() => searchSections(sections.value, query.value));
const hasQuery = computed(() => query.value.trim() !== '');

/** Id of a result option, referenced by the input while the option is active. */
const optionId = (index: number) => `search-result-${index}`;

/** Loads the articles of the active language; a later language change replaces a slower earlier load. */
const loadSections = async () => {
  const requested = locale.value;
  loading.value = true;
  try {
    const loaded = await loadSearchIndex(requested);
    if (requested === locale.value) sections.value = loaded;
  } finally {
    loading.value = false;
  }
};

/** Closes the dialog; the browser returns focus to the control that opened it. */
const close = () => {
  dialogRef.value?.close();
};

/** Opens the article of a result, scrolled to its heading. */
const open = (result: SearchResult | undefined) => {
  if (!result) return;
  const { slug, anchor } = result.section;
  close();
  void router.push({ path: `/docs/${slug}`, hash: anchor ? `#${anchor}` : '' });
};

/** Arrow keys move through the results, Enter opens one and Tab stays inside the dialog. */
const onKeydown = (event: KeyboardEvent) => {
  const count = results.value.length;
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    if (!count) return;
    const step = event.key === 'ArrowDown' ? 1 : -1;
    activeIndex.value = (activeIndex.value + step + count) % count;
  } else if (event.key === 'Enter' && event.target === inputRef.value) {
    event.preventDefault();
    open(results.value[activeIndex.value]);
  } else if (event.key === 'Tab' && dialogRef.value) {
    const focusable = Array.from(dialogRef.value.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
};

/** A click on the backdrop, outside the panel, closes the dialog. */
const onDialogClick = (event: MouseEvent) => {
  if (event.target === dialogRef.value) close();
};

watch(searchOpen, async open => {
  const dialog = dialogRef.value;
  if (!dialog) return;
  if (open && !dialog.open) {
    dialog.showModal();
    await nextTick();
    inputRef.value?.select();
    void loadSections();
  } else if (!open && dialog.open) {
    dialog.close();
  }
});

watch(query, () => {
  activeIndex.value = 0;
});

watch(activeIndex, async index => {
  await nextTick();
  document.getElementById(optionId(index))?.scrollIntoView({ block: 'nearest' });
});
</script>

<template>
  <dialog
    ref="dialogRef"
    class="search"
    aria-labelledby="search-title"
    @close="searchOpen = false"
    @click="onDialogClick"
    @keydown="onKeydown"
  >
    <div class="search__panel">
      <h2 id="search-title" class="visually-hidden">{{ messages.search.title }}</h2>
      <div class="search__field">
        <SiteIcon name="search" :size="19" />
        <input
          ref="inputRef"
          v-model="query"
          class="search__input"
          type="search"
          role="combobox"
          autocomplete="off"
          spellcheck="false"
          enterkeyhint="go"
          aria-autocomplete="list"
          aria-controls="search-results"
          :aria-expanded="results.length > 0"
          :aria-activedescendant="results.length ? optionId(activeIndex) : undefined"
          :aria-label="messages.search.title"
          :placeholder="messages.search.placeholder"
        />
        <button type="button" class="search__close" :aria-label="messages.search.close" @click="close">
          <kbd>Esc</kbd>
          <SiteIcon name="x" :size="18" />
        </button>
      </div>

      <div class="search__body">
        <ul
          v-show="results.length"
          id="search-results"
          class="search__results"
          role="listbox"
          :aria-label="messages.search.results"
        >
          <li
            v-for="(result, index) in results"
            :id="optionId(index)"
            :key="`${result.section.slug}#${result.section.anchor}`"
            class="search__result"
            :class="{ 'is-active': index === activeIndex }"
            role="option"
            :aria-selected="index === activeIndex"
            @click="open(result)"
            @mousemove="activeIndex = index"
          >
            <span class="search__result-path">
              <span class="search__result-title">{{ result.section.title }}</span>
              <template v-if="result.section.heading">
                <span class="search__result-separator" aria-hidden="true">›</span>
                <span class="search__result-heading">{{ result.section.heading }}</span>
              </template>
            </span>
            <span v-if="result.snippet.length" class="search__snippet">
              <template v-for="(part, partIndex) in result.snippet" :key="partIndex">
                <mark v-if="part.match">{{ part.text }}</mark>
                <template v-else>{{ part.text }}</template>
              </template>
            </span>
          </li>
        </ul>
        <p v-if="!results.length" class="search__status">
          {{ loading ? messages.search.loading : hasQuery ? messages.search.empty(query.trim()) : messages.search.hint }}
        </p>
      </div>

      <p class="visually-hidden" role="status" aria-live="polite">
        {{ hasQuery && !loading ? messages.search.count(results.length) : '' }}
      </p>

      <footer class="search__footer" aria-hidden="true">
        <span><kbd>↑</kbd><kbd>↓</kbd> {{ messages.search.navigate }}</span>
        <span><kbd>↵</kbd> {{ messages.search.select }}</span>
        <span><kbd>Esc</kbd> {{ messages.search.close }}</span>
      </footer>
    </div>
  </dialog>
</template>

<style scoped>
.search {
  box-sizing: border-box;
  width: min(640px, calc(100vw - 32px));
  max-width: none;
  max-height: min(640px, calc(100dvh - 96px));
  margin: 72px auto auto;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text);
  background: var(--color-bg-elevated);
  box-shadow: var(--shadow-lg);
}

.search[open] {
  display: flex;
}

.search::backdrop {
  background: rgb(15 15 20 / 45%);
  backdrop-filter: blur(3px);
}

.search__panel {
  display: flex;
  width: 100%;
  min-height: 0;
  flex-direction: column;
}

.search__field {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px 0 18px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-faint);
}

.search__input {
  flex: 1 1 auto;
  min-width: 0;
  height: 58px;
  padding: 0;
  border: 0;
  outline: none;
  color: var(--color-text);
  background: transparent;
  font: inherit;
  font-size: 17px;
}

.search__input::-webkit-search-cancel-button {
  display: none;
}

.search__close {
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 6px;
  border: 0;
  border-radius: 8px;
  color: var(--color-text-soft);
  background: transparent;
  cursor: pointer;
}

.search__close:hover {
  color: var(--color-text);
  background: var(--color-bg-muted);
}

.search__close:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.search__close .site-icon {
  display: none;
}

.search__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.search__results {
  display: grid;
  gap: 2px;
  margin: 0;
  padding: 8px;
  list-style: none;
}

.search__result {
  display: grid;
  gap: 3px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.search__result.is-active {
  background: var(--color-accent-soft);
}

.search__result-path {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 2px 6px;
  font-size: 14.5px;
  line-height: 1.4;
}

.search__result-title {
  color: var(--color-text-soft);
}

.search__result-separator {
  color: var(--color-text-faint);
}

.search__result-heading,
.search__result:not(:has(.search__result-heading)) .search__result-title {
  color: var(--color-text);
  font-weight: 600;
}

.search__result.is-active .search__result-heading,
.search__result.is-active:not(:has(.search__result-heading)) .search__result-title {
  color: var(--color-accent-strong);
}

.search__snippet {
  display: -webkit-box;
  overflow: hidden;
  color: var(--color-text-soft);
  font-size: 13.5px;
  line-height: 1.5;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow-wrap: anywhere;
}

.search__snippet mark {
  border-radius: 3px;
  color: inherit;
  background: color-mix(in srgb, var(--color-accent) 24%, transparent);
}

.search__status {
  margin: 0;
  padding: 36px 24px;
  color: var(--color-text-faint);
  font-size: 14.5px;
  text-align: center;
  overflow-wrap: anywhere;
}

.search__footer {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  padding: 10px 18px;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-faint);
  background: var(--color-bg-muted);
  font-size: 12.5px;
}

kbd {
  display: inline-grid;
  min-width: 20px;
  height: 20px;
  box-sizing: border-box;
  place-items: center;
  margin-right: 3px;
  padding: 0 5px;
  border: 1px solid var(--color-border-strong);
  border-radius: 5px;
  color: var(--color-text-soft);
  background: var(--color-bg-elevated);
  font-family: var(--font-sans);
  font-size: 11.5px;
  font-weight: 600;
  line-height: 1;
}

@media (max-width: 640px) {
  .search {
    width: calc(100vw - 16px);
    max-height: calc(100dvh - 16px);
    margin-top: 8px;
  }

  .search__close kbd {
    display: none;
  }

  .search__close .site-icon {
    display: block;
  }

  .search__footer {
    display: none;
  }
}
</style>
