import { ref, watchEffect } from 'vue';

/** Colour scheme of the site. */
export type ColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'nuvra-docs:theme';

/** The saved scheme, or the system preference when nothing is saved. */
const readInitialScheme = (): ColorScheme => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Storage can be unavailable (private mode); the system preference applies.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/** Active colour scheme; the `dark` class it puts on <html> also switches nuvra to its dark palette. */
export const colorScheme = ref<ColorScheme>(readInitialScheme());

watchEffect(() => {
  document.documentElement.classList.toggle('dark', colorScheme.value === 'dark');
  try {
    localStorage.setItem(STORAGE_KEY, colorScheme.value);
  } catch {
    // The choice only lasts for this visit when storage is unavailable.
  }
});

/** Switches between the light and the dark scheme. */
export const toggleColorScheme = (): void => {
  colorScheme.value = colorScheme.value === 'dark' ? 'light' : 'dark';
};
