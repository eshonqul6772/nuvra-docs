<script setup lang="ts">
import { RouterLink } from 'vue-router';

import { messages } from '../i18n';
import { GITHUB_URL, NPM_URL, NUVRA_VERSION } from '../site';
import SiteLogo from './site-logo.vue';

/** Site footer: tagline, links and licence. */
defineOptions({ name: 'SiteFooter' });

const YEAR = new Date().getFullYear();
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <SiteLogo />
        <p>{{ messages.footer.tagline }}</p>
      </div>
      <nav class="footer__links">
        <RouterLink to="/docs/getting-started">{{ messages.footer.docs }}</RouterLink>
        <a :href="GITHUB_URL" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a :href="NPM_URL" target="_blank" rel="noopener noreferrer">npm</a>
      </nav>
      <p class="footer__legal">{{ messages.footer.license }} © {{ YEAR }} Eshonqul · nuvra v{{ NUVRA_VERSION }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg);
}

.footer__inner {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px 48px;
  align-items: start;
  padding-block: 48px 40px;
}

.footer__brand p {
  max-width: 320px;
  margin: 12px 0 0;
  color: var(--color-text-soft);
  font-size: 15px;
}

.footer__links {
  display: flex;
  gap: 24px;
  font-size: 15px;
}

.footer__links a {
  color: var(--color-text-soft);
  text-decoration: none;
}

.footer__links a:hover {
  color: var(--color-text);
}

.footer__legal {
  grid-column: 1 / -1;
  margin: 0;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-faint);
  font-size: 13px;
}

@media (max-width: 640px) {
  .footer__inner {
    grid-template-columns: 1fr;
  }
}
</style>
