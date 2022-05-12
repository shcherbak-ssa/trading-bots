import type { AnalyticsBotProgress, NewUser } from 'global/types';

import type { TelegramCommandConfig } from 'shared/types';
import { TelegramActionType, TelegramCommand } from 'shared/constants';


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
    heading: 'Manage login/password',
    onlyAdmin: false,
    commands: [
      {
        command: TelegramCommand.SECURITY_LOGIN,
        description: 'get/set your login',
        parameterRequired: false,
        parameter: 'new login',
      },
      {
        command: TelegramCommand.SECURITY_PASSWORD,
        description: 'get/set your password',
        parameterRequired: false,
        parameter: 'new password',
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
        parameter: 'login',
      },
    ],
  },
];
