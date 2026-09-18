<script setup lang="ts">
import { type Component, computed, ref, shallowRef, watch, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import { en, ru, setEditorLocale, uz } from 'nuvra';

import ExampleCode from '../components/example-code.vue';
import SiteIcon from '../components/site-icon.vue';
import { EXAMPLES, exampleFileName, groupOf, loadExample, loadExampleSource } from '../examples/catalog';
import { locale, messages } from '../i18n';

import '../examples/examples.css';

/**
 * One live example: breadcrumb, title and description, the running demo in a frame with the code that runs it right
 * under it, and the previous and next examples.
 */
defineOptions({ name: 'ExamplePage' });

interface Props {
  /** Example from the URL; also the name of its file in `src/examples/demos`. */
  slug: string;
}

const props = defineProps<Props>();

/** Editor interface language for each site language; the examples themselves pass no `locale`. */
const EDITOR_LOCALES = { en, uz, ru };

const demo = shallowRef<Component | null>(null);
const source = ref('');
/** Grows with every load, so a slow earlier load cannot replace a newer example. */
let loadCount = 0;
/** Changing it mounts the demo afresh, which puts its content back to the start. */
const runKey = ref(0);

const index = computed(() => EXAMPLES.findIndex(example => example.slug === props.slug));
const example = computed(() => EXAMPLES[index.value]);
const group = computed(() => groupOf(props.slug));
const previous = computed(() => (index.value > 0 ? EXAMPLES[index.value - 1] : undefined));
const next = computed(() => (index.value >= 0 ? EXAMPLES[index.value + 1] : undefined));

watch(
  () => props.slug,
  async slug => {
    const current = ++loadCount;
    demo.value = null;
    source.value = '';
    const [module, code] = await Promise.all([loadExample(slug), loadExampleSource(slug)]);
    if (current !== loadCount) return;
    demo.value = module?.default ?? null;
    source.value = code ?? '';
  },
  { immediate: true }
);

watch(
  locale,
  value => {
    setEditorLocale(EDITOR_LOCALES[value]);
  },
  { immediate: true }
);

watchEffect(() => {
  const title = example.value?.title[locale.value];
  document.title = title ? `${title} · ${messages.value.meta.examplesTitle}` : messages.value.meta.examplesTitle;
});
</script>

<template>
  <main class="example">
    <template v-if="example">
      <nav class="breadcrumb" :aria-label="messages.examples.breadcrumb">
        <RouterLink to="/examples">{{ messages.examples.eyebrow }}</RouterLink>
        <span aria-hidden="true">/</span>
        <span>{{ group?.title[locale] }}</span>
      </nav>
      <h1 class="example__title">{{ example.title[locale] }}</h1>
      <p class="example__lead">{{ example.description[locale] }}</p>
      <p class="example__meta">
        <code v-for="feature in example.features" :key="feature">{{ feature }}</code>
        <RouterLink v-if="example.guide" :to="`/docs/${example.guide}`" class="example__guide">
          {{ messages.examples.guide }}
          <SiteIcon name="arrow-right" :size="14" />
        </RouterLink>
      </p>

      <section class="showcase" :aria-label="messages.examples.demo">
        <header class="showcase__bar">
          <span class="showcase__tab is-active">Vue</span>
          <button type="button" class="showcase__action" @click="runKey += 1">{{ messages.examples.reset }}</button>
        </header>
        <div class="showcase__stage example-stage">
          <component :is="demo" v-if="demo" :key="`${slug}:${runKey}`" />
          <p v-else class="showcase__loading">{{ messages.examples.loading }}</p>
        </div>
        <ExampleCode :code="source" :file-name="exampleFileName(slug)" :path="`src/examples/demos/${slug}.vue`" />
      </section>

      <nav class="example__pager" :aria-label="messages.examples.pager">
        <RouterLink v-if="previous" :to="`/examples/${previous.slug}`" class="pager pager--previous">
          <SiteIcon name="arrow-right" :size="16" class="pager__arrow pager__arrow--back" />
          <span class="pager__text">
            <span>{{ messages.examples.previous }}</span>
            <strong>{{ previous.title[locale] }}</strong>
          </span>
        </RouterLink>
        <RouterLink v-else to="/examples" class="pager pager--previous">
          <SiteIcon name="arrow-right" :size="16" class="pager__arrow pager__arrow--back" />
          <span class="pager__text">
            <span>{{ messages.examples.previous }}</span>
            <strong>{{ messages.examples.overview }}</strong>
          </span>
        </RouterLink>
        <RouterLink v-if="next" :to="`/examples/${next.slug}`" class="pager pager--next">
          <span class="pager__text">
            <span>{{ messages.examples.next }}</span>
            <strong>{{ next.title[locale] }}</strong>
          </span>
          <SiteIcon name="arrow-right" :size="16" class="pager__arrow" />
        </RouterLink>
      </nav>
    </template>

    <div v-else class="example__missing">
      <h1>{{ messages.examples.missingTitle }}</h1>
      <p>
        {{ messages.examples.missingText }}
        <RouterLink to="/examples">{{ messages.examples.overview }}</RouterLink>
      </p>
    </div>
  </main>
</template>

<style scoped>
.example {
  max-width: 900px;
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--color-text-faint);
  font-size: 13.5px;
  font-weight: 600;
}

