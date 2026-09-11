/// <reference types="vite/client" />

/** Version of the installed nuvra package, injected by Vite. */
declare const __NUVRA_VERSION__: string;

/** Markdown files compile to Vue components. */
declare module '*.md' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent;
  export default component;
}
