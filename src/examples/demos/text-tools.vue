<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  DocumentEditor,
  type NumberWordsLocale,
  formatAmountInWords,
  formatLongDate,
  parseAmount,
  transliterate
} from 'nuvra';

// Only these tools appear in the toolbar; leave `tools` out to show every tool.
const TOOLS = ['history', 'marks', 'textCase', 'insert'] as const;

const html = ref('<p>Place the caret here, then insert the results below.</p>');
const editor = ref<InstanceType<typeof DocumentEditor>>();

const language = ref<NumberWordsLocale>('uz');
const amountText = ref('15 000 000');
const latin = ref('Toshkent shahri, O‘zbekiston');

// parseAmount reads "15 000 000", "15,000,000.50" and similar; it returns null for anything else.
const amount = computed(() => parseAmount(amountText.value));
const amountInWords = computed(() => (amount.value === null ? '' : formatAmountInWords(amount.value, language.value)));
const today = computed(() => formatLongDate(new Date(), language.value));
const cyrillic = computed(() => transliterate(latin.value, 'toCyrillic'));

/** Inserts text at the caret; mousedown.prevent on the buttons keeps the caret where it was. */
const insert = (text: string) => {
  editor.value?.focus();
  editor.value?.engine?.insertText(`${text} `);
};
</script>

<template>
  <div class="example-stage">
    <div class="example-bar">
      <span class="example-note">Language of the words:</span>
      <button
        v-for="code in ['uz', 'uz-Cyrl', 'ru', 'en'] as const"
        :key="code"
        type="button"
        class="example-button"
        :class="{ 'is-active': language === code }"
        @click="language = code"
      >
        {{ code }}
      </button>
    </div>

    <div class="example-grid">
      <section class="example-panel">
        <h3>formatAmountInWords</h3>
        <input v-model="amountText" class="example-input" inputmode="decimal" />
        <p class="example-note">{{ amountInWords || 'Not a number' }}</p>
        <button
          type="button"
          class="example-button"
          :disabled="!amountInWords"
          @mousedown.prevent
          @click="insert(amountInWords)"
        >
          Insert
        </button>
      </section>
      <section class="example-panel">
        <h3>formatLongDate</h3>
        <p class="example-note">{{ today }}</p>
        <button type="button" class="example-button" @mousedown.prevent @click="insert(today)">Insert</button>
      </section>
      <section class="example-panel">
        <h3>transliterate</h3>
        <input v-model="latin" class="example-input" />
        <p class="example-note">{{ cyrillic }}</p>
        <button type="button" class="example-button" @mousedown.prevent @click="insert(cyrillic)">Insert</button>
      </section>
    </div>

    <DocumentEditor :tools="TOOLS" ref="editor" v-model="html" default-view-mode="web" :height="280" />
  </div>
</template>
