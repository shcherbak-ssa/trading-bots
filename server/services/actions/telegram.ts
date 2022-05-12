import type { User } from 'global/types';
import { GetUserType } from 'global/constants';

import type {
  GetUserFilters,
  TelegramIncomeMessage,
  UpdateUserPayload,
  TelegramAction,
  TelegramMessage,
} from 'shared/types';

import { ActionType, TelegramActionType } from 'shared/constants';
import { AppError } from 'shared/exceptions';
import { generateRandomPassword } from 'shared/utils';

import { runAction } from 'services/actions';
import { telegramService } from 'services/telegram';


export const telegramActions = {
  async [ActionType.TELEGRAM_PROCESS_INCOME_MESSAGE](userId: string, payload: TelegramIncomeMessage): Promise<void> {
    if (payload.telegramToken !== process.env.TELEGRAM_BOT_TOKEN) {
      throw new AppError({
        message: `Received invalid Telegram token (${payload.telegramToken})`,
        messageHeading: 'Telegram webhook',
        payload,
      });
    }

    const { chat, text: incomeMessage } = payload.message;

    const [ currentUser ] = await runAction<GetUserFilters, User[]>({
      type: ActionType.USERS_GET,
      userId: '',
      payload: { type: GetUserType.ONE, telegramChatId: chat.id },
    });

    if (!currentUser) {
      const parseResult: TelegramMessage | TelegramAction = telegramService.parseUnknownUserCommand(incomeMessage);
      const telegramMessage: TelegramMessage = { type: 'message', message: '' };

      if (parseResult.type === 'action' && parseResult.action === TelegramActionType.CONNECT_USER_TELEGRAM) {
        const { userId, message } = parseResult;

        await runAction<UpdateUserPayload, void>({
          type: ActionType.USERS_UPDATE,
          userId,
          payload: { telegramChatId: chat.id },
        });

        telegramMessage.message = message;
      } else if (parseResult.type === 'message') {
        telegramMessage.message = parseResult.message;
      }

      return await telegramService.sendMessage(chat.id, telegramMessage);
    }

    const parseResult: TelegramMessage | TelegramAction = telegramService.parseUserCommand(currentUser, incomeMessage);

    if (parseResult.type === 'message') {
      return await telegramService.sendMessage(chat.id, parseResult);
    }

    switch (parseResult.action) {
      case TelegramActionType.CREATE_USER: {
        const { login } = parseResult;
        const password: string = generateRandomPassword();

        // @TODO

        break;
      }
    }
  },
};
