import type { ServerRoute } from 'shared/types';

import { apiBotsRoutes } from './api-bots';
import { apiBrokersRoutes } from './api-brokers';


export * from './webhooks';

export const apiRoutes: ServerRoute[] = [
  ...apiBotsRoutes,
  ...apiBrokersRoutes,
];
