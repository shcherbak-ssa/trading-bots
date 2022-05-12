import type { User } from 'global/types';

import type {
  Notification,
  TelegramAction,
  TelegramCommandConfig,
  TelegramCommandItemConfig,
  TelegramMessage,
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
        message: 'Invalid command! Expected  <code>password</code>  parameter.',
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

    const [ command, parameter ]: string[] = Utils.parseCommand(message);
    const baseCommandMessage: TelegramMessage | null = Telegram.checkBaseCommands(command as TelegramCommand, user);

    if (baseCommandMessage) {
      return baseCommandMessage;
    }

    const config: TelegramCommandConfig | undefined = Utils.getCommandConfig(command as TelegramCommand);

    if (!config || (config.onlyAdmin && !user.isAdmin)) {
      return Telegram.getUnknownCommandMessage();
    }

    const commandItemConfig: TelegramCommandItemConfig | undefined
      = Utils.getCommandItemConfig(command as TelegramCommand, config);

    if (!commandItemConfig) {
      return Telegram.getInternalErrorMessage();
    }

    if (commandItemConfig.parameterRequired && !parameter) {
      return Telegram.getRequiredParameterMessage(commandItemConfig);
    }

    const commandAction: TelegramAction | null = Telegram.checkCommand(command as TelegramCommand, parameter);

    if (commandAction) {
      return commandAction;
    }

    return Telegram.getUnknownCommandMessage();
  }

  getNotificationMessage(notification: Notification): TelegramMessage {
    return getNotificationMessage(notification);
  }

  async sendMessage(chatId: number, message: TelegramMessage): Promise<void> {
    return await sendMessage(chatId, message);
  }


  private static checkBaseCommands(command: TelegramCommand, user: User): TelegramMessage | null {
    let message: string = '';

    switch (command) {
      case TelegramCommand.START:
        message = 'Your account is already exist.\nUse /help to see available commands.';

        break;
      case TelegramCommand.HELP:
        const [ userCommands, adminCommands ]: string[] = Utils.getHelpCommandsDescription(user);

        message += 'I will notify you when something happens to your trading bots. ';
        message += `You can control my notifications in <a href="${process.env.SERVER_URL}/settings">Settings</a> page.\n\n`;
        message += `Command template is  <code>/[scope] [label] [parameter]</code>. <i>Parameter</i> may be optional.\n\n`;

        message += '<b>Available commands</b>';
        message += userCommands;

        if (user.isAdmin) {
          message += adminCommands;
        }

        message += '\n\n<i>Note: You can copy a command by clicking on it.</i>';

        break;
      default:
        return null;
    }

    return { type: 'message', message };
  }

  private static checkCommand(command: string, parameter: string): TelegramAction | null {
    switch (command) {
      case TelegramCommand.USER_CREATE:
        return {
          type: 'action',
          action: TelegramActionType.CREATE_USER,
          login: parameter.trim(),
        };
    }

    return null;
  }

  private static getUnknownCommandMessage(): TelegramMessage {
    return {
      type: 'message',
      message: 'Unknown command!\nUse /help to see available commands.',
    };
  }

  private static getInternalErrorMessage(): TelegramMessage {
    return {
      type: 'message',
      message: 'Internal Server Error! Please, contact admin.',
    };
  }

  private static getRequiredParameterMessage({ parameter, command }: TelegramCommandItemConfig): TelegramMessage {
    return {
      type: 'message',
      message: (
        `Invalid command! Missing parameter <i>${parameter}</i>.\n` +
        `Valid command is  <code>${command} [${parameter}]</code>.` +

        '\n\nUse /help to see all available commands.'
      ),
    };
  }
}
