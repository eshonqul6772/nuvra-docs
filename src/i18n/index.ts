import { computed, ref, watchEffect } from 'vue';

import { en } from './messages/en';
import { ru } from './messages/ru';
import { uz } from './messages/uz';

/** Languages of the site. */
export type Locale = 'en' | 'uz' | 'ru';

/** Language switch options. */
export const LOCALES: ReadonlyArray<{ value: Locale; label: string }> = [
  { value: 'en', label: 'EN' },
  { value: 'uz', label: 'UZ' },
  { value: 'ru', label: 'RU' }
];

const STORAGE_KEY = 'nuvra-docs:locale';
const MESSAGES = { en, uz, ru };

/** Whether a stored or detected value is one of the site languages. */
const isLocale = (value: unknown): value is Locale => LOCALES.some(option => option.value === value);

/** The saved language, or Uzbek or Russian for browsers in those languages and English otherwise. */
const readInitialLocale = (): Locale => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    // Storage can be unavailable (private mode); the browser language applies.
  }
  const browser = navigator.language.toLowerCase().slice(0, 2);
  return isLocale(browser) ? browser : 'en';
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
