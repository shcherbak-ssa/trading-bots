import { RequestMethod, ServerEndpoint } from 'global/constants';

import type { ServerRoute, Signal } from 'shared/types';
import { ActionType, Validation } from 'shared/constants';

import { runAction } from 'services/actions';


export const signalRoutes: ServerRoute[] = [
  {
    endpoint: ServerEndpoint.SIGNALS,
    method: RequestMethod.POST,
    validation: Validation.SIGNALS,
    async handler(userId: string, payload: Signal): Promise<void> {
      return runAction({
        type: ActionType.SIGNALS_PROCESS,
        userId,
        payload,
      });
    },
  }
];
