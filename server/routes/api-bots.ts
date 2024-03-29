import type { BotClientInfo, LoadBotsPayload, NewBot, OnlyIdPayload, UpdateBotPayload } from 'global/types';
import { RequestMethod, ServerEndpoint } from 'global/constants';

import type { ServerRoute, BotsGetFilters } from 'shared/types';
import { ActionType, Validation } from 'shared/constants';

import { runAction } from 'services/actions';


export const apiBotsRoutes: ServerRoute[] = [
  {
    endpoint: ServerEndpoint.API_BOTS_WITH_ID,
    method: RequestMethod.GET,
    validation: Validation.ONLY_ID,
    async handler(userId: string, payload: OnlyIdPayload): Promise<BotClientInfo> {
      const [ bot ] = await runAction({
        type: ActionType.BOTS_GET,
        userId,
        payload,
      });

      return bot;
    },
  },
  {
    endpoint: ServerEndpoint.API_BOTS,
    method: RequestMethod.GET,
    validation: Validation.BOTS_GET,
    async handler(userId: string, payload: BotsGetFilters): Promise<BotClientInfo[]> {
      return await runAction({
        type: ActionType.BOTS_GET,
        userId,
        payload,
      });
    },
  },
  {
    endpoint: ServerEndpoint.API_BOTS,
    method: RequestMethod.POST,
    validation: Validation.BOTS_CREATE,
    async handler(userId: string, payload: NewBot): Promise<BotClientInfo> {
      return await runAction({
        type: ActionType.BOTS_CREATE,
        userId,
        payload,
      });
    },
  },
  {
    endpoint: ServerEndpoint.API_BOTS_WITH_ID,
    method: RequestMethod.PUT,
    validation: Validation.BOTS_UPDATE,
    async handler(userId: string, payload: UpdateBotPayload): Promise<void> {
      return await runAction({
        type: ActionType.BOTS_UPDATE,
        userId,
        payload,
      });
    },
  },
  {
    endpoint: ServerEndpoint.API_BOTS_WITH_ID,
    method: RequestMethod.DELETE,
    validation: Validation.ONLY_ID,
    async handler(userId: string, payload: OnlyIdPayload): Promise<void> {
      return await runAction({
        type: ActionType.BOTS_DELETE,
        userId,
        payload,
      });
    },
  },
];
