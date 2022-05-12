import type { User } from 'global/types';

import type { TelegramCommandConfig, TelegramCommandItemConfig, TelegramMessage } from 'shared/types';
import { TelegramCommand } from 'shared/constants';
import { telegramCommands } from 'shared/config';

import { COMMAND_INITIAL_STRING, COMMAND_SEPARATOR } from 'api/telegram';


export class Utils {
  static isCommand(message: string): boolean {
    return message.startsWith(COMMAND_INITIAL_STRING);
  }

  static parseCommand(message: string): string[] {
    const commands: string[] = message.trim().split(COMMAND_SEPARATOR);

    if (Utils.isBaseCommand(commands[0])) {
      return commands;
    }

    const [ scope, label, parameter ] = commands;

    return [ `${scope} ${label}`, parameter ];
  }

  static getCommandConfig(command: TelegramCommand): TelegramCommandConfig | undefined {
    return telegramCommands.find(({ commands }) => {
      return !!commands.find(({ command: configCommand }) => command === configCommand);
    });
  }

  static getCommandItemConfig(command: TelegramCommand, config: TelegramCommandConfig): TelegramCommandItemConfig | undefined {
    return config.commands.find(({ command: configCommand }) => command === configCommand);
  }

  static getHelpCommandsDescription(user: User): string[] {
    const commandConfigs: TelegramCommandConfig[] = telegramCommands.filter(({ onlyAdmin }) => {
      return user.isAdmin ? true : !onlyAdmin;
    });

    return commandConfigs
      .reduce((result, { heading, onlyAdmin, commands }) => {
        const resultIndex: number = onlyAdmin ? 1 : 0;

        result[resultIndex] += `\n\n<i># ${heading}</i>`;

        for (const { command, parameter, description } of commands) {
          result[resultIndex] += `\n<code>${command}${parameter ? ` [${parameter}]` : ''}</code>  -  ${description}`;
        }

        return result;
      }, ['', '\n\n<b>Admin</b>']);
  }


  // Helpers
  static isBaseCommand(command: string): boolean {
    return command === TelegramCommand.START || command === TelegramCommand.HELP;
  }
}
