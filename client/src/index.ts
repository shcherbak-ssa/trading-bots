import { createApp } from 'vue';
import PrimeVue from 'primevue/config';

import AppContainer from './components/app-container.vue';
import { router } from './router';
import { store } from './store';


export function drawApp() {
  const app = createApp(AppContainer);

  app.use(router);
  app.use(store);
  app.use(PrimeVue);

  app.mount('#app');
}
