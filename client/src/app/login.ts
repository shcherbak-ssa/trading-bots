import LoginLayout from 'components/login-layout.vue';

import { commonSetup } from './common';


export function setup(): void {
  const app = commonSetup(LoginLayout);

  app.mount('#app');
}
