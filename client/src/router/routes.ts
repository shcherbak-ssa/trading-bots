import { Route } from 'shared/constants';

import DashboardPage from '../pages/dashboard-page.vue';
import BotsPage from '../pages/bots-page.vue';
import BrokersPage from '../pages/brokers-page.vue';
import AnalyticsPage from '../pages/analytics-page.vue';
import SettingsPage from '../pages/settings-page.vue';


export const routes = [
  {
    path: Route.DASHBOARD,
    component: DashboardPage,
  },
  {
    path: Route.BOTS,
    component: BotsPage,
  },
  {
    path: Route.BROKERS,
    component: BrokersPage,
  },
  {
    path: Route.ANALYTICS,
    component: AnalyticsPage,
  },
  {
    path: Route.SETTINGS,
    component: SettingsPage,
  },
];
