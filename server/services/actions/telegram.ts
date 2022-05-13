import type { User } from 'global/types';
import { GetUserType, PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH } from 'global/constants';

import type {
  NewUser,
  CheckUserPayload,
  ConnectUserAction,
  GetUserFilters,
  TelegramAction,
  TelegramIncomeMessage,
  UpdateUserPayload,
  Notification
} from 'shared/types';

import { ActionType, ErrorName, LogScope, NotificationType, TelegramActionType } from 'shared/constants';
import { initialUser } from 'shared/config';
import { AppError } from 'shared/exceptions';
import { logger } from 'shared/logger';
import { generateRandomPassword } from 'shared/utils';

import { runAction } from 'services/actions';
import { telegramService } from 'services/telegram';


export const telegramActions = {
  async [ActionType.TELEGRAM_PROCESS_INCOME_MESSAGE](userId: string, payload: TelegramIncomeMessage): Promise<void> {
    if (payload.telegramToken !== process.env.TELEGRAM_BOT_TOKEN) {
      throw new AppError({
        message: `Received invalid Telegram token (${payload.telegramToken}).`,
        messageHeading: 'Telegram webhook',
        payload,
      });
    }

    if (payload.my_chat_member || !payload.message.text) {
      logger.logWarning(LogScope.API, {
        message: 'Received not message payload.',
        messageHeading: 'Telegram webhook',
        savePayload: true,
        payload,
      });

      return await runAction<Notification, void>({
        type: ActionType.NOTIFICATIONS_NOTIFY_ADMIN,
        userId: '',
        payload: {
          type: NotificationType.INFO,
          forAdmin: true,
          message: 'Telegram webhook - Received not message payload.',
        },
      });
    }

    const { chat, text: incomeMessage } = payload.message;

    const [ currentUser ] = await runAction<GetUserFilters, User[]>({
      type: ActionType.USERS_GET,
      userId: '',
      payload: { type: GetUserType.ONE, telegramChatId: chat.id },
    });

    const parseCommandResult: string | TelegramAction = currentUser
      ? telegramService.parseUserCommand(currentUser, incomeMessage)
      : telegramService.parseUnknownUserCommand(incomeMessage);

    if (typeof parseCommandResult === 'string') {
      return await telegramService.sendMessage(chat.id, parseCommandResult);
    }

    let telegramMessage: string = '';

    if (currentUser) {
      switch (parseCommandResult.action) {
        case TelegramActionType.CREATE_USER: {
          const { username, getMessage } = parseCommandResult;
          const password: string = generateRandomPassword();

          try {
            await runAction<NewUser, User>({
              type: ActionType.USERS_CREATE,
              userId: '',
              payload: {
                ...initialUser,
                username,
                password,
              },
            });

            telegramMessage = getMessage(username, password);
          } catch (e: any) {
            if (e.name !== ErrorName.API_ERROR) throw e;

            telegramMessage = `Error! ${e.logPayload.message}`;
          }

          break;
        }
        case TelegramActionType.GET_USER_LOGIN: {
          const { field, getMessage } = parseCommandResult;

          telegramMessage = getMessage(currentUser[field]);

          break;
        }
        case TelegramActionType.SET_USER_LOGIN: {
          const { field, newValue, getMessage, getValidationMessage } = parseCommandResult;

          if (field === 'password' && newValue.length < PASSWORD_MIN_LENGTH) {
            telegramMessage = getValidationMessage(field, PASSWORD_MIN_LENGTH);
            break;
          }

          if (field === 'username' && newValue.length < USERNAME_MIN_LENGTH) {
            telegramMessage = getValidationMessage(field, USERNAME_MIN_LENGTH);
            break;
          }

          try {
            await runAction<UpdateUserPayload, void>({
              type: ActionType.USERS_UPDATE,
              userId: currentUser.id,
              payload: {
                [field]: newValue,
              },
            });

            telegramMessage = getMessage();
          } catch (e: any) {
            if (e.name !== ErrorName.API_ERROR) throw e;

            telegramMessage = `Error! ${e.logPayload.message}`;
          }

          break;
        }
      }
    } else {
      const { username, password, getMessage } = parseCommandResult as ConnectUserAction;

      const isValidUser = await runAction<CheckUserPayload, boolean>({
        type: ActionType.USERS_CHECK,
        userId: '',
        payload: { username, password },
      });

      if (isValidUser) {
        const [ newUser ] = await runAction<GetUserFilters, User[]>({
          type: ActionType.USERS_GET,
          userId: '',
          payload: { type: GetUserType.ONE, username },
        });

        await runAction<UpdateUserPayload, void>({
          type: ActionType.USERS_UPDATE,
          userId: newUser.id,
          payload: { telegramChatId: chat.id },
        });

        telegramMessage = getMessage();
      } else {
        telegramMessage = telegramService.getUnknownUserMessage();
      }
    }

    await telegramService.sendMessage(chat.id, telegramMessage);
  },
};
