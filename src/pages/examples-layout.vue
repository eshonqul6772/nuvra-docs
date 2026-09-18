<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';

import SiteIcon from '../components/site-icon.vue';
import { EXAMPLES, EXAMPLE_GROUPS } from '../examples/catalog';
import { locale, messages } from '../i18n';

/**
 * Frame of the examples: a full-height area with the sidebar on the left and the open example on the right, each
 * scrolling on its own. The sidebar stays mounted while the visitor moves between the examples, so its scroll position
 * survives and its highlight glides from the old entry to the new one; the content starts at its top for every example.
 */
defineOptions({ name: 'ExamplesLayout' });

const route = useRoute();
const navRef = ref<HTMLElement>();
/** Scrolling area of the open example. */
const mainRef = ref<HTMLElement>();
const menuOpen = ref(false);
/** Where the sliding highlight sits, relative to the scrolling list. */
const highlight = ref<{ top: number; height: number } | null>(null);
/** Whether the list is scrolled away from its top or bottom, which shows a soft fade on that edge. */
const fadeTop = ref(false);
const fadeBottom = ref(false);

const activeSlug = computed(() => (typeof route.params.slug === 'string' ? route.params.slug : ''));
const activeTitle = computed(() => {
  const example = EXAMPLES.find(entry => entry.slug === activeSlug.value);
  return example ? example.title[locale.value] : messages.value.examples.overview;
});

/** Moves the highlight under the active link and brings that link into view, both smoothly. */
const placeHighlight = async (scroll: boolean) => {
  await nextTick();
  const nav = navRef.value;
  const link = nav?.querySelector<HTMLElement>('.examples-nav__link.is-active');
  if (!nav || !link) {
    highlight.value = null;
    return;
  }
  highlight.value = { top: link.offsetTop, height: link.offsetHeight };
  if (!scroll) return;
  const top = link.offsetTop - nav.scrollTop;
  const margin = 48;
  if (top < margin || top + link.offsetHeight > nav.clientHeight - margin) {
    nav.scrollTo({ top: link.offsetTop - nav.clientHeight / 2 + link.offsetHeight / 2, behavior: 'smooth' });
  }
};

const updateFades = () => {
  const nav = navRef.value;
  if (!nav) return;
  fadeTop.value = nav.scrollTop > 4;
  fadeBottom.value = nav.scrollTop + nav.clientHeight < nav.scrollHeight - 4;
};

let resizeObserver: ResizeObserver | undefined;

onMounted(() => {
  void placeHighlight(true);
  updateFades();
  resizeObserver = new ResizeObserver(() => {
    void placeHighlight(false);
    updateFades();
  });
  if (navRef.value) resizeObserver.observe(navRef.value);
});

onBeforeUnmount(() => resizeObserver?.disconnect());

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
    mainRef.value?.scrollTo({ top: 0 });
    void placeHighlight(true);
  }
);
// Titles change length with the language, which moves the links.
watch(locale, () => void placeHighlight(false));
</script>

<template>
  <div class="page examples-layout container">
    <button
      type="button"
      class="examples-layout__menu-toggle"
      :aria-expanded="menuOpen"
      @click="menuOpen = !menuOpen"
    >
      <SiteIcon :name="menuOpen ? 'x' : 'menu'" :size="18" />
      {{ activeTitle }}
    </button>

    <aside class="examples-layout__sidebar" :class="{ 'is-open': menuOpen }">
      <nav
        ref="navRef"
        class="examples-nav"
        :class="{ 'has-fade-top': fadeTop, 'has-fade-bottom': fadeBottom }"
        :aria-label="messages.examples.menu"
        @scroll.passive="updateFades"
      >
        <span
          v-if="highlight"
          class="examples-nav__highlight"
          aria-hidden="true"
          :style="{ transform: `translateY(${highlight.top}px)`, height: `${highlight.height}px` }"
        />

        <section class="examples-nav__group">
          <h2 class="examples-nav__title">{{ messages.examples.getStarted }}</h2>
          <RouterLink
            to="/examples"
            class="examples-nav__link"
            :class="{ 'is-active': !activeSlug }"
            :aria-current="!activeSlug ? 'page' : undefined"
          >
            {{ messages.examples.overview }}
          </RouterLink>
        </section>

        <section v-for="group in EXAMPLE_GROUPS" :key="group.title.en" class="examples-nav__group">
          <h2 class="examples-nav__title">{{ group.title[locale] }}</h2>
          <ul class="examples-nav__list">
            <li v-for="entry in group.examples" :key="entry.slug">
              <RouterLink
                :to="`/examples/${entry.slug}`"
                class="examples-nav__link"
                :class="{ 'is-active': entry.slug === activeSlug }"
                :aria-current="entry.slug === activeSlug ? 'page' : undefined"
              >
                {{ entry.title[locale] }}
              </RouterLink>
            </li>
          </ul>
        </section>
      </nav>
    </aside>

    <div ref="mainRef" class="examples-layout__main" tabindex="-1">
      <RouterView v-slot="{ Component, route: current }">
        <Transition name="examples-page" mode="out-in">
          <component :is="Component" :key="current.path" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style scoped>
