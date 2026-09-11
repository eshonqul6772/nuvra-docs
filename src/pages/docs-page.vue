<script setup lang="ts">
import { type Component, computed, nextTick, onBeforeUnmount, ref, shallowRef, watch, watchEffect } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

import SiteIcon from '../components/site-icon.vue';
import { DOCS_NAV, DOCS_PAGES } from '../content/docs/nav';
import { locale, messages } from '../i18n';

/**
 * Documentation page: the sidebar, the Markdown article of the slug in the active language with copy buttons on its
 * code blocks, previous and next links, and an outline that follows the reader.
 */
defineOptions({ name: 'DocsPage' });

interface Props {
  /** Article from the URL; also the name of its Markdown files. */
  slug: string;
}

const props = defineProps<Props>();

/** A heading listed in the page outline. */
interface OutlineItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Markdown articles by path, loaded on demand. */
const ARTICLES = import.meta.glob<{ default: Component }>('../content/docs/*/*.md');
/** How long a copy button shows its confirmation, in milliseconds. */
const COPIED_DURATION = 1600;
/** Band of the viewport, below the header, in which a heading counts as the one being read. */
const READING_ZONE = '-96px 0px -66% 0px';

const route = useRoute();
const router = useRouter();
const articleRef = ref<HTMLElement>();
const article = shallowRef<Component | null>(null);
const outline = ref<OutlineItem[]>([]);
const activeHeading = ref('');
const menuOpen = ref(false);

let headingObserver: IntersectionObserver | undefined;
/** Grows with every load, so a slow earlier load cannot replace a newer article. */
let loadCount = 0;

const pageIndex = computed(() => DOCS_PAGES.findIndex(entry => entry.slug === props.slug));
const page = computed(() => DOCS_PAGES[pageIndex.value]);
const previousPage = computed(() => (pageIndex.value > 0 ? DOCS_PAGES[pageIndex.value - 1] : undefined));
const nextPage = computed(() => (pageIndex.value >= 0 ? DOCS_PAGES[pageIndex.value + 1] : undefined));

/** Wraps every code block of the article with a copy button. */
const addCopyButtons = (root: HTMLElement) => {
  for (const pre of root.querySelectorAll('pre')) {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.before(wrapper);
    wrapper.append(pre);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-block__copy';
    button.textContent = messages.value.docs.copy;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.textContent ?? '');
      } catch {
        return;
      }
      button.textContent = messages.value.docs.copied;
      setTimeout(() => {
        button.textContent = messages.value.docs.copy;
      }, COPIED_DURATION);
    });
    wrapper.append(button);
  }
};

/** Lists the article's second- and third-level headings and marks the one being read. */
const buildOutline = (root: HTMLElement) => {
  const headings = Array.from(root.querySelectorAll<HTMLElement>('h2[id], h3[id]'));
  outline.value = headings.map(heading => ({
    id: heading.id,
    text: heading.textContent?.trim() ?? '',
    level: heading.tagName === 'H2' ? 2 : 3
  }));
  activeHeading.value = headings[0]?.id ?? '';
  headingObserver?.disconnect();
  headingObserver = new IntersectionObserver(
    entries => {
      const reading = entries
        .filter(entry => entry.isIntersecting)
        .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)[0];
      if (reading) activeHeading.value = reading.target.id;
    },
    { rootMargin: READING_ZONE }
  );
  for (const heading of headings) headingObserver.observe(heading);
};

/** Scrolls to the heading named in the URL hash; articles load after the router has tried to scroll. */
const scrollToHash = () => {
  const id = decodeURIComponent(route.hash.slice(1));
  if (id) document.getElementById(id)?.scrollIntoView();
};

/** Loads the article of the current slug and language, then adds copy buttons and the outline. */
const loadArticle = async () => {
  const load = ARTICLES[`../content/docs/${locale.value}/${props.slug}.md`];
  const current = ++loadCount;
  menuOpen.value = false;
  if (!load) {
    article.value = null;
    outline.value = [];
    return;
  }
  const module = await load();
  if (current !== loadCount) return;
  article.value = module.default;
  await nextTick();
  const root = articleRef.value;
  if (!root) return;
  addCopyButtons(root);
  buildOutline(root);
  scrollToHash();
};

/** Opens links to other docs pages and in-page anchors through the router instead of reloading the site. */
const onArticleClick = (event: MouseEvent) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
  const link = event.target instanceof Element ? event.target.closest('a') : null;
  const href = link?.getAttribute('href');
  if (!link || !href || link.target === '_blank') return;
  if (href.startsWith('#')) {
    event.preventDefault();
    void router.push({ hash: href });
  } else if (href.startsWith('/docs')) {
    event.preventDefault();
    void router.push(href);
  }
};

watch(() => [props.slug, locale.value], loadArticle, { immediate: true });

watchEffect(() => {
  const title = page.value?.title[locale.value];
  document.title = title ? `${title} · ${messages.value.meta.docsTitle}` : messages.value.meta.docsTitle;
});

onBeforeUnmount(() => headingObserver?.disconnect());
</script>

