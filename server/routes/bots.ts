import type { BotClientInfo, LoadBotsPayload, NewBot, OnlyIdPayload, UpdateBotPayload } from 'global/types';
import { RequestMethod, ServerEndpoint } from 'global/constants';

import type { ServerRoute } from 'shared/types';
import { ActionType, Validation } from 'shared/constants';
import { runAction } from 'shared/actions';


export const botsRoutes: ServerRoute[] = [
  {
    endpoint: ServerEndpoint.API_BOTS,
    method: RequestMethod.GET,
    validation: Validation.BOTS_LOAD,
    async handler(userId: string, payload: LoadBotsPayload): Promise<BotClientInfo[]> {
      return await runAction({
        type: ActionType.BOTS_LOAD,
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
