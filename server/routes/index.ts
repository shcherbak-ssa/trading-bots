import type { ServerRoute } from 'shared/types';

import { apiBotsRoutes } from './api-bots';
import { apiBrokersRoutes } from './api-brokers';


export * from './signals';

export const apiRoutes: ServerRoute[] = [
  ...apiBotsRoutes,
  ...apiBrokersRoutes,
];
