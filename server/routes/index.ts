import type { ServerRoute } from 'shared/types';

import { apiBotsRoutes } from './api-bots';
import { apiBrokersRoutes } from './api-brokers';
import { apiUsersRoutes } from './api-users';


export const apiRoutes: ServerRoute[] = [
  ...apiBotsRoutes,
  ...apiBrokersRoutes,
  ...apiUsersRoutes,
];

export * from './auth';
export * from './webhooks';
