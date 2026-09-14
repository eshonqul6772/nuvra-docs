import { ref } from 'vue';

/** Whether the search dialog is open; the header button and the Ctrl+K / ⌘K shortcut open it. */
export const searchOpen = ref(false);

/** Whether the visitor is on an Apple platform, where the shortcut uses ⌘ instead of Ctrl. */
export const IS_APPLE = /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);

/** Opens the search dialog. */
export const openSearch = (): void => {
  searchOpen.value = true;
};

/** Whether a key press is the search shortcut: Ctrl+K, or ⌘K on Apple platforms. */
export const isSearchShortcut = (event: KeyboardEvent): boolean =>
  event.key.toLowerCase() === 'k' && (IS_APPLE ? event.metaKey : event.ctrlKey) && !event.altKey && !event.shiftKey;
