<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';

import ExampleArt from '../components/example-art.vue';
import SiteIcon from '../components/site-icon.vue';
import { EXAMPLES, EXAMPLE_GROUPS, type ExampleEntry } from '../examples/catalog';
import { locale, messages } from '../i18n';

/** Overview of the examples: a filter by group and a card with a picture for every example. */
defineOptions({ name: 'ExamplesPage' });

/** Index of the group the gallery is filtered by, or `-1` for all of them. */
const filter = ref(-1);

/** Examples shown under the current filter, each with the name of its group. */
const cards = computed(() =>
  EXAMPLE_GROUPS.flatMap((group, index) =>
    filter.value === -1 || filter.value === index
      ? group.examples.map((example): { example: ExampleEntry; group: string } => ({
          example,
          group: group.title[locale.value]
        }))
      : []
  )
);

watchEffect(() => {
  document.title = messages.value.meta.examplesTitle;
});
</script>

<template>
  <main class="gallery">
    <nav class="breadcrumb" :aria-label="messages.examples.breadcrumb">
      <span class="breadcrumb__current">{{ messages.examples.eyebrow }}</span>
    </nav>
    <h1 class="gallery__title">{{ messages.examples.title }}</h1>
    <p class="gallery__lead">{{ messages.examples.lead(EXAMPLES.length) }}</p>

    <div class="gallery__filters" role="tablist" :aria-label="messages.examples.filter">
      <button
        type="button"
        role="tab"
        class="gallery__filter"
        :class="{ 'is-active': filter === -1 }"
        :aria-selected="filter === -1"
        @click="filter = -1"
      >
        {{ messages.examples.all }}
      </button>
      <button
        v-for="(group, index) in EXAMPLE_GROUPS"
        :key="group.title.en"
        type="button"
        role="tab"
        class="gallery__filter"
        :class="{ 'is-active': filter === index }"
        :aria-selected="filter === index"
        @click="filter = index"
      >
        {{ group.title[locale] }}
      </button>
    </div>

    <TransitionGroup tag="ul" name="gallery-card" class="gallery__grid">
      <li v-for="card in cards" :key="card.example.slug">
        <RouterLink :to="`/examples/${card.example.slug}`" class="example-card">
          <span class="example-card__art">
            <ExampleArt :art="card.example.art" />
          </span>
          <span class="example-card__body">
            <strong class="example-card__title">{{ card.example.title[locale] }}</strong>
            <span class="example-card__description">{{ card.example.description[locale] }}</span>
            <span class="example-card__footer">
              <span class="example-card__tag">{{ card.group }}</span>
              <SiteIcon name="arrow-right" :size="16" class="example-card__arrow" />
            </span>
          </span>
        </RouterLink>
      </li>
    </TransitionGroup>
  </main>
</template>

<style scoped>
.gallery {
  max-width: 1000px;
}

.breadcrumb {
  display: flex;
  gap: 8px;
  color: var(--color-accent-strong);
  font-size: 13.5px;
  font-weight: 600;
}

.gallery__title {
  margin: 12px 0 0;
  font-family: var(--font-display);
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.05;
}

.gallery__lead {
  max-width: 640px;
  margin: 20px 0 0;
  color: var(--color-text-soft);
  font-size: 17px;
  line-height: 1.6;
}

/* Filter */
.gallery__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 36px 0 22px;
}

.gallery__filter {
  height: 32px;
  padding: 0 14px;
  border: 0;
  border-radius: 9px;
  color: var(--color-text-soft);
  background: transparent;
  font: inherit;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition:
    color 160ms ease,
    background-color 160ms ease;
}

.gallery__filter:hover {
  color: var(--color-text);
}

.gallery__filter.is-active {
  color: var(--color-text);
  background: var(--color-bg-muted);
  box-shadow: inset 0 0 0 1px var(--color-border);
}

.gallery__filter:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Cards */
.gallery__grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.gallery__grid > li {
  display: flex;
}

.example-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  color: inherit;
  background: var(--color-bg-elevated);
  text-decoration: none;
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease,
    transform 200ms ease;
}

.example-card:hover {
  border-color: color-mix(in srgb, var(--color-accent) 45%, var(--color-border));
  box-shadow: var(--shadow-lg);
  transform: translateY(-3px);
}

.example-card:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.example-card__art {
  display: block;
  overflow: hidden;
  border-radius: 10px;
}

.example-card__art :deep(svg) {
  transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
}

.example-card:hover .example-card__art :deep(svg) {
  transform: scale(1.04);
}

.example-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  padding: 14px 6px 4px;
}

.example-card__title {
  font-size: 15.5px;
  font-weight: 650;
}

.example-card__description {
  flex: 1;
  color: var(--color-text-soft);
  font-size: 14px;
  line-height: 1.5;
}

.example-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}

.example-card__tag {
  padding: 3px 9px;
  border: 1px solid var(--color-border);
  border-radius: 7px;
  color: var(--color-text-soft);
  font-size: 12px;
  font-weight: 600;
}

.example-card__arrow {
  color: var(--color-text-faint);
  transition:
    color 200ms ease,
    transform 200ms ease;
}

.example-card:hover .example-card__arrow {
  color: var(--color-accent-strong);
  transform: translateX(3px);
}

/* Filtering: cards that stay slide into place and new ones fade in; the ones filtered out leave at once. */
.gallery-card-move,
.gallery-card-enter-active {
  transition:
    opacity 260ms ease,
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.gallery-card-enter-from {
  opacity: 0;
  transform: scale(0.97);
}

.gallery-card-leave-active {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .example-card,
  .example-card__art :deep(svg),
  .gallery-card-move,
  .gallery-card-enter-active,
  .gallery-card-leave-active {
    transition: none;
  }
}
</style>