.breadcrumb a,
.breadcrumb span:last-child {
  color: var(--color-accent-strong);
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.example__title {
  margin: 12px 0 0;
  font-family: var(--font-display);
  font-size: clamp(34px, 4.6vw, 52px);
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.06;
}

.example__lead {
  max-width: 680px;
  margin: 20px 0 0;
  color: var(--color-text-soft);
  font-size: 17px;
  line-height: 1.6;
}

.example__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: 18px 0 0;
}

.example__meta code {
  padding: 2px 8px;
  border-radius: 999px;
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
  font-family: var(--font-mono);
  font-size: 12px;
}

.example__guide {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
  color: var(--color-accent-strong);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.example__guide:hover {
  text-decoration: underline;
}

/* Demo and code in one frame. */
.showcase {
  overflow: hidden;
  margin-top: 36px;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: var(--color-bg-elevated);
  box-shadow: var(--shadow-lg);
}

.showcase__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  background: #0d0d12;
}

.showcase__tab {
  padding: 5px 12px;
  border-radius: 8px;
  color: rgb(255 255 255 / 55%);
  font-size: 13px;
  font-weight: 600;
}

.showcase__tab.is-active {
  color: #fff;
  background: rgb(255 255 255 / 12%);
}

.showcase__action {
  height: 28px;
  padding: 0 12px;
  border: 1px solid rgb(255 255 255 / 16%);
  border-radius: 8px;
  color: rgb(255 255 255 / 80%);
  background: transparent;
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition:
    color 160ms ease,
    border-color 160ms ease;
}

.showcase__action:hover {
  border-color: rgb(255 255 255 / 40%);
  color: #fff;
}

.showcase__stage {
  padding: 22px;
}

.showcase__loading {
  min-height: 240px;
  margin: 0;
  color: var(--color-text-faint);
}

/* Previous and next. */
.example__pager {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 48px;
}

.pager {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  color: inherit;
  background: var(--color-bg-elevated);
  text-decoration: none;
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease;
}

.pager:hover {
  border-color: color-mix(in srgb, var(--color-accent) 45%, var(--color-border));
  box-shadow: var(--shadow-sm);
}

.pager__text {
  display: grid;
  flex: 1;
  gap: 2px;
}

.pager__text span {
  color: var(--color-text-faint);
  font-size: 12.5px;
}

.pager__text strong {
  font-size: 15.5px;
  font-weight: 650;
}

.pager--next {
  grid-column: 2;
  text-align: right;
}

.pager__arrow {
  flex: none;
  color: var(--color-text-faint);
  transition:
    color 200ms ease,
    transform 200ms ease;
}

.pager__arrow--back {
  transform: rotate(180deg);
}

.pager:hover .pager__arrow {
  color: var(--color-accent-strong);
  transform: translateX(3px);
}

.pager:hover .pager__arrow--back {
  transform: rotate(180deg) translateX(3px);
}

.example__missing h1 {
  margin: 0 0 8px;
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 500;
}

.example__missing p {
  color: var(--color-text-soft);
}

@media (max-width: 860px) {
  .showcase__stage {
    padding: 12px;
  }

  .example__pager {
    grid-template-columns: minmax(0, 1fr);
  }

  .pager--next {
    grid-column: auto;
  }
}
</style>
