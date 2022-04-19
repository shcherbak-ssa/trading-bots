import type { BrokerClientInfo, NewBroker, OnlyIdPayload } from 'global/types';
import { RequestMethod, ServerEndpoint } from 'global/constants';

import type { ServerRequestPayload, ServerRoute } from 'shared/types';
import { ActionType, Validation } from 'shared/constants';
import { runAction } from 'shared/actions';


export const brokersRoutes: ServerRoute[] = [
  {
    endpoint: ServerEndpoint.API_BROKERS,
    method: RequestMethod.GET,
    validation: Validation.EMPTY,
    async handler(userId: string): Promise<BrokerClientInfo[]> {
      return await runAction({
        type: ActionType.BROKERS_GET,
        userId,
        payload: {}
      });
    },
  },
  {
    endpoint: ServerEndpoint.API_BROKERS,
    method: RequestMethod.POST,
    validation: Validation.BROKERS_CONNECT,
    async handler(userId: string, payload: ServerRequestPayload<NewBroker>): Promise<BrokerClientInfo> {
      return await runAction({
        type: ActionType.BROKERS_CONNECT,
        userId,
        payload,
      });
    },
  },
  {
    endpoint: ServerEndpoint.API_BROKERS_WITH_ID,
    method: RequestMethod.DELETE,
    validation: Validation.ID,
    async handler(userId: string, payload: OnlyIdPayload): Promise<void> {
      return await runAction({
        type: ActionType.BROKERS_DELETE,
        userId,
        payload,
      });
    },
  },
];
