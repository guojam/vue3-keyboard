import { createApp } from 'vue';
import App from './App.vue';

import { Keyboard } from './keyboard';

const app = createApp(App).component('app-keyboard', Keyboard);
app.mount('#app');
