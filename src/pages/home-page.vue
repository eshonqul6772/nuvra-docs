<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';

import EditorDemo from '../components/editor-demo.vue';
import InstallCommand from '../components/install-command.vue';
import SiteIcon from '../components/site-icon.vue';
import type { SiteIconName } from '../components/site-icons';
import { useCopyButtons } from '../composables/use-copy-buttons';
import QuickStart from '../content/snippets/quick-start.md';
import { messages } from '../i18n';
import { NUVRA_VERSION } from '../site';

/** Landing page: hero with the install command, live demo, features, quick start and key numbers. */
defineOptions({ name: 'HomePage' });

/** Icons of the feature cards, in the order of the feature texts. */
const FEATURE_ICONS: SiteIconName[] = ['pages', 'table', 'image', 'search', 'printer', 'globe', 'palette', 'feather'];

const codeWindowRef = ref<HTMLElement>();
const { addCopyButtons } = useCopyButtons();

onMounted(() => {
  if (codeWindowRef.value) addCopyButtons(codeWindowRef.value);
});

watchEffect(() => {
  document.title = messages.value.meta.title;
});
</script>

<template>
  <main class="page">
    <section class="hero">
      <div class="hero__glow" aria-hidden="true" />
      <div class="container hero__inner">
        <p class="hero__badge">
          <span class="hero__badge-dot" />
          v{{ NUVRA_VERSION }} · {{ messages.hero.badge }}
        </p>
        <h1 class="hero__title">
          {{ messages.hero.titleLead }}
          <span class="hero__accent">{{ messages.hero.titleAccent }}</span>
        </h1>
        <p class="hero__lead">{{ messages.hero.lead }}</p>
        <div class="hero__actions">
          <RouterLink to="/docs/getting-started" class="button button--primary">
            {{ messages.hero.start }}
            <SiteIcon name="arrow-right" :size="18" />
          </RouterLink>
          <RouterLink :to="{ hash: '#demo' }" class="button button--ghost">{{ messages.hero.demo }}</RouterLink>
        </div>
        <InstallCommand class="hero__install" />
      </div>
    </section>

    <section id="demo" class="section section--demo">
      <div class="container">
        <header class="section__header">
          <p class="eyebrow">{{ messages.demo.eyebrow }}</p>
          <h2 class="section__title">{{ messages.demo.title }}</h2>
          <p class="section__lead">{{ messages.demo.lead }}</p>
        </header>
        <EditorDemo />
      </div>
    </section>

    <section class="section">
      <div class="container">
        <header class="section__header">
          <p class="eyebrow">{{ messages.features.eyebrow }}</p>
          <h2 class="section__title">{{ messages.features.title }}</h2>
          <p class="section__lead">{{ messages.features.lead }}</p>
        </header>
        <ul class="features">
          <li v-for="(feature, index) in messages.features.items" :key="feature.title" class="feature">
            <span class="feature__icon">
              <SiteIcon :name="FEATURE_ICONS[index] ?? 'pages'" :size="22" />
            </span>
            <h3 class="feature__title">{{ feature.title }}</h3>
            <p class="feature__text">{{ feature.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="section section--quick-start">
      <div class="container quick-start">
        <div class="quick-start__intro">
          <p class="eyebrow">{{ messages.quickStart.eyebrow }}</p>
          <h2 class="section__title">{{ messages.quickStart.title }}</h2>
          <p class="section__lead">{{ messages.quickStart.lead }}</p>
          <ol class="steps">
            <li v-for="(step, index) in messages.quickStart.steps" :key="step.title" class="step">
              <span class="step__number">{{ index + 1 }}</span>
              <div>
                <h3 class="step__title">{{ step.title }}</h3>
                <p class="step__text">{{ step.text }}</p>
              </div>
            </li>
          </ol>
          <RouterLink to="/docs/getting-started" class="button button--ghost">
            {{ messages.quickStart.cta }}
            <SiteIcon name="arrow-right" :size="18" />
          </RouterLink>
        </div>
        <div ref="codeWindowRef" class="code-window">
          <div class="code-window__bar" aria-hidden="true">
            <span />
            <span />
            <span />
            <em>App.vue</em>
          </div>
          <QuickStart />
        </div>
      </div>
    </section>

    <section class="section section--stats">
      <div class="container">
        <dl class="stats">
          <div v-for="stat in messages.stats" :key="stat.label" class="stat">
            <dt class="stat__label">{{ stat.label }}</dt>
            <dd class="stat__value">{{ stat.value }}</dd>
          </div>
        </dl>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Hero */
.hero {
  position: relative;
  overflow: hidden;
  padding: 96px 0 80px;
  isolation: isolate;
}

/* "nuvra" means a new glow: soft brand-coloured light behind the headline. */
.hero__glow {
  position: absolute;
  z-index: -1;
  top: -260px;
  left: 50%;
  width: min(1400px, 140vw);
  height: 820px;
  background:
    radial-gradient(38% 42% at 32% 46%, rgb(107 77 255 / 32%), transparent 72%),
    radial-gradient(34% 40% at 68% 40%, rgb(20 184 166 / 26%), transparent 72%),
    radial-gradient(28% 34% at 52% 72%, rgb(236 72 153 / 16%), transparent 72%);
  filter: blur(36px);
  transform: translateX(-50%);
  pointer-events: none;
}

.hero__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 28px;
  padding: 6px 16px 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-text-soft);
  background: color-mix(in srgb, var(--color-bg-elevated) 70%, transparent);
  font-size: 13.5px;
  font-weight: 500;
  backdrop-filter: blur(8px);
}

