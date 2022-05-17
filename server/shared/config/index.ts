import type { AnalyticsBotProgress } from 'global/types';
import { BrokerName } from 'global/constants';

import type { Signal, TelegramCommandConfig, NewUser } from 'shared/types';
import { EXCHANGE_TICKER_DIVIDER, TelegramCommand } from 'shared/constants';
import { SignalError } from 'shared/exceptions';

import type { Bot } from 'modules/bot';


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

export const signalMarketValidators: { [p in BrokerName]: { validate(signal: Signal, bot: Bot): void } } = {
  [BrokerName.CURRENCY_COM]: {
    validate(signal: Signal, bot: Bot): void {
      const [ exchange, market = '' ] = signal.market.split(EXCHANGE_TICKER_DIVIDER);

      if (exchange !== 'CURRENCYCOMLEV') {
        throw new SignalError(
          `Invalid market exchange: expected "CURRENCYCOMLEV", received "${exchange}".`,
          bot.settings,
          signal,
        );
      }

      const brokerMarket: string = bot.settings.brokerMarketSymbol
        .replace('_LEVERAGE', '')
        .replace(/[.\/\s]/g, '')
        .toLowerCase();

      const signalMarket: string = market
        .replace(/[\s]/g, '')
        .toLowerCase();

      if (signalMarket !== brokerMarket) {
        throw new SignalError(`Invalid market.`, bot.settings, signal);
      }
    },
  },
  [BrokerName.CAPITAL_COM]: {
    validate(signal: Signal, bot: Bot): void {}
  },
};
