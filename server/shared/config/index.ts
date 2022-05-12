import type { AnalyticsBotProgress } from 'global/types';

import type { TelegramCommandConfig, NewUser } from 'shared/types';
import { TelegramCommand } from 'shared/constants';


export const emptyBotProgress: AnalyticsBotProgress = {
  botActivationIndex: 0,
  changePercent: 0,
  totalFee: 0,
  totalLoss: 0,
  totalProfit: 0,
  totalResult: 0,
  state: 'empty',
};

export const initialUser: NewUser = {
  telegramChatId: 0,
  isAdmin: false,
  username: '[username]',
  password: '[password]',
};

export const telegramCommands: TelegramCommandConfig[] = [
  {
    heading: 'Trading reports',
    onlyAdmin: false,
    commands: [
      {
        command: TelegramCommand.REPORT_TODAY,
        description: 'get trading report for current day',
      },
      {
        command: TelegramCommand.REPORT_WEEK,
        description: 'get trading report for current week',
      },
      {
        command: TelegramCommand.REPORT_MONTH,
        description: 'get trading report for last 4 weeks',
      },
    ],
  },
  {
    heading: 'Manage login data',
    onlyAdmin: false,
    commands: [
      {
        command: TelegramCommand.LOGIN_USERNAME,
        description: 'get/set your username',
        parameterRequired: false,
        parameter: 'username',
      },
      {
        command: TelegramCommand.LOGIN_PASSWORD,
        description: 'set new password',
        parameterRequired: true,
        parameter: 'password',
      },
    ],
  },
  {
    heading: 'Manage users',
    onlyAdmin: true,
    commands: [
      {
        command: TelegramCommand.USER_CREATE,
        description: 'create new user',
        parameterRequired: true,
        parameter: 'username',
      },
    ],
  },
];
