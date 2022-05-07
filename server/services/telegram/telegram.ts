import type { User } from 'global/types';

import type {
  TelegramAction,
  TelegramCommandConfig,
  TelegramMessage, Notification,
  TelegramService
} from 'shared/types';

import { TelegramActionType, TelegramCommand } from 'shared/constants';

import { sendMessage } from 'api/telegram';

import { getNotificationMessage } from './notification';
import { Utils } from './utils';


export class Telegram implements TelegramService {
  private static newUsers: Map<string, string> = new Map([]);


  parseUnknownUserCommand(message: string): TelegramMessage | TelegramAction {
    if (!message.startsWith(TelegramCommand.START)) {
      return {
        type: 'message',
        message: 'Oops... I don\'t know who you are!'
      };
    }

    const [ , password ]: string[] = Utils.parseCommand(message);

    if (!password) {
      return {
        type: 'message',
        message: 'Invalid command! Expected <code>password</code> parameter.',
      };
    }

    const newUserId: string | undefined = Telegram.newUsers.get(password);

    if (!newUserId) {
      return {
        type: 'message',
        message: 'Invalid password!',
      };
    }

    return {
      type: 'action',
      action: TelegramActionType.CONNECT_USER_TELEGRAM,
      userId: newUserId,
      message: 'Your account is created! TODO: add link to dashboard', // @TODO
    };
  }

  parseUserCommand(user: User, message: string): TelegramMessage | TelegramAction {
    if (!Utils.isCommand(message)) {
      return {
        type: 'message',
        message: 'Only commands that start with <b>"/"</b> are allowed.\nUse /help to see available commands.',
      };
    }

    const [ command, ...params ]: string[] = Utils.parseCommand(message);

    switch (command) {
      case TelegramCommand.START:
        return {
          type: 'message',
          message: 'Your account is already exist.\nUse /help to see available commands.',
        };
      case TelegramCommand.HELP:
        const [ userCommands, adminCommands ]: string[] = Utils.getHelpCommandsDescription(user);

        return {
          type: 'message',
          message: (
            'TODO: add description\n\n' +
            'Available commands:' +
            userCommands +
            (user.isAdmin ? adminCommands : '')
          ),
        };
      case TelegramCommand.USER:
      case TelegramCommand.REPORT:
        const config: TelegramCommandConfig | undefined = Utils.getCommandConfig(command);

        if (!config) {
          return {
            type: 'message',
            message: '<b>Internal Server Error</b>\n\nPlease, contact developer.',
          };
        }

        if (!user.isAdmin && config.onlyAdmin) {
          return Utils.getUnknownCommandMessage();
        }

        if (!params.length) {
          return Utils.getInvalidCommandParams(config, 0);
        }

        const action: TelegramAction | null = Utils.checkParameter(config, params);

        return action || Utils.getInvalidCommandParams(config, params.length);
    }

    return Utils.getUnknownCommandMessage();
  }

  getNotificationMessage(notification: Notification): TelegramMessage {
    return getNotificationMessage(notification);
  }

  async sendMessage(chatId: number, message: TelegramMessage): Promise<void> {
    return await sendMessage(chatId, message);
  }
}
