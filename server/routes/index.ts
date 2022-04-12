import type { ServerRoute } from 'shared/types';

import { botsRoutes } from './bots';
import { brokersRoutes } from './brokers';


export const routes: ServerRoute[] = [
  ...botsRoutes,
  ...brokersRoutes,
];
