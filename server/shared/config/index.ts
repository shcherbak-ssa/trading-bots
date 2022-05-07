import type { AnalyticsBotProgress, NewUser } from 'global/types';

import type { TelegramCommandConfig } from 'shared/types';
import { TelegramActionType, TelegramCommand } from 'shared/constants';


export const emptyBotProgress: AnalyticsBotProgress = {
  botActivationIndex: 0,
  totalFee: 0,
  totalLoss: 0,
  totalProfit: 0,
  totalResult: 0,
  changePercent: 0,
};

export const initialUser: NewUser = {
  telegramChatId: 0,
  isAdmin: false,
};

export const telegramCommands: TelegramCommandConfig[] = [
  {
    command: TelegramCommand.REPORT,
    onlyAdmin: false,
    description: 'get trading report',
    params: [
      {
        value: 'today',
        description: 'trading report for current day',
        action: {
          type: 'action',
          action: TelegramActionType.REPORT_TODAY,
        },
      },
      {
        value: 'week',
        description: 'trading report for current week',
        action: {
          type: 'action',
          action: TelegramActionType.REPORT_WEEK,
        },
      },
      {
        value: 'month',
        description: 'trading report for last 4 weeks',
        action: {
          type: 'action',
          action: TelegramActionType.REPORT_MONTH,
        },
      },
    ],
  },
  {
    command: TelegramCommand.USER,
    onlyAdmin: true,
    description: 'manage users',
    params: [
      {
        value: 'create',
        description: 'create new user',
        action: {
          type: 'action',
          action: TelegramActionType.CREATE_USER,
        },
      },
    ],
  },
];
