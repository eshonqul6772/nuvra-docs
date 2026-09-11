import { createRouter, createWebHistory } from 'vue-router';

import HomePage from './pages/home-page.vue';

/** Space kept above an anchor target, so the sticky header does not cover it. */
const HEADER_OFFSET = 88;

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/docs', redirect: '/docs/getting-started' },
    { path: '/docs/:slug', name: 'docs', component: () => import('./pages/docs-page.vue'), props: true },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./pages/not-found-page.vue') }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, top: HEADER_OFFSET, behavior: 'smooth' };
    if (to.path !== from.path) return { top: 0 };
    return undefined;
  }
});
