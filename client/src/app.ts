import { createApp } from 'vue';
import { Icon, addIcon } from '@iconify/vue';

import 'primevue/resources/primevue.min.css';
import PrimeVue from 'primevue/config';
import PrimeVueTooltip from 'primevue/tooltip';

import roundDashboard from '@iconify-icons/ic/round-dashboard';
import roundSmartToy from '@iconify-icons/ic/round-smart-toy';
import roundCandlestickChart from '@iconify-icons/ic/round-candlestick-chart';
import roundInsertChart from '@iconify-icons/ic/round-insert-chart';
import baselineSettings from '@iconify-icons/ic/baseline-settings';
import roundMenu from '@iconify-icons/ic/round-menu';
import roundMenuOpen from '@iconify-icons/ic/round-menu-open';

import { IconList } from 'shared/constants';

import AppContainer from './components/app-container.vue';
import { router } from './router';
import { store, storeKey } from './store';


export function drawApp() {
  const app = createApp(AppContainer);

  app.use(router);
  app.use(store, storeKey);
  app.use(PrimeVue);

  app.directive('tooltip', PrimeVueTooltip);

  app.component('base-icon', Icon);
  setupIcons();

  app.mount('#app');
}

function setupIcons() {
  addIcon(IconList.DASHBOARD, roundDashboard);
  addIcon(IconList.BOTS, roundSmartToy);
  addIcon(IconList.BROKERS, roundCandlestickChart);
  addIcon(IconList.ANALYTICS, roundInsertChart);
  addIcon(IconList.SETTINGS, baselineSettings);
  addIcon(IconList.MENU_CLOSE, roundMenu);
  addIcon(IconList.MENU_OPEN, roundMenuOpen);
}
