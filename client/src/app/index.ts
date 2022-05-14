import '../assets/currency-com-logo.png';
import '../assets/capital-com-logo.jpeg';

import PrimeVueTooltip from 'primevue/tooltip';
import PrimeVueToastService from 'primevue/toastservice';
import PrimeVueConfirmationService from 'primevue/confirmationservice';

import PrimeVueDataTable from 'primevue/datatable';
import PrimeVueColumn from 'primevue/column';
import PrimeVueSkeleton from 'primevue/skeleton';
import PrimeVueScrollPanel from 'primevue/scrollpanel';

import { addIcon } from '@iconify/vue';
import roundSmartToy from '@iconify-icons/ic/round-smart-toy';
import roundMenu from '@iconify-icons/ic/round-menu';
import roundMenuOpen from '@iconify-icons/ic/round-menu-open';

import type { ClientUser } from 'global/types';

import { IconList } from 'shared/constants';

import BaseCheckbox from 'components/base/base-checkbox.vue';
import BaseDropdown from 'components/base/base-dropdown.vue';
import BaseStatus from 'components/base/base-status.vue';
import AppLayout from 'components/app-layout.vue';

import { router } from './router';
import { store, storeKey } from './store';
import { commonSetup } from './common';


export function setup(user: ClientUser): void {
  const app = commonSetup({
    setup() {
      return { user };
    },
    components: { AppLayout },
    template: '<app-layout :user="user" />',
  });

  app.use(router);
  app.use(store, storeKey);
  app.use(PrimeVueToastService);
  app.use(PrimeVueConfirmationService);

  app.directive('tooltip', PrimeVueTooltip);

  app.component('base-table', PrimeVueDataTable);
  app.component('base-table-column', PrimeVueColumn);
  app.component('base-skeleton', PrimeVueSkeleton);
  app.component('base-scroll-panel', PrimeVueScrollPanel);
  app.component('base-checkbox', BaseCheckbox);
  app.component('base-dropdown', BaseDropdown);
  app.component('base-status', BaseStatus);

  addIcon(IconList.BOTS, roundSmartToy);
  addIcon(IconList.MENU_CLOSE, roundMenu);
  addIcon(IconList.MENU_OPEN, roundMenuOpen);

  app.mount('#app');
}
