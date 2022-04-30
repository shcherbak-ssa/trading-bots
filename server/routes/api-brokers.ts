import type {
  Broker,
  UpdateBrokerPayload,
  GetBrokerDataPayload,
  GetBrokerDataResult,
  LoadBrokersPayload,
  NewBroker,
  OnlyIdPayload
} from 'global/types';

import { RequestMethod, ServerEndpoint } from 'global/constants';

import type { ServerRequestPayload, ServerRoute } from 'shared/types';
import { ActionType, Validation } from 'shared/constants';

import { runAction } from 'services/actions';


export const apiBrokersRoutes: ServerRoute[] = [
  {
    endpoint: ServerEndpoint.API_BROKERS,
    method: RequestMethod.GET,
    validation: Validation.BROKERS_LOAD,
    async handler(userId: string, payload: LoadBrokersPayload): Promise<Broker[]> {
      return await runAction({
        type: ActionType.BROKERS_LOAD,
        userId,
        payload,
      });
    },
  },
  {
    endpoint: ServerEndpoint.API_BROKERS_WITH_ID,
    method: RequestMethod.GET,
    validation: Validation.BROKERS_GET_DATA,
    async handler(userId: string, payload: GetBrokerDataPayload): Promise<GetBrokerDataResult> {
      return await runAction({
        type: ActionType.BROKERS_GET_DATA,
        userId,
        payload,
      });
    },
  },
  {
    endpoint: ServerEndpoint.API_BROKERS,
    method: RequestMethod.POST,
    validation: Validation.BROKERS_CONNECT,
    async handler(userId: string, payload: ServerRequestPayload<NewBroker>): Promise<Broker> {
      return await runAction({
        type: ActionType.BROKERS_CONNECT,
        userId,
        payload,
      });
    },
  },
  {
    endpoint: ServerEndpoint.API_BROKERS_WITH_ID,
    method: RequestMethod.PUT,
    validation: Validation.BROKERS_UPDATE,
    async handler(userId: string, payload: UpdateBrokerPayload): Promise<void> {
      return await runAction({
        type: ActionType.BROKERS_UPDATE,
        userId,
        payload,
      });
    },
  },
  {
    endpoint: ServerEndpoint.API_BROKERS_WITH_ID,
    method: RequestMethod.DELETE,
    validation: Validation.ONLY_ID,
    async handler(userId: string, payload: OnlyIdPayload): Promise<void> {
      return await runAction({
        type: ActionType.BROKERS_DELETE,
        userId,
        payload,
      });
    },
  },
];