.hero__badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-teal);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-teal) 22%, transparent);
}

.hero__title {
  max-width: 980px;
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(46px, 8.4vw, 96px);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1;
}

.hero__accent {
  display: block;
  padding-bottom: 0.1em;
  background: var(--gradient-brand);
  background-clip: text;
  color: transparent;
  font-style: italic;
}

.hero__lead {
  max-width: 660px;
  margin: 22px 0 0;
  color: var(--color-text-soft);
  font-size: clamp(17px, 2.1vw, 20px);
  line-height: 1.6;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 36px;
}

.hero__install {
  margin-top: 32px;
}

/* Sections */
.section {
  padding: 96px 0;
}

.section--demo {
  padding-top: 16px;
}

.section__header {
  max-width: 700px;
  margin: 0 auto 44px;
  text-align: center;
}

.section__title {
  margin: 10px 0 0;
  font-family: var(--font-display);
  font-size: clamp(34px, 5vw, 52px);
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.08;
}

.section__lead {
  margin: 16px 0 0;
  color: var(--color-text-soft);
  font-size: 17px;
}

/* Features */
.features {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.feature {
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-bg-elevated);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;
}

.feature:hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-lg);
  transform: translateY(-3px);
}

.feature__icon {
  display: inline-grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 12px;
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
}

.feature__title {
  margin: 18px 0 6px;
  font-size: 16.5px;
  font-weight: 650;
  letter-spacing: -0.01em;
}

.feature__text {
  margin: 0;
  color: var(--color-text-soft);
  font-size: 14.5px;
  line-height: 1.6;
}

/* Quick start */
.section--quick-start {
  border-block: 1px solid var(--color-border);
  background: var(--color-bg-muted);
}

.quick-start {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  align-items: center;
  gap: 64px;
}

.quick-start__intro .section__title,
.quick-start__intro .section__lead {
  text-align: left;
}

.steps {
  display: grid;
  gap: 18px;
  margin: 32px 0 36px;
  padding: 0;
  list-style: none;
}

.step {
  display: flex;
  gap: 14px;
}

.step__number {
  display: grid;
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid var(--color-border-strong);
  border-radius: 50%;
  background: var(--color-bg-elevated);
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
}

.step__title {
  margin: 3px 0 2px;
  font-size: 16px;
  font-weight: 650;
}

.step__text {
  margin: 0;
  color: var(--color-text-soft);
  font-size: 15px;
}

.code-window {
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-code-bg);
  box-shadow: var(--shadow-lg);
}

.code-window__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 16px;
  border-bottom: 1px solid var(--color-border);
}

.code-window__bar span {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--color-border-strong);
}

.code-window__bar em {
  margin-left: 10px;
  color: var(--color-text-faint);
  font-family: var(--font-mono);
  font-size: 12.5px;
  font-style: normal;
}

.code-window :deep(pre.shiki) {
  margin: 0;
  padding: 22px 24px;
  border: 0;
  border-radius: 0;
  font-size: 14px;
}

/* Stats */
.section--stats {
  padding-top: 80px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  overflow: hidden;
  margin: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-elevated);
}

.stat {
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  padding: 32px 24px;
  text-align: center;
}

.stat + .stat {
  border-left: 1px solid var(--color-border);
}

.stat__value {
  margin: 0;
  background: var(--gradient-brand);
  background-clip: text;
  color: transparent;
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1;
}

.stat__label {
  color: var(--color-text-soft);
  font-size: 14px;
}

@media (max-width: 1024px) {
  .features {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .quick-start {
    grid-template-columns: minmax(0, 1fr);
    gap: 40px;
  }
}

@media (max-width: 760px) {
  .hero {
    padding: 64px 0 56px;
  }

  .section {
    padding: 72px 0;
  }

  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stat:nth-child(odd) {
    border-left: 0;
  }

  .stat:nth-child(n + 3) {
    border-top: 1px solid var(--color-border);
  }
}

@media (max-width: 560px) {
  .features {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
