import { Route } from 'shared/constants';

import DashboardPage from 'app/pages/dashboard-page.vue';
import BotsPage from 'app/pages/bots-page.vue';
import AnalyticsPage from 'app/pages/analytics-page.vue';
import SettingsPage from 'app/pages/settings-page.vue';


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
    path: Route.ANALYTICS,
    component: AnalyticsPage,
  },
  {
    path: Route.SETTINGS,
    component: SettingsPage,
  },
];
