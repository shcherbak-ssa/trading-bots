import { RequestMethod, ServerEndpoint } from 'global/constants';

import type { ServerRoute, Signal, TelegramIncomeMessage } from 'shared/types';
import { ActionType, Validation } from 'shared/constants';

import { runAction } from 'services/actions';


export const webhooksRoutes: ServerRoute[] = [
  {
    endpoint: ServerEndpoint.WEBHOOK_SIGNALS,
    method: RequestMethod.POST,
    validation: Validation.SIGNALS,
    async handler(userId: string, payload: Signal): Promise<void> {
      return await runAction({
        type: ActionType.SIGNALS_PROCESS,
        userId,
        payload,
      });
    },
  },
  {
    endpoint: ServerEndpoint.WEBHOOK_TELEGRAM,
    method: RequestMethod.POST,
    validation: Validation.NONE,
    async handler(userId: string, payload: TelegramIncomeMessage): Promise<void> {
      return await runAction({
        type: ActionType.TELEGRAM_PROCESS_INCOME_MESSAGE,
        userId,
        payload,
      });
    },
  }
];
