import type { User } from 'global/types';

import type {
  Notification,
  TelegramAction,
  TelegramCommandConfig,
  TelegramCommandItemConfig,
  TelegramService
} from 'shared/types';

import { USERNAME_PASSWORD_SEPARATOR, USERNAME_PASSWORD_TEST, TelegramActionType, TelegramCommand } from 'shared/constants';

import { BOT_URL, sendMessage } from 'api/telegram';

import { getNotificationMessage } from './notification';
import { Utils } from './utils';


export class Telegram implements TelegramService {
  getUnknownUserMessage(): string {
    return 'I don\'t know who you are!';
  }

  parseUnknownUserCommand(message: string): string | TelegramAction {
    if (!message.startsWith(TelegramCommand.START)) {
      return this.getUnknownUserMessage();
    }

    const [ , loginWithPassword ]: string[] = Utils.parseCommand(message);

    if (!loginWithPassword || !USERNAME_PASSWORD_TEST.test(loginWithPassword)) {
      return this.getUnknownUserMessage();
    }

    const [ username, password ] = loginWithPassword.split(USERNAME_PASSWORD_SEPARATOR);

    return {
      type: 'action',
      action: TelegramActionType.CONNECT_USER_TELEGRAM,
      username,
      password,
      getMessage: () => {
        return (
          `Your account connected successfully! ` +
          'Use /help to see all available commands. ' +
          `Use <i>username</i> and <i>password</i> to enter in <a href="${process.env.SERVER_URL}/">Dashboard</a>.\n\n` +

          `Username:  <code>${username}</code>\n` +
          `Password:  <code>${password}</code>  (remember it)` +

          '\n\n<i>It is recommended to change the password after connecting the account</i>.'
        );
      },
    };
  }

  parseUserCommand(user: User, message: string): string | TelegramAction {
    if (!Utils.isCommand(message)) {
      return 'Only commands that start with <b>"/"</b> are allowed.\nUse /help to see available commands.';
    }

    const [ command, parameter ]: string[] = Utils.parseCommand(message);
    const baseCommandMessage: string | null = Telegram.checkBaseCommand(command as TelegramCommand, user);

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

  getNotificationMessage(notification: Notification): string {
    return getNotificationMessage(notification);
  }

  async sendMessage(chatId: number, message: string): Promise<void> {
    return await sendMessage(chatId, message);
  }


  private static checkBaseCommand(command: TelegramCommand, user: User): string | null {
    let message: string = '';

    switch (command) {
      case TelegramCommand.START:
        message = 'Your account is already exist.\nUse /help to see available commands.';

        break;
      case TelegramCommand.HELP:
        const [ userCommands, adminCommands ]: string[] = Utils.getHelpCommandsDescription(user);

        message += `I will notify you when something happens to your trading bots. `;
        message += `You can control my notifications on <a href="${process.env.SERVER_URL}/settings">Settings</a> page. `;
        message += `Dashboard <a href="${process.env.SERVER_URL}/dashboard">here</a>.\n\n`;

        message += `Command template is  <code>/command label parameter</code>. `;
        message += `The <i>parameter</i> may be optional, depending on the brackets: <code>[]</code> - optional, <code>{}</code> - required.\n\n`;

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

    return message;
  }

  private static checkCommand(command: TelegramCommand, parameter: string): TelegramAction | null {
    switch (command) {
      case TelegramCommand.USER_CREATE:
        return {
          type: 'action',
          action: TelegramActionType.CREATE_USER,
          username: parameter.trim(),
          getMessage: (username: string, password: string) => {
            const startLinkUrl: string = `${BOT_URL}?start=${username}${USERNAME_PASSWORD_SEPARATOR}${password}`;

            return `New user created! Use this <a href="${startLinkUrl}">link</a> to connect Telegram account.`;
          },
        };
      case TelegramCommand.LOGIN_USERNAME:
      case TelegramCommand.LOGIN_PASSWORD:
        const field = command === TelegramCommand.LOGIN_USERNAME ? 'username' : 'password';

        if (parameter) {
          return {
            type: 'action',
            action: TelegramActionType.SET_USER_LOGIN,
            newValue: parameter,
            field,
            getMessage: () => {
              return `Your <i>${field}</i> updated successfully!`;
            },
            getValidationMessage: (field: string, minLength: number) => {
              return `Invalid value! Minimum length of <i>${field}</i> is ${minLength} symbols.`;
            },
          };
        }

        if (field === 'username') {
          return {
            type: 'action',
            action: TelegramActionType.GET_USER_LOGIN,
            field,
            getMessage: (value: string) => {
              return `Your current <i>${field}</i>  -  <code>${value}</code>.`;
            },
          };
        }
    }

    return null;
  }

  private static getUnknownCommandMessage(): string {
    return 'Unknown command!\nUse /help to see available commands.';
  }

  private static getInternalErrorMessage(): string {
    return 'Internal Server Error! Please, contact admin.';
  }

  private static getRequiredParameterMessage({ parameter, command }: TelegramCommandItemConfig): string {
    return (
      `Invalid command! Missing parameter <i>${parameter}</i>.\n` +
      `Valid command is  <code>${command} [${parameter}]</code>.` +

      '\n\nUse /help to see all available commands.'
    );
  }
}
