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
    {
      // The sidebar of the examples stays mounted while the visitor moves between them.
      path: '/examples',
      component: () => import('./pages/examples-layout.vue'),
      // A full-height frame whose sidebar and content scroll on their own, without the site footer.
      meta: { appShell: true },
      children: [
        { path: '', name: 'examples', component: () => import('./pages/examples-page.vue') },
        { path: ':slug', name: 'example', component: () => import('./pages/example-page.vue'), props: true }
      ]
    },
    { path: '/playground', name: 'playground', component: () => import('./pages/playground-page.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./pages/not-found-page.vue') }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, top: HEADER_OFFSET, behavior: 'smooth' };
    if (to.path !== from.path) return { top: 0 };
    return undefined;
  }
});
