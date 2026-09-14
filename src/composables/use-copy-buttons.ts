import { h, onBeforeUnmount, render } from 'vue';

import CopyButton from '../components/copy-button.vue';

/**
 * Copy buttons for rendered Markdown: every `pre > code` is wrapped in a `.code-block` and gets a {@link CopyButton}.
 * The buttons are small Vue trees of their own, so their labels follow the site language; they are unmounted when
 * the content is replaced and when the component using them unmounts.
 */
export const useCopyButtons = () => {
  let mounts: HTMLElement[] = [];

  /** Unmounts the buttons added so far. */
  const removeCopyButtons = () => {
    for (const mount of mounts) render(null, mount);
    mounts = [];
  };

  /** Adds a copy button to every code block inside `root` that has none yet. */
  const addCopyButtons = (root: HTMLElement) => {
    for (const code of root.querySelectorAll('pre > code')) {
      const pre = code.parentElement;
      if (!pre || pre.parentElement?.classList.contains('code-block')) continue;
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block';
      pre.before(wrapper);
      wrapper.append(pre);
      const mount = document.createElement('div');
      wrapper.append(mount);
      render(h(CopyButton, { source: () => code.textContent ?? '' }), mount);
      mounts.push(mount);
    }
  };

  onBeforeUnmount(removeCopyButtons);

  return { addCopyButtons, removeCopyButtons };
};
