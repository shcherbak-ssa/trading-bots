import 'primeicons/primeicons.css';
import 'primevue/resources/primevue.min.css';

import 'primeicons/fonts/primeicons.eot';
import 'primeicons/fonts/primeicons.svg';
import 'primeicons/fonts/primeicons.ttf';
import 'primeicons/fonts/primeicons.woff';

import '../styles/main.scss';

import type { App, Component } from 'vue';
import { createApp } from 'vue';

import PrimeVue from 'primevue/config';
import PrimeVueProgressSpinner from 'primevue/progressspinner';

import BaseIcon from 'components/base/base-icon.vue';
import BaseButton from 'components/base/base-button.vue';
import BaseInput from 'components/base/base-input.vue';
import BaseMessage from 'components/base/base-message.vue';


export function commonSetup(component: Component): App {
  const app: App = createApp(component);

  app.use(PrimeVue, { ripple: true });

  app.component('base-progress-spinner', PrimeVueProgressSpinner);

  app.component('base-icon', BaseIcon);
  app.component('base-button', BaseButton);
  app.component('base-input', BaseInput);
  app.component('base-message', BaseMessage);

  return app;
}
