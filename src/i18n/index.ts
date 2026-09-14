import { computed, ref, watchEffect } from 'vue';

import { en } from './messages/en';
import { uz } from './messages/uz';

/** Languages of the site. */
export type Locale = 'en' | 'uz';

/** Language switch options. */
export const LOCALES: ReadonlyArray<{ value: Locale; label: string }> = [
  { value: 'en', label: 'EN' },
  { value: 'uz', label: 'UZ' }
];

const STORAGE_KEY = 'nuvra-docs:locale';
const MESSAGES = { en, uz };

/** The saved language, or Uzbek for Uzbek browsers and English otherwise. */
const readInitialLocale = (): Locale => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'uz') return saved;
  } catch {
    // Storage can be unavailable (private mode); the browser language applies.
  }
  return navigator.language.toLowerCase().startsWith('uz') ? 'uz' : 'en';
};

/** Active site language. */
export const locale = ref<Locale>(readInitialLocale());

/** Interface texts of the active language. */
export const messages = computed(() => MESSAGES[locale.value]);

/** Switches the site language. */
export const setLocale = (value: Locale): void => {
  locale.value = value;
};

watchEffect(() => {
  document.documentElement.lang = locale.value;
  try {
    localStorage.setItem(STORAGE_KEY, locale.value);
  } catch {
    // The choice only lasts for this visit when storage is unavailable.
  }
});
