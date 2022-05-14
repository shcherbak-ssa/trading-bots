import { Route } from 'shared/constants';

import DashboardPage from 'app/pages/dashboard-page.vue';
import BotsPage from 'app/pages/bots-page.vue';
import SettingsPage from 'app/pages/settings-page.vue';


export const routes = [
  {
    path: Route.ROOT,
    redirect: Route.DASHBOARD,
  },
  {
    path: Route.DASHBOARD,
    component: DashboardPage,
  },
  {
    path: Route.BOTS,
    component: BotsPage,
  },
  {
    path: Route.SETTINGS,
    component: SettingsPage,
  },
];
