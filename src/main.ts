import { createApp } from 'vue';

import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource-variable/newsreader';
import '@fontsource-variable/newsreader/wght-italic.css';
import 'nuvra/style.css';

import App from './app.vue';
import { router } from './router';

import './styles/main.css';
import './styles/prose.css';

createApp(App).use(router).mount('#app');
