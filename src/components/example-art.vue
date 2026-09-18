<script setup lang="ts">
import { computed } from 'vue';

import type { ExampleArt } from '../examples/catalog';

/**
 * Picture on an example card: a small editor window on a soft brand gradient, with a sketch of what the example
 * shows inside it. Colours come from the site's variables, so it follows the colour scheme.
 */
defineOptions({ name: 'ExampleArt' });

interface Props {
  art: ExampleArt;
}

const props = defineProps<Props>();

/** Widths of the text lines drawn in most sketches. */
const LINES = [150, 128, 142, 96];

/** Texts of the two chips: template variables, or an amount and its words. */
const chipLabels = computed(() =>
  props.art === 'chips' ? ['{' + '{client}}', '{' + '{date}}'] : ['15 000 000', 'o‘n besh mln']
);
</script>

<template>
  <svg class="example-art" viewBox="0 0 320 168" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="example-art-sky" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" class="example-art__sky-start" />
        <stop offset="100%" class="example-art__sky-end" />
      </linearGradient>
      <radialGradient id="example-art-glow" cx="0.8" cy="0.9" r="0.7">
        <stop offset="0%" class="example-art__glow" />
        <stop offset="100%" class="example-art__glow" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="320" height="168" fill="url(#example-art-sky)" />
    <rect width="320" height="168" fill="url(#example-art-glow)" />

    <!-- Editor window with a toolbar. -->
    <g class="example-art__window">
      <rect x="56" y="22" width="208" height="124" rx="10" />
      <line x1="56" y1="44" x2="264" y2="44" />
    </g>
    <g class="example-art__tools">
      <rect v-for="index in 7" :key="index" :x="58 + index * 14" y="29" width="9" height="9" rx="2" />
    </g>

    <g class="example-art__ink">
      <template v-if="art === 'text'">
        <rect x="76" y="56" width="92" height="8" rx="3" class="is-strong" />
        <rect v-for="(width, index) in LINES" :key="index" x="76" :y="72 + index * 13" :width="width" height="5" rx="2.5" />
        <rect x="76" y="124" width="40" height="12" rx="3" class="is-accent" />
        <rect x="120" y="124" width="40" height="12" rx="3" class="is-soft" />
      </template>

      <template v-else-if="art === 'form'">
        <rect x="76" y="56" width="56" height="5" rx="2.5" class="is-strong" />
        <rect x="76" y="65" width="168" height="16" rx="4" class="is-field" />
        <rect x="76" y="89" width="72" height="5" rx="2.5" class="is-strong" />
        <rect x="76" y="98" width="168" height="30" rx="4" class="is-field" />
        <rect x="84" y="106" width="96" height="4" rx="2" />
        <rect x="84" y="114" width="64" height="4" rx="2" />
        <rect x="204" y="132" width="40" height="9" rx="4.5" class="is-accent" />
      </template>

      <template v-else-if="art === 'sheet' || art === 'lock' || art === 'save'">
        <rect x="118" y="52" width="84" height="88" rx="3" class="is-paper" />
        <rect x="126" y="58" width="68" height="3" rx="1.5" class="is-dashed" />
        <rect v-for="index in 5" :key="index" x="128" :y="70 + index * 9" :width="index % 2 ? 64 : 52" height="4" rx="2" />
        <rect x="126" y="131" width="68" height="3" rx="1.5" class="is-dashed" />
        <g v-if="art === 'lock'" class="is-badge">
          <rect x="196" y="104" width="30" height="26" rx="5" />
          <path d="M203 104v-6a8 8 0 0 1 16 0v6" fill="none" />
        </g>
        <g v-else-if="art === 'save'" class="is-badge">
          <circle cx="210" cy="118" r="14" />
          <path d="m203 118 5 5 9-10" fill="none" class="is-check" />
        </g>
        <text v-else x="160" y="100" text-anchor="middle" class="is-watermark">DRAFT</text>
      </template>

      <template v-else-if="art === 'globe'">
        <rect v-for="(width, index) in LINES" :key="index" x="76" :y="84 + index * 12" :width="width" height="5" rx="2.5" />
        <g v-for="(code, index) in ['UZ', 'ЎЗ', 'EN', 'RU']" :key="code">
          <rect :x="76 + index * 42" y="54" width="36" height="18" rx="9" :class="index ? 'is-soft' : 'is-accent'" />
          <text :x="94 + index * 42" y="67" text-anchor="middle" class="is-label" :class="{ 'is-on-accent': !index }">
            {{ code }}
          </text>
        </g>
      </template>

      <template v-else-if="art === 'palette'">
        <circle v-for="index in 5" :key="index" :cx="70 + index * 22" cy="64" r="8" :class="`is-swatch is-swatch-${index}`" />
        <rect v-for="(width, index) in LINES" :key="index" x="76" :y="86 + index * 12" :width="width" height="5" rx="2.5" />
        <rect x="76" y="84" width="46" height="9" rx="2" class="is-accent is-faint" />
      </template>

      <template v-else-if="art === 'file'">
        <g v-for="(label, index) in ['DOCX', 'PDF', 'HTML']" :key="label">
          <path
            :d="`M${84 + index * 56} 56h30l12 12v58a4 4 0 0 1-4 4h-38a4 4 0 0 1-4-4V60a4 4 0 0 1 4-4Z`"
            class="is-paper"
          />
          <rect :x="86 + index * 56" y="100" width="36" height="14" rx="3" :class="index ? 'is-soft' : 'is-accent'" />
          <text :x="104 + index * 56" y="110.5" text-anchor="middle" class="is-label" :class="{ 'is-on-accent': !index }">
            {{ label }}
          </text>
        </g>
      </template>

      <template v-else-if="art === 'chips' || art === 'numbers'">
        <rect x="76" y="58" width="36" height="5" rx="2.5" />
        <rect x="116" y="54" width="70" height="13" rx="6.5" class="is-accent is-faint" />
        <text x="151" y="63.5" text-anchor="middle" class="is-label is-accent-text">
          {{ chipLabels[0] }}
        </text>
        <rect x="190" y="58" width="52" height="5" rx="2.5" />
        <rect x="76" y="78" width="120" height="5" rx="2.5" />
        <rect x="76" y="90" width="80" height="5" rx="2.5" />
        <rect x="160" y="86" width="84" height="13" rx="6.5" class="is-accent is-faint" />
        <text x="202" y="95.5" text-anchor="middle" class="is-label is-accent-text">
          {{ chipLabels[1] }}
        </text>
        <rect x="76" y="110" width="150" height="5" rx="2.5" />
        <rect x="76" y="122" width="104" height="5" rx="2.5" />
      </template>

      <template v-else-if="art === 'toc'">
        <rect x="76" y="54" width="70" height="7" rx="3" class="is-strong" />
        <g v-for="(indent, index) in [0, 12, 12, 0, 12]" :key="index">
          <rect :x="76 + indent" :y="70 + index * 13" :width="80 - indent" height="5" rx="2.5" />
          <line :x1="162" :y1="72.5 + index * 13" x2="232" :y2="72.5 + index * 13" class="is-dots" />
          <rect x="238" :y="70 + index * 13" width="6" height="5" rx="2" class="is-strong" />
        </g>
      </template>

      <template v-else-if="art === 'comment'">
        <rect v-for="(width, index) in LINES" :key="index" x="76" :y="60 + index * 14" :width="width - 30" height="5" rx="2.5" />
        <rect x="104" y="72" width="54" height="9" rx="2" class="is-accent is-faint" />
        <path d="M178 58h58a6 6 0 0 1 6 6v26a6 6 0 0 1-6 6h-40l-10 9v-9h-8a6 6 0 0 1-6-6V64a6 6 0 0 1 6-6Z" class="is-bubble" />
        <rect x="182" y="66" width="48" height="4" rx="2" />
        <rect x="182" y="76" width="36" height="4" rx="2" />
        <rect x="76" y="118" width="30" height="5" rx="2.5" class="is-deleted" />
        <rect x="110" y="118" width="38" height="5" rx="2.5" class="is-inserted" />
      </template>

      <template v-else-if="art === 'split' || art === 'cursors'">
        <line x1="160" y1="50" x2="160" y2="140" class="is-divider" />
        <g v-for="side in [0, 1]" :key="side">
          <rect v-for="index in 5" :key="index" :x="72 + side * 96" :y="56 + index * 13" :width="index % 2 ? 76 : 58" height="5" rx="2.5" />
        </g>
        <template v-if="art === 'split'">
          <rect x="72" y="82" width="42" height="5" rx="2.5" class="is-deleted" />
          <rect x="168" y="82" width="50" height="5" rx="2.5" class="is-inserted" />
        </template>
        <template v-else>
          <line x1="118" y1="64" x2="118" y2="76" class="is-caret is-caret-a" />
          <rect x="118" y="55" width="26" height="9" rx="2" class="is-caret-flag-a" />
          <line x1="214" y1="90" x2="214" y2="102" class="is-caret is-caret-b" />
          <rect x="214" y="81" width="26" height="9" rx="2" class="is-caret-flag-b" />
        </template>
      </template>

      <template v-else-if="art === 'command'">
        <rect x="76" y="56" width="120" height="5" rx="2.5" />
        <text x="78" y="78" class="is-slash">/</text>
        <rect x="88" y="70" width="2" height="10" class="is-accent" />
        <rect x="84" y="86" width="116" height="52" rx="6" class="is-menu" />
        <rect x="88" y="90" width="108" height="14" rx="4" class="is-accent is-faint" />
        <rect v-for="index in 3" :key="index" x="96" :y="84 + index * 14" width="64" height="4" rx="2" />
      </template>

      <template v-else-if="art === 'image'">
        <rect x="100" y="54" width="120" height="70" rx="6" class="is-paper" />
        <circle cx="124" cy="74" r="8" class="is-accent is-faint" />
        <path d="m104 118 32-30 22 20 16-12 42 22Z" class="is-accent is-faint" />
        <rect x="100" y="130" width="80" height="5" rx="2.5" />
        <rect x="184" y="128" width="36" height="9" rx="4.5" class="is-accent" />
      </template>
    </g>
  </svg>
