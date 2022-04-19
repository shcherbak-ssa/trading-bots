import type { BotsCreatePayload, BotsDeletePayload, BotsReadPayload, BotsUpdatePayload } from 'global/types';
import type { BotsCreateResult, BotsReadResult } from 'global/types';
import { RequestMethod, ServerEndpoint } from 'global/constants';

import type { ServerRequestPayload, ServerRoute } from 'shared/types';
import { Validation } from 'shared/constants';


export const botsRoutes: ServerRoute[] = [
  {
    endpoint: ServerEndpoint.API_BOTS,
    method: RequestMethod.GET,
    validation: Validation.BOTS_READ,
    async handler(userId: string, payload: ServerRequestPayload<BotsReadPayload>): Promise<BotsReadResult> {
      throw new Error('Not implemented');
    },
  },
  {
    endpoint: ServerEndpoint.API_BOTS,
    method: RequestMethod.POST,
    validation: Validation.BOTS_CREATE,
    async handler(userId: string, payload: ServerRequestPayload<BotsCreatePayload>): Promise<BotsCreateResult> {
      throw new Error('Not implemented');
    },
  },
  {
    endpoint: ServerEndpoint.API_BOTS,
    method: RequestMethod.PUT,
    validation: Validation.BOTS_UPDATE,
    async handler(userId: string, payload: ServerRequestPayload<BotsUpdatePayload>): Promise<void> {
      throw new Error('Not implemented');
    },
  },
  {
    endpoint: ServerEndpoint.API_BOTS,
    method: RequestMethod.DELETE,
    validation: Validation.BOTS_DELETE,
    async handler(userId: string, payload: ServerRequestPayload<BotsDeletePayload>): Promise<void> {
      throw new Error('Not implemented');
    },
  },
];
