import type { User } from 'global/types';

import type { TelegramAction, TelegramCommandConfig, TelegramCommandParamConfig, TelegramMessage } from 'shared/types';
import type { TelegramCommand } from 'shared/constants';
import { telegramCommands } from 'shared/config';

import { COMMAND_INITIAL_STRING, COMMAND_SEPARATOR } from 'api/telegram';


export class Utils {
  static isCommand(message: string): boolean {
    return message.startsWith(COMMAND_INITIAL_STRING);
  }

  static parseCommand(message: string): string[] {
    return message.trim().split(COMMAND_SEPARATOR);
  }

  static checkParameter(config: TelegramCommandConfig, [ parameter ]: string[]): TelegramAction | null {
    const parameterConfig: TelegramCommandParamConfig | undefined
      = config.params.find(({ value }) => {
      return value === parameter;
    });

    return parameterConfig ? parameterConfig.action : null;
  }

  static getCommandConfig(command: TelegramCommand): TelegramCommandConfig | undefined {
    return telegramCommands.find(({ command: configCommand }) => {
      return command === configCommand;
    });
  }

  static getHelpCommandsDescription(user: User): string[] {
    const commandConfigs: TelegramCommandConfig[] = telegramCommands.filter(({ onlyAdmin }) => {
      return user.isAdmin ? true : !onlyAdmin;
    });

    return commandConfigs
    .reduce((result, { command, description, onlyAdmin, params }) => {
      const resultIndex: number = onlyAdmin ? 1 : 0;

      result[resultIndex] += `\n${command} - ${description}`;

      for (const { value, description } of params) {
        result[resultIndex] += `\n <code>${command} ${value}</code> - ${description}`;
      }

      return result;
    }, ['\n', '\n\n<b>Admin</b>']);
  }

  static getUnknownCommandMessage(): TelegramMessage {
    return {
      type: 'message',
      message: 'Unknown command!\nUse /help to see available commands.',
    };
  }

  static getInvalidCommandParams({ command, params }: TelegramCommandConfig, paramsCount: number): TelegramMessage {
    let paramsDescription: string = '\n\nAvailable parameters:';

    for (const { value, description } of params) {
      paramsDescription += `\n <code>${command} ${value}</code> - ${description}`;
    }

    return {
      type: 'message',
      message: (
        (paramsCount ? 'Invalid command parameter.' : 'This command requires a parameter.') +
        paramsDescription +
        '\n\nUse /help to see all commands.'
      ),
    };
  }
}
