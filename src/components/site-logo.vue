<script setup lang="ts">
/** nuvra mark, a page on the brand gradient, followed by the wordmark. */
defineOptions({ name: 'SiteLogo' });
</script>

<template>
  <span class="logo">
    <svg class="logo__mark" viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="nuvra-logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#6b4dff" />
          <stop offset="0.55" stop-color="#b04dff" />
          <stop offset="1" stop-color="#14b8a6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#nuvra-logo-gradient)" />
      <path
        d="M11.5 7.5h7l4.5 4.5v11a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 10 23V9a1.5 1.5 0 0 1 1.5-1.5Z"
        fill="#fff"
      />
      <path d="M18.5 7.5V12h4.5" fill="none" stroke="#6b4dff" stroke-opacity=".35" stroke-width="1.2" />
      <path d="M13 15.5h7M13 18.5h7M13 21.5h4.5" stroke="#6b4dff" stroke-width="1.5" stroke-linecap="round" />
    </svg>
    <span class="logo__word">nuvra</span>
  </span>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text);
}

.logo__mark {
  flex: 0 0 auto;
  border-radius: 9px;
  box-shadow: 0 6px 16px -8px rgb(107 77 255 / 70%);
}

.logo__word {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1;
}
</style>