/*
 * The frame fills the window below the header; the window itself does not scroll. The sidebar and the content are
 * two scrolling areas side by side, each with its own scrollbar.
 */
.examples-layout.container {
  display: grid;
  box-sizing: border-box;
  /* The header is its height plus a 1px bottom border. */
  height: calc(100vh - var(--header-height) - 1px);
  height: calc(100dvh - var(--header-height) - 1px);
  max-width: 1320px;
  grid-template-columns: 236px minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  gap: 48px;
  overflow: hidden;
  padding-block: 0;
}

/* Sidebar */
.examples-layout__sidebar {
  display: flex;
  min-height: 0;
  flex-direction: column;
  padding-top: 28px;
}

.examples-nav {
  --fade: 28px;
  position: relative;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 4px 8px 32px 0;
  scroll-behavior: smooth;
  scrollbar-color: transparent transparent;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  transition: scrollbar-color 200ms ease;
}

/* The scrollbar only appears while the pointer is over the list. */
.examples-nav:hover,
.examples-nav:focus-within {
  scrollbar-color: color-mix(in srgb, var(--color-text-faint) 45%, transparent) transparent;
}

.examples-nav::-webkit-scrollbar {
  width: 6px;
}

.examples-nav::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: transparent;
}

.examples-nav:hover::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--color-text-faint) 45%, transparent);
}

/* Soft edges where more links are hidden above or below. */
.examples-nav.has-fade-top {
  mask-image: linear-gradient(to bottom, transparent 0, #000 var(--fade), #000 100%);
}

.examples-nav.has-fade-bottom {
  mask-image: linear-gradient(to bottom, #000 0, #000 calc(100% - var(--fade)), transparent 100%);
}

.examples-nav.has-fade-top.has-fade-bottom {
  mask-image: linear-gradient(
    to bottom,
    transparent 0,
    #000 var(--fade),
    #000 calc(100% - var(--fade)),
    transparent 100%
  );
}

.examples-nav__highlight {
  position: absolute;
  top: 0;
  left: 0;
  right: 8px;
  border-radius: 10px;
  background: var(--color-bg-elevated);
  box-shadow:
    var(--shadow-sm),
    inset 0 0 0 1px var(--color-border);
  pointer-events: none;
  transition:
    transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
    height 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.examples-nav__group + .examples-nav__group {
  margin-top: 26px;
}

.examples-nav__title {
  margin: 0 0 6px;
  padding-left: 12px;
  color: var(--color-text);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.examples-nav__list {
  display: grid;
  gap: 1px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.examples-nav__link {
  position: relative;
  display: block;
  padding: 7px 12px;
  border-radius: 10px;
  color: var(--color-text-soft);
  font-size: 14px;
  line-height: 1.35;
  text-decoration: none;
  transition: color 200ms ease;
}

.examples-nav__link:hover {
  color: var(--color-text);
}

.examples-nav__link.is-active {
  color: var(--color-accent-strong);
  font-weight: 600;
}

.examples-nav__link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

/* Content: scrolls on its own, with a slim scrollbar at the right edge of the frame. */
.examples-layout__main {
  min-width: 0;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  margin-right: -24px;
  padding: 28px 24px 96px 0;
  outline: none;
  scrollbar-color: color-mix(in srgb, var(--color-text-faint) 45%, transparent) transparent;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
}

.examples-layout__main::-webkit-scrollbar {
  width: 8px;
}

.examples-layout__main::-webkit-scrollbar-thumb {
  border: 2px solid transparent;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-text-faint) 45%, transparent) padding-box;
}

.examples-layout__main::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-text-faint);
}

.examples-page-enter-active,
.examples-page-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.examples-page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.examples-page-leave-to {
  opacity: 0;
}

.examples-layout__menu-toggle {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .examples-nav,
  .examples-nav__highlight,
  .examples-page-enter-active,
  .examples-page-leave-active {
    scroll-behavior: auto;
    transition: none;
  }
}

@media (max-width: 1024px) {
  .examples-layout.container {
    grid-template-columns: 210px minmax(0, 1fr);
    gap: 32px;
  }
}

/* Phones: one column in the normal page scroll, with the sidebar behind a menu button. */
@media (max-width: 860px) {
  .examples-layout.container {
    height: auto;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: none;
    gap: 16px;
    overflow: visible;
    padding-block: 20px 64px;
  }

  .examples-layout__main {
    overflow: visible;
    margin-right: 0;
    padding: 0;
  }

  .examples-layout__menu-toggle {
    display: inline-flex;
    align-items: center;
    justify-self: start;
    gap: 8px;
    height: 40px;
    padding: 0 16px;
    border: 1px solid var(--color-border);
    border-radius: 999px;
    color: var(--color-text);
    background: var(--color-bg-elevated);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  .examples-layout__sidebar {
    position: static;
    display: none;
    padding: 16px 8px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-bg-elevated);
  }

  .examples-layout__sidebar.is-open {
    display: block;
  }

  .examples-nav {
    max-height: 60vh;
  }
}
</style>