<template>
  <div class="page docs container">
    <button type="button" class="docs__menu-toggle" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
      <SiteIcon :name="menuOpen ? 'x' : 'menu'" :size="18" />
      {{ page?.title[locale] ?? messages.docs.menu }}
    </button>

    <aside class="docs__sidebar" :class="{ 'is-open': menuOpen }">
      <nav :aria-label="messages.nav.menu">
        <section v-for="group in DOCS_NAV" :key="group.title.en" class="docs-nav__group">
          <h2 class="docs-nav__title">{{ group.title[locale] }}</h2>
          <ul class="docs-nav__list">
            <li v-for="entry in group.pages" :key="entry.slug">
              <RouterLink
                :to="`/docs/${entry.slug}`"
                class="docs-nav__link"
                :class="{ 'is-active': entry.slug === slug }"
              >
                {{ entry.title[locale] }}
              </RouterLink>
            </li>
          </ul>
        </section>
      </nav>
    </aside>

    <main class="docs__main">
      <template v-if="page">
        <article ref="articleRef" class="docs__article" @click="onArticleClick">
          <component :is="article" v-if="article" />
        </article>
        <nav class="docs__pager">
          <RouterLink v-if="previousPage" :to="`/docs/${previousPage.slug}`" class="pager pager--previous">
            <span>{{ messages.docs.previous }}</span>
            <strong>{{ previousPage.title[locale] }}</strong>
          </RouterLink>
          <RouterLink v-if="nextPage" :to="`/docs/${nextPage.slug}`" class="pager pager--next">
            <span>{{ messages.docs.next }}</span>
            <strong>{{ nextPage.title[locale] }}</strong>
          </RouterLink>
        </nav>
      </template>
      <div v-else class="docs__missing">
        <h1>{{ messages.docs.missingTitle }}</h1>
        <p>{{ messages.docs.missingText }}</p>
      </div>
    </main>

    <aside v-if="outline.length" class="docs__outline">
      <p class="docs__outline-title">{{ messages.docs.onThisPage }}</p>
      <ul>
        <li v-for="item in outline" :key="item.id" :class="`is-level-${item.level}`">
          <RouterLink :to="{ hash: `#${item.id}` }" :class="{ 'is-active': activeHeading === item.id }">
            {{ item.text }}
          </RouterLink>
        </li>
      </ul>
    </aside>
  </div>
</template>

<style scoped>
.docs.container {
  display: grid;
  max-width: 1320px;
  grid-template-columns: 232px minmax(0, 1fr) 216px;
  align-items: start;
  gap: 56px;
  padding-block: 40px 104px;
}

/* Sidebar */
.docs__sidebar {
  position: sticky;
  top: calc(var(--header-height) + 32px);
  max-height: calc(100vh - var(--header-height) - 56px);
  overflow-y: auto;
}

.docs-nav__group + .docs-nav__group {
  margin-top: 28px;
}

.docs-nav__title {
  margin: 0 0 8px;
  padding-left: 12px;
  color: var(--color-text-faint);
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.docs-nav__list {
  display: grid;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.docs-nav__link {
  display: block;
  padding: 7px 12px;
  border-radius: 8px;
  color: var(--color-text-soft);
  font-size: 14.5px;
  text-decoration: none;
  transition:
    color 140ms ease,
    background-color 140ms ease;
}

.docs-nav__link:hover {
  color: var(--color-text);
  background: var(--color-bg-muted);
}

.docs-nav__link.is-active {
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
  font-weight: 600;
}

/* Article */
.docs__main {
  min-width: 0;
}

.docs__article {
  max-width: 780px;
  min-height: 60vh;
}

.docs__pager {
  display: grid;
  max-width: 780px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 64px;
}

.pager {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  text-decoration: none;
  transition:
    border-color 140ms ease,
    box-shadow 140ms ease;
}

.pager:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-sm);
}

.pager span {
  color: var(--color-text-faint);
  font-size: 13px;
}

.pager strong {
  color: var(--color-accent-strong);
  font-size: 16px;
  font-weight: 600;
}

.pager--next {
  grid-column: 2;
  text-align: right;
}

.docs__missing h1 {
  margin: 0 0 8px;
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 500;
}

.docs__missing p {
  color: var(--color-text-soft);
}

/* Outline */
.docs__outline {
  position: sticky;
  top: calc(var(--header-height) + 32px);
  font-size: 13.5px;
}

.docs__outline-title {
  margin: 0 0 10px;
  color: var(--color-text-faint);
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.docs__outline ul {
  margin: 0;
  padding: 0;
  border-left: 1px solid var(--color-border);
  list-style: none;
}

.docs__outline a {
  display: block;
  margin-left: -1px;
  padding: 5px 0 5px 14px;
  border-left: 2px solid transparent;
  color: var(--color-text-soft);
  line-height: 1.4;
  text-decoration: none;
}

.docs__outline a:hover {
  color: var(--color-text);
}

.docs__outline .is-level-3 a {
  padding-left: 26px;
}

.docs__outline a.is-active {
  border-left-color: var(--color-accent);
  color: var(--color-accent-strong);
}

.docs__menu-toggle {
  display: none;
}

@media (max-width: 1200px) {
  .docs.container {
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 40px;
  }

  .docs__outline {
    display: none;
  }
}

@media (max-width: 860px) {
  .docs.container {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
    padding-top: 20px;
  }

  .docs__menu-toggle {
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

  .docs__sidebar {
    position: static;
    display: none;
    max-height: none;
    padding: 18px 12px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-bg-elevated);
  }

  .docs__sidebar.is-open {
    display: block;
  }

  .docs__pager {
    grid-template-columns: minmax(0, 1fr);
  }

  .pager--next {
    grid-column: auto;
  }
}
</style>
