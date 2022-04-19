import 'primeicons/primeicons.css';
import 'primevue/resources/primevue.min.css';

import 'primeicons/fonts/primeicons.eot';
import 'primeicons/fonts/primeicons.svg';
import 'primeicons/fonts/primeicons.ttf';
import 'primeicons/fonts/primeicons.woff';
import '../assets';

import { createApp } from 'vue';
import { Icon, addIcon } from '@iconify/vue';

import PrimeVue from 'primevue/config';
import PrimeVueTooltip from 'primevue/tooltip';

import PrimeVueToastService from 'primevue/toastservice';
import PrimeVueConfirmationService from 'primevue/confirmationservice';

import PrimeVueSpeedDial from 'primevue/speeddial';
import PrimeVueDropdown from 'primevue/dropdown';
import PrimeVueProgressSpinner from 'primevue/progressspinner';
import PrimeVueDataTable from 'primevue/datatable';
import PrimeVueColumn from 'primevue/column';
import PrimeVueSkeleton from 'primevue/skeleton';

import roundDashboard from '@iconify-icons/ic/round-dashboard';
import roundSmartToy from '@iconify-icons/ic/round-smart-toy';
import roundCandlestickChart from '@iconify-icons/ic/round-candlestick-chart';
import roundInsertChart from '@iconify-icons/ic/round-insert-chart';
import baselineSettings from '@iconify-icons/ic/baseline-settings';
import roundMenu from '@iconify-icons/ic/round-menu';
import roundMenuOpen from '@iconify-icons/ic/round-menu-open';
import roundAdd from '@iconify-icons/ic/round-add';
import roundReportGmailerrorred from '@iconify-icons/ic/round-report-gmailerrorred';
import outlineInfo from '@iconify-icons/ic/outline-info';
import roundCheckCircleOutline from '@iconify-icons/ic/round-check-circle-outline';
import roundEdit from '@iconify-icons/ic/round-edit';
import roundDelete from '@iconify-icons/ic/round-delete';

import { IconList } from 'shared/constants';

import BaseButton from 'components/base/base-button.vue';
import BaseInput from 'components/base/base-input.vue';
import AppContainer from 'components/app-container.vue';

import { router } from './router';
import { store, storeKey } from './store';


drawApp();


function drawApp() {
  const app = createApp(AppContainer);

  app.use(router);
  app.use(store, storeKey);

  app.use(PrimeVue, { ripple: true });
  app.use(PrimeVueToastService);
  app.use(PrimeVueConfirmationService);

  app.directive('tooltip', PrimeVueTooltip);

  app.component('base-actions', PrimeVueSpeedDial);
  app.component('base-dropdown', PrimeVueDropdown);
  app.component('base-progress-spinner', PrimeVueProgressSpinner);
  app.component('base-table', PrimeVueDataTable);
  app.component('base-table-column', PrimeVueColumn);
  app.component('base-skeleton', PrimeVueSkeleton);

  app.component('base-icon', Icon);
  app.component('base-button', BaseButton);
  app.component('base-input', BaseInput);

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

  addIcon(IconList.ADD, roundAdd);
  addIcon(IconList.EDIT, roundEdit);
  addIcon(IconList.DELETE, roundDelete);

  addIcon(IconList.NOTIFICATION_ERROR, roundReportGmailerrorred);
  addIcon(IconList.NOTIFICATION_INFO, outlineInfo);
  addIcon(IconList.NOTIFICATION_SUCCESS, roundCheckCircleOutline);
}