</template>

<style scoped>
.example-art {
  display: block;
  width: 100%;
  height: auto;
}

.example-art__sky-start {
  stop-color: color-mix(in srgb, var(--color-accent) 20%, var(--color-bg-elevated));
}

.example-art__sky-end {
  stop-color: color-mix(in srgb, var(--color-teal) 14%, var(--color-bg-elevated));
}

.example-art__glow {
  stop-color: color-mix(in srgb, #ff8a5c 35%, transparent);
}

.example-art__window rect {
  fill: color-mix(in srgb, var(--color-bg-elevated) 82%, transparent);
  stroke: color-mix(in srgb, var(--color-accent) 35%, transparent);
}

.example-art__window line {
  stroke: color-mix(in srgb, var(--color-accent) 25%, transparent);
}

.example-art__tools rect {
  fill: color-mix(in srgb, var(--color-accent) 30%, transparent);
}

.example-art__ink rect,
.example-art__ink circle {
  fill: color-mix(in srgb, var(--color-accent) 22%, transparent);
}

.example-art__ink .is-strong {
  fill: color-mix(in srgb, var(--color-accent) 50%, transparent);
}

.example-art__ink .is-accent {
  fill: var(--color-accent);
}

.example-art__ink .is-faint {
  fill: color-mix(in srgb, var(--color-accent) 22%, transparent);
}

.example-art__ink .is-soft,
.example-art__ink .is-field,
.example-art__ink .is-paper,
.example-art__ink .is-menu,
.example-art__ink .is-bubble {
  fill: var(--color-bg-elevated);
  stroke: color-mix(in srgb, var(--color-accent) 35%, transparent);
}

.example-art__ink path.is-paper {
  fill: var(--color-bg-elevated);
}

.example-art__ink .is-dashed {
  fill: none;
  stroke: color-mix(in srgb, var(--color-accent) 45%, transparent);
  stroke-dasharray: 3 3;
}

.example-art__ink .is-label {
  fill: var(--color-accent-strong);
  font-family: var(--font-sans);
  font-size: 8.5px;
  font-weight: 700;
}

.example-art__ink .is-on-accent {
  fill: #fff;
}

.example-art__ink .is-accent-text {
  font-family: var(--font-mono);
  font-weight: 600;
}

.example-art__ink .is-watermark {
  fill: color-mix(in srgb, var(--color-accent) 30%, transparent);
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 2px;
  transform: rotate(-24deg);
  transform-box: fill-box;
  transform-origin: center;
}

.example-art__ink .is-badge rect,
.example-art__ink .is-badge circle {
  fill: var(--color-accent);
}

.example-art__ink .is-badge path {
  stroke: var(--color-accent);
  stroke-width: 3.5;
}

.example-art__ink .is-badge .is-check {
  stroke: #fff;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.example-art__ink .is-dots {
  stroke: color-mix(in srgb, var(--color-accent) 35%, transparent);
  stroke-dasharray: 1 3;
  stroke-linecap: round;
  stroke-width: 1.5;
}

.example-art__ink .is-divider {
  stroke: color-mix(in srgb, var(--color-accent) 30%, transparent);
}

.example-art__ink .is-deleted {
  fill: color-mix(in srgb, #e5484d 55%, transparent);
}

.example-art__ink .is-inserted {
  fill: color-mix(in srgb, #0e9f8e 60%, transparent);
}

.example-art__ink .is-caret {
  stroke-width: 2;
}

.example-art__ink .is-caret-a {
  stroke: #db2777;
}

.example-art__ink .is-caret-b {
  stroke: #059669;
}

.example-art__ink .is-caret-flag-a {
  fill: #db2777;
}

.example-art__ink .is-caret-flag-b {
  fill: #059669;
}

.example-art__ink .is-slash {
  fill: var(--color-accent-strong);
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
}

.example-art__ink .is-swatch-1 {
  fill: #409eff;
}

.example-art__ink .is-swatch-2 {
  fill: #7c3aed;
}

.example-art__ink .is-swatch-3 {
  fill: #0e9f8e;
}

.example-art__ink .is-swatch-4 {
  fill: #e5484d;
}

.example-art__ink .is-swatch-5 {
  fill: #d97706;
}
</style>
